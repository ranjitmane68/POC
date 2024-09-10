"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
/** No-op implementation of SpanProcessor */
var NoopSpanProcessor = /** @class */function () {
    function NoopSpanProcessor() {}
    NoopSpanProcessor.prototype.onStart = function (_span, _context) {};
    NoopSpanProcessor.prototype.onEnd = function (_span) {};
    NoopSpanProcessor.prototype.shutdown = function () {
        return Promise.resolve();
    };
    NoopSpanProcessor.prototype.forceFlush = function () {
        return Promise.resolve();
    };
    return NoopSpanProcessor;
}();
exports.NoopSpanProcessor = NoopSpanProcessor;
//# sourceMappingURL=NoopSpanProcessor.js.map