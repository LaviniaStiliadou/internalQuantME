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

import { layout } from 'client/src/app/quantme/layouter/Layouter';
import { matchesQRM } from './QuantMEMatcher';
import {
  getRootProcess,
  getSingleFlowElement,
  isFlowLikeElement,
  getCamundaInputOutput,
  getPropertiesToCopy,
  exportXmlFromModeler
} from 'client/src/app/quantme/utilities/Utilities';
import { getDefinitionsFromXml, createModelerFromXml } from '../Utilities';
import { addQuantMEInputParameters } from 'client/src/app/quantme/replacement/InputOutputHandler';
import * as Constants from 'client/src/app/quantme/Constants';
import { replaceHardwareSelectionSubprocess } from './hardware-selection/QuantMEHardwareSelectionHandler';
import { getQiskitRuntimeProgramDeploymentModel } from '../../adaptation/runtimes/QiskitRuntimeHandler';
import { getAWSRuntimeProgramDeploymentModel } from '../../adaptation/runtimes/AwsRuntimeHandler';
import { config } from 'chai';

/**
 * Initiate the replacement process for the QuantME tasks that are contained in the current process model
 *
 * @param xml the BPMN diagram in XML format
 * @param currentQRMs the set of currently in the framework available QRMs
 * @param endpointConfig endpoints of the services required for the dynamic hardware selection
 * @param candidate runtime candidate to update if available (might be undefined)
 */
