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

import lodash from 'lodash';
import { getRootProcess } from 'client/src/app/quantme/utilities/Utilities';


/**
 * Find candidates within the current workflow model that can be executed efficiently using a hybrid runtime
 *
 * @param modeler the modeler containing the current workflow model
 * @return the list of optimization candidates
 */
export async function findOptimizationCandidates(modeler) {

  // get the root element of the current workflow model
  const definitions = modeler.getDefinitions();
  const rootElement = getRootProcess(definitions);
  console.log('Searching optimization candidates for workflow with root element: ', rootElement);

  // get all potential entry points for a hybrid loop
  let entryPoints = findEntryPoints(rootElement);
  console.log('Found %d potential entry points to hybrid loops!', entryPoints.length);

  // check if the entry points are part of valid optimization candidates
  let optimizationCandidates = [];
  for (let i = 0; i < entryPoints.length; i++) {
    let entryPoint = entryPoints[i];
    let outgoingFlow = entryPoint.outgoing[0];
    let nextElement = outgoingFlow.targetRef;

    let optimizationCandidate = getOptimizationCandidate({
      entryPoint: entryPoint,
      currentElement: nextElement,
      containedElements: [entryPoints[i], outgoingFlow]
    });

    // TODO discuss how qc exec for different providers shall be handled
    // set starting points to include tasks at the start with DataFactor > 1, and at the end with DataFactor < 1.
    let loopExitPoint = optimizationCandidate.containedElements.find(element => element.$type === 'bpmn:ExclusiveGateway' && element.id !== entryPoint.id);
    let outgoingLoopFlow = optimizationCandidate.containedElements.includes(loopExitPoint.outgoing[1]) ? loopExitPoint.outgoing[0] : loopExitPoint.outgoing[1];
    let incomingLoopFlow = optimizationCandidate.containedElements.includes(entryPoint.incoming[1]) ? entryPoint.incoming[0] : entryPoint.incoming[1];
    incomingLoopFlow.bestDFIncoming = 1;
    incomingLoopFlow.bestPointIncoming = 0;
    incomingLoopFlow.currentDFIncoming = 1;
    incomingLoopFlow.additionalElementsIncoming = [];
    outgoingLoopFlow.bestDFOutgoing = 1;
    outgoingLoopFlow.bestPointOutgoing = 0;
    outgoingLoopFlow.currentDFOutgoing = 1;
    outgoingLoopFlow.additionalElementsOutgoing = [];
    const preTasks = includePreviousTaskForDFEfficiency(incomingLoopFlow);
    const afterTasks = includeNextTaskForDFEfficiency(outgoingLoopFlow);

    if (preTasks.bestPointIncoming > 0) {
      optimizationCandidate.containedElements = optimizationCandidate.containedElements.concat(preTasks.additionalElementsIncoming.slice(0, preTasks.bestPointIncoming));
    }
    if (afterTasks.bestPointOutgoing > 0) {
      optimizationCandidate.containedElements = optimizationCandidate.containedElements.concat(afterTasks.additionalElementsOutgoing.slice(0, afterTasks.bestPointOutgoing));
    }
    // save information of what service, script and execution tasks happened before and after the loop to merge multiple connected optimization candidates into 1 candidate
    optimizationCandidate.incomingMergeInfo = preTasks;
    optimizationCandidate.outgoingMergeInfo = afterTasks;


    // candidate must comprise at least one quantum circuit execution and classical task to benefit from a hybrid runtime
    if (optimizationCandidate !== undefined
      && containsQuantumCircuitExecutionTask(optimizationCandidate)
      && containsClassicalTask(optimizationCandidate)) {
      console.log('Found valid optimization candidate: ', optimizationCandidate);
      optimizationCandidates.push(optimizationCandidate);
    } else {
      console.log('Entry point is not part of valid optimization loop: ', entryPoints[i]);
    }
  }

  // merge candidates if they are overlapping
  optimizationCandidates = mergeOptimizationCandidates(optimizationCandidates);

  // draw hybrid runtime groups
  for (let candidate of optimizationCandidates) {
    candidate = await visualizeCandidateGroup(candidate, modeler);
    generateCandidateGroup(candidate.groupBox, modeler);
  }
  // return all valid optimization candidates for the analysis and rewrite modal
  return optimizationCandidates;
}

