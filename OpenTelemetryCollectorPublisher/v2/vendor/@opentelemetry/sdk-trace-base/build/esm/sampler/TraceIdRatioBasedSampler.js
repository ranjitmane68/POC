'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TraceIdRatioBasedSampler = undefined;

var _api = require('@opentelemetry/api');

var _Sampler = require('../Sampler');

/** Sampler that samples a given fraction of traces based of trace id deterministically. */
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
var TraceIdRatioBasedSampler = /** @class */function () {
    function TraceIdRatioBasedSampler(_ratio) {
        if (_ratio === void 0) {
            _ratio = 0;
        }
        this._ratio = _ratio;
        this._ratio = this._normalize(_ratio);
        this._upperBound = Math.floor(this._ratio * 0xffffffff);
    }
    TraceIdRatioBasedSampler.prototype.shouldSample = function (context, traceId) {
        return {
            decision: (0, _api.isValidTraceId)(traceId) && this._accumulate(traceId) < this._upperBound ? _Sampler.SamplingDecision.RECORD_AND_SAMPLED : _Sampler.SamplingDecision.NOT_RECORD
        };
    };
    TraceIdRatioBasedSampler.prototype.toString = function () {
        return "TraceIdRatioBased{" + this._ratio + "}";
    };
    TraceIdRatioBasedSampler.prototype._normalize = function (ratio) {
        if (typeof ratio !== 'number' || isNaN(ratio)) return 0;
        return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
    };
    TraceIdRatioBasedSampler.prototype._accumulate = function (traceId) {
        var accumulation = 0;
        for (var i = 0; i < traceId.length / 8; i++) {
            var pos = i * 8;
            var part = parseInt(traceId.slice(pos, pos + 8), 16);
            accumulation = (accumulation ^ part) >>> 0;
        }
        return accumulation;
    };
    return TraceIdRatioBasedSampler;
}();
exports.TraceIdRatioBasedSampler = TraceIdRatioBasedSampler;
//# sourceMappingURL=TraceIdRatioBasedSampler.js.map