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

import QuantMERenderer from './QuantMERenderer';
import QuantMEReplaceMenuProvider from './QuantMEReplaceMenuProvider';
import QuantMEFactory from './QuantMEFactory';
import QuantMEPathMap from './QuantMEPathMap';
import QuantMEPropertiesProvider from './QuantMEPropertiesProvider';
import QuantMEPalette from './QuantMEPalette';
import QuantMERules from './QuantMERules';

export default {
  __init__: ['quantMERenderer', 'quantMEReplaceMenu', 'bpmnFactory', 'quantMEPathMap', 'quantMEPalette', 'quantMERules', 'propertiesProvider'],
  quantMERenderer: ['type', QuantMERenderer],
  quantMEReplaceMenu: ['type', QuantMEReplaceMenuProvider],
  bpmnFactory: ['type', QuantMEFactory],
  quantMEPathMap: ['type', QuantMEPathMap],
  quantMEPalette: [ 'type', QuantMEPalette],
  quantMERules: ['type', QuantMERules],
  propertiesProvider: ['type', QuantMEPropertiesProvider]
};
