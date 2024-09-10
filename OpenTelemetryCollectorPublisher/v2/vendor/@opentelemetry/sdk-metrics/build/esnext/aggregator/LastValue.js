'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LastValueAggregator = exports.LastValueAccumulation = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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


var _types = require('./types');

var _core = require('@opentelemetry/core');

var _MetricData = require('../export/MetricData');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LastValueAccumulation = exports.LastValueAccumulation = function () {
    function LastValueAccumulation(startTime) {
        var _current = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var sampleTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];

        _classCallCheck(this, LastValueAccumulation);

        this.startTime = startTime;
        this._current = _current;
        this.sampleTime = sampleTime;
    }

    _createClass(LastValueAccumulation, [{
        key: 'record',
        value: function record(value) {
            this._current = value;
            this.sampleTime = (0, _core.millisToHrTime)(Date.now());
        }
    }, {
        key: 'setStartTime',
        value: function setStartTime(startTime) {
            this.startTime = startTime;
        }
    }, {
        key: 'toPointValue',
        value: function toPointValue() {
            return this._current;
        }
    }]);

    return LastValueAccumulation;
}();
/** Basic aggregator which calculates a LastValue from individual measurements. */


var LastValueAggregator = exports.LastValueAggregator = function () {
    function LastValueAggregator() {
        _classCallCheck(this, LastValueAggregator);

        this.kind = _types.AggregatorKind.LAST_VALUE;
    }

    _createClass(LastValueAggregator, [{
        key: 'createAccumulation',
        value: function createAccumulation(startTime) {
            return new LastValueAccumulation(startTime);
        }
        /**
         * Returns the result of the merge of the given accumulations.
         *
         * Return the newly captured (delta) accumulation for LastValueAggregator.
         */

    }, {
        key: 'merge',
        value: function merge(previous, delta) {
            // nanoseconds may lose precisions.
            var latestAccumulation = (0, _core.hrTimeToMicroseconds)(delta.sampleTime) >= (0, _core.hrTimeToMicroseconds)(previous.sampleTime) ? delta : previous;
            return new LastValueAccumulation(previous.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
        }
        /**
         * Returns a new DELTA aggregation by comparing two cumulative measurements.
         *
         * A delta aggregation is not meaningful to LastValueAggregator, just return
         * the newly captured (delta) accumulation for LastValueAggregator.
         */

    }, {
        key: 'diff',
        value: function diff(previous, current) {
            // nanoseconds may lose precisions.
            var latestAccumulation = (0, _core.hrTimeToMicroseconds)(current.sampleTime) >= (0, _core.hrTimeToMicroseconds)(previous.sampleTime) ? current : previous;
            return new LastValueAccumulation(current.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
        }
    }, {
        key: 'toMetricData',
        value: function toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
            return {
                descriptor: descriptor,
                aggregationTemporality: aggregationTemporality,
                dataPointType: _MetricData.DataPointType.GAUGE,
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
                })
            };
        }
    }]);

    return LastValueAggregator;
}();
//# sourceMappingURL=LastValue.js.map