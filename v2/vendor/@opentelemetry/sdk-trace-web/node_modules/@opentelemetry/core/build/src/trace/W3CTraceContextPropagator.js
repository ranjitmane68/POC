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
exports.W3CTraceContextPropagator = exports.parseTraceParent = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = void 0;
var api_1 = require("@opentelemetry/api");
var suppress_tracing_1 = require("./suppress-tracing");
var TraceState_1 = require("./TraceState");
exports.TRACE_PARENT_HEADER = 'traceparent';
exports.TRACE_STATE_HEADER = 'tracestate';
var VERSION = '00';
var VERSION_PART = '(?!ff)[\\da-f]{2}';
var TRACE_ID_PART = '(?![0]{32})[\\da-f]{32}';
var PARENT_ID_PART = '(?![0]{16})[\\da-f]{16}';
var FLAGS_PART = '[\\da-f]{2}';
var TRACE_PARENT_REGEX = new RegExp("^\\s?(" + VERSION_PART + ")-(" + TRACE_ID_PART + ")-(" + PARENT_ID_PART + ")-(" + FLAGS_PART + ")(-.*)?\\s?$");
/**
 * Parses information from the [traceparent] span tag and converts it into {@link SpanContext}
 * @param traceParent - A meta property that comes from server.
 *     It should be dynamically generated server side to have the server's request trace Id,
 *     a parent span Id that was set on the server's request span,
 *     and the trace flags to indicate the server's sampling decision
 *     (01 = sampled, 00 = not sampled).
 *     for example: '{version}-{traceId}-{spanId}-{sampleDecision}'
 *     For more information see {@link https://www.w3.org/TR/trace-context/}
 */
function parseTraceParent(traceParent) {
    var match = TRACE_PARENT_REGEX.exec(traceParent);
    if (!match) return null;
    // According to the specification the implementation should be compatible
    // with future versions. If there are more parts, we only reject it if it's using version 00
    // See https://www.w3.org/TR/trace-context/#versioning-of-traceparent
    if (match[1] === '00' && match[5]) return null;
    return {
        traceId: match[2],
        spanId: match[3],
        traceFlags: parseInt(match[4], 16)
    };
}
exports.parseTraceParent = parseTraceParent;
/**
 * Propagates {@link SpanContext} through Trace Context format propagation.
 *
 * Based on the Trace Context specification:
 * https://www.w3.org/TR/trace-context/
 */

var W3CTraceContextPropagator = function () {
    function W3CTraceContextPropagator() {
        _classCallCheck(this, W3CTraceContextPropagator);
    }

    _createClass(W3CTraceContextPropagator, [{
        key: "inject",
        value: function inject(context, carrier, setter) {
            var spanContext = api_1.trace.getSpanContext(context);
            if (!spanContext || (0, suppress_tracing_1.isTracingSuppressed)(context) || !(0, api_1.isSpanContextValid)(spanContext)) return;
            var traceParent = VERSION + "-" + spanContext.traceId + "-" + spanContext.spanId + "-0" + Number(spanContext.traceFlags || api_1.TraceFlags.NONE).toString(16);
            setter.set(carrier, exports.TRACE_PARENT_HEADER, traceParent);
            if (spanContext.traceState) {
                setter.set(carrier, exports.TRACE_STATE_HEADER, spanContext.traceState.serialize());
            }
        }
    }, {
        key: "extract",
        value: function extract(context, carrier, getter) {
            var traceParentHeader = getter.get(carrier, exports.TRACE_PARENT_HEADER);
            if (!traceParentHeader) return context;
            var traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
            if (typeof traceParent !== 'string') return context;
            var spanContext = parseTraceParent(traceParent);
            if (!spanContext) return context;
            spanContext.isRemote = true;
            var traceStateHeader = getter.get(carrier, exports.TRACE_STATE_HEADER);
            if (traceStateHeader) {
                // If more than one `tracestate` header is found, we merge them into a
                // single header.
                var state = Array.isArray(traceStateHeader) ? traceStateHeader.join(',') : traceStateHeader;
                spanContext.traceState = new TraceState_1.TraceState(typeof state === 'string' ? state : undefined);
            }
            return api_1.trace.setSpanContext(context, spanContext);
        }
    }, {
        key: "fields",
        value: function fields() {
            return [exports.TRACE_PARENT_HEADER, exports.TRACE_STATE_HEADER];
        }
    }]);

    return W3CTraceContextPropagator;
}();

exports.W3CTraceContextPropagator = W3CTraceContextPropagator;
//# sourceMappingURL=W3CTraceContextPropagator.js.map