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
exports.LogsAPI = void 0;
var global_utils_1 = require("../internal/global-utils");
var NoopLoggerProvider_1 = require("../NoopLoggerProvider");

var LogsAPI = function () {
    function LogsAPI() {
        _classCallCheck(this, LogsAPI);
    }

    _createClass(LogsAPI, [{
        key: "setGlobalLoggerProvider",
        value: function setGlobalLoggerProvider(provider) {
            if (global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) {
                return this.getLoggerProvider();
            }
            global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY] = (0, global_utils_1.makeGetter)(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, provider, NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER);
            return provider;
        }
        /**
         * Returns the global logger provider.
         *
         * @returns LoggerProvider
         */

    }, {
        key: "getLoggerProvider",
        value: function getLoggerProvider() {
            var _a, _b;
            return (_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER;
        }
        /**
         * Returns a logger from the global logger provider.
         *
         * @returns Logger
         */

    }, {
        key: "getLogger",
        value: function getLogger(name, version, options) {
            return this.getLoggerProvider().getLogger(name, version, options);
        }
        /** Remove the global logger provider */

    }, {
        key: "disable",
        value: function disable() {
            delete global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY];
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            if (!this._instance) {
                this._instance = new LogsAPI();
            }
            return this._instance;
        }
    }]);

    return LogsAPI;
}();

exports.LogsAPI = LogsAPI;
//# sourceMappingURL=logs.js.map