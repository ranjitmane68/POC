'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DropAggregator = undefined;

var _types = require('./types');

/** Basic aggregator for None which keeps no recorded value. */
var DropAggregator = /** @class */function () {
    function DropAggregator() {
        this.kind = _types.AggregatorKind.DROP;
    }
    DropAggregator.prototype.createAccumulation = function () {
        return undefined;
    };
    DropAggregator.prototype.merge = function (_previous, _delta) {
        return undefined;
    };
    DropAggregator.prototype.diff = function (_previous, _current) {
        return undefined;
    };
    DropAggregator.prototype.toMetricData = function (_descriptor, _aggregationTemporality, _accumulationByAttributes, _endTime) {
        return undefined;
    };
    return DropAggregator;
}(); /*
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
exports.DropAggregator = DropAggregator;
//# sourceMappingURL=Drop.js.map