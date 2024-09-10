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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.DropAggregator = void 0;
var types_1 = require("./types");
/** Basic aggregator for None which keeps no recorded value. */

var DropAggregator = function () {
    function DropAggregator() {
        _classCallCheck(this, DropAggregator);

        this.kind = types_1.AggregatorKind.DROP;
    }

    _createClass(DropAggregator, [{
        key: "createAccumulation",
        value: function createAccumulation() {
            return undefined;
        }
    }, {
        key: "merge",
        value: function merge(_previous, _delta) {
            return undefined;
        }
    }, {
        key: "diff",
        value: function diff(_previous, _current) {
            return undefined;
        }
    }, {
        key: "toMetricData",
        value: function toMetricData(_descriptor, _aggregationTemporality, _accumulationByAttributes, _endTime) {
            return undefined;
        }
    }]);

    return DropAggregator;
}();

exports.DropAggregator = DropAggregator;
//# sourceMappingURL=Drop.js.map