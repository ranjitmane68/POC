'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogsAPI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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


var _globalUtils = require('../internal/global-utils');

var _NoopLoggerProvider = require('../NoopLoggerProvider');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogsAPI = exports.LogsAPI = function () {
    function LogsAPI() {
        _classCallCheck(this, LogsAPI);
    }

    _createClass(LogsAPI, [{
        key: 'setGlobalLoggerProvider',
        value: function setGlobalLoggerProvider(provider) {
            if (_globalUtils._global[_globalUtils.GLOBAL_LOGS_API_KEY]) {
                return this.getLoggerProvider();
            }
            _globalUtils._global[_globalUtils.GLOBAL_LOGS_API_KEY] = (0, _globalUtils.makeGetter)(_globalUtils.API_BACKWARDS_COMPATIBILITY_VERSION, provider, _NoopLoggerProvider.NOOP_LOGGER_PROVIDER);
            return provider;
        }
        /**
         * Returns the global logger provider.
         *
         * @returns LoggerProvider
         */

    }, {
        key: 'getLoggerProvider',
        value: function getLoggerProvider() {
            var _a, _b;
            return (_b = (_a = _globalUtils._global[_globalUtils.GLOBAL_LOGS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(_globalUtils._global, _globalUtils.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : _NoopLoggerProvider.NOOP_LOGGER_PROVIDER;
        }
        /**
         * Returns a logger from the global logger provider.
         *
         * @returns Logger
         */

    }, {
        key: 'getLogger',
        value: function getLogger(name, version, options) {
            return this.getLoggerProvider().getLogger(name, version, options);
        }
        /** Remove the global logger provider */

    }, {
        key: 'disable',
        value: function disable() {
            delete _globalUtils._global[_globalUtils.GLOBAL_LOGS_API_KEY];
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            if (!this._instance) {
                this._instance = new LogsAPI();
            }
            return this._instance;
        }
    }]);

    return LogsAPI;
}();
//# sourceMappingURL=logs.js.map