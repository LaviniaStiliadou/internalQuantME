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

/* eslint-disable no-unused-vars*/
import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import AdaptationModal from './AdaptationModal';
import { findOptimizationCandidates } from './CandidateDetector';
import RewriteModal from './RewriteModal';
import { getQiskitRuntimeProgramDeploymentModel } from './runtimes/QiskitRuntimeHandler';
import { getAWSRuntimeProgramDeploymentModel } from './runtimes/AwsRuntimeHandler';
import { rewriteWorkflow } from './WorkflowRewriter';
import { getInvalidModelingConstruct, getRequiredProgramsGroup, getTaskOrder } from './runtimes/RuntimeHandlerUtils';
import { startReplacementProcess } from '../quantme/replacement/QuantMETransformator';
import { createModelerFromXml } from '../quantme/Utilities';
import {
  getRootProcess, performAjax
} from 'client/src/app/quantme/utilities/Utilities';
const defaultState = {
  adaptationOpen: false
};

export default class AdaptationPlugin extends PureComponent {

  constructor(props) {
    super(props);

    // modelers for all tabs to enable switching between them
    this.modelers = {};

    this.handleAdaptationClosed = this.handleAdaptationClosed.bind(this);
    this.handleRewriteClosed = this.handleRewriteClosed.bind(this);

    this.state = defaultState;

    // get QuantME component from the backend, e.g., to retrieve current QRMs
    this.quantME = props._getGlobal('quantME');

    // get config to update details in the backend
    this.backendConfig = props._getGlobal('config');
  }

