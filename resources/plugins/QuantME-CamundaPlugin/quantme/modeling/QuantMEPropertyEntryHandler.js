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

let EntryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');
let ModelUtil = require('bpmn-js/lib/util/ModelUtil');
let CmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');
import * as consts from 'client/src/app/quantme/Constants';

export function addAlgorithmEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ALGORITHM,
    label: translate('Algorithm'),
    modelProperty: consts.ALGORITHM,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let algorithm = bo && bo.algorithm;
      return { algorithm: algorithm };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        algorithm: values.algorithm || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addProviderEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.PROVIDER,
    label: translate('Provider'),
    modelProperty: consts.PROVIDER,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let provider = bo && bo.provider;
      return { provider: provider };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        provider: values.provider || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addQuantumCircuitEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.QUANTUM_CIRCUIT,
    label: translate('Quantum Circuit'),
    modelProperty: consts.QUANTUM_CIRCUIT,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let quantumCircuit = bo && bo.quantumCircuit;
      return { quantumCircuit: quantumCircuit };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        quantumCircuit: values.quantumCircuit || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addUrlEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.URL,
    label: translate('URL'),
    modelProperty: consts.URL,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let url = bo && bo.url;
      return { url: url };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        url: values.url || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addEncodingSchemaEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ENCODING_SCHEMA,
    label: translate('Encoding Schema'),
    modelProperty: consts.ENCODING_SCHEMA,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let encodingSchema = bo && bo.encodingSchema;
      return { encodingSchema: encodingSchema };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        encodingSchema: values.encodingSchema || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addProgrammingLanguageEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.PROGRAMMING_LANGUAGE,
    label: translate('Programming Language'),
    modelProperty: consts.PROGRAMMING_LANGUAGE,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let programmingLanguage = bo && bo.programmingLanguage;
      return { programmingLanguage: programmingLanguage };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        programmingLanguage: values.programmingLanguage || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addOracleIdEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ORACLE_ID,
    label: translate('Oracle Id'),
    modelProperty: consts.ORACLE_ID,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let oracleId = bo && bo.oracleId;
      return { oracleId: oracleId };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        oracleId: values.oracleId || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addOracleCircuitEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ORACLE_CIRCUIT,
    label: translate('Oracle Circuit'),
    modelProperty: consts.ORACLE_CIRCUIT,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let oracleCircuit = bo && bo.oracleCircuit;
      return { oracleCircuit: oracleCircuit };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        oracleCircuit: values.oracleCircuit || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addOracleURLEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ORACLE_URL,
    label: translate('Oracle URL'),
    modelProperty: consts.ORACLE_URL,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let oracleURL = bo && bo.oracleURL;
      return { oracleURL: oracleURL };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        oracleURL: values.oracleURL || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addQpuEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.QPU,
    label: translate('QPU'),
    modelProperty: consts.QPU,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let qpu = bo && bo.qpu;
      return { qpu: qpu };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        qpu: values.qpu || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addShotsEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.SHOTS,
    label: translate('Shots'),
    modelProperty: consts.SHOTS,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let shots = bo && bo.shots;
      return { shots: shots };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        shots: values.shots || undefined
      });
    },

    validate: function(element, values, node) {
      return values.shots && isNaN(values.shots) ? { shots: translate('Shots attribute must contain an Integer!') } : {};
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addMaxAgeEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.MAX_AGE,
    label: translate('Max Age (in minutes)'),
    modelProperty: consts.MAX_AGE,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let maxAge = bo && bo.maxAge;
      return { maxAge: maxAge };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        maxAge: values.maxAge || undefined
      });
    },

    validate: function(element, values, node) {
      return values.maxAge && isNaN(values.maxAge) ? { maxAge: translate('MaxAge attribute must contain an Integer!') } : {};
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addProvidersEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.PROVIDERS,
    label: translate('Providers for the Selection'),
    modelProperty: consts.PROVIDERS,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let providers = bo && bo.providers;
      return { providers: providers };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        providers: values.providers || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addSimulatorsAllowedEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.SIMULATORS_ALLOWED,
    label: translate('Simulators Allowed (true/false)'),
    modelProperty: consts.SIMULATORS_ALLOWED,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let simulatorsAllowed = bo && bo.simulatorsAllowed;
      return { simulatorsAllowed: simulatorsAllowed };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        simulatorsAllowed: values.simulatorsAllowed || undefined
      });
    },

    validate: function(element, values, node) {
      return values.simulatorsAllowed === undefined || (values.simulatorsAllowed !== 'true' && values.simulatorsAllowed !== 'false') ? { simulatorsAllowed: translate('Simulators Allowed must either be true or false!') } : {};
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addSelectionStrategyEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.SELECTION_STRATEGY,
    label: translate('Selection Strategy'),
    modelProperty: consts.SELECTION_STRATEGY,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let selectionStrategy = bo && bo.selectionStrategy;
      return { selectionStrategy: selectionStrategy };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        selectionStrategy: values.selectionStrategy || undefined
      });
    },

    validate: function(element, values, node) {
      return (values.selectionStrategy && !consts.SELECTION_STRATEGY_LIST.includes(values.selectionStrategy)) ? { selectionStrategy: translate('Please define a supported selection strategy (see docs)!') } : {};
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addCalibrationMethodEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.CALIBRATION_METHOD,
    label: translate('Calibration Matrix Generation Method'),
    selectOptions: [
      { value:'fullMatrix',name:'Full Matrix' } , { value:'tpnm',name:'TPNM' }, { value:'ctmp',name:'CTMP' } , { value:'ddot',name:'DDOT' }, { value:'conditionallyRigorous',name:'Conditionally Rigorous' } ,
      { value:'fuzzyCMeans',name:'Fuzzy C-Means' } , { value:'cumulantCM',name:'Cumulant CM' } , { value:'sclableTMatrix',name:'Sclable T-Matrix' }
    ],
    modelProperty: consts.CALIBRATION_METHOD,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let calibrationMethod = bo && bo.calibrationMethod;
      return { calibrationMethod: calibrationMethod };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        calibrationMethod: values.calibrationMethod || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let mitigationMethod = bo && bo.mitigationMethod;
      return !(mitigationMethod === 'matrixInversion' || mitigationMethod === 'pertubativeREM' || mitigationMethod === 'geneticBasedREM' || mitigationMethod === 'mthree');
    }
  }));
}

