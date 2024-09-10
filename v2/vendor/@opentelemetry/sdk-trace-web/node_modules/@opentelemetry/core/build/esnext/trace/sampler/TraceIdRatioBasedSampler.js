'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TraceIdRatioBasedSampler = undefined;

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


var _api = require('@opentelemetry/api');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * Sampler that samples a given fraction of traces based of trace id deterministically.
 */
var TraceIdRatioBasedSampler = exports.TraceIdRatioBasedSampler = function () {
    function TraceIdRatioBasedSampler() {
        var _ratio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        _classCallCheck(this, TraceIdRatioBasedSampler);

        this._ratio = _ratio;
        this._ratio = this._normalize(_ratio);
        this._upperBound = Math.floor(this._ratio * 0xffffffff);
    }

    _createClass(TraceIdRatioBasedSampler, [{
        key: 'shouldSample',
        value: function shouldSample(context, traceId) {
            return {
                decision: (0, _api.isValidTraceId)(traceId) && this._accumulate(traceId) < this._upperBound ? _api.SamplingDecision.RECORD_AND_SAMPLED : _api.SamplingDecision.NOT_RECORD
            };
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'TraceIdRatioBased{' + this._ratio + '}';
        }
    }, {
        key: '_normalize',
        value: function _normalize(ratio) {
            if (typeof ratio !== 'number' || isNaN(ratio)) return 0;
            return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
        }
    }, {
        key: '_accumulate',
        value: function _accumulate(traceId) {
            var accumulation = 0;
            for (var i = 0; i < traceId.length / 8; i++) {
                var pos = i * 8;
                var part = parseInt(traceId.slice(pos, pos + 8), 16);
                accumulation = (accumulation ^ part) >>> 0;
            }
            return accumulation;
        }
    }]);

    return TraceIdRatioBasedSampler;
}();
//# sourceMappingURL=TraceIdRatioBasedSampler.js.map