/**
 * Checks for each candidate if there are merge possibilities with other candidates
 *
 * @param optimizationCandidates
 * @returns {*}
 */
function mergeOptimizationCandidates(optimizationCandidates) {
  for (let i = 0; i < optimizationCandidates.length; i++) {
    optimizationCandidates = recursiveMerge(optimizationCandidates[i], optimizationCandidates);
  }
  return optimizationCandidates;
}

/**
 * Recursively merge hybrid runtime candidates if they have overlapping tasks
 *
 * @param currentCandidate
 * @param optimizationCandidates
 * @returns {*}
 */
function recursiveMerge(currentCandidate, optimizationCandidates) {
  let changes = false;
  for (let mergeCandidate of optimizationCandidates) {
    if (mergeCandidate.incomingMergeInfo.additionalElementsIncoming.some(item => currentCandidate.outgoingMergeInfo.additionalElementsOutgoing.includes(item))) {
      // combine candidates and remove duplicates
      currentCandidate.containedElements = currentCandidate.containedElements.concat(currentCandidate.outgoingMergeInfo.additionalElementsOutgoing).concat(mergeCandidate.containedElements);
      currentCandidate.containedElements = currentCandidate.containedElements.filter((item,index) => {
        return (currentCandidate.containedElements.indexOf(item) === index); });
      currentCandidate.outgoingMergeInfo = mergeCandidate.outgoingMergeInfo;

      // remove merged candidate
      optimizationCandidates = optimizationCandidates.filter(item => item !== mergeCandidate);
      changes = true;
      break;
    }
    if (mergeCandidate.outgoingMergeInfo.additionalElementsOutgoing.some(item => currentCandidate.incomingMergeInfo.additionalElementsIncoming.includes(item))) {
      currentCandidate.containedElements = currentCandidate.containedElements.concat(currentCandidate.outgoingMergeInfo.additionalElementsIncoming).concat(mergeCandidate.containedElements);
      currentCandidate.containedElements = currentCandidate.containedElements.filter((item,index) => {
        return (currentCandidate.containedElements.indexOf(item) === index); });
      currentCandidate.outgoingMergeInfo = mergeCandidate.outgoingMergeInfo;

      // remove merged candidate
      optimizationCandidates = optimizationCandidates.filter(item => item !== mergeCandidate);
      changes = true;
      break;
    }
  }
  if (changes === true) {
    return recursiveMerge(currentCandidate, optimizationCandidates);
  }
  return optimizationCandidates;
}

/**
 * Iteratively determine if incoming elements of detected hybrid loop are suitable to be included in the runtime
 *
 * @param flow
 * @returns dataflow
 */
function includePreviousTaskForDFEfficiency(flow) {
  let currentTask = flow.sourceRef;
  if (['bpmn:ServiceTask', 'bpmn:ScriptTask', 'quantme:QuantumCircuitExecutionTask'].includes(currentTask.$type)
       && currentTask.incoming.length === 1 && currentTask.dataFactor) {
    let nextFlow = currentTask.incoming[0];

    // compute DF attributes for current task
    nextFlow.currentDFIncoming = flow.currentDFIncoming * currentTask.dataFactor;
    if (flow.additionalElementsIncoming.length === 0) {
      nextFlow.additionalElementsIncoming = [flow, currentTask];
    } else {
      nextFlow.additionalElementsIncoming = flow.additionalElementsIncoming;
      nextFlow.additionalElementsIncoming.push(flow, currentTask);
    }
    // if current DF improves overall DF, save current element as best
    if (nextFlow.currentDFIncoming > flow.bestDFIncoming) {
      nextFlow.bestDFIncoming = nextFlow.currentDFIncoming;
      nextFlow.bestPointIncoming = nextFlow.additionalElementsIncoming.length;
    } else {
      nextFlow.bestDFIncoming = flow.bestDFIncoming;
      nextFlow.bestPointIncoming = flow.bestPointIncoming;
    }
    return includePreviousTaskForDFEfficiency(nextFlow);
  } else {
    return flow;
  }
}

