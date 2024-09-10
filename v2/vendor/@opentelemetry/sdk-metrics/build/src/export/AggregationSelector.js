"use strict";
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

Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = exports.DEFAULT_AGGREGATION_SELECTOR = void 0;
var Aggregation_1 = require("../view/Aggregation");
var AggregationTemporality_1 = require("./AggregationTemporality");
var DEFAULT_AGGREGATION_SELECTOR = function DEFAULT_AGGREGATION_SELECTOR(_instrumentType) {
  return Aggregation_1.Aggregation.Default();
};
exports.DEFAULT_AGGREGATION_SELECTOR = DEFAULT_AGGREGATION_SELECTOR;
var DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = function DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR(_instrumentType) {
  return AggregationTemporality_1.AggregationTemporality.CUMULATIVE;
};
exports.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
//# sourceMappingURL=AggregationSelector.js.map