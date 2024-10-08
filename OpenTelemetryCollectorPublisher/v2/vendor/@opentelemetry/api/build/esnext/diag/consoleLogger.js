'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var consoleMap = [{ n: 'error', c: 'error' }, { n: 'warn', c: 'warn' }, { n: 'info', c: 'info' }, { n: 'debug', c: 'debug' }, { n: 'verbose', c: 'trace' }];
/**
 * A simple Immutable Console based diagnostic logger which will output any messages to the Console.
 * If you want to limit the amount of logging to a specific level or lower use the
 * {@link createLogLevelDiagLogger}
 */

var DiagConsoleLogger = exports.DiagConsoleLogger = function DiagConsoleLogger() {
    _classCallCheck(this, DiagConsoleLogger);

    function _consoleFunc(funcName) {
        return function () {
            if (console) {
                // Some environments only expose the console when the F12 developer console is open
                // eslint-disable-next-line no-console
                var theFunc = console[funcName];
                if (typeof theFunc !== 'function') {
                    // Not all environments support all functions
                    // eslint-disable-next-line no-console
                    theFunc = console.log;
                }
                // One last final check
                if (typeof theFunc === 'function') {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    return theFunc.apply(console, args);
                }
            }
        };
    }
    for (var i = 0; i < consoleMap.length; i++) {
        this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
    }
};
//# sourceMappingURL=consoleLogger.js.map