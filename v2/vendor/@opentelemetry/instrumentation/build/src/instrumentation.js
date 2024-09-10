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
exports.InstrumentationAbstract = void 0;
var api_1 = require("@opentelemetry/api");
var api_logs_1 = require("@opentelemetry/api-logs");
var shimmer = require("shimmer");
/**
 * Base abstract internal class for instrumenting node and web plugins
 */

var InstrumentationAbstract = function () {
    function InstrumentationAbstract(instrumentationName, instrumentationVersion, config) {
        _classCallCheck(this, InstrumentationAbstract);

        this.instrumentationName = instrumentationName;
        this.instrumentationVersion = instrumentationVersion;
        /* Api to wrap instrumented method */
        this._wrap = shimmer.wrap;
        /* Api to unwrap instrumented methods */
        this._unwrap = shimmer.unwrap;
        /* Api to mass wrap instrumented method */
        this._massWrap = shimmer.massWrap;
        /* Api to mass unwrap instrumented methods */
        this._massUnwrap = shimmer.massUnwrap;
        // copy config first level properties to ensure they are immutable.
        // nested properties are not copied, thus are mutable from the outside.
        this._config = Object.assign({ enabled: true }, config);
        this._diag = api_1.diag.createComponentLogger({
            namespace: instrumentationName
        });
        this._tracer = api_1.trace.getTracer(instrumentationName, instrumentationVersion);
        this._meter = api_1.metrics.getMeter(instrumentationName, instrumentationVersion);
        this._logger = api_logs_1.logs.getLogger(instrumentationName, instrumentationVersion);
        this._updateMetricInstruments();
    }
    /* Returns meter */


    _createClass(InstrumentationAbstract, [{
        key: "setMeterProvider",

        /**
         * Sets MeterProvider to this plugin
         * @param meterProvider
         */
        value: function setMeterProvider(meterProvider) {
            this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
            this._updateMetricInstruments();
        }
        /* Returns logger */

    }, {
        key: "setLoggerProvider",

        /**
         * Sets LoggerProvider to this plugin
         * @param loggerProvider
         */
        value: function setLoggerProvider(loggerProvider) {
            this._logger = loggerProvider.getLogger(this.instrumentationName, this.instrumentationVersion);
        }
        /**
         * @experimental
         *
         * Get module definitions defined by {@link init}.
         * This can be used for experimental compile-time instrumentation.
         *
         * @returns an array of {@link InstrumentationModuleDefinition}
         */

    }, {
        key: "getModuleDefinitions",
        value: function getModuleDefinitions() {
            var _a;
            var initResult = (_a = this.init()) !== null && _a !== void 0 ? _a : [];
            if (!Array.isArray(initResult)) {
                return [initResult];
            }
            return initResult;
        }
        /**
         * Sets the new metric instruments with the current Meter.
         */

    }, {
        key: "_updateMetricInstruments",
        value: function _updateMetricInstruments() {
            return;
        }
        /* Returns InstrumentationConfig */

    }, {
        key: "getConfig",
        value: function getConfig() {
            return this._config;
        }
        /**
         * Sets InstrumentationConfig to this plugin
         * @param InstrumentationConfig
         */

    }, {
        key: "setConfig",
        value: function setConfig(config) {
            // copy config first level properties to ensure they are immutable.
            // nested properties are not copied, thus are mutable from the outside.
            this._config = Object.assign({}, config);
        }
        /**
         * Sets TraceProvider to this plugin
         * @param tracerProvider
         */

    }, {
        key: "setTracerProvider",
        value: function setTracerProvider(tracerProvider) {
            this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
        }
        /* Returns tracer */

    }, {
        key: "_runSpanCustomizationHook",

        /**
         * Execute span customization hook, if configured, and log any errors.
         * Any semantics of the trigger and info are defined by the specific instrumentation.
         * @param hookHandler The optional hook handler which the user has configured via instrumentation config
         * @param triggerName The name of the trigger for executing the hook for logging purposes
         * @param span The span to which the hook should be applied
         * @param info The info object to be passed to the hook, with useful data the hook may use
         */
        value: function _runSpanCustomizationHook(hookHandler, triggerName, span, info) {
            if (!hookHandler) {
                return;
            }
            try {
                hookHandler(span, info);
            } catch (e) {
                this._diag.error("Error running span customization hook due to exception in handler", { triggerName: triggerName }, e);
            }
        }
    }, {
        key: "meter",
        get: function get() {
            return this._meter;
        }
    }, {
        key: "logger",
        get: function get() {
            return this._logger;
        }
    }, {
        key: "tracer",
        get: function get() {
            return this._tracer;
        }
    }]);

    return InstrumentationAbstract;
}();

exports.InstrumentationAbstract = InstrumentationAbstract;
//# sourceMappingURL=instrumentation.js.map