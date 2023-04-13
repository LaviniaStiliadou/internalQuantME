/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { exportXmlFromModeler, getCamundaInputOutput, getPropertiesToCopy, getRootProcess } from 'client/src/app/quantme/utilities/Utilities';
import { getQuantMETasks, insertShape } from '../QuantMETransformator';
import {
  INVOKE_NISQ_ANALYZER_SCRIPT,
  INVOKE_TRANSFORMATION_SCRIPT, POLL_FOR_TRANSFORMATION_SCRIPT,
  RETRIEVE_FRAGMENT_SCRIPT_PREFIX,
  RETRIEVE_FRAGMENT_SCRIPT_SUFFIX,
  SELECT_ON_QUEUE_SIZE_SCRIPT
} from './HardwareSelectionScripts';
import * as consts from 'client/src/app/quantme/Constants';
import extensionElementsHelper from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
import { createModeler, createModelerFromXml } from '../../Utilities';

/**
 * Replace the given QuantumHardwareSelectionSubprocess by a native subprocess orchestrating the hardware selection
 */
export async function replaceHardwareSelectionSubprocess2(subprocess, parent, modeler, nisqAnalyzerEndpoint, transformationFrameworkEndpoint, camundaEndpoint, hybridRuntimeGroups) {
  let bpmnReplace = modeler.get('bpmnReplace');
  let bpmnFactory = modeler.get('bpmnFactory');
  let modeling = modeler.get('modeling');
  let elementRegistry = modeler.get('elementRegistry');
  console.log(subprocess);
  //let group = elementRegistry.get(hybridRuntimeGroups[0].group.id)
  console.log(hybridRuntimeGroups[0])
  let group ;

  // find the group which has the policy attached
  for (let i = 0; i < hybridRuntimeGroups.length; i++) {
    for (let j = 0; j < hybridRuntimeGroups[i].attachers.length; j++) {
      if (subprocess.id === hybridRuntimeGroups[i].attachers[i].id) {
        group = hybridRuntimeGroups[i];
      }
    }
  }

  let exitFlow;

  // find the sequence flow which exits the group to insert the policy flow
  for (let i = 0; i < group.candidate.exitPoint.outgoing.length; i++) {
    let target = group.candidate.exitPoint.outgoing[i].id;
    for (let j = 0; j < group.candidate.containedElements.length; j++) {
      let containedElement = group.candidate.containedElements[j].id;
      if (containedElement.id === target.id) {
        exitFlow = group.candidate.exitPoint.outgoing[i];
      }
    }
  }
  console.log(exitFlow)
  let exitFlowElement = elementRegistry.get(exitFlow.id)
  let element = elementRegistry.get(subprocess.id);
  // replace QuantumHardwareSelectionSubprocess with traditional subprocess
  modeling.removeShape(element);

  let exitPoint = elementRegistry.get(group.candidate.exitPoint.id)
  console.log(exitFlowElement);
  let targetOfExitPoint = elementRegistry.get(exitFlowElement.target.id)
  // update the properties of the new element
  //modeling.updateProperties(element, getPropertiesToCopy(subprocess));
  //modeling.updateProperties(element, { selectionStrategy : undefined, providers: undefined, simulatorsAllowed: undefined });

  // retrieve business object of the new element
  //let bo = elementRegistry.get(element.id).businessObject;

  // add task to invoke the NISQ Analyzer and connect it
  let invokeHardwareSelection = modeling.createShape({ type: 'bpmn:ScriptTask' }, { x: 50, y: 50 }, parent, {});
  let invokeHardwareSelectionBo = elementRegistry.get(invokeHardwareSelection.id).businessObject;
  invokeHardwareSelectionBo.name = 'Invoke NISQ Analyzer';
  invokeHardwareSelectionBo.scriptFormat = 'groovy';
  invokeHardwareSelectionBo.script = INVOKE_NISQ_ANALYZER_SCRIPT;
  invokeHardwareSelectionBo.asyncBefore = true;
  //modeling.connect(exitPoint, invokeHardwareSelection, { type: 'bpmn:SequenceFlow' });
  console.log(exitFlowElement);
  let newFlow = modeling.connect(exitPoint, invokeHardwareSelection, { type: 'bpmn:SequenceFlow' });
  modeling.updateProperties(newFlow, {conditionExpression: exitFlow.conditionExpression, name: exitFlow.name})
  let newFlow2 = modeling.connect(invokeHardwareSelection, targetOfExitPoint, { type: 'bpmn:SequenceFlow' });
  modeling.removeConnection(exitFlowElement);
  return true;
}

