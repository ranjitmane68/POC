'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DiagAPI = undefined;

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


var _ComponentLogger = require('../diag/ComponentLogger');

var _logLevelLogger = require('../diag/internal/logLevelLogger');

var _types = require('../diag/types');

var _globalUtils = require('../internal/global-utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_NAME = 'diag';
/**
 * Singleton object which represents the entry point to the OpenTelemetry internal
 * diagnostic API
 */

var DiagAPI = exports.DiagAPI = function () {
    /**
     * Private internal constructor
     * @private
     */
    function DiagAPI() {
        _classCallCheck(this, DiagAPI);

        function _logProxy(funcName) {
            return function () {
                var logger = (0, _globalUtils.getGlobal)('diag');
                // shortcut if logger not set
                if (!logger) return;
                return logger[funcName].apply(logger, arguments);
            };
        }
        // Using self local variable for minification purposes as 'this' cannot be minified
        var self = this;
        // DiagAPI specific functions
        var setLogger = function setLogger(logger) {
            var optionsOrLogLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { logLevel: _types.DiagLogLevel.INFO };

            var _a, _b, _c;
            if (logger === self) {
                // There isn't much we can do here.
                // Logging to the console might break the user application.
                // Try to log to self. If a logger was previously registered it will receive the log.
                var err = new Error('Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation');
                self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
                return false;
            }
            if (typeof optionsOrLogLevel === 'number') {
                optionsOrLogLevel = {
                    logLevel: optionsOrLogLevel
                };
            }
            var oldLogger = (0, _globalUtils.getGlobal)('diag');
            var newLogger = (0, _logLevelLogger.createLogLevelDiagLogger)((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : _types.DiagLogLevel.INFO, logger);
            // There already is an logger registered. We'll let it know before overwriting it.
            if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
                var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : '<failed to generate stacktrace>';
                oldLogger.warn('Current logger will be overwritten from ' + stack);
                newLogger.warn('Current logger will overwrite one already registered from ' + stack);
            }
            return (0, _globalUtils.registerGlobal)('diag', newLogger, self, true);
        };
        self.setLogger = setLogger;
        self.disable = function () {
            (0, _globalUtils.unregisterGlobal)(API_NAME, self);
        };
        self.createComponentLogger = function (options) {
            return new _ComponentLogger.DiagComponentLogger(options);
        };
        self.verbose = _logProxy('verbose');
        self.debug = _logProxy('debug');
        self.info = _logProxy('info');
        self.warn = _logProxy('warn');
        self.error = _logProxy('error');
    }
    /** Get the singleton instance of the DiagAPI API */


    _createClass(DiagAPI, null, [{
        key: 'instance',
        value: function instance() {
            if (!this._instance) {
                this._instance = new DiagAPI();
            }
            return this._instance;
        }
    }]);

    return DiagAPI;
}();
//# sourceMappingURL=diag.js.map