export function addMitigationMethodEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.MITIGATION_METHOD,
    label: translate('Mitigation Method'),
    selectOptions: [
      { value:'matrixInversion',name:'Matrix Inversion' } , { value:'pertubativeREM',name:'Pertubative REM' }, { value:'mthree',name:'Mthree' }, { value:'geneticBasedREM',name:'Genetic-Based REM' },
      { value:'activeREM',name:'Active REM' } , { value:'modelFreeREM',name:'Model-Free REM' }, { value:'hybridREM',name:'Hybrid REM' }, { value:'crosstalkREM',name:'Crosstalk-Focused REM' },
      { value:'sim',name:'SIM' } , { value:'aim',name:'AIM' }, { value:'bfa',name:'BFA' }, { value:'truncatedNeumannSeries',name:'Truncated Neumann Series' },
      { value:'lsu',name:'LSU' } , { value:'dnnREM',name:'DNN-Based REM' }
    ],
    modelProperty: consts.MITIGATION_METHOD,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let mitigationMethod = bo && bo.mitigationMethod;
      return { mitigationMethod: mitigationMethod };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      const isCM = (values.mitigationMethod === 'matrixInversion' || values.mitigationMethod === 'pertubativeREM' || values.mitigationMethod === 'geneticBasedREM' || values.mitigationMethod === 'mthree');

      // remove CM value if non CM method is selected
      if (!isCM) {
        return CmdHelper.updateBusinessObject(element, bo, {
          mitigationMethod: values.mitigationMethod || undefined,
          calibrationMethod: undefined
        });
      } // set default CM value if CM method is selected and non CM method was selected previously
      else if (isCM && !bo.calibrationMethod) {
        return CmdHelper.updateBusinessObject(element, bo, {
          mitigationMethod: values.mitigationMethod || undefined,
          calibrationMethod: 'fullMatrix'
        });
      }
      return CmdHelper.updateBusinessObject(element, bo, {
        mitigationMethod: values.mitigationMethod || undefined,
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addDNNHiddenLayersEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.DNN_HIDDEN_LAYER,
    label: translate('Number of DNN Hidden Layers'),
    modelProperty: consts.DNN_HIDDEN_LAYER,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let dnnHiddenLayer = bo && bo.dnnHiddenLayer;
      return { dnnHiddenLayer: dnnHiddenLayer };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        dnnHiddenLayer: values.dnnHiddenLayer || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let mitigationMethod = bo && bo.mitigationMethod;
      return !(mitigationMethod === 'dnnREM');
    }
  }));
}

export function addNeighborhoodRangeEntry(group, translate) {

  // const mm = group.entries.get(consts.MITIGATION_METHOD);
  group.entries.push(EntryFactory.textField({
    id: consts.NEIGHBORHOOD_RANGE,
    label: translate('Neighborhood Range'),
    modelProperty: consts.NEIGHBORHOOD_RANGE,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let neighborhoodRange = bo && bo.neighborhoodRange;
      return { neighborhoodRange: neighborhoodRange };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        neighborhoodRange: values.neighborhoodRange || undefined
      });
    },

    validate: function(element, values, node) {
      return values.neighborhoodRange && isNaN(values.neighborhoodRange) ? { neighborhoodRange: translate('Shots attribute must contain an Integer!') } : {};
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let calibrationMethod = bo && bo.calibrationMethod;
      return !(calibrationMethod === 'sclableTMatrix');
    }
  }));
}

export function addObjectiveFunctionEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.OBJECTIVE_FUNCTION,
    label: translate('Objective Function'),
    selectOptions: [
      { value:'expectationValue',name:'Expectation Value' } ,
      { value:'gibbs',name:'Gibbs' },
      { value:'cvar',name:'CVar' }
    ],
    modelProperty: consts.OBJECTIVE_FUNCTION,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let objectiveFunction = bo && bo.objectiveFunction;
      return { objectiveFunction: objectiveFunction };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        objectiveFunction: values.objectiveFunction || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      console.log(element);
      let bo = ModelUtil.getBusinessObject(element);
      if (bo.$type === 'quantme:ReadoutErrorMitigationTask') {
        let mitigationMethod = bo && bo.mitigationMethod;
        return !(mitigationMethod === 'geneticBasedREM');
      }
      else {
        return false;
      }
    }
  }));
}

