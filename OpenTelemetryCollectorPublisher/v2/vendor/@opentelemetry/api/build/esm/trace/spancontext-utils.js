'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isValidTraceId = isValidTraceId;
exports.isValidSpanId = isValidSpanId;
exports.isSpanContextValid = isSpanContextValid;
exports.wrapSpanContext = wrapSpanContext;

var _invalidSpanConstants = require('./invalid-span-constants');

var _NonRecordingSpan = require('./NonRecordingSpan');

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
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
    return VALID_TRACEID_REGEX.test(traceId) && traceId !== _invalidSpanConstants.INVALID_TRACEID;
}
function isValidSpanId(spanId) {
    return VALID_SPANID_REGEX.test(spanId) && spanId !== _invalidSpanConstants.INVALID_SPANID;
}
/**
 * Returns true if this {@link SpanContext} is valid.
 * @return true if this {@link SpanContext} is valid.
 */
function isSpanContextValid(spanContext) {
    return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
/**
 * Wrap the given {@link SpanContext} in a new non-recording {@link Span}
 *
 * @param spanContext span context to be wrapped
 * @returns a new non-recording {@link Span} with the provided context
 */
function wrapSpanContext(spanContext) {
    return new _NonRecordingSpan.NonRecordingSpan(spanContext);
}
//# sourceMappingURL=spancontext-utils.js.map