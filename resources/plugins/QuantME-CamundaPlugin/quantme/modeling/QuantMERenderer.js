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

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import * as quantmeReplaceOptions from './QuantMEReplaceOptions';
import * as consts from 'client/src/app/quantme/Constants';
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';
import { getFillColor, getStrokeColor } from 'bpmn-js/lib/draw/BpmnRenderUtil';
import { is } from 'bpmn-js/lib/util/ModelUtil';

/**
 * This class extends the default BPMNRenderer to render the newly introduced QuantME task types
 */
export default class QuantMERenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, quantMEPathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, 1001);

    this.computeStyle = styles.computeStyle;
    this.quantMEPathMap = quantMEPathMap;

    var defaultFillColor = config && config.defaultFillColor,
        defaultStrokeColor = config && config.defaultStrokeColor;

    function drawPath(self, parentGfx, d, attrs,) {
      attrs = self.computeStyle(attrs, [ 'no-fill' ], {
        strokeWidth: 2,
        stroke: 'black'
      });

      const path = svgCreate('path');
      svgAttr(path, { d: d });
      svgAttr(path, attrs);

      svgAppend(parentGfx, path);

      return path;
    }


    this.quantMeHandlers = {
      [consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS]: function(self, parentGfx, element) {
        var subprocess = self.renderer('bpmn:SubProcess')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('SUBPROCESS_QUANTUM_HARDWARE_SELECTION');

        drawPath(self,parentGfx, pathData, {
          transform:'scale(0.5)',
          strokeWidth: 1.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath('SUBPROCESS_QUANTUM_HARDWARE_SELECTION_FILL');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.5)',
          strokeWidth: 1.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return subprocess;
      },
      [consts.QUANTUM_COMPUTATION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_QUANTUM_COMPUTATION');

        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.QUANTUM_CIRCUIT_LOADING_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        // create circuit paths without filled shapes
        var pathData = quantMEPathMap.getPath('TASK_TYPE_CIRCUIT_LOADING');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultStrokeColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath('TASK_TYPE_CIRCUIT_LOADING_FILL');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.DATA_PREPARATION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes (black)
        pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION_FILL_BLACK');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes (background color)
        pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION_FILL_BACKGROUND');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultStrokeColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with dashed shapes
        pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION_DASHED');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          strokeDasharray: 5,
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create white line for database
        pathData = quantMEPathMap.getPath('TASK_TYPE_DATA_PREPARATION_BACKGROUND');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          stroke: getFillColor(element, '#FFFFFF')
        });

        return task;
      },
      [consts.ORACLE_EXPANSION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_ORACLE_EXPANSION');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath('TASK_TYPE_ORACLE_EXPANSION_FILL_BLACK');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        // create oracle box
        pathData = quantMEPathMap.getPath('TASK_TYPE_ORACLE_EXPANSION_BOX');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, '#FFF')
        });

        // create arrow
        pathData = quantMEPathMap.getPath('TASK_TYPE_ORACLE_EXPANSION_ARROW');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.QUANTUM_CIRCUIT_EXECUTION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_CIRCUIT_EXECUTION');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        pathData = quantMEPathMap.getPath('TASK_TYPE_CIRCUIT_EXECUTION_FILL');
        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 2.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.READOUT_ERROR_MITIGATION_TASK]: function(self, parentGfx, element) {
        var task = self.renderer('bpmn:Task')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('TASK_TYPE_ERROR_MITIGATION');

        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.3)',
          strokeWidth: 0.5,
          fill: getFillColor(element, '#000000'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return task;
      },
      [consts.HYBRID_RUNTIME_GROUP]: function(self, parentGfx, element) {
        var group = self.renderer('bpmn:Group')(parentGfx, element);

        var pathData = quantMEPathMap.getPath('GROUP_HYBRID_RUNTIME');

        drawPath(self, parentGfx, pathData, {
          transform:'scale(0.2)',
          strokeWidth: 0.5,
          fill: getFillColor(element, '#FFFFFF'),
          stroke: getStrokeColor(element, defaultStrokeColor)
        });

        return group;
      }
    };
  }

  renderer(type) {
    return this.handlers[type];
  }

  canRender(element) {

    // default elements can be handled
    if (super.canRender(element)) {
      return true;
    }

    // QuantME elements can be handled
    for (var i = 0; i < quantmeReplaceOptions.TASK.length; i++) {
      if (element.type === quantmeReplaceOptions.TASK[i].target.type) {
        return true;
      }
    }

    console.log('Unable to render element of type: ' + element.type);
    return false;
  }

  drawShape(parentNode, element) {
    let camundaRendered;

    // handle QuantME elements
    if (element.type in this.quantMeHandlers) {
      var h = this.quantMeHandlers[element.type];

      /* jshint -W040 */
      camundaRendered = h(this, parentNode, element);

    // use parent class for all non QuantME elements
    } else {
      camundaRendered = super.drawShape(parentNode, element);
    }

    function drawText(parentGfx, text, attrs) {
      let svgEl = svgCreate('<text>'+text+'</text>');
      svgAttr(svgEl, attrs);
      svgAppend(parentGfx, svgEl);
      return svgEl;
    }

    function drawPath(self, parentGfx, d, attrs,) {
      attrs = self.computeStyle(attrs, [ 'no-fill' ], {
        strokeWidth: 2,
        stroke: 'black'
      });

      const path = svgCreate('path');
      svgAttr(path, { d: d });
      svgAttr(path, attrs);
      svgAttr(path, { x: 0, y: -50 });

      svgAppend(parentGfx, path);

      return path;
    }

    // draw datafactor number next to tasks with assigned variable
    if (is(element, 'bpmn:Task') && element.businessObject.dataFactor) {
      drawText(parentNode, element.businessObject.dataFactor, { x: 71, y: -5 });

      var pathData = this.quantMEPathMap.getPath('DATA_FACTOR_ICON');
      drawPath(this, parentNode, pathData, {
        transform:'scale(0.21), translate(290,-111)',
        strokeWidth: 5,
        fill: getFillColor(element, '#FFFFFF'),
        stroke: getStrokeColor(element, '#000000'),
        'fill-opacity': 0,
      });

    }
    return camundaRendered;
  }




}


QuantMERenderer.$inject = [
  'config',
  'eventBus',
  'styles',
  'pathMap',
  'quantMEPathMap',
  'canvas',
  'textRenderer'
];