/**
 * Iteratively determine if outgoing elements of detected hybrid loop are suitable to be included in the runtime
 *
 * @param flow
 * @returns dataflow
 */
function includeNextTaskForDFEfficiency(flow) {
  let currentTask = flow.targetRef;
  if (['bpmn:ServiceTask', 'bpmn:ScriptTask', 'quantme:QuantumCircuitExecutionTask'].includes(currentTask.$type)
    && currentTask.outgoing.length === 1 && currentTask.dataFactor) {
    let nextFlow = currentTask.outgoing[0];

    // compute DF attributes for current task
    nextFlow.currentDFOutgoing = flow.currentDFOutgoing * currentTask.dataFactor;
    if (flow.additionalElementsOutgoing.length === 0) {
      nextFlow.additionalElementsOutgoing = [flow, currentTask];
    } else {
      nextFlow.additionalElementsOutgoing = flow.additionalElementsOutgoing;
      nextFlow.additionalElementsOutgoing.push(flow, currentTask);
    }
    // if current DF improves overall DF, save current element as best
    if (nextFlow.currentDFOutgoing < flow.bestDFOutgoing) {
      nextFlow.bestDFOutgoing = nextFlow.currentDFOutgoing;
      nextFlow.bestPointOutgoing = nextFlow.additionalElementsOutgoing.length;
    } else {
      nextFlow.bestDFOutgoing = flow.bestDFOutgoing;
      nextFlow.bestPointOutgoing = flow.bestPointOutgoing;
    }
    return includeNextTaskForDFEfficiency(nextFlow);
  } else {
    return flow;
  }
}

/**
 * Generate Group Element for hybrid runtime area
 *
 * @param groupBox
 * @param modeler
 */
async function generateCandidateGroup(groupBox, modeler) {
  let definitions = modeler.getDefinitions();
  let rootElement = getRootProcess(definitions);
  const elementRegistry = modeler.get('elementRegistry');
  let rootElementBo = elementRegistry.get(rootElement.id);
  let modeling = modeler.get('modeling');
  return modeling.createShape({ type: 'quantme:HybridRuntimeGroup' }, { x: groupBox.x, y: groupBox.y, width: groupBox.width, height: groupBox.height }, rootElementBo, {});
}

/**
 * Add Groupbox for HybridRuntime Candidate
 *
 * @param optimizationCandidate the candidate to visualize
 * @param modeler of the WF
 * @return the string containing the base64 encoded image
 */
async function visualizeCandidateGroup(optimizationCandidate, modeler) {
  let elementRegistry = modeler.get('elementRegistry');

  const viewBox = calculateViewBox(optimizationCandidate, elementRegistry);
  let groupBox = {};
  groupBox.x = viewBox.minX - 25;
  groupBox.y = viewBox.minY - 30;
  groupBox.width = viewBox.maxX - viewBox.minX + 45;
  groupBox.height = viewBox.maxY - viewBox.minY + 45;

  // generate png from svg
  optimizationCandidate.modeler = modeler;
  optimizationCandidate.groupBox = groupBox;
  return optimizationCandidate;
}

/**
 * Compute Viewbox of Optimization Candidate
 *
 * @param optimizationCandidate
 * @param elementRegistry
 * @returns {{}}
 */
