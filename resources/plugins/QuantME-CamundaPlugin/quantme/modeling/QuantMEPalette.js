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

import * as consts from 'client/src/app/quantme/Constants';

export default class QuantMEPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;


    function createPolicy(policyType) {
      return function(event) {
        const businessObject = bpmnFactory.create(policyType);

        const shape = elementFactory.createShape({
          type: policyType,
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    return {
      'tool-separator': {
        group: 'artifact',
        separator: true
      },
      'tool-separator2': {
        group: 'policy2',
        separator: true
      },
      'create.policy-task': {
        group: 'policy2',
        className: 'bpmn-icon-scroll',
        title: translate('Create Policy Event'),
        action: {
          dragstart: createPolicy(consts.POLICY),
          click: createPolicy(consts.POLICY)
        }
      }
    };
  }
}

QuantMEPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];