export async function startReplacementProcess(xml, currentQRMs, endpointConfig, candidate) {
  let modeler = await createModelerFromXml(xml);
  let modeling = modeler.get('modeling');
  let elementRegistry = modeler.get('elementRegistry');
  console.log(elementRegistry, modeling, modeler, currentQRMs);

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  console.log(rootElement);
  if (typeof rootElement === 'undefined') {
    console.log('Unable to retrieve root process element from definitions!');
    return { status: 'failed', cause: 'Unable to retrieve root process element from definitions!' };
  }

  // get all QuantME modeling constructs from the process TODO might need to be careful with constructs in loop
  const replacementConstructs = getQuantMETasks(rootElement, elementRegistry);
  console.log('Process contains ' + replacementConstructs.length + ' QuantME modeling constructs to replace...');
  if (!replacementConstructs || !replacementConstructs.length) {
    return { status: 'transformed', xml: xml };
  }

  // check for hybrid loop groups
  const hybridRuntimeGroups = getHybridRuntimeGroups(rootElement, elementRegistry);

  for (let hybridRuntimeGroup of hybridRuntimeGroups) {
    let groupModeler = await createModelerFromXml(xml);
    groupModeler.config = endpointConfig;
    let groupModeling = groupModeler.get('modeling');
    let groupElementRegistry = groupModeler.get('elementRegistry');
    const groupDefinitions = groupModeler.getDefinitions();
    const groupRootElement = getRootProcess(groupDefinitions);
    console.log(groupElementRegistry,xml);

    let groupElement = groupElementRegistry.get(hybridRuntimeGroup.group.id);
    let groupX, groupY, groupWidth, groupHeight;
    groupX= groupElement.x;
    groupY = groupElement.y;
    groupWidth = groupElement.width;
    groupHeight = groupElement.height;

    let elementsInGroup = [];
    let elementIdsInGroup =[];
    for (let flowElement of groupRootElement.flowElements) {
      if (flowElement.$type !== 'bpmn:StartEvent' && flowElement.$type !== 'bpmn:EndEvent') {
        let flowElementBo = groupElementRegistry.get(flowElement.id);
        // check for each sequence flow if all points are within the group
        if (flowElementBo.waypoints) {
          let inside = true;
          for (let waypoint of flowElementBo.waypoints) {
            if (!(waypoint.x > groupX && waypoint.x < groupX + groupWidth
              && waypoint.y > groupY && waypoint.y < groupY + groupHeight)) {
              inside = false;
            }
          }
          if (inside) {
            elementsInGroup.push(flowElement);
            elementIdsInGroup.push(flowElement.id);
          }
        // check for tasks and gateways if all corners of the element are within the group
        } else if (flowElementBo.x && flowElementBo.y && flowElementBo.width && flowElementBo.height) {
          if (flowElementBo.x > groupX && flowElementBo.x < groupX + groupWidth
            && flowElementBo.x + flowElementBo.width < groupX + groupWidth
            && flowElementBo.y > groupY && flowElementBo.y < groupY + groupHeight
            && flowElementBo.y + flowElementBo.height < groupY + groupHeight) {
            elementsInGroup.push(flowElement);
            elementIdsInGroup.push(flowElement.id);
          }
        }
      }
    }

    console.log(elementsInGroup);
    console.log(elementIdsInGroup);
    // remove outer sequence flow if existing
    for (let el of elementsInGroup) {
      if (el.$type === 'bpmn:SequenceFlow') {
        if (!elementIdsInGroup.includes(el.sourceRef.id)) {
          const index = elementsInGroup.indexOf(el);
          if (index > -1) {
            elementsInGroup.splice(index, 1);
            elementIdsInGroup.splice(index, 1);
            continue;
          }
        }
        if (!elementIdsInGroup.includes(el.targetRef.id)) {
          const index = elementsInGroup.indexOf(el);
          if (index > -1) {
            elementsInGroup.splice(index, 1);
            elementIdsInGroup.splice(index, 1);
            continue;
          }
        }
      }
    }

    // check for incoming and outgoing elements that are not part of the group --> set entry and exitpoint
    let entrypoint, exit;
    for (let el of elementsInGroup) {
      if (el.$type === 'bpmn:SequenceFlow') {
        continue;
      }
      console.log(el);
      for (let incoming of el.incoming) {
        if (!elementIdsInGroup.includes(incoming.id)) {
          if (entrypoint === undefined) {
            entrypoint = el.id;
          } else {
            console.log('Multiple Entrypoints found - Aborting Hybrid Runtime transformation');
            return undefined;
          }
        }
      }

      for (let outgoing of el.outgoing) {
        if (!elementIdsInGroup.includes(outgoing.id)) {
          if (exit === undefined) {
            exit = el.id;
          } else {
            console.log('Multiple Exits found - Aborting Hybrid Runtime transformation');
            return undefined;
          }
        }
      }
    }



    let groupFlowElements = [];
    groupRootElement.flowElements.forEach(flowElement => groupFlowElements.push({ id: flowElement.id, $type: flowElement.$type }));
    // remove unused sequence flow elements from group modeler to avoid reference errors
    for (let flowElement of groupFlowElements) {
      if (!elementIdsInGroup.includes(flowElement.id) && flowElement.$type === 'bpmn:SequenceFlow') {
        console.log(flowElement, groupModeling);
        groupModeling.removeConnection(groupElementRegistry.get(flowElement.id));
      }
    }
    // remove remaining unused flowelements
    for (let flowElement of groupFlowElements) {
      if (!elementIdsInGroup.includes(flowElement.id) && flowElement.$type !== 'bpmn:SequenceFlow') {
        console.log(flowElement, groupModeling);
        groupModeling.removeShape(groupElementRegistry.get(flowElement.id));
      } else {
        console.log(flowElement);
      }
    }
    // remove outside artifacts
    let artifactIds = [];
    for (let artifacts of groupRootElement.artifacts) {
      artifactIds.push(artifacts.id);
    }
    for (let id of artifactIds) {
      if (!elementIdsInGroup.includes(id)) {
        groupModeling.removeShape(groupElementRegistry.get(id));
      }
    }

    modeling.removeShape(elementRegistry.get(hybridRuntimeGroup.group.id));

    console.log(groupElementRegistry);
    let candidate = { containedElements: elementsInGroup, entryPointId: entrypoint, exitPointId: exit, modeler: groupModeler };

    let programGenerationResult;
    switch (hybridRuntimeGroup.group.runtimeProvider) {
    case 'qiskit':
      programGenerationResult = await getQiskitRuntimeProgramDeploymentModel(candidate, endpointConfig, currentQRMs);
      break;
    case 'aws':
      programGenerationResult = await getAWSRuntimeProgramDeploymentModel(candidate, endpointConfig, currentQRMs);
      break;
    default:
      programGenerationResult = { error: 'Unable to find suitable runtime handler for: ' + hybridRuntimeGroup.group.runtimeProvider };
    }

    // check if hybrid program generation was successful
    if (programGenerationResult.error) {
      console.log('Hybrid program generation failed with error: ', programGenerationResult.error);
    }
    console.log(xml);


  }

  // check for available replacement models for all QuantME modeling constructs
  for (let replacementConstruct of replacementConstructs) {
    if (replacementConstruct.task.$type === Constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS) {
      console.log('QuantumHardwareSelectionSubprocess needs no QRM. Skipping search...');
      continue;
    }

    // abort transformation if at least one task can not be replaced
    replacementConstruct.qrm = await getMatchingQRM(replacementConstruct.task, currentQRMs);
    if (!replacementConstruct.qrm) {
      console.log('Unable to replace task with id %s. Aborting transformation!', replacementConstruct.task.id);
      return {
        status: 'failed',
        cause: 'Unable to replace task with id \'' + replacementConstruct.task.id + '\' by suited QRM!'
      };
    }
  }

  let candidateStart = candidate !== undefined ? candidate.entryPoint : undefined;
  let candidateEnd = candidate !== undefined ? candidate.exitPoint : undefined;
  // replace each QuantME modeling construct to retrieve standard-compliant BPMN
  for (let replacementConstruct of replacementConstructs) {

    let replacementSuccess = false;
    if (replacementConstruct.task.$type === Constants.QUANTUM_HARDWARE_SELECTION_SUBPROCESS) {
      console.log('Transforming QuantumHardwareSelectionSubprocess...');
      replacementSuccess = await replaceHardwareSelectionSubprocess(replacementConstruct.task, replacementConstruct.parent, modeler, endpointConfig.nisqAnalyzerEndpoint, endpointConfig.transformationFrameworkEndpoint, endpointConfig.camundaEndpoint);
    } else {
      console.log('Replacing task with id %s by using QRM: ', replacementConstruct.task.id, replacementConstruct.qrm);
      replacementSuccess = await replaceByFragment(definitions, replacementConstruct.task, replacementConstruct.parent, replacementConstruct.qrm.replacement, modeler);
    }

    if (!replacementSuccess) {
      console.log('Replacement of QuantME modeling construct with Id ' + replacementConstruct.task.id + ' failed. Aborting process!');
      return {
        status: 'failed',
        cause: 'Replacement of QuantME modeling construct with Id ' + replacementConstruct.task.id + ' failed. Aborting process!'
      };
    }
  }

  // layout diagram after successful transformation
  layout(modeling, elementRegistry, rootElement);

  console.log(modeler);
  console.log(elementRegistry);
  let newXML = await exportXmlFromModeler(modeler);
  console.log(newXML);
  return { status: 'transformed', xml: newXML, entryPoint: null, exitPoint: null };
}