function calculateViewBox(optimizationCandidate, elementRegistry) {
  // search for the modeling elements with the minimal and maximal x and y values
  let result = {};
  for (let i = 0; i < optimizationCandidate.containedElements.length; i++) {
    let element = elementRegistry.get(optimizationCandidate.containedElements[i].id);

    // for sequence flows check the position of each waypoint and label
    if (element.type === 'bpmn:SequenceFlow') {
      if (element.waypoints) {
        for (let j = 0; j < element.waypoints.length; j++) {
          let waypoint = element.waypoints[j];

          if (result.minX === undefined || result.minX > waypoint.x) {
            result.minX = waypoint.x;
          }

          if (result.minY === undefined || result.minY > waypoint.y) {
            result.minY = waypoint.y;
          }

          if (result.maxX === undefined || result.maxX < waypoint.x) {
            result.maxX = waypoint.x;
          }

          if (result.maxY === undefined || result.maxY < waypoint.y) {
            result.maxY = waypoint.y;
          }
        }
      }
    } else {

      // handle non sequence flow elements
      result = updateViewBoxCoordinates(result, element);
    }

    // handle labels attached to arbitrary elements
    if (element.labels) {
      for (let j = 0; j < element.labels.length; j++) {
        result = updateViewBoxCoordinates(result, element.labels[j]);
      }
    }
  }
  return result;
}

/**
 * Update the view box coordinates with the coordinates of the given element if they provide higher/lower values for max/min
 *
 * @param coordindates the current view box coordinates, i.e., the min/max for x and y
 * @param element the element to check if it provides new coordinates for the view box
 * @return the updated view box coordinates
 */
function updateViewBoxCoordinates(coordindates, element) {

  if (coordindates.minX === undefined || coordindates.minX > element.x) {
    coordindates.minX = element.x;
  }

  if (coordindates.minY === undefined || coordindates.minY > element.y) {
    coordindates.minY = element.y;
  }

  // max x and y also incorporate the width of the current element
  if (coordindates.maxX === undefined || coordindates.maxX < element.x + element.width) {
    coordindates.maxX = element.x + element.width;
  }

  if (coordindates.maxY === undefined || coordindates.maxY < element.y + element.height) {
    coordindates.maxY = element.y + element.height;
  }

  return coordindates;
}

/**
 * Find all potential entry points to a hybrid loop
 *
 * @param rootElement the root element of the workflow model
 * @return the list of potential entry points to a hybrid loop
 */
function findEntryPoints(rootElement) {
  let entryPoints = [];

  // we currently restrict the entry point search to XOR gateways
  Array.prototype.push.apply(entryPoints, getXOREntryPoints(rootElement));

  return entryPoints;
}

/**
 * Find all XOR gateways in the workflow model that are potential entry points to a hybrid loop
 *
 * @param rootElement the root element of the workflow model
 * @return the list of XOR gateways
 */
function getXOREntryPoints(rootElement) {
  let entryPoints = [];

  // search for XOR gateways within the workflow
  const flowElements = rootElement.flowElements;
  for (let i = 0; i < flowElements.length; i++) {
    let flowElement = flowElements[i];
    if (flowElement.$type && flowElement.$type === ('bpmn:ExclusiveGateway')) {
      console.log('Found exclusive gateway: ', flowElement);

      // the gateway should have exactly one outgoing flow representing the control flow of the hybrid loop
      if (flowElement.outgoing.length === 1) {
        console.log('Exclusive gateway is potential entry point: ', flowElement);
        entryPoints.push(flowElement);
      }
    }
  }

  return entryPoints;
}

/**
 * Analyse the next modeling element for the given candidate and add it to the list of modeling elements.
 * Abort if unsuitable modeling element occurs.
 *
 * @param candidate the candidate to analyse
 * @return {undefined} the updated candidate or undefined if the candidate is invalid
 */
