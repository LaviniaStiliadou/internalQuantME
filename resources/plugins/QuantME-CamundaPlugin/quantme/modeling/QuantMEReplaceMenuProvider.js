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

import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import * as quantmeReplaceOptions from './QuantMEReplaceOptions';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { filter } from 'min-dash';
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';

/**
 * This class extends the default ReplaceMenuProvider with the newly introduced QuantME task types
 */
export default class QuantMEReplaceMenuProvider extends ReplaceMenuProvider {
  constructor(popupMenu, modeling, moddle, bpmnReplace, rules, translate) {
    super(popupMenu, modeling, moddle, bpmnReplace, rules, translate);
  }

  /**
   * Overwrites the default menu provider to add the QuantME task types as replacement options for elements of type bpmn:Task
   *
   * @param element the element for which the replacement entries are requested
   * @returns {*} an array with menu entries of possible replacements
   */
  getEntries(element) {
    var options = super.getEntries(element);

    // add additional elements to replace tasks
    if (is(element, 'bpmn:Task')) {

      // remove option to replace element by itself
      var filteredOptions = filter(quantmeReplaceOptions.TASK, isDifferentType(element));
      options = options.concat(super._createEntries(element, filteredOptions));
    }

    // add additional elements to replace subprocesses
    if (is(element, 'bpmn:SubProcess')) {

      // remove option to replace element by itself
      filteredOptions = filter(quantmeReplaceOptions.SUBPROCESS, isDifferentType(element));
      options = options.concat(super._createEntries(element, filteredOptions));
    }

    // add additional elements to replace groups
    if (is(element, 'bpmn:Group')) {

      // remove option to replace element by itself
      filteredOptions = filter(quantmeReplaceOptions.GROUP, isDifferentType(element));
      options = options.concat(super._createEntries(element, filteredOptions));
    }

    // add additional elements to replace policies
    if ((element.type.includes('quantme') && element.type.includes('Policy')) ) {
      
      // remove option to replace element by itself
      filteredOptions = filter(quantmeReplaceOptions.POLICY, isDifferentType(element));
      options = options.concat(super._createEntries(element, filteredOptions));
    }
    return options;
  }
}

QuantMEReplaceMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];
