'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.suppressTracing = suppressTracing;
exports.unsuppressTracing = unsuppressTracing;
exports.isTracingSuppressed = isTracingSuppressed;

var _api = require('@opentelemetry/api');

var SUPPRESS_TRACING_KEY = (0, _api.createContextKey)('OpenTelemetry SDK Context Key SUPPRESS_TRACING'); /*
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
function suppressTracing(context) {
    return context.setValue(SUPPRESS_TRACING_KEY, true);
}
function unsuppressTracing(context) {
    return context.deleteValue(SUPPRESS_TRACING_KEY);
}
function isTracingSuppressed(context) {
    return context.getValue(SUPPRESS_TRACING_KEY) === true;
}
//# sourceMappingURL=suppress-tracing.js.map