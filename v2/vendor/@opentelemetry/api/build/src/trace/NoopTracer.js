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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopTracer = void 0;
var context_1 = require("../api/context");
var context_utils_1 = require("../trace/context-utils");
var NonRecordingSpan_1 = require("./NonRecordingSpan");
var spancontext_utils_1 = require("./spancontext-utils");
var contextApi = context_1.ContextAPI.getInstance();
/**
 * No-op implementations of {@link Tracer}.
 */

var NoopTracer = function () {
    function NoopTracer() {
        _classCallCheck(this, NoopTracer);
    }

    _createClass(NoopTracer, [{
        key: "startSpan",

        // startSpan starts a noop span.
        value: function startSpan(name, options) {
            var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : contextApi.active();

            var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
            if (root) {
                return new NonRecordingSpan_1.NonRecordingSpan();
            }
            var parentFromContext = context && (0, context_utils_1.getSpanContext)(context);
            if (isSpanContext(parentFromContext) && (0, spancontext_utils_1.isSpanContextValid)(parentFromContext)) {
                return new NonRecordingSpan_1.NonRecordingSpan(parentFromContext);
            } else {
                return new NonRecordingSpan_1.NonRecordingSpan();
            }
        }
    }, {
        key: "startActiveSpan",
        value: function startActiveSpan(name, arg2, arg3, arg4) {
            var opts = void 0;
            var ctx = void 0;
            var fn = void 0;
            if (arguments.length < 2) {
                return;
            } else if (arguments.length === 2) {
                fn = arg2;
            } else if (arguments.length === 3) {
                opts = arg2;
                fn = arg3;
            } else {
                opts = arg2;
                ctx = arg3;
                fn = arg4;
            }
            var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
            var span = this.startSpan(name, opts, parentContext);
            var contextWithSpanSet = (0, context_utils_1.setSpan)(parentContext, span);
            return contextApi.with(contextWithSpanSet, fn, undefined, span);
        }
    }]);

    return NoopTracer;
}();

exports.NoopTracer = NoopTracer;
function isSpanContext(spanContext) {
    return (typeof spanContext === "undefined" ? "undefined" : _typeof(spanContext)) === 'object' && typeof spanContext['spanId'] === 'string' && typeof spanContext['traceId'] === 'string' && typeof spanContext['traceFlags'] === 'number';
}
//# sourceMappingURL=NoopTracer.js.map