/**
 * Get QuantME HybridRuntime Groups from process
 */
export function getHybridRuntimeGroups(process, elementRegistry) {

  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);

  const hybridRuntimeGroups = [];
  const artifacts = process.artifacts;
  if (artifacts === undefined) {
    return [];
  }
  for (let i = 0; i < artifacts.length; i++) {
    let artifact = artifacts[i];
    if (artifact.$type && artifact.$type === 'quantme:HybridRuntimeGroup') {
      hybridRuntimeGroups.push({ group: artifact, parent: processBo });
    }
  }
  return hybridRuntimeGroups;
}

/**
 * Get QuantME tasks from process
 */
export function getQuantMETasks(process, elementRegistry) {

  // retrieve parent object for later replacement
  const processBo = elementRegistry.get(process.id);

  const quantmeTasks = [];
  const flowElements = process.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];
    if (flowElement.$type && flowElement.$type.startsWith('quantme:')) {
      quantmeTasks.push({ task: flowElement, parent: processBo });
    }

    // recursively retrieve QuantME tasks if subprocess is found
    if (flowElement.$type && flowElement.$type === 'bpmn:SubProcess') {
      Array.prototype.push.apply(quantmeTasks, getQuantMETasks(flowElement, elementRegistry));
    }
  }
  return quantmeTasks;
}

