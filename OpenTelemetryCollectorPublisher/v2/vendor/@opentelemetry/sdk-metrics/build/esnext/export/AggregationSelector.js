'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = exports.DEFAULT_AGGREGATION_SELECTOR = undefined;

var _Aggregation = require('../view/Aggregation');

var _AggregationTemporality = require('./AggregationTemporality');

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DEFAULT_AGGREGATION_SELECTOR = exports.DEFAULT_AGGREGATION_SELECTOR = function DEFAULT_AGGREGATION_SELECTOR(_instrumentType) {
  return _Aggregation.Aggregation.Default();
};
var DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = exports.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = function DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR(_instrumentType) {
  return _AggregationTemporality.AggregationTemporality.CUMULATIVE;
};
//# sourceMappingURL=AggregationSelector.js.map