/**
 * Configure the given QuantME workflow fragment based on the selected hardware
 *
 * @param xml the QuantME workflow fragment in XML format
 * @param provider the provider of the selected QPU
 * @param qpu the selected QPU
 * @param circuitLanguage the language of the circuit provided by the NISQ Analyzer
 * @return the configured workflow model
 */
export async function configureBasedOnHardwareSelection(xml, provider, qpu, circuitLanguage) {
  let modeler = await createModelerFromXml(xml);
  let elementRegistry = modeler.get('elementRegistry');

  // get root element of the current diagram
  const rootElement = getRootProcess(modeler.getDefinitions());
  if (typeof rootElement === 'undefined') {
    console.log('Unable to retrieve root process element from definitions!');
    return { status: 'failed', cause: 'Unable to retrieve root process element from definitions!' };
  }
  rootElement.isExecutable = true;

  // get all QuantME modeling constructs from the process
  const quantmeTasks = getQuantMETasks(rootElement, elementRegistry);

  // update properties of quantum circuit execution and readout error mitigation tasks according to the hardware selection
  for (let quantmeTask of quantmeTasks) {
    console.log('Configuring task: ', quantmeTask.task);

    if (quantmeTask.task.$type === consts.QUANTUM_CIRCUIT_EXECUTION_TASK) {
      quantmeTask.task.provider = provider;
      quantmeTask.task.qpu = qpu;
      quantmeTask.task.programmingLanguage = circuitLanguage;
    }

    if (quantmeTask.task.$type === consts.READOUT_ERROR_MITIGATION_TASK) {
      quantmeTask.task.provider = provider;
      quantmeTask.task.qpu = qpu;
    }
  }

  return { status: 'success', xml: await exportXmlFromModeler(modeler) };
}

/**
 * Add and return a task implementing the given selection strategy
 */
function addSelectionStrategyTask(selectionStrategy, parent, elementRegistry, modeling) {
  console.log('Adding task for selection strategy: %s', selectionStrategy);

  if (selectionStrategy === undefined || !consts.SELECTION_STRATEGY_LIST.includes(selectionStrategy)) {
    console.log('Selection strategy not supported. Aborting!');
    return undefined;
  }

  switch (selectionStrategy) {
  case consts.SELECTION_STRATEGY_SHORTEST_QUEUE_SIZE:
    return addShortestQueueSelectionStrategy(parent, elementRegistry, modeling);
  default:
    console.log('Selection strategy not supported. Aborting!');
    return undefined;
  }
}

/**
 * Add a task implementing the Shortest-Queue selection strategy
 */
function addShortestQueueSelectionStrategy(parent, elementRegistry, modeling) {
  let task = modeling.createShape({ type: 'bpmn:ScriptTask' }, { x: 50, y: 50 }, parent, {});
  let taskBo = elementRegistry.get(task.id).businessObject;
  taskBo.name = 'Selecting based on Queue Size';
  taskBo.scriptFormat = 'groovy';
  taskBo.script = SELECT_ON_QUEUE_SIZE_SCRIPT;
  return task;
}

async function getHardwareSelectionFragment(subprocess) {
  console.log('Extracting workflow fragment from subprocess: ', subprocess);

  // create new modeler to extract the XML of the workflow fragment
  let modeler = createModeler();
  let elementRegistry = modeler.get('elementRegistry');
  let bpmnReplace = modeler.get('bpmnReplace');
  let modeling = modeler.get('modeling');

  // initialize the modeler
  function initializeModeler() {
    return new Promise((resolve) => {
      modeler.createDiagram((err, successResponse) => {
        resolve(successResponse);
      });
    });
  }
  await initializeModeler();

  // retrieve root element to add extracted workflow fragment
  let definitions = modeler.getDefinitions();
  let rootElement = getRootProcess(definitions);
  let rootElementBo = elementRegistry.get(rootElement.id);

  // add start and end event to the new process
  //let startEvent = bpmnReplace.replaceElement(elementRegistry.get(rootElement.flowElements[0].id), { type: 'bpmn:StartEvent' });
  //let endEvent = modeling.createShape({ type: 'bpmn:EndEvent' }, { x: 50, y: 50 }, rootElementBo, {});

  // insert given subprocess and connect to start and end event
  //let insertedSubprocess = insertShape(definitions, rootElementBo, subprocess, {}, false, modeler).element;
  //modeling.connect(startEvent, insertedSubprocess, { type: 'bpmn:SequenceFlow' });
  //modeling.connect(insertedSubprocess, endEvent, { type: 'bpmn:SequenceFlow' });

  // export xml and remove line breaks
  let xml = await exportXmlFromModeler(modeler);
  return xml.replace(/(\r\n|\n|\r)/gm, '');
}