/**
 * Search for a matching QRM for the given task
 */
async function getMatchingQRM(task, currentQRMs) {
  console.log('Number of available QRMs: ', currentQRMs.length);

  for (let i = 0; i < currentQRMs.length; i++) {
    if (await matchesQRM(currentQRMs[i], task)) {
      return currentQRMs[i];
    }
  }
  return undefined;
}

/**
 * Replace the given task by the content of the replacement fragment
 */
async function replaceByFragment(definitions, task, parent, replacement, modeler) {
  let bpmnFactory = modeler.get('bpmnFactory');

  if (!replacement) {
    console.log('Replacement fragment is undefined. Aborting replacement!');
    return false;
  }

  // get the root process of the replacement fragment
  let replacementProcess = getRootProcess(await getDefinitionsFromXml(replacement));
  let replacementElement = getSingleFlowElement(replacementProcess);
  console.log(replacementProcess, replacementElement);
  if (replacementElement === null || replacementElement === undefined) {
    console.log('Unable to retrieve QuantME task from replacement fragment: ', replacement);
    return false;
  }

  console.log('Replacement element: ', replacementElement);
  let result = insertShape(definitions, parent, replacementElement, {}, true, modeler, task);

  // add all attributes of the replaced QuantME task to the input parameters of the replacement fragment
  let inputOutputExtension = getCamundaInputOutput(result['element'].businessObject, bpmnFactory);
  addQuantMEInputParameters(task, inputOutputExtension, bpmnFactory);

  return result['success'];
}

/**
 * Insert the given element and all child elements into the diagram
 *
 * @param definitions the definitions element of the BPMN diagram
 * @param parent the parent element under which the new element should be attached
 * @param newElement the new element to insert
 * @param idMap the idMap containing a mapping of ids defined in newElement to the new ids in the diagram
 * @param replace true if the element should be inserted instead of an available element, false otherwise
 * @param modeler the BPMN modeler containing the target BPMN diagram
 * @param oldElement an old element that is only required if it should be replaced by the new element
 * @return {{success: boolean, idMap: *, element: *}}
 */
export function insertShape(definitions, parent, newElement, idMap, replace, modeler, oldElement) {
  console.log('Inserting shape for element: ', newElement);
  let bpmnReplace = modeler.get('bpmnReplace');
  let bpmnFactory = modeler.get('bpmnFactory');
  let modeling = modeler.get('modeling');
  let elementRegistry = modeler.get('elementRegistry');

  // create new id map if not provided
  if (idMap === undefined) {
    idMap = {};
  }

  let element;
  if (!isFlowLikeElement(newElement.$type)) {
    if (replace) {

      // replace old element to retain attached sequence flow, associations, data objects, ...
      element = bpmnReplace.replaceElement(elementRegistry.get(oldElement.id), { type: newElement.$type });
    } else {

      // create new shape for this element
      modeling.removeShape();
      element = modeling.createShape({ type: newElement.$type }, { x: 50, y: 50 }, parent, {});
    }
  } else {

    // create connection between two previously created elements
    let sourceElement = elementRegistry.get(idMap[newElement.sourceRef.id]);
    let targetElement = elementRegistry.get(idMap[newElement.targetRef.id]);
    element = modeling.connect(sourceElement, targetElement, { type: newElement.$type });
  }

  // store id to create sequence flows
  idMap[newElement['id']] = element.id;

  // if the element is a subprocess, check if it is expanded in the replacement fragment and expand the new element
  if (newElement.$type === 'bpmn:SubProcess') {

    // get the shape element related to the subprocess
    let shape = newElement.di;
    if (shape && shape.isExpanded) {

      // expand the new element
      elementRegistry.get(element.id).businessObject.di.isExpanded = true;
    }

    // preserve messages defined in ReceiveTasks
  } else if (newElement.$type === 'bpmn:ReceiveTask') {

    // get message from the replacement and check if a corresponding message was already created
    let oldMessage = newElement.messageRef;
    if (idMap[oldMessage.id] === undefined) {

      // add a new message element to the definitions document and link it to the receive task
      let message = bpmnFactory.create('bpmn:Message');
      message.name = oldMessage.name;
      definitions.rootElements.push(message);
      modeling.updateProperties(element, { 'messageRef': message });

      // store id if other receive tasks reference the same message
      idMap[oldMessage.id] = message.id;
    } else {

      // reuse already created message and add it to receive task
      modeling.updateProperties(element, { 'messageRef': idMap[oldMessage.id] });
    }
  }

  // add element to which a boundary event is attached
  if (newElement.$type === 'bpmn:BoundaryEvent') {
    let hostElement = elementRegistry.get(idMap[newElement.attachedToRef.id]);
    modeling.updateProperties(element, { 'attachedToRef': hostElement.businessObject });
    element.host = hostElement;
  }

  // update the properties of the new element
  modeling.updateProperties(element, getPropertiesToCopy(newElement));

  // recursively handle children of the current element
  let resultTuple = insertChildElements(definitions, element, newElement, idMap, modeler);

  // add artifacts with their shapes to the diagram
  let success = resultTuple['success'];
  idMap = resultTuple['idMap'];
  let artifacts = newElement.artifacts;
  if (artifacts) {
    console.log('Element contains %i artifacts. Adding corresponding shapes...', artifacts.length);
    for (let i = 0; i < artifacts.length; i++) {
      let result = insertShape(definitions, element, artifacts[i], idMap, false, modeler);
      success = success && result['success'];
      idMap = result['idMap'];
    }
  }

  // return success flag and idMap with id mappings of this element and all children
  return { success: success, idMap: idMap, element: element };
}

/**
 * Insert all children of the given element into the diagram
 *
 * @param definitions the definitions element of the BPMN diagram
 * @param parent the element that is the new parent of the inserted elements
 * @param newElement the new element to insert the children for
 * @param idMap the idMap containing a mapping of ids defined in newElement to the new ids in the diagram
 * @param modeler the BPMN modeler containing the target BPMN diagram
 * @return {{success: boolean, idMap: *, element: *}}
 */
function insertChildElements(definitions, parent, newElement, idMap, modeler) {

  let success = true;
  let flowElements = newElement.flowElements;
  let boundaryEvents = [];
  let sequenceflows = [];
  if (flowElements) {
    console.log('Element contains %i children. Adding corresponding shapes...', flowElements.length);
    for (let i = 0; i < flowElements.length; i++) {

      // skip elements with references and add them after all other elements to set correct references
      if (flowElements[i].$type === 'bpmn:SequenceFlow') {
        sequenceflows.push(flowElements[i]);
        continue;
      }
      if (flowElements[i].$type === 'bpmn:BoundaryEvent') {
        boundaryEvents.push(flowElements[i]);
        continue;
      }

      let result = insertShape(definitions, parent, flowElements[i], idMap, false, modeler);
      success = success && result['success'];
      idMap = result['idMap'];
    }

    // handle boundary events with new ids of added elements
    for (let i = 0; i < boundaryEvents.length; i++) {
      let result = insertShape(definitions, parent, boundaryEvents[i], idMap, false, modeler);
      success = success && result['success'];
      idMap = result['idMap'];
    }

    // handle boundary events with new ids of added elements
    for (let i = 0; i < sequenceflows.length; i++) {
      let result = insertShape(definitions, parent, sequenceflows[i], idMap, false, modeler);
      success = success && result['success'];
      idMap = result['idMap'];
    }
  }

  return { success: success, idMap: idMap, element: parent };
}