export function addOptimizerEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.OBJECTIVE_FUNCTION,
    label: translate('Optimizer'),
    selectOptions: [
      { value:'cobyla',name:'Cobyla' } ,
      { value:'spsa',name:'SPSA' },
      { value:'nelderMead',name:'Nelder Mead' }
    ],
    modelProperty: consts.OPTIMIZER,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let optimizer = bo && bo.optimizer;
      return { optimizer: optimizer };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        optimizer: values.optimizer || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if (bo.$type === 'quantme:ReadoutErrorMitigationTask') {
        let mitigationMethod = bo && bo.mitigationMethod;
        return !(mitigationMethod === 'geneticBasedREM');
      } else {
        return false;
      }
    }
  }));
}

export function addMaxREMCostsEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.MAX_REM_COSTS,
    label: translate('Max REM Costs (in $)'),
    modelProperty: consts.MAX_REM_COSTS,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let maxREMCosts = bo && bo.maxREMCosts;
      return { maxREMCosts: maxREMCosts };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        maxREMCosts: values.maxREMCosts || undefined
      });
    },

    validate: function(element, values, node) {
      return values.maxREMCosts && isNaN(values.maxREMCosts) ? { maxREMCosts: translate('Max REM Costs attribute must contain an Integer!') } : {};
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addMaxCMSizeEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.MAX_CM_SIZE,
    label: translate('Max CM Size (in MB)'),
    modelProperty: consts.MAX_CM_SIZE,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let maxCMSize = bo && bo.maxCMSize;
      return { maxCMSize: maxCMSize };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        maxCMSize: values.maxCMSize || undefined
      });
    },

    validate: function(element, values, node) {
      return values.maxCMSize && isNaN(values.maxCMSize) ? { maxCMSize: translate('Max CM Size attribute must contain an Integer!') } : {};
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let mitigationMethod = bo && bo.mitigationMethod;
      return !(mitigationMethod === 'matrixInversion' || mitigationMethod === 'pertubativeREM' || mitigationMethod === 'geneticBasedREM' || mitigationMethod === 'mthree');
    }
  }));
}

export function addWarmStartingMethodEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.WARM_STARTING_METHOD,
    label: translate('Warm-Starting method'),
    selectOptions: [
      { value:'initialStateWarmStartEgger',name:'Initial State Warm-Start Egger' } ,
      { value:'initialParameterPrecomputation',name:'Initial Parameter Precomputation' },
    ],
    modelProperty: consts.WARM_STARTING_METHOD,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let warmStartingMethod = bo && bo.warmStartingMethod;
      return { warmStartingMethod: warmStartingMethod };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        warmStartingMethod: values.warmStartingMethod || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addQuantumAlgorithmEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.QUANTUM_ALGORITHM,
    label: translate('Quantum algorithm (e.g. QAOA)'),
    modelProperty: consts.QUANTUM_ALGORITHM,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let quantumAlgorithm = bo && bo.quantumAlgorithm;
      return { quantumAlgorithm: quantumAlgorithm };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        quantumAlgorithm: values.quantumAlgorithm || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addClassicalAlgorithmdEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.CLASSICAL_ALGORTHM,
    label: translate('Classical algorithm used to warm-start'),
    modelProperty: consts.CLASSICAL_ALGORTHM,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let classicalAlgorithm = bo && bo.classicalAlgorithm;
      return { classicalAlgorithm: classicalAlgorithm };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        classicalAlgorithm: values.classicalAlgorithm || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let warmStartingMethod = bo && bo.warmStartingMethod;
      return !(warmStartingMethod === 'initialStateWarmStartEgger');
    }
  }));
}

export function addRepetitionsEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.REPETITIONS,
    label: translate('Repetitions of the classical algorithm for finding good approximation'),
    modelProperty: consts.REPETITIONS,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let repetitions = bo && bo.repetitions;
      return { repetitions: repetitions };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        repetitions: values.repetitions || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let warmStartingMethod = bo && bo.warmStartingMethod;
      return !(warmStartingMethod === 'initialStateWarmStartEgger');
    }
  }));
}

export function addRoundedEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ROUNDED,
    label: translate('Round classical result '),
    modelProperty: consts.ROUNDED,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let rounded = bo && bo.rounded;
      return { rounded: rounded };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        rounded: values.rounded || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let warmStartingMethod = bo && bo.warmStartingMethod;
      console.log(warmStartingMethod);
      return !(warmStartingMethod === 'initialStateWarmStartEgger');
    }
  }));
}
export function addCostFunctionEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.COST_FUNCTION,
    label: translate('Cost function to use'),
    modelProperty: consts.COST_FUNCTION,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let costFunction = bo && bo.costFunction;
      return { costFunction: costFunction };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        costFunction: values.costFunction || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addEtaEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ETA,
    label: translate('Eta'),
    modelProperty: consts.ETA,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let eta = bo && bo.eta;
      return { eta: eta };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        eta: values.eta || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let objectiveFunction = bo && bo.objectiveFunction;
      return !(objectiveFunction === 'gibbs');
    }
  }));
}

