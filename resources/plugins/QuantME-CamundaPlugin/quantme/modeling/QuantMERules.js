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

import inherits from 'inherits';
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

export default function QuantMERules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(QuantMERules, RuleProvider);

QuantMERules.$inject = [ 'eventBus'];


QuantMERules.prototype.init = function() {

  this.addRule('shape.create', 4000, function(context) {
    var shape = context.shape,
        target = context.target;

    if (shape.type.includes('Policy') && target.type != 'quantme:HybridRuntimeGroup') {
      return false;
    }
  });

  function canMove(context) {
    var target = context.target;

    if (target != undefined) {
      if (context.shapes[0].type.includes('Policy')) {
        return false;
      }
    }
  }


  this.addRule('elements.move', 4000, function(context) {
    return canMove(context);
  });

  this.addRule('shape.attach', 4000, function(context) {
    let shapeToAttach = context.shape;
    let target = context.target;

    if (shapeToAttach.type.includes('Policy') && target.type !== 'quantme:HybridRuntimeGroup') {
      return false;
    }

    if (shapeToAttach.type.includes('Policy') && target.type === 'quantme:HybridRuntimeGroup') {
      return true;
    }
  });
};