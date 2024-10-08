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
exports.Tracer = void 0;
var api = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");
var Span_1 = require("./Span");
var utility_1 = require("./utility");
var platform_1 = require("./platform");
/**
 * This class represents a basic tracer.
 */

var Tracer = function () {
    /**
     * Constructs a new Tracer instance.
     */
    function Tracer(instrumentationLibrary, config, _tracerProvider) {
        _classCallCheck(this, Tracer);

        this._tracerProvider = _tracerProvider;
        var localConfig = (0, utility_1.mergeConfig)(config);
        this._sampler = localConfig.sampler;
        this._generalLimits = localConfig.generalLimits;
        this._spanLimits = localConfig.spanLimits;
        this._idGenerator = config.idGenerator || new platform_1.RandomIdGenerator();
        this.resource = _tracerProvider.resource;
        this.instrumentationLibrary = instrumentationLibrary;
    }
    /**
     * Starts a new Span or returns the default NoopSpan based on the sampling
     * decision.
     */


    _createClass(Tracer, [{
        key: "startSpan",
        value: function startSpan(name) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : api.context.active();

            var _a, _b, _c;
            // remove span from context in case a root span is requested via options
            if (options.root) {
                context = api.trace.deleteSpan(context);
            }
            var parentSpan = api.trace.getSpan(context);
            if ((0, core_1.isTracingSuppressed)(context)) {
                api.diag.debug('Instrumentation suppressed, returning Noop Span');
                var nonRecordingSpan = api.trace.wrapSpanContext(api.INVALID_SPAN_CONTEXT);
                return nonRecordingSpan;
            }
            var parentSpanContext = parentSpan === null || parentSpan === void 0 ? void 0 : parentSpan.spanContext();
            var spanId = this._idGenerator.generateSpanId();
            var traceId = void 0;
            var traceState = void 0;
            var parentSpanId = void 0;
            if (!parentSpanContext || !api.trace.isSpanContextValid(parentSpanContext)) {
                // New root span.
                traceId = this._idGenerator.generateTraceId();
            } else {
                // New child span.
                traceId = parentSpanContext.traceId;
                traceState = parentSpanContext.traceState;
                parentSpanId = parentSpanContext.spanId;
            }
            var spanKind = (_a = options.kind) !== null && _a !== void 0 ? _a : api.SpanKind.INTERNAL;
            var links = ((_b = options.links) !== null && _b !== void 0 ? _b : []).map(function (link) {
                return {
                    context: link.context,
                    attributes: (0, core_1.sanitizeAttributes)(link.attributes)
                };
            });
            var attributes = (0, core_1.sanitizeAttributes)(options.attributes);
            // make sampling decision
            var samplingResult = this._sampler.shouldSample(context, traceId, name, spanKind, attributes, links);
            traceState = (_c = samplingResult.traceState) !== null && _c !== void 0 ? _c : traceState;
            var traceFlags = samplingResult.decision === api.SamplingDecision.RECORD_AND_SAMPLED ? api.TraceFlags.SAMPLED : api.TraceFlags.NONE;
            var spanContext = { traceId: traceId, spanId: spanId, traceFlags: traceFlags, traceState: traceState };
            if (samplingResult.decision === api.SamplingDecision.NOT_RECORD) {
                api.diag.debug('Recording is off, propagating context in a non-recording span');
                var _nonRecordingSpan = api.trace.wrapSpanContext(spanContext);
                return _nonRecordingSpan;
            }
            // Set initial span attributes. The attributes object may have been mutated
            // by the sampler, so we sanitize the merged attributes before setting them.
            var initAttributes = (0, core_1.sanitizeAttributes)(Object.assign(attributes, samplingResult.attributes));
            var span = new Span_1.Span(this, context, name, spanContext, spanKind, parentSpanId, links, options.startTime, undefined, initAttributes);
            return span;
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
            var parentContext = ctx !== null && ctx !== void 0 ? ctx : api.context.active();
            var span = this.startSpan(name, opts, parentContext);
            var contextWithSpanSet = api.trace.setSpan(parentContext, span);
            return api.context.with(contextWithSpanSet, fn, undefined, span);
        }
        /** Returns the active {@link GeneralLimits}. */

    }, {
        key: "getGeneralLimits",
        value: function getGeneralLimits() {
            return this._generalLimits;
        }
        /** Returns the active {@link SpanLimits}. */

    }, {
        key: "getSpanLimits",
        value: function getSpanLimits() {
            return this._spanLimits;
        }
    }, {
        key: "getActiveSpanProcessor",
        value: function getActiveSpanProcessor() {
            return this._tracerProvider.getActiveSpanProcessor();
        }
    }]);

    return Tracer;
}();

exports.Tracer = Tracer;
//# sourceMappingURL=Tracer.js.map