export function addAlphaEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ALPHA,
    label: translate('Alpha'),
    modelProperty: consts.ALPHA,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let alpha = bo && bo.alpha;
      return { alpha: alpha };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        alpha: values.alpha || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let objectiveFunction = bo && bo.objectiveFunction;
      return !(objectiveFunction === 'cvar');
    }
  }));
}

export function addAlgorithmicProblemEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.ALGORITHMIC_PROBLEM,
    label: translate('Algorithmic Problem (e.g. MaxCut)'),
    modelProperty: consts.ALGORITHMIC_PROBLEM,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let algorithmicProblem = bo && bo.algorithmicProblem;
      return { algorithmicProblem: algorithmicProblem };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        algorithmicProblem: values.algorithmicProblem || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addMaxIterationsEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.MAX_ITERATIONS,
    label: translate('Max Iterations'),
    modelProperty: consts.MAX_ITERATIONS,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let maxIterations = bo && bo.maxIterations;
      return { maxIterations: maxIterations };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        maxIterations: values.maxIterations || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let optimizer = bo && bo.optimizer;
      return !(optimizer === 'cobyla');
    }
  }));
}

export function addToleranceThresholdEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.TOLERANCE_THRESHOLD,
    label: translate('Tolereance Threshold'),
    modelProperty: consts.TOLERANCE_THRESHOLD,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let toleranceThreshold = bo && bo.toleranceThreshold;
      return { toleranceThreshold: toleranceThreshold };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        toleranceThreshold: values.toleranceThreshold || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let optimizer = bo && bo.optimizer;
      return !(optimizer === 'cobyla');
    }
  }));
}

export function addLearningRateEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.LEARNING_RATE,
    label: translate('Learning Rate'),
    modelProperty: consts.LEARNING_RATE,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let learningRate = bo && bo.learningRate;
      return { learningRate: learningRate };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        learningRate: values.learningRate || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let optimizer = bo && bo.optimizer;
      return !(optimizer === 'cobyla');
    }
  }));
}



export function addCuttingMethodEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.CUTTING_METHOD,
    label: translate('Cutting Method'),
    selectOptions: [
      { value:'qiskit',name:'Qiskit' }
    ],
    modelProperty: consts.CUTTING_METHOD,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let cuttingMethod = bo && bo.cuttingMethod;
      return { cuttingMethod: cuttingMethod };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        cuttingMethod: values.cuttingMethod || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addMaxSubCircuitWidthEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.MAX_SUBCIRCUIT_WIDTH,
    label: translate('Maximum Sub-Circuit width'),
    modelProperty: consts.MAX_SUBCIRCUIT_WIDTH,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let maxSubCircuitWidth = bo && bo.maxSubCircuitWidth;
      return { maxSubCircuitWidth: maxSubCircuitWidth };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        maxSubCircuitWidth: values.maxSubCircuitWidth || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let cuttingMethod = bo && bo.cuttingMethod;
      return !(cuttingMethod === 'qiskit');
    }
  }));
}


export function addMaxNumberOfCutsEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.MAX_NUMBER_OF_CUTS,
    label: translate('Maximum number of cuts'),
    modelProperty: consts.MAX_NUMBER_OF_CUTS,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let maxNumberOfCuts = bo && bo.maxNumberOfCuts;
      return { maxNumberOfCuts: maxNumberOfCuts };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        maxNumberOfCuts: values.maxNumberOfCuts || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let cuttingMethod = bo && bo.cuttingMethod;
      return !(cuttingMethod === 'qiskit');
    }
  }));
}


export function addNumberOfSubcircuitsEntry(group, translate) {
  group.entries.push(EntryFactory.textField({
    id: consts.MAXIMUM_NUM_SUBCIRCUITS,
    label: translate('Maximum Number of Sub-Circuits'),
    modelProperty: consts.MAXIMUM_NUM_SUBCIRCUITS,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let maxNumSubCircuits = bo && bo.maxNumSubCircuits;
      return { maxNumSubCircuits: maxNumSubCircuits };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        maxNumSubCircuits: values.maxNumSubCircuits || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let cuttingMethod = bo && bo.cuttingMethod;
      return !(cuttingMethod === 'qiskit');
    }
  }));
}

export function addCuttingMethodVQATaskEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.CUTTING_METHOD,
    label: translate('Cutting Method'),
    selectOptions: [
      { value:'',name:'None' }, { value:'qiskit',name:'Qiskit' }
    ],
    modelProperty: consts.CUTTING_METHOD,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let cuttingMethod = bo && bo.cuttingMethod;
      return { cuttingMethod: cuttingMethod };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        cuttingMethod: values.cuttingMethod || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addWarmStartingMethodVQATaskEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.WARM_STARTING_METHOD,
    label: translate('Warm-Starting method'),
    selectOptions: [
      { value: '', name: 'None' },
      { value:'initialStateWarmStartEgger',name:'Initial State Warm-Start Egger' } ,
      { value:'initialParameterPrecomputation',name:'Initial Parameter Precomputation' },
    ],
    modelProperty: consts.WARM_STARTING_METHOD,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let warmStartingMethod = bo && bo.warmStartingMethod;
      return { warmStartingMethod: warmStartingMethod };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        warmStartingMethod: values.warmStartingMethod || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addMitigationMethodVQATaskEntry(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.MITIGATION_METHOD,
    label: translate('Mitigation Method'),
    selectOptions: [
      { value:'',name:'None' } ,
      { value:'matrixInversion',name:'Matrix Inversion' } , { value:'pertubativeREM',name:'Pertubative REM' }, { value:'mthree',name:'Mthree' }, { value:'geneticBasedREM',name:'Genetic-Based REM' },
      { value:'activeREM',name:'Active REM' } , { value:'modelFreeREM',name:'Model-Free REM' }, { value:'hybridREM',name:'Hybrid REM' }, { value:'crosstalkREM',name:'Crosstalk-Focused REM' },
      { value:'sim',name:'SIM' } , { value:'aim',name:'AIM' }, { value:'bfa',name:'BFA' }, { value:'truncatedNeumannSeries',name:'Truncated Neumann Series' },
      { value:'lsu',name:'LSU' } , { value:'dnnREM',name:'DNN-Based REM' }
    ],
    modelProperty: consts.MITIGATION_METHOD,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let mitigationMethod = bo && bo.mitigationMethod;
      return { mitigationMethod: mitigationMethod };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        mitigationMethod: values.mitigationMethod || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addRuntimeProvider(group, translate) {
  group.entries.push(EntryFactory.selectBox({
    id: consts.RUNTIME_PROVIDER,
    label: translate('Runtime Provider'),
    selectOptions: [
      { value:'qiskit',name:'Qiskit' } , { value:'aws',name:'AWS' }
    ],
    modelProperty: consts.RUNTIME_PROVIDER,

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let runtimeProvider = bo && bo.runtimeProvider;
      return { runtimeProvider: runtimeProvider };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        runtimeProvider: values.runtimeProvider || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addAvailabilityPolicyEntries(group, translate, moddle, element, index){
  group.entries.push(EntryFactory.textField({
    id: 'avaiabilityWeight',
    label: translate('Weight'),
    modelProperty: 'availabilityWeight',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.availabilityWeight;
      return { availabilityWeight: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.weight = values.availabilityWeight;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        availabilityWeight: values.availabilityWeight|| undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
  /**
  group.entries.push(EntryFactory.textField({
    id: 'devices',
    label: translate('Devices'),
    modelProperty: 'devices',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.devices;
      return { devices: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.devices = values.devices;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        devices: values.devices || undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
   */
  group.entries.push(EntryFactory.selectBox({
    id: 'simulatorsAllowed',
    label: translate('Simulators allowed?'),
    selectOptions: [
      { value:'yes',name:'Yes' } , { value:'no',name:'No' }
    ],
    modelProperty: 'simulatorsAllowed',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let runtimeProvider = bo && bo.simulatorsAllowed;
      return { simulatorsAllowed: runtimeProvider };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.weight = devices;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        devices: values.devices || undefined,
        extensionElements});
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
  
}
export function addMoneyPolicyEntries(group, translate, moddle, element, index) {
  group.entries.push(EntryFactory.textField({
    id: 'moneyWeight',
    label: translate('Weight'),
    modelProperty: 'moneyWeight',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.moneyWeight;
      return { moneyWeight: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.weight = values.moneyWeight;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        moneyWeight: values.moneyWeight|| undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
  group.entries.push(EntryFactory.textField({
    id: 'threshold',
    label: translate('Threshold'),
    modelProperty: 'threshold',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.threshold;
      return { threshold: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.threshold = values.threshold;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        threshold: values.threshold|| undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
}

export function addPrivacyPolicyEntries(group, translate, moddle, element, index){
  group.entries.push(EntryFactory.textField({
    id: 'privacyWeight',
    label: translate('Weight'),
    modelProperty: 'privacyWeight',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.privacyWeight;
      return { privacyWeight: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.weight = values.privacyWeight;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        privacyWeight: values.privacyWeight|| undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
  group.entries.push(EntryFactory.textField({
    id: 'dataRetention',
    label: translate('Data Retention'),
    modelProperty: 'dataRetention',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.dataRetention;
      return { dataRetention: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.dataRetention = values.dataRetention;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        dataRetention: values.dataRetention|| undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
  group.entries.push(EntryFactory.textField({
    id: 'thirdPartyQPU',
    label: translate('Third-party QPU'),
    modelProperty: 'thirdPartyQPU',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.thirdPartyQPU;
      return { thirdPartyQPU: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.thirdPartyQPU = values.thirdPartyQPU
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        thirdPartyQPU: values.thirdPartyQPU|| undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));

}

export function addCustomEnvironmentPolicyEntries(group, translate, moddle, element, index) {
  group.entries.push(EntryFactory.textField({
    id: 'customWeight',
    label: translate('Weight'),
    modelProperty: 'customWeight',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.customWeight;
      return { customWeight: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[index];
      if (extensionElement != undefined){
          extensionElement.customWeight = values.customWeight;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        customWeight: values.customWeight|| undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[index];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
}

export function addMoneyPolicyNoneEntries(group, translate, moddle, element){

  group.entries.push(EntryFactory.textField({
    id: 'weight',
    label: translate('Weight'),
    modelProperty: 'weight',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.weight;
      return { weight: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        weight: values.weight|| undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
  group.entries.push(EntryFactory.textField({
    id: 'threshold',
    label: translate('Threshold'),
    modelProperty: 'threshold',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.threshold;
      return { threshold: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        threshold: values.threshold|| undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addAvailabilityPolicyNoneEntries(group, translate, moddle, element){
  group.entries.push(EntryFactory.textField({
    id: 'weight',
    label: translate('Weight'),
    modelProperty: 'weight',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.weight;
      return { weight: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        weight: values.weight|| undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));

  group.entries.push(EntryFactory.selectBox({
    id: 'simulatorsAllowed',
    label: translate('Simulators allowed'),
    selectOptions: [
      { value:'yes',name:'Yes' }, { value:'no',name:'No' }
    ],
    modelProperty: 'simulatorsAllowed',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let cuttingMethod = bo && bo.simulatorsAllowed;
      return { simulatorsAllowed: cuttingMethod };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        simulatorsAllowed: values.simulatorsAllowed || undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addPrivacyPolicyNoneEntries(group, translate, moddle, element){

  group.entries.push(EntryFactory.textField({
    id: 'weight',
    label: translate('Weight'),
    modelProperty: 'weight',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.weight;
      return { weight: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        weight: values.weight|| undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
  group.entries.push(EntryFactory.textField({
    id: 'dataRetention',
    label: translate('Data Retention'),
    modelProperty: 'dataRetention',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.dataRetention;
      return { dataRetention: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      return CmdHelper.updateBusinessObject(element, bo, {
        dataRetention: values.dataRetention|| undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
  group.entries.push(EntryFactory.textField({
    id: 'thirdPartyQPU',
    label: translate('Third-party QPU'),
    modelProperty: 'thirdPartyQPU',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.thirdPartyQPU;
      return { thirdPartyQPU: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        thirdPartyQPU: values.thirdPartyQPU|| undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
  group.entries.push(EntryFactory.textField({
    id: 'marketingCommunication',
    label: translate('Marketing Communication'),
    modelProperty: 'marketingCommunication',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.marketingCommunication;
      return { marketingCommunication: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        marketingCommunication: values.marketingCommunication|| undefined
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      return false;
    }
  }));
}

export function addPolicyEntries(group, translate, moddle, element) {
  var remainingPolicies = consts.AVAILABLE_POLICIES;
  var remainingPoliciesOptions = [];
  for (let i = 0; i < remainingPolicies.length; i++) {
    remainingPoliciesOptions.push({ value:remainingPolicies[i],name:remainingPolicies[i] });
  }
  let bo2 = ModelUtil.getBusinessObject(element);
  let extensionElements2 = bo2.extensionElements

  group.entries.push(EntryFactory.selectBox({
    id: 'policyOne',
    label: translate('First Policy'),
    selectOptions:remainingPoliciesOptions,
    modelProperty: 'policyOne',
    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let policyOne = bo && bo.policyOne;
      return { policyOne: policyOne };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      const extensionElements = moddle.create("bpmn:ExtensionElements");
      console.log(values.policyOne);

      // create the custom element (according to our json config)
      const policyType = moddle.create("quantme:PolicyType");
      //extensionElements.get("values").push(policyType);
      if (values.policyOne === 'quantme:MoneyPolicy'){
        const moneyPolicy = moddle.create("quantme:MoneyPolicyType");
        moneyPolicy.weight = 0;
        moneyPolicy.threshold = 0;
        extensionElements.get("values").push(moneyPolicy);
      }
      if (values.policyOne === 'quantme:AvailabilityPolicy'){
        const availabilityPolicy = moddle.create("quantme:AvailabilityPolicyType");
        availabilityPolicy.weight = 0;
        availabilityPolicy.devices ;
        availabilityPolicy.simulatorsAllowed= true;
        extensionElements.get("values").push(availabilityPolicy);
      }
      if (values.policyOne === 'quantme:PrivacyPolicy'){
        const privacyPolicy = moddle.create("quantme:PrivacyPolicyType");
        privacyPolicy.weight = 0;
        privacyPolicy.dataRetention = false;
        privacyPolicy.marketingCommunication = "opt-out";
        privacyPolicy.thirdPartyQPU = false;
        extensionElements.get("values").push(privacyPolicy);
        //policyType.privacyPolicy = privacyPolicy;

      }
      if (values.policyOne === 'quantme:CustomEnvironmentPolicy'){
        const customEnvironmentPolicy = moddle.create("quantme:CustomEnvironmentPolicyType");
        customEnvironmentPolicy.weight = 0;
        extensionElements.get("values").push(customEnvironmentPolicy);
        //policyType.customEnvironmentPolicy = customEnvironmentPolicy;
      }
      
      policyType.name = values.policyOne;
      console.log(policyType);

      // put the custom element into the extensionElements
      
      return CmdHelper.updateBusinessObject(element, bo, {
        policyOne: values.policyOne || undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      console.log(element);
      return false;
    }
  }));
  /** 
  group.entries.push(EntryFactory.textField({
    id: 'weight',
    label: translate('Weight'),
    modelProperty: 'weight',

    get: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let weight = bo && bo.weight;
      return { weight: weight };
    },

    set: function(element, values, node) {
      let bo = ModelUtil.getBusinessObject(element);
      let extensionElement = bo.extensionElements.values[0];
      if (extensionElement != undefined){
          extensionElement.weight = values.weight;
      }
      let extensionElements = bo.extensionElements;
      return CmdHelper.updateBusinessObject(element, bo, {
        weight: values.weight|| undefined,
        extensionElements
      });
    },

    validate: function(element, values, node) {
      return true;
    },

    hidden: function(element, node) {
      let bo = ModelUtil.getBusinessObject(element);
      if(bo.extensionElements){
        let extensionElement = bo.extensionElements.values[0];
        if(extensionElement != undefined){
          return false;
        }
      }
      return true;
    }
  }));
  */
  if (extensionElements2 != undefined){
    if(extensionElements2.values[0] != undefined){
      if(extensionElements2.values[0].$type  === "quantme:AvailabilityPolicyType" ){
        addAvailabilityPolicyEntries(group, translate, moddle, element, 0);
    }
      if(extensionElements2.values[0].$type  === "quantme:CustomEnvironmentPolicyType" ){
        addCustomEnvironmentPolicyEntries(group, translate, moddle, element, 0);
    }
    if(extensionElements2.values[0].$type  === "quantme:MoneyPolicyType" ){
      addMoneyPolicyEntries(group, translate, moddle, element, 0);
    } 
    if(extensionElements2.values[0].$type  === "quantme:PrivacyPolicyType" ){
      addPrivacyPolicyEntries(group, translate, moddle, element, 0);
    } 
  }
    group.entries.push(EntryFactory.selectBox({
      id: 'policyTwo',
      label: translate('Second Policy'),
      selectOptions:remainingPoliciesOptions,
      modelProperty: 'policyTwo',
      get: function(element, node) {
        let bo = ModelUtil.getBusinessObject(element);
        let policyTwo = bo && bo.policyTwo;
        return { policyTwo: policyTwo };
      },
  
      set: function(element, values, node) {
        let bo = ModelUtil.getBusinessObject(element);
        const extensionElements = ModelUtil.getBusinessObject(element).extensionElements;
        console.log(values.policyTwo);
  
        // create the custom element (according to our json config)
        const policyType = moddle.create("quantme:PolicyType");
        //extensionElements.get("values").push(policyType);
        if(values.policyTwo !== element.businessObject.policyOne){
          if (values.policyTwo === 'quantme:MoneyPolicy'){
            const moneyPolicy = moddle.create("quantme:MoneyPolicyType");
            moneyPolicy.weight = 0;
            moneyPolicy.threshold = 0;
            extensionElements.get("values").push(moneyPolicy);
          }
          if (values.policyTwo === 'quantme:AvailabilityPolicy'){
            const availabilityPolicy = moddle.create("quantme:AvailabilityPolicyType");
            availabilityPolicy.weight = 0;
            availabilityPolicy.devices ;
            availabilityPolicy.simulatorsAllowed= true;
            extensionElements.get("values").push(availabilityPolicy);
          }
          if (values.policyTwo === 'quantme:PrivacyPolicy'){
            const privacyPolicy = moddle.create("quantme:PrivacyPolicyType");
            privacyPolicy.weight = 0;
            privacyPolicy.dataRetention = false;
            privacyPolicy.marketingCommunication = "opt-out";
            privacyPolicy.thirdPartyQPU = false;
            extensionElements.get("values").push(privacyPolicy);
            //policyType.privacyPolicy = privacyPolicy;
    
          }
          if (values.policyTwo === 'quantme:CustomEnvironmentPolicy'){
            const customEnvironmentPolicy = moddle.create("quantme:CustomEnvironmentPolicyType");
            customEnvironmentPolicy.weight = 0;
            extensionElements.get("values").push(customEnvironmentPolicy);
            //policyType.customEnvironmentPolicy = customEnvironmentPolicy;
          }
          policyType.name = values.policyTwo;
          console.log(policyType);

      }
      
        // put the custom element into the extensionElements
        
        return CmdHelper.updateBusinessObject(element, bo, {
          policyTwo: values.policyTwo || undefined,
          extensionElements
        });
      },
  
      validate: function(element, values, node) {
        var errorMessage = {};
        if(element.businessObject.policyTwo !== undefined){
        if(element.businessObject.policyOne !== element.businessObject.policyTwo){
          return true;
        }else{
          errorMessage.policyTwo = "Please select for each policy a different type."
          return errorMessage;
        }}
        //if(element.businessObject.extensionElements != undefined){
          //if(element.businessObject.extensionElements.values.length > 1){
           // console.log(element.businessObject.extensionElements.values[0].$type);
            //console.log(element.businessObject.extensionElements.values[0].$type)
            //if(element.businessObject.extensionElements.values[0].$type !== element.businessObject.extensionElements.values[1].$type){
             // return true;
            //}else{
             // errorMessage.policyTwo = "Please select for each policy a different type."
              //return errorMessage;
            //}
          //}
        //}
      },
  
      hidden: function(element, node) {
        if(element.businessObject.extensionElements != undefined){
          if(element.businessObject.extensionElements.values[0] != undefined){
            return false
          }
        }
        return true;
      }
    }));
    if(extensionElements2.values[1] != undefined){
      if(extensionElements2.values[1].$type  === "quantme:AvailabilityPolicyType" ){
        addAvailabilityPolicyEntries(group, translate, moddle, element, 1);
    }
      if(extensionElements2.values[1].$type  === "quantme:CustomEnvironmentPolicyType" ){
        addCustomEnvironmentPolicyEntries(group, translate, moddle, element, 1);
    }
    if(extensionElements2.values[1].$type  === "quantme:MoneyPolicyType" ){
      addMoneyPolicyEntries(group, translate, moddle, element, 1);
    } 
    if(extensionElements2.values[1].$type  === "quantme:PrivacyPolicyType" ){
      addPrivacyPolicyEntries(group, translate, moddle, element, 1);
    } }
    group.entries.push(EntryFactory.selectBox({
      id: 'policyThree',
      label: translate('Third Policy'),
      selectOptions:remainingPoliciesOptions,
      modelProperty: 'policyThree',
      get: function(element, node) {
        let bo = ModelUtil.getBusinessObject(element);
        let policyThree = bo && bo.policyThree;
        return { policyThree: policyThree };
      },
  
      set: function(element, values, node) {
        let bo = ModelUtil.getBusinessObject(element);
        const extensionElements = ModelUtil.getBusinessObject(element).extensionElements;
        //console.log(values.policyTwo);
  
        // create the custom element (according to our json config)
        const policyType = moddle.create("quantme:PolicyType");
        //extensionElements.get("values").push(policyType);
        if(values.policyThree !== element.businessObject.policyTwo && element.businessObject.policyOne !== values.policyThree){
          if (values.policyThree === 'quantme:MoneyPolicy'){
            const moneyPolicy = moddle.create("quantme:MoneyPolicyType");
            moneyPolicy.weight = 0;
            moneyPolicy.threshold = 0;
            extensionElements.get("values").push(moneyPolicy);
          }
          if (values.policyThree === 'quantme:AvailabilityPolicy'){
            const availabilityPolicy = moddle.create("quantme:AvailabilityPolicyType");
            availabilityPolicy.weight = 0;
            availabilityPolicy.devices ;
            availabilityPolicy.simulatorsAllowed= true;
            extensionElements.get("values").push(availabilityPolicy);
          }
          if (values.policyThree === 'quantme:PrivacyPolicy'){
            const privacyPolicy = moddle.create("quantme:PrivacyPolicyType");
            privacyPolicy.weight = 0;
            privacyPolicy.dataRetention = false;
            privacyPolicy.marketingCommunication = "opt-out";
            privacyPolicy.thirdPartyQPU = false;
            extensionElements.get("values").push(privacyPolicy);
            //policyType.privacyPolicy = privacyPolicy;
    
          }
          if (values.policyThree === 'quantme:CustomEnvironmentPolicy'){
            const customEnvironmentPolicy = moddle.create("quantme:CustomEnvironmentPolicyType");
            customEnvironmentPolicy.weight = 0;
            extensionElements.get("values").push(customEnvironmentPolicy);
            //policyType.customEnvironmentPolicy = customEnvironmentPolicy;
          }
          policyType.name = values.policyThree;
          console.log(policyType);

      }
      
        // put the custom element into the extensionElements
        
        return CmdHelper.updateBusinessObject(element, bo, {
          policyThree: values.policyThree || undefined,
          extensionElements
        });
      },
  
      validate: function(element, values, node) {
        var errorMessage = {};
        if (element.businessObject.policyThree !== undefined) {
        if(element.businessObject.policyOne !== element.businessObject.policyThree && element.businessObject.policyTwo !== element.businessObject.policyThree ){
          return true;
        }else{
          errorMessage.policyTwo = "Please select for each policy a different type."
          return errorMessage;
        }}
        //if(element.businessObject.extensionElements != undefined){
          //if(element.businessObject.extensionElements.values.length > 1){
           // console.log(element.businessObject.extensionElements.values[0].$type);
            //console.log(element.businessObject.extensionElements.values[0].$type)
            //if(element.businessObject.extensionElements.values[0].$type !== element.businessObject.extensionElements.values[1].$type){
             // return true;
            //}else{
             // errorMessage.policyTwo = "Please select for each policy a different type."
              //return errorMessage;
            //}
          //}
        //}
      },
  
      hidden: function(element, node) {
        if(element.businessObject.extensionElements != undefined){
          if(element.businessObject.extensionElements.values[1] != undefined){
            return false
          }
        }
        return true;
      }
    }));
    if(extensionElements2.values[2] != undefined){
      if(extensionElements2.values[2].$type  === "quantme:AvailabilityPolicyType" ){
        addAvailabilityPolicyEntries(group, translate, moddle, element, 2);
    }
      if(extensionElements2.values[2].$type  === "quantme:CustomEnvironmentPolicyType" ){
        addCustomEnvironmentPolicyEntries(group, translate, moddle, element, 2);
    }
    if(extensionElements2.values[2].$type  === "quantme:MoneyPolicyType" ){
      addMoneyPolicyEntries(group, translate, moddle, element, 2);
    } 
    if(extensionElements2.values[2].$type  === "quantme:PrivacyPolicyType" ){
      addPrivacyPolicyEntries(group, translate, moddle, element, 2);
    } }
}
}
