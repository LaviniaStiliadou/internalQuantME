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

import JSZip from 'jszip';
import { fetch } from 'whatwg-fetch';

/**
 * Get the task order within the candidate represented by two lists containing tasks before and after the looping gateway
 *
 * @param candidate the candidate to retrieve the task order for
 * @param modeler the modeler comprising the transformed workflow model of the candidate
 * @return two ordered lists representing the task order, one with all tasks before the looping gateway, the second after
 */
export function getTaskOrder(candidate, modeler) {

  // lists to store task before/after looping gateway
  let beforeLoop = [];
  let loopCondition = [];
  let beforeLoopGateway = [];
  let afterLoopGateway = [];

  // get entry point from the current modeler
  let elementRegistry = modeler.get('elementRegistry');
  let element = elementRegistry.get(candidate.entryPointId).businessObject;


  // search all tasks before looping gateway
  while (element !== undefined) {
    let localBeforeLoop = collectElementsBeforeGateway(element);

    // skip lastTaskBeforeLoop if there are 2 loops right after each other
    let lastTaskBeforeLoop = localBeforeLoop.length > 0 ? localBeforeLoop[localBeforeLoop.length - 1] : undefined ;
    let loopStartGateway;
    if (lastTaskBeforeLoop !== undefined) {
      let beforeLoopIds = [];
      localBeforeLoop.forEach(task => beforeLoopIds.push(task.id));
      beforeLoop.push(beforeLoopIds.toString());

      // break loop if task is last task of hybrid group
      if (lastTaskBeforeLoop.id === candidate.exitPointId) {
        break;
      }
      loopStartGateway = getNextNonSequenceFlowElement(lastTaskBeforeLoop);
    } else {
      loopStartGateway = element;
    }


    // collect BeforeGatewayElements
    let localBeforeGateway = collectElementsBeforeGateway(getNextElement(loopStartGateway));
    let beforeGatewayIds = [];
    localBeforeGateway.forEach(task => beforeGatewayIds.push(task.id));
    beforeLoopGateway.push(beforeGatewayIds.toString());
    let lastTaskBeforeStartGateway = localBeforeGateway.length > 0 ? localBeforeGateway[localBeforeGateway.length - 1] : undefined;
    let loopEndGateway;

    if (lastTaskBeforeStartGateway !== undefined) {
      loopEndGateway = getNextNonSequenceFlowElement(lastTaskBeforeStartGateway);
    } else {
      loopEndGateway = getNextNonSequenceFlowElement(loopStartGateway);
    }

    // find AfterGateway (but in loop) path and collect elements + save loop condition
    let path0Elements = collectElementsBeforeGateway(loopEndGateway.outgoing[0]);
    let path0End = path0Elements.length > 0 ? getNextNonSequenceFlowElement(path0Elements[path0Elements.length -1]) : getNextElement(loopEndGateway.outgoing[0]);
    if (path0End !== undefined && path0End.id === loopStartGateway.id) {
      let afterGatewayIds = [];
      path0Elements.forEach(task => afterGatewayIds.push(task.id));
      afterLoopGateway.push(afterGatewayIds.toString());
      loopCondition.push(loopEndGateway.outgoing[0].conditionExpression.body);
      element = getNextNonSequenceFlowElement(loopEndGateway.outgoing[1]);
    } else {
      let afterGatewayIds = [];
      collectElementsBeforeGateway(loopEndGateway.outgoing[1]).forEach(task => afterGatewayIds.push(task.id));
      afterLoopGateway.push(afterGatewayIds.toString());
      loopCondition.push(loopEndGateway.outgoing[1].conditionExpression.body);
      element = getNextNonSequenceFlowElement(loopEndGateway.outgoing[0]);
    }
  }

  return { beforeLoop: beforeLoop, loopCondition: loopCondition, beforeLoopGateway: beforeLoopGateway, afterLoopGateway: afterLoopGateway };
}

function collectElementsBeforeGateway(currentEl) {
  let beforeLoopList = [];
  while (currentEl !== undefined && currentEl.$type !== 'bpmn:ExclusiveGateway') {
    if (currentEl.$type === 'bpmn:ScriptTask' || currentEl.$type === 'bpmn:ServiceTask') {
      beforeLoopList.push(currentEl);
    }
    currentEl = getNextElement(currentEl);
  }
  return beforeLoopList;
}

function getNextNonSequenceFlowElement(element) {
  let next = getNextElement(element);
  if (next === undefined) {
    return undefined;
  }
  return next.$type === 'bpmn:SequenceFlow'? getNextElement(next) : next;
}

/**
 * Get the next element within the candidate
 *
 * @param element the current element
 * @return the next element
 */
function getNextElement(element) {
  if (element === undefined) {
    return undefined;
  }
  if (element.$type === 'bpmn:SequenceFlow') {
    return element.targetRef;
  } else {
    if (element.outgoing === undefined) {
      return undefined;
    } else {
      return element.outgoing[0];
    }
  }
}

/**
 * Retrieve the programs of all script/service tasks defined within the given root element
 *
 * @param rootElement the root element to retrieve all related programs
 * @param wineryEndpoint the endpoint of a Winery to load the required deployment models from
 * @return the list of all retrieved files or an error message if the retrieval fails
 */
export async function getRequiredPrograms(rootElement, wineryEndpoint) {
  let requiredProgramsZip = new JSZip();

  for (let i = 0; i < rootElement.flowElements.length; i++) {
    let element = rootElement.flowElements[i];

    // service task needs attached deployment model that is accessible through the defined URL
    if (element.$type === 'bpmn:ServiceTask') {
      if (element.deploymentModelUrl === undefined) {
        console.log('No deployment model defined for ServiceTask: ', element.id);
        return { error: 'No deployment model defined for ServiceTask: ' + element.id };
      }

      // replace generic placeholder by endpoint of connected Winery
      let url = element.deploymentModelUrl.replace('{{ wineryEndpoint }}', wineryEndpoint);

      // download the deployment model from the given URL
      console.log('Retrieving deployment model from URL: ', url);
      const response = await fetch(url);
      const blob = await response.blob();

      // unzip the retrieved CSAR
      let zip = await (new JSZip()).loadAsync(blob);

      // get all contained deployment artifacts
      let files = getDeploymentArtifactFiles(zip);

      // only one deployment artifact is allowed containing the quantum and classical programs
      if (files.length !== 1) {
        console.log('Unable to retrieve required deployment artifact for ServiceTemplate with URL: ', url);
        return { error: 'Unable to retrieve required deployment artifact for ServiceTemplate with URL: ', url };
      }

      // load the DA as blob and add in separate folder into overall zip
      let folder = requiredProgramsZip.folder(element.id);
      let da = await files[0].async('blob');
      await folder.loadAsync(da);
    }

    // script task need an inline script which can be exported
    if (element.$type === 'bpmn:ScriptTask') {
      if (element.script === undefined || element.scriptFormat === undefined) {
        console.log('No inline script defined for ScriptTask: ', element.id);
        return { error: 'No inline script defined for ScriptTask: ' + element.id };
      }

      // create folder for the script
      let folder = requiredProgramsZip.folder(element.id);

      // add file depending on the used language
      switch (element.scriptFormat) {
      case 'groovy':
        folder.file(element.id + '.groovy', element.script);
        break;
      case 'javascript':
        folder.file(element.id + '.js', element.script);
        break;
      default:
        console.log('Inline script for ScriptTask %s has invalid scriptFormat: %s', element.id, element.scriptFormat);
        return { error: 'Inline script for ScriptTask ' + element.id + ' has invalid scriptFormat: ' + element.scriptFormat };
      }
    }
  }

  return { programs: await requiredProgramsZip.generateAsync({ type: 'blob' }) };
}

/**
 * Search for invalid modeling construct for AWS Runtime within the given root element and return the first found construct
 *
 * @param rootElement the root element to search for the invalid constructs
 * @return the first invalid modeling construct or undefined if all are valid
 */
export function getInvalidModelingConstruct(rootElement) {
  for (let i = 0; i < rootElement.flowElements.length; i++) {
    let element = rootElement.flowElements[i];
    if (element.$type !== 'bpmn:ExclusiveGateway'
      && element.$type !== 'bpmn:SequenceFlow'
      && element.$type !== 'bpmn:ServiceTask'
      && element.$type !== 'bpmn:ScriptTask') {

      return element;
    }
  }
  return undefined;
}

/**
 * Returns the files within the CSAR related to deployment artifacts
 *
 * FIXME: add generic DA retrieval functionality
 *
 * @param zip the zip object comprising the CSAR content
 * @return the files related to deployment artifacts
 */
export function getDeploymentArtifactFiles(zip) {
  return zip.filter(function(relativePath) {
    if (!relativePath.startsWith('artifacttemplates/')) {
      return false;
    }

    // skip artifacttemplates/{namespace} and access the contained folder name
    let pathParts = relativePath.split('/');
    if (pathParts.length < 5) {
      return false;
    }

    // we currently assume that the deployment artifacts are stored in folders ending with '_DA'
    let artifactName = pathParts[2];
    if (!artifactName.endsWith('_DA')) {
      return false;
    }

    // the deployment artifact must contain a files folder with a zip.file in it
    if (pathParts[3] !== 'files') {
      return false;
    }
    return pathParts[4].endsWith('.zip');
  });
}
