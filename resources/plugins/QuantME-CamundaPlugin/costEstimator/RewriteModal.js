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

/* eslint-disable no-unused-vars */
import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

function calculateCosts(){

}

export default function RewriteModal({ onClose, candidates }) {

  // add an entry to the model per candidate
  let candidateButtons = [];
  let candidatesHtml = [];
  for (let i = 0; i < candidates.length; i++) {
    let policiesTable = [];
    policiesTable.push(<tr key={-1}><th>Task ID</th><th>Quality metric</th><th>Weight</th></tr>);
    let executionTasks = [];
    executionTasks.push(<tr key={-1}><th>Task ID</th><th>QPU</th></tr>);
    let candidate = candidates[i];
    let policies = candidates[i].policy;
    let hiddenPolicy = false;
    if (undefined !== policies && policies.length) {
      for (let j = 0; j < policies.length; j++) {
        console.log('POLICY');
        console.log(policies[j]);
        if (policies[j].businessObject.weight == undefined) {
          let policyName = policies[j].type.split('quantme:')[1].replace('Task', '').replace('_', ' ');
          policiesTable.push(<tr key={j}><td>{policies[j].businessObject.attachedToRef.id}</td><td>{policyName}</td><td contentEditable='true' suppressContentEditableWarning={true}>{0}</td></tr>);
        } else {
          let policyName = policies[j].type.split('quantme:')[1].replace('Task', '').replace('_', ' ');
          policiesTable.push(<tr key={j}><td>{policies[j].businessObject.attachedToRef.id}</td><td>{policyName}</td><td contentEditable='true' suppressContentEditableWarning={true}>{policies[j].businessObject.weight}</td></tr>);
        }
      }
    }
    if (policiesTable.length == 1) {
      hiddenPolicy = true;
    }
    for (let k = 0; k < candidate.containedElements.length; k++) {
      let currentElement = candidate.containedElements[k];
      if (currentElement.$type == 'quantme:QuantumCircuitExecutionTask') {
        executionTasks.push(<tr key={k}><td>{currentElement.id}</td><td>{currentElement.qpu}</td></tr>);
      }
    }
    let qpus = [] ;
      qpus.push('IonQ')
      qpus.push('QuEra');
      qpus.push('Xanadu');

    if (i === 0) {

      // activate first button and display details as default
      candidateButtons.push(<button id={'candidate-button' + { i }} key={i} className="adaptation-tab-button active" onClick={() => openTab(i)}>Candidate {i + 1}</button>);

      candidatesHtml.push(<div id={'candidate-html' + { i }} key={i} hidden={false}>
        <h3 className='spaceAbove'>Cost Estimator Qiskit</h3>
        The execution time was: 
        <h3 class="cmd-change-menu__title">
            Total costs: 0 USD
          </h3>
        <h3 className='spaceAbove'>Cost Estimator AWS</h3>
        <label for="region">Choose a region:</label>
          <select name="region" id="region" onChange={(e) =>computeQPU(e)}>
            <option value="us-east-1">US East (North Virginia)</option>
            <option value="us-west-1" selected>US West (North California)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="eu-west-2">Europe (London)</option>
          </select>
          <details class="details-example"><summary>Open simulators</summary>
          <label class="cmd-change-menu__header label" for="fname1">Number of Amazon Braket SV1 simulations</label>
          <input class="cmd-change-menu__header input" type="text1" id="sv1NumberSimulations" name="sv1NumberSimulations"/>
          <label class="cmd-change-menu__header label" for="fname2">Average duration (minutes) of SV1 simulations</label>
          <input class="cmd-change-menu__header input" type="text2" id="sv1AverageDuration" name="sv1AverageDuration"/>
          <label class="cmd-change-menu__header label" for="fname3">Number of Amazon Braket TN1 simulations</label>
          <input class="cmd-change-menu__header input" type="text3" id="tn1NumberSimulations" name="tn1NumberSimulations"/>
          <label class="cmd-change-menu__header label" for="fname4">Average duration (minutes) of TN1 simulations</label>
          <input class="cmd-change-menu__header input" type="text4" id="tn1AverageDuration" name="tn1AverageDuration"/>
          <label class="cmd-change-menu__header label" for="fname5">Number of Amazon Braket DM1 simulations</label>
          <input class="cmd-change-menu__header input" type="text5" id="dm1NumberSimulations" name="dm1NumberSimulations"/>
          <label class="cmd-change-menu__header label" for="fname6">Average duration (minutes) of DM1 simulations</label>
          <input class="cmd-change-menu__header input" type="text6" id="dm1AverageDuration" name="dm1AverageDuration"/>
          </details>
          <details class="details-example2"><summary>Open QPUs</summary>
          <label class="cmd-change-menu__header label" for="task7">Number of Quantum Tasks for </label><input class="cmd-change-menu__header input" type="taskQPUs" id="taskQPUs" name="taskQPUs"/>
          <label class="cmd-change-menu__header label" for="fname7">Average shots per task</label><input class="cmd-change-menu__header input" type="shots" id="shots" name="shots"/>
          </details>
          <button class="cmd-change-menu__body btn-sm btn-primary mb1 bg-blue" onClick={ (event) => calculateCosts()}>Calculate costs</button>
          <h3 class="cmd-change-menu__title">
            Total costs: 0 USD
          </h3>
          <details class="details-example2"><summary>Hybrid Jobs</summary></details>
          <h3 class="cmd-change-menu__title">
            Total costs: 0 USD
          </h3>
        <h3 className='spaceAbove'>Simulators</h3>
        <img className='spaceAbove' width="400" src={candidate.candidateImage}/>
        <h3 className='spaceAbove spaceUnder' hidden={hiddenPolicy}>The candidate contains QuantMeexecutionTask where the QPU attribute is not specified:</h3>
        <table hidden={hiddenPolicy}>
          <tbody>
            {executionTasks}
          </tbody>
        </table>
        <h3 className='spaceAbove spaceUnder' hidden={hiddenPolicy}>The candidate contains the following quality metrics:</h3>
        <table hidden={hiddenPolicy}>
          <tbody>
            {policiesTable}
          </tbody>
        </table>
        <h3 className='spaceAbove spaceUnder' hidden={hiddenPolicy}>Compute the hybrid runtime based on the specified quality metrics:</h3>
        <button type="button" className="btn btn-secondary" hidden={hiddenPolicy} onClick={() => onSubmit(i, undefined, true)}>Evaluate</button>
        <h3 className='spaceAbove spaceUnder' hidden={!hiddenPolicy}>The following hybrid runtimes might be used for improved execution:</h3>
        <table hidden={!hiddenPolicy}>
          <tbody>
            <tr className="spaceUnder">
              <td align="right">Qiskit Runtime</td>
              <td align="left">
                <button type="button" className="btn btn-secondary" onClick={() => onSubmit(i, 'Qiskit Runtime')}>Rewrite Workflow</button>
              </td>
            </tr>
            <tr className="spaceUnder">
              <td align="right">AWS Runtime</td>
              <td align="left">
                <button type="button" className="btn btn-secondary" onClick={() => onSubmit(i, 'AWS Runtime')}>Rewrite Workflow</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>);
    } else {

      // hide details for other candidates until activated through tab selection
      candidateButtons.push(<button id={'candidate-button' + { i }} key={i} className="adaptation-tab-button" onClick={() => openTab(i)}>Candidate {i + 1}</button>);
      candidatesHtml.push(
        <div id={'candidate-html' + { i }} key={i} hidden={true}>
          <h3 className='spaceAbove'>Visualized candidate:</h3>
          <img className='spaceAbove' width="400" src={candidate.candidateImage}/>
          <h3 className='spaceAbove spaceUnder' hidden={hiddenPolicy}>The candidate contains the following quality metrics:</h3>
          <table hidden={hiddenPolicy}>
            <tbody>
              {policiesTable}
            </tbody>
          </table>
          <h3 className='spaceAbove spaceUnder' hidden={hiddenPolicy}>Compute the hybrid runtime based on the specified quality metrics:</h3>
          <button type="button" className="btn btn-secondary" hidden={hiddenPolicy}>Evaluate</button>
          <button type="button" className="btn btn-secondary" hidden={hiddenPolicy} onClick={() => onSubmit(i, undefined, true)}>Evaluate</button>
          <h3 className='spaceAbove spaceUnder' hidden={!hiddenPolicy}>The following hybrid runtimes might be used for improved execution:</h3>
          <table hidden={!hiddenPolicy}>
            <tbody>
              <tr className="spaceUnder">
                <td align="right">Qiskit Runtime</td>
                <td align="left">
                  <button type="button" className="btn btn-secondary" onClick={() => onSubmit(i, 'Qiskit Runtime', false)}>Rewrite Workflow</button>
                </td>
              </tr>
              <tr className="spaceUnder">
                <td align="right">AWS Runtime</td>
                <td align="left">
                  <button type="button" className="btn btn-secondary" onClick={() => onSubmit(i, 'AWS Runtime', false)}>Rewrite Workflow</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>);
    }
  }

  const onSubmit = (i, runtimeName) => onClose({
    rewriteStarted: true,
    rewriteCandidateId: i,
    candidates: candidates,
    runtimeName : runtimeName,
    candidatesRootRef: candidatesRootRef
  });

  // reference to change the content depending on the selected tab
  let candidatesRootRef = React.createRef();
  let buttonsRootRef = React.createRef();

  // method to enable tab functionality by hiding and displaying different div elements
  function openTab(id) {
    const buttons = buttonsRootRef.current.children;
    const elements = candidatesRootRef.current.children;

    // hide details and deactivate buttons
    for (let i = 0; i < elements.length; i++) {
      elements[i].hidden = true;
      buttons[i].className = 'adaptation-tab-button';
    }

    // activity selected button and display details
    elements[id].hidden = false;
    buttons[id].className = 'adaptation-tab-button active';
  }

  return <Modal onClose={onClose}>

    <Title>
      Workflow Rewrite
    </Title>

    <Body>
      <div>
        <div className="adaptation-tab" ref={buttonsRootRef}>
          {candidateButtons}
        </div>

        <div id="candidateElements" ref={candidatesRootRef}>
          {candidatesHtml}
        </div>
      </div>
    </Body>

    <Footer>
      <div id="rewriteFormButtons">
        <button type="button" className="btn btn-secondary" onClick={() => onClose()}>Done</button>
      </div>
    </Footer>
  </Modal>;
}