  componentDidMount() {

    // get modeler to access current workflow
    this.props.subscribe('bpmn.modeler.created', (event) => {

      const {
        modeler, tab
      } = event;

      // save modeler and activate as current modeler
      this.modelers[tab.id] = modeler;
      this.modeler = modeler;
    });

    // change to modeler corresponding to the active tab
    this.props.subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.modeler = this.modelers[activeTab.id];
      this.state = defaultState;
    });

    // remove corresponding modeler if tab is closed
    this.props.subscribe('app.closedTab', ({ tab }) => {
      delete this.modelers[tab.id];
    });
  }

  async handleAdaptationClosed(result) {

    // handle click on 'Analyse Workflow' button
    if (result && result.hasOwnProperty('analysisStarted') && result.analysisStarted === true) {

      // hide analysis button
      result.refs.analysisButtonRef.current.hidden = true;

      // get all optimization candidates within the workflow model
      const analysisStartDate = Date.now();
      const optimizationCandidates = await findOptimizationCandidates(this.modeler);
      console.log('Searching for optimization candidates took: %d ms', Date.now() - analysisStartDate);

      if (optimizationCandidates === undefined || optimizationCandidates.length === 0) {
        console.log('Unable to find suitable optimization candidates!');

        // visualize error message
        result.refs.noCandidateDivRef.current.hidden = false;
      } else {
        console.log('Found %d optimization candidates within the workflow!', optimizationCandidates.length);

        this.candidateList = optimizationCandidates;
        this.setState({ adaptationOpen: false, rewriteOpen: true });
      }
    } else {

      // analysis modal aborted by the user
      this.setState({ adaptationOpen: false });
    }
  }

  async handleRewriteClosed(result) {
    if(result && result.hasOwnProperty('policyEvaluation')){
      console.log(result)
      let selectedCandidate = result.candidates[result.rewriteCandidateId];
      console.log(selectedCandidate);
      let group;
      for(let i= 0; i< selectedCandidate.currentElement.$parent.artifacts.length; i++){
        
        let currentGroupElement = selectedCandidate.currentElement.$parent.artifacts[i].candidate;
        //.currentElement.id;
        console.log(currentGroupElement);
        if (currentGroupElement != undefined) {
          currentGroupElement = selectedCandidate.currentElement.$parent.artifacts[i].candidate.currentElement.id
          if(currentGroupElement === selectedCandidate.currentElement.id){
             group = selectedCandidate.currentElement.$parent.artifacts[i];
             const elementRegistry = this.modeler.get('elementRegistry');
            console.log(elementRegistry);
            const element = elementRegistry.get(group.id);
            group = element;
          }
        }
      }
      console.log(group);
      let moneyPolicy = '';
      let privacyPolicy = '';
      let customEnvironmentPolicy = '';
      let availabilityPolicy = '';
      let policyRequest = '';

      // extract workflow XML
      function exportXmlWrapper() {
        return new Promise((resolve) => {
          group.candidate.modeler.saveXML((err, successResponse) => {
            resolve(successResponse);
          });
        });
      }

      let xml = await exportXmlWrapper();

      console.log(xml);
      // transform QuantME tasks within candidate
      let transformationResult = await startReplacementProcess(xml, await this.quantME.getQRMs(), this.modeler.config, group.candidate);
      if (transformationResult.status === 'failed') {
        console.log('Unable to transform QuantME tasks within the candidates!');
        return { error: 'Unable to transform QuantME tasks within the candidates. Please provide valid QRMs!' };
      }

      // import transformed XML to the modeler
      let modeler = await createModelerFromXml(transformationResult.xml);
      // check if all service tasks have either a deployment model attached and all script tasks provide the code inline and retrieve the files
      let rootElement = getRootProcess(modeler.getDefinitions());
      let requiredPrograms = await getRequiredProgramsGroup(rootElement, this.modeler.config.wineryEndpoint, group);
      if (requiredPrograms.error !== undefined) {
        return { error: requiredPrograms.error };
      }
      for (let i = 0; i < group.attachers.length; i++) {
        let boundaryEvent = group.attachers[i];
        if (boundaryEvent.type === 'quantme:Policy') {

        }
        if (boundaryEvent.type === 'quantme:MoneyPolicy') {
          let thresholdValue = boundaryEvent.businessObject.threshold;
          let weightValue = boundaryEvent.businessObject.weight || 0;
          moneyPolicy = {
            "moneyPolicy": {
              "threshold": thresholdValue,
              "weight": weightValue
            }
          };

        }
        if (boundaryEvent.type === 'quantme:PrivacyPolicy') {
          let weightValue = boundaryEvent.businessObject.weight || 0;
          let dataRetentionValue = boundaryEvent.businessObject.dataRetention;
          let thirdPartyQPUValue = boundaryEvent.businessObject.thirdPartyQPU;
          privacyPolicy = {
            "privacyPolicy": {
              "dataRetention": dataRetentionValue,
              "thirdPartyQPU": thirdPartyQPUValue,
              "weight": weightValue
            }
          };

        }
        if (boundaryEvent.type === 'quantme:AvailabilityPolicy') {
          let weightValue = boundaryEvent.businessObject.weight || 0;
          let devicesValue = boundaryEvent.businessObject.devices;
          let simulatorsAllowed = boundaryEvent.businessObject.simulatorsAllowed || false;
          availabilityPolicy = {
            "availabilityPolicy": {
              "devices": devicesValue,
              "simulatorsAllowed": simulatorsAllowed,
              "weight": weightValue
            }
          };


        }
        if (boundaryEvent.type === 'quantme:CustomEnvironmentPolicy') {
          let weightValue = boundaryEvent.businessObject.weight || 0;
          customEnvironmentPolicy = {
            "customEnvironmentPolicy": {
              "weight": weightValue
            }
          };

        }

      }
      let ibmq_token = {
        "ibmqToken": this.modeler.config.ibmqToken
      };
      let aws_keys = {
        "awsKeys": {
          "awsSecretAccessKey": this.modeler.config.awsSecretAccessKey,
          "awsAccessKey": this.modeler.config.awsAccessKey
        }
      };
      policyRequest = Object.assign({}, availabilityPolicy, customEnvironmentPolicy, moneyPolicy, privacyPolicy, ibmq_token, aws_keys);
      console.log(policyRequest);
      const fd = new FormData();
      fd.append('moneyPolicy', moneyPolicy);
      fd.append('availabilityPolicy', availabilityPolicy);
      fd.append('privacyPolicy', privacyPolicy);
      fd.append('customEnvironmentPolicy', customEnvironmentPolicy);
      fd.append('requiredPrograms', requiredPrograms.programs);
      fd.append('ibmToken', ibmq_token);
      fd.append('awsKeys', aws_keys);
      let r = await performAjax(this.modeler.config.policyHandlerEndpoint + '/policy-handler/api/v1.0/design-time-evaluation-hybrid-runtime', fd); 
      console.log(r)
      /** 
      fetch(this.modeler.config.policyHandlerEndpoint + '/policy-handler/api/v1.0/detect', {
        method: 'POST', // Replace with the appropriate HTTP method
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(policyRequest)
      })
      .then(response => {
        console.log('Data sent:', response);
      })
      .catch(error => {
        console.error('Error:', error);
      }); 

      fetch(this.modeler.config.policyHandlerEndpoint + '/policy-handler/api/v1.0/design-time-evaluation-hybrid-runtime', {
        method: 'POST', // Replace with the appropriate HTTP method
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(policyRequest)
      })
      .then(response => {
        console.log('Data sent:', response);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      //console.log(r);
      //console.log(result.policyEvaluation);
      */
      return;
    }else{
    // handle click on 'Rewrite Workflow' button
    if (result && result.hasOwnProperty('rewriteStarted') && result.rewriteStarted === true
      && result.hasOwnProperty('rewriteCandidateId')) {
      console.log('Rewriting started for candidate with ID %d and for runtime: ', result.rewriteCandidateId, result.runtimeName);

      // get reference to the button triggering the current rewrite
      let rewriteButton;
      let selectedTab = result.candidatesRootRef.current.children[result.rewriteCandidateId];
      let runtimeTable = selectedTab.children[3];
      let runtimeLines = runtimeTable.children[0].children;
      let otherButtons = [];
      for (let runtimeLine of runtimeLines) {

        // check if table line corresponding to runtime is found
        let button = runtimeLine.children[1].children[0];
        if (runtimeLine.children[0].innerText === result.runtimeName) {

          // get the button reference
          rewriteButton = button;
        } else {

          // get other buttons to deactivate if they are not already deactivated
          if (button.disabled === false) {
            otherButtons.push(button);
          }
        }
      }

      if (rewriteButton === undefined) {
        this.props.displayNotification({
          type: 'error',
          title: 'Unable to analyse workflow',
          content: 'Error during workflow analysis. Aborting rewriting modal!',
          duration: 20000
        });

        this.setState({ rewriteOpen: false });
        return;
      }

      // disable button and show message that rewrite is in progress
      rewriteButton.disabled = true;
      rewriteButton.innerText = 'Rewriting in progress...';

      // deactivate all other buttons
      for (let otherButton of otherButtons) {
        console.log('Deactivating button: ', otherButton);
        otherButton.disabled = true;
      }

      // track start time of hybrid program generation and workflow rewrite
      const rewriteStartDate = Date.now();

      let rewriteCandidate = result.candidates[result.rewriteCandidateId];
      let programGenerationResult;
      switch (result.runtimeName) {
      case 'Qiskit Runtime':
        programGenerationResult = await getQiskitRuntimeProgramDeploymentModel(rewriteCandidate, this.modeler.config, await this.quantME.getQRMs());
        break;
      case 'AWS Runtime':
        programGenerationResult = await getAWSRuntimeProgramDeploymentModel(rewriteCandidate, this.modeler.config, await this.quantME.getQRMs());
        break;
      default:
        programGenerationResult = { error: 'Unable to find suitable runtime handler for: ' + result.runtimeName };
      }

      // check if hybrid program generation was successful
      if (programGenerationResult.error) {
        console.log('Hybrid program generation failed with error: ', programGenerationResult.error);

        // display error in modal
        rewriteButton.title = programGenerationResult.error;
        rewriteButton.innerText = 'Rewrite not possible!';
        rewriteButton.className = rewriteButton.className + ' rewrite-failed-button';

        // reactivate all other buttons
        for (let otherButton of otherButtons) {
          console.log('Reactivating button: ', otherButton);
          otherButton.disabled = false;
        }

        return;
      } else {
        console.log('Hybrid program generation successful!');

        // rewrite the workflow and display the result for the user
        let rewritingResult = await rewriteWorkflow(this.modeler, rewriteCandidate, this.modeler.config.hybridRuntimeProvenance, programGenerationResult.hybridProgramId);
        if (rewritingResult.error) {
          console.log('Rewriting workflow failed with error: ', rewritingResult.error);

          // display error in modal
          rewriteButton.title = programGenerationResult.error;
          rewriteButton.innerText = 'Rewrite not possible!';
          rewriteButton.className = rewriteButton.className + ' rewrite-failed-button';

          // reactivate all other buttons
          for (let otherButton of otherButtons) {
            console.log('Reactivating button: ', otherButton);
            otherButton.disabled = false;
          }
        } else {
          console.log('Rewriting workflow successfully after %d ms!', Date.now() - rewriteStartDate);

          // display success in modal
          rewriteButton.title = programGenerationResult.error;
          rewriteButton.innerText = 'Rewrite successful!';
          rewriteButton.className = rewriteButton.className + ' rewrite-successful-button';
        }
        return;
      }
    }}

    // close the modal if 'Cancel' button is pressed
    this.setState({ rewriteOpen: false });

  }


  async detectOptimizationCandidates() {
    const optimizationCandidates = await findOptimizationCandidates(this.modeler);
    if (optimizationCandidates === undefined || optimizationCandidates.length === 0) {
      console.log('Unable to find suitable optimization candidates!');

      // TODO visualize error message
      // result.refs.noCandidateDivRef.current.hidden = false;
    } else {
      console.log('Found %d optimization candidates within the workflow!', optimizationCandidates.length);

      this.candidateList = optimizationCandidates;
    }
  }

  render() {

    // render loop analysis button and pop-up menu
    return (<Fragment>
      <Fill slot="toolbar">
        <button type="button" className="src-app-primitives-Button__Button--3Ffn0"
          title="Open menu to analyse and improve hybrid loops"
          onClick={() => { this.detectOptimizationCandidates(); this.setState({ adaptationOpen: true }); } }>
          <span className="hybrid-loop-adaptation"><span className="indent">Improve Hybrid Loops</span></span>
        </button>
      </Fill>
      {this.state.adaptationOpen && (
        <AdaptationModal
          onClose={this.handleAdaptationClosed}
        />
      )}
      {this.state.rewriteOpen && (
        <RewriteModal
          onClose={this.handleRewriteClosed}
          candidates={this.candidateList}
        />
      )}
    </Fragment>);
  }
}
