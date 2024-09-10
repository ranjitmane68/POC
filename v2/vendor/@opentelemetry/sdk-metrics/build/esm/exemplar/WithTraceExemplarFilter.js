'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WithTraceExemplarFilter = undefined;

var _api = require('@opentelemetry/api');

var WithTraceExemplarFilter = /** @class */function () {
    function WithTraceExemplarFilter() {}
    WithTraceExemplarFilter.prototype.shouldSample = function (value, timestamp, attributes, ctx) {
        var spanContext = _api.trace.getSpanContext(ctx);
        if (!spanContext || !(0, _api.isSpanContextValid)(spanContext)) return false;
        return spanContext.traceFlags & _api.TraceFlags.SAMPLED ? true : false;
    };
    return WithTraceExemplarFilter;
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
exports.WithTraceExemplarFilter = WithTraceExemplarFilter;
//# sourceMappingURL=WithTraceExemplarFilter.js.map