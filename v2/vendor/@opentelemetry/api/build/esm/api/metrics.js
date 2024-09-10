'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MetricsAPI = undefined;

var _NoopMeterProvider = require('../metrics/NoopMeterProvider');

var _globalUtils = require('../internal/global-utils');

var _diag = require('./diag');

var API_NAME = 'metrics';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Metrics API
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
var MetricsAPI = /** @class */function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function MetricsAPI() {}
    /** Get the singleton instance of the Metrics API */
    MetricsAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new MetricsAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global meter provider.
     * Returns true if the meter provider was successfully registered, else false.
     */
    MetricsAPI.prototype.setGlobalMeterProvider = function (provider) {
        return (0, _globalUtils.registerGlobal)(API_NAME, provider, _diag.DiagAPI.instance());
    };
    /**
     * Returns the global meter provider.
     */
    MetricsAPI.prototype.getMeterProvider = function () {
        return (0, _globalUtils.getGlobal)(API_NAME) || _NoopMeterProvider.NOOP_METER_PROVIDER;
    };
    /**
     * Returns a meter from the global meter provider.
     */
    MetricsAPI.prototype.getMeter = function (name, version, options) {
        return this.getMeterProvider().getMeter(name, version, options);
    };
    /** Remove the global meter provider */
    MetricsAPI.prototype.disable = function () {
        (0, _globalUtils.unregisterGlobal)(API_NAME, _diag.DiagAPI.instance());
    };
    return MetricsAPI;
}();
exports.MetricsAPI = MetricsAPI;
//# sourceMappingURL=metrics.js.map