function getOptimizationCandidate(candidate) {
  console.log('Analyzing optimization candidate: ', candidate);

  // each element except the entry point of the candidate is only allowed to have one incoming flow,
  // as the hybrid runtime can only be invoked through the entry point and there are no other entries possible
  if (!candidate.currentElement.incoming || candidate.currentElement.incoming.length !== 1) {
    console.log('Element has more or less than one ingoing flow: ', candidate.currentElement);

    // found complete candidate
    if (candidate.currentElement.id === candidate.entryPoint.id) {
      return candidate;
    } else {
      return undefined;
    }
  }

  // each element except the exit point of the candidate is only allowed to have one outgoing flow (no branching within candidates)
  if (!candidate.currentElement.outgoing || candidate.currentElement.outgoing.length !== 1) {
    console.log('Element has more or less than one outgoing flow: ', candidate.currentElement);

    // found exit point, continue until entry point is reached again or invalid element is reached
    if (candidate.currentElement.$type && candidate.currentElement.$type === ('bpmn:ExclusiveGateway')
      && candidate.currentElement.outgoing.length === 2 && !candidate.exitPoint) {
      console.log('Found exit point for candidate: ', candidate.currentElement);

      // store exit point and follow both outgoing paths to check if the end in the entry point forming a complete candidate
      candidate.exitPoint = candidate.currentElement;

      // deepcopy leads to incomplete objects -> check suitability of first path on copy, afterwards analyze graph for corresponding path
      let pathChoice = 1;

      // follow first path
      let pathOneCandidate = lodash.cloneDeep(candidate);
      let pathOneSequenceFlow = candidate.currentElement.outgoing[0];
      let pathOneNextElement = pathOneSequenceFlow.targetRef;
      pathOneCandidate.expression = pathOneSequenceFlow.conditionExpression;
      pathOneCandidate.containedElements.push(candidate.currentElement, pathOneSequenceFlow);
      pathOneCandidate.currentElement = pathOneNextElement;
      let pathOneResult = getOptimizationCandidate(pathOneCandidate);

      // check if candidate is complete or invalid
      if (pathOneResult !== undefined) {
        console.log('Found suitable candidate loop!');
        pathChoice = 0;
      } else {
        console.log('First path did not result in valid candidate. Following second path...');
      }


      // follow second path
      let pathTwoCandidate = candidate;
      let pathTwoSequenceFlow = candidate.currentElement.outgoing[pathChoice];
      let pathTwoNextElement = pathTwoSequenceFlow.targetRef;
      pathTwoCandidate.expression = pathTwoSequenceFlow.conditionExpression;
      pathTwoCandidate.containedElements.push(candidate.currentElement, pathTwoSequenceFlow);
      pathTwoCandidate.currentElement = pathTwoNextElement;
      return getOptimizationCandidate(pathTwoCandidate);
    } else {
      return undefined;
    }
  }
  candidate.containedElements.push(candidate.currentElement);

  // get outgoing sequence flow of current element
  let outgoingFlow = candidate.currentElement.outgoing[0];
  candidate.containedElements.push(outgoingFlow);

  // move to the next element recursively
  candidate.currentElement = outgoingFlow.targetRef;
  return getOptimizationCandidate(candidate);
}


/**
 * Check if the candidate comprises a quantum circuit execution task
 *
 * @param candidate the candidate to analyse
 * @return true if the candidate comprises a quantum circuit execution task, false otherwise
 */
function containsQuantumCircuitExecutionTask(candidate) {
  for (let i = 0; i < candidate.containedElements.length; i++) {
    let element = candidate.containedElements[i];
    if (element.$type && element.$type === ('quantme:QuantumCircuitExecutionTask')) {
      return true;
    }
  }

  console.log('No quantum circuit execution task found. Candidate invalid: ', candidate);
  return false;
}

/**
 * Check if the candidate comprises a classical task, i.e., service or script task
 *
 * @param candidate the candidate to analyse
 * @return true if the candidate comprises a classical task, false otherwise
 */
function containsClassicalTask(candidate) {
  for (let i = 0; i < candidate.containedElements.length; i++) {
    let element = candidate.containedElements[i];
    if (element.$type && (element.$type === ('bpmn:ServiceTask') || element.$type === ('bpmn:ScriptTask'))) {
      return true;
    }
  }

  console.log('No classical task found. Candidate invalid: ', candidate);
  return false;
}
