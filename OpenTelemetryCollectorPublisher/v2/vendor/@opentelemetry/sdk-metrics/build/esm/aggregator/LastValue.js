"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LastValueAggregator = exports.LastValueAccumulation = undefined;

var _types = require("./types");

var _core = require("@opentelemetry/core");

var _MetricData = require("../export/MetricData");

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
var __read = undefined && undefined.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
};

var LastValueAccumulation = /** @class */function () {
    function LastValueAccumulation(startTime, _current, sampleTime) {
        if (_current === void 0) {
            _current = 0;
        }
        if (sampleTime === void 0) {
            sampleTime = [0, 0];
        }
        this.startTime = startTime;
        this._current = _current;
        this.sampleTime = sampleTime;
    }
    LastValueAccumulation.prototype.record = function (value) {
        this._current = value;
        this.sampleTime = (0, _core.millisToHrTime)(Date.now());
    };
    LastValueAccumulation.prototype.setStartTime = function (startTime) {
        this.startTime = startTime;
    };
    LastValueAccumulation.prototype.toPointValue = function () {
        return this._current;
    };
    return LastValueAccumulation;
}();
exports.LastValueAccumulation = LastValueAccumulation;
/** Basic aggregator which calculates a LastValue from individual measurements. */

var LastValueAggregator = /** @class */function () {
    function LastValueAggregator() {
        this.kind = _types.AggregatorKind.LAST_VALUE;
    }
    LastValueAggregator.prototype.createAccumulation = function (startTime) {
        return new LastValueAccumulation(startTime);
    };
    /**
     * Returns the result of the merge of the given accumulations.
     *
     * Return the newly captured (delta) accumulation for LastValueAggregator.
     */
    LastValueAggregator.prototype.merge = function (previous, delta) {
        // nanoseconds may lose precisions.
        var latestAccumulation = (0, _core.hrTimeToMicroseconds)(delta.sampleTime) >= (0, _core.hrTimeToMicroseconds)(previous.sampleTime) ? delta : previous;
        return new LastValueAccumulation(previous.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
    };
    /**
     * Returns a new DELTA aggregation by comparing two cumulative measurements.
     *
     * A delta aggregation is not meaningful to LastValueAggregator, just return
     * the newly captured (delta) accumulation for LastValueAggregator.
     */
    LastValueAggregator.prototype.diff = function (previous, current) {
        // nanoseconds may lose precisions.
        var latestAccumulation = (0, _core.hrTimeToMicroseconds)(current.sampleTime) >= (0, _core.hrTimeToMicroseconds)(previous.sampleTime) ? current : previous;
        return new LastValueAccumulation(current.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
    };
    LastValueAggregator.prototype.toMetricData = function (descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
        return {
            descriptor: descriptor,
            aggregationTemporality: aggregationTemporality,
            dataPointType: _MetricData.DataPointType.GAUGE,
            dataPoints: accumulationByAttributes.map(function (_a) {
                var _b = __read(_a, 2),
                    attributes = _b[0],
                    accumulation = _b[1];
                return {
                    attributes: attributes,
                    startTime: accumulation.startTime,
                    endTime: endTime,
                    value: accumulation.toPointValue()
                };
            })
        };
    };
    return LastValueAggregator;
}();
exports.LastValueAggregator = LastValueAggregator;
//# sourceMappingURL=LastValue.js.map