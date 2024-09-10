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
exports.MetricsAPI = void 0;
var NoopMeterProvider_1 = require("../metrics/NoopMeterProvider");
var global_utils_1 = require("../internal/global-utils");
var diag_1 = require("./diag");
var API_NAME = 'metrics';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Metrics API
 */

var MetricsAPI = function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function MetricsAPI() {
        _classCallCheck(this, MetricsAPI);
    }
    /** Get the singleton instance of the Metrics API */


    _createClass(MetricsAPI, [{
        key: "setGlobalMeterProvider",

        /**
         * Set the current global meter provider.
         * Returns true if the meter provider was successfully registered, else false.
         */
        value: function setGlobalMeterProvider(provider) {
            return (0, global_utils_1.registerGlobal)(API_NAME, provider, diag_1.DiagAPI.instance());
        }
        /**
         * Returns the global meter provider.
         */

    }, {
        key: "getMeterProvider",
        value: function getMeterProvider() {
            return (0, global_utils_1.getGlobal)(API_NAME) || NoopMeterProvider_1.NOOP_METER_PROVIDER;
        }
        /**
         * Returns a meter from the global meter provider.
         */

    }, {
        key: "getMeter",
        value: function getMeter(name, version, options) {
            return this.getMeterProvider().getMeter(name, version, options);
        }
        /** Remove the global meter provider */

    }, {
        key: "disable",
        value: function disable() {
            (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            if (!this._instance) {
                this._instance = new MetricsAPI();
            }
            return this._instance;
        }
    }]);

    return MetricsAPI;
}();

exports.MetricsAPI = MetricsAPI;
//# sourceMappingURL=metrics.js.map