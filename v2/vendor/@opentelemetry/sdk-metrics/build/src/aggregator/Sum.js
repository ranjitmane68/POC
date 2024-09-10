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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.SumAggregator = exports.SumAccumulation = void 0;
var types_1 = require("./types");
var MetricData_1 = require("../export/MetricData");

var SumAccumulation = function () {
    function SumAccumulation(startTime, monotonic) {
        var _current = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        var reset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        _classCallCheck(this, SumAccumulation);

        this.startTime = startTime;
        this.monotonic = monotonic;
        this._current = _current;
        this.reset = reset;
    }

    _createClass(SumAccumulation, [{
        key: "record",
        value: function record(value) {
            if (this.monotonic && value < 0) {
                return;
            }
            this._current += value;
        }
    }, {
        key: "setStartTime",
        value: function setStartTime(startTime) {
            this.startTime = startTime;
        }
    }, {
        key: "toPointValue",
        value: function toPointValue() {
            return this._current;
        }
    }]);

    return SumAccumulation;
}();

exports.SumAccumulation = SumAccumulation;
/** Basic aggregator which calculates a Sum from individual measurements. */

var SumAggregator = function () {
    function SumAggregator(monotonic) {
        _classCallCheck(this, SumAggregator);

        this.monotonic = monotonic;
        this.kind = types_1.AggregatorKind.SUM;
    }

    _createClass(SumAggregator, [{
        key: "createAccumulation",
        value: function createAccumulation(startTime) {
            return new SumAccumulation(startTime, this.monotonic);
        }
        /**
         * Returns the result of the merge of the given accumulations.
         */

    }, {
        key: "merge",
        value: function merge(previous, delta) {
            var prevPv = previous.toPointValue();
            var deltaPv = delta.toPointValue();
            if (delta.reset) {
                return new SumAccumulation(delta.startTime, this.monotonic, deltaPv, delta.reset);
            }
            return new SumAccumulation(previous.startTime, this.monotonic, prevPv + deltaPv);
        }
        /**
         * Returns a new DELTA aggregation by comparing two cumulative measurements.
         */

    }, {
        key: "diff",
        value: function diff(previous, current) {
            var prevPv = previous.toPointValue();
            var currPv = current.toPointValue();
            /**
             * If the SumAggregator is a monotonic one and the previous point value is
             * greater than the current one, a reset is deemed to be happened.
             * Return the current point value to prevent the value from been reset.
             */
            if (this.monotonic && prevPv > currPv) {
                return new SumAccumulation(current.startTime, this.monotonic, currPv, true);
            }
            return new SumAccumulation(current.startTime, this.monotonic, currPv - prevPv);
        }
    }, {
        key: "toMetricData",
        value: function toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
            return {
                descriptor: descriptor,
                aggregationTemporality: aggregationTemporality,
                dataPointType: MetricData_1.DataPointType.SUM,
                dataPoints: accumulationByAttributes.map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        attributes = _ref2[0],
                        accumulation = _ref2[1];

                    return {
                        attributes: attributes,
                        startTime: accumulation.startTime,
                        endTime: endTime,
                        value: accumulation.toPointValue()
                    };
                }),
                isMonotonic: this.monotonic
            };
        }
    }]);

    return SumAggregator;
}();

exports.SumAggregator = SumAggregator;
//# sourceMappingURL=Sum.js.map