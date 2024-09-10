'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpan = getSpan;
exports.getActiveSpan = getActiveSpan;
exports.setSpan = setSpan;
exports.deleteSpan = deleteSpan;
exports.setSpanContext = setSpanContext;
exports.getSpanContext = getSpanContext;

var _context = require('../context/context');

var _NonRecordingSpan = require('./NonRecordingSpan');

var _context2 = require('../api/context');

/**
 * span key
 */
var SPAN_KEY = (0, _context.createContextKey)('OpenTelemetry Context Key SPAN');
/**
 * Return the span if one exists
 *
 * @param context context to get span from
 */
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
function getSpan(context) {
  return context.getValue(SPAN_KEY) || undefined;
}
/**
 * Gets the span from the current context, if one exists.
 */
function getActiveSpan() {
  return getSpan(_context2.ContextAPI.getInstance().active());
}
/**
 * Set the span on a context
 *
 * @param context context to use as parent
 * @param span span to set active
 */
function setSpan(context, span) {
  return context.setValue(SPAN_KEY, span);
}
/**
 * Remove current span stored in the context
 *
 * @param context context to delete span from
 */
function deleteSpan(context) {
  return context.deleteValue(SPAN_KEY);
}
/**
 * Wrap span context in a NoopSpan and set as span in a new
 * context
 *
 * @param context context to set active span on
 * @param spanContext span context to be wrapped
 */
function setSpanContext(context, spanContext) {
  return setSpan(context, new _NonRecordingSpan.NonRecordingSpan(spanContext));
}
/**
 * Get the span context of the span if it exists.
 *
 * @param context context to get values from
 */
function getSpanContext(context) {
  var _a;
  return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
}
//# sourceMappingURL=context-utils.js.map