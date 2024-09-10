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
exports.WithTraceExemplarFilter = void 0;
var api_1 = require("@opentelemetry/api");

var WithTraceExemplarFilter = function () {
    function WithTraceExemplarFilter() {
        _classCallCheck(this, WithTraceExemplarFilter);
    }

    _createClass(WithTraceExemplarFilter, [{
        key: "shouldSample",
        value: function shouldSample(value, timestamp, attributes, ctx) {
            var spanContext = api_1.trace.getSpanContext(ctx);
            if (!spanContext || !(0, api_1.isSpanContextValid)(spanContext)) return false;
            return spanContext.traceFlags & api_1.TraceFlags.SAMPLED ? true : false;
        }
    }]);

    return WithTraceExemplarFilter;
}();

exports.WithTraceExemplarFilter = WithTraceExemplarFilter;
//# sourceMappingURL=WithTraceExemplarFilter.js.map