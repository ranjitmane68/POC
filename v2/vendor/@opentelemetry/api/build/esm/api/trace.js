'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TraceAPI = undefined;

var _globalUtils = require('../internal/global-utils');

var _ProxyTracerProvider = require('../trace/ProxyTracerProvider');

var _spancontextUtils = require('../trace/spancontext-utils');

var _contextUtils = require('../trace/context-utils');

var _diag = require('./diag');

var API_NAME = 'trace';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Tracing API
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
var TraceAPI = /** @class */function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function TraceAPI() {
        this._proxyTracerProvider = new _ProxyTracerProvider.ProxyTracerProvider();
        this.wrapSpanContext = _spancontextUtils.wrapSpanContext;
        this.isSpanContextValid = _spancontextUtils.isSpanContextValid;
        this.deleteSpan = _contextUtils.deleteSpan;
        this.getSpan = _contextUtils.getSpan;
        this.getActiveSpan = _contextUtils.getActiveSpan;
        this.getSpanContext = _contextUtils.getSpanContext;
        this.setSpan = _contextUtils.setSpan;
        this.setSpanContext = _contextUtils.setSpanContext;
    }
    /** Get the singleton instance of the Trace API */
    TraceAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new TraceAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global tracer.
     *
     * @returns true if the tracer provider was successfully registered, else false
     */
    TraceAPI.prototype.setGlobalTracerProvider = function (provider) {
        var success = (0, _globalUtils.registerGlobal)(API_NAME, this._proxyTracerProvider, _diag.DiagAPI.instance());
        if (success) {
            this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
    };
    /**
     * Returns the global tracer provider.
     */
    TraceAPI.prototype.getTracerProvider = function () {
        return (0, _globalUtils.getGlobal)(API_NAME) || this._proxyTracerProvider;
    };
    /**
     * Returns a tracer from the global tracer provider.
     */
    TraceAPI.prototype.getTracer = function (name, version) {
        return this.getTracerProvider().getTracer(name, version);
    };
    /** Remove the global tracer provider */
    TraceAPI.prototype.disable = function () {
        (0, _globalUtils.unregisterGlobal)(API_NAME, _diag.DiagAPI.instance());
        this._proxyTracerProvider = new _ProxyTracerProvider.ProxyTracerProvider();
    };
    return TraceAPI;
}();
exports.TraceAPI = TraceAPI;
//# sourceMappingURL=trace.js.map