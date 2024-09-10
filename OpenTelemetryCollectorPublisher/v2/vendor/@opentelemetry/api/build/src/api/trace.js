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
exports.TraceAPI = void 0;
var global_utils_1 = require("../internal/global-utils");
var ProxyTracerProvider_1 = require("../trace/ProxyTracerProvider");
var spancontext_utils_1 = require("../trace/spancontext-utils");
var context_utils_1 = require("../trace/context-utils");
var diag_1 = require("./diag");
var API_NAME = 'trace';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Tracing API
 */

var TraceAPI = function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function TraceAPI() {
        _classCallCheck(this, TraceAPI);

        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
        this.wrapSpanContext = spancontext_utils_1.wrapSpanContext;
        this.isSpanContextValid = spancontext_utils_1.isSpanContextValid;
        this.deleteSpan = context_utils_1.deleteSpan;
        this.getSpan = context_utils_1.getSpan;
        this.getActiveSpan = context_utils_1.getActiveSpan;
        this.getSpanContext = context_utils_1.getSpanContext;
        this.setSpan = context_utils_1.setSpan;
        this.setSpanContext = context_utils_1.setSpanContext;
    }
    /** Get the singleton instance of the Trace API */


    _createClass(TraceAPI, [{
        key: "setGlobalTracerProvider",

        /**
         * Set the current global tracer.
         *
         * @returns true if the tracer provider was successfully registered, else false
         */
        value: function setGlobalTracerProvider(provider) {
            var success = (0, global_utils_1.registerGlobal)(API_NAME, this._proxyTracerProvider, diag_1.DiagAPI.instance());
            if (success) {
                this._proxyTracerProvider.setDelegate(provider);
            }
            return success;
        }
        /**
         * Returns the global tracer provider.
         */

    }, {
        key: "getTracerProvider",
        value: function getTracerProvider() {
            return (0, global_utils_1.getGlobal)(API_NAME) || this._proxyTracerProvider;
        }
        /**
         * Returns a tracer from the global tracer provider.
         */

    }, {
        key: "getTracer",
        value: function getTracer(name, version) {
            return this.getTracerProvider().getTracer(name, version);
        }
        /** Remove the global tracer provider */

    }, {
        key: "disable",
        value: function disable() {
            (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
            this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            if (!this._instance) {
                this._instance = new TraceAPI();
            }
            return this._instance;
        }
    }]);

    return TraceAPI;
}();

exports.TraceAPI = TraceAPI;
//# sourceMappingURL=trace.js.map