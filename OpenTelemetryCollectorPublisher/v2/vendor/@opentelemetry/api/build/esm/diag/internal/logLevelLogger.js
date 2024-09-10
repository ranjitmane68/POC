'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createLogLevelDiagLogger = createLogLevelDiagLogger;

var _types = require('../types');

function createLogLevelDiagLogger(maxLevel, logger) {
    if (maxLevel < _types.DiagLogLevel.NONE) {
        maxLevel = _types.DiagLogLevel.NONE;
    } else if (maxLevel > _types.DiagLogLevel.ALL) {
        maxLevel = _types.DiagLogLevel.ALL;
    }
    // In case the logger is null or undefined
    logger = logger || {};
    function _filterFunc(funcName, theLevel) {
        var theFunc = logger[funcName];
        if (typeof theFunc === 'function' && maxLevel >= theLevel) {
            return theFunc.bind(logger);
        }
        return function () {};
    }
    return {
        error: _filterFunc('error', _types.DiagLogLevel.ERROR),
        warn: _filterFunc('warn', _types.DiagLogLevel.WARN),
        info: _filterFunc('info', _types.DiagLogLevel.INFO),
        debug: _filterFunc('debug', _types.DiagLogLevel.DEBUG),
        verbose: _filterFunc('verbose', _types.DiagLogLevel.VERBOSE)
    };
}
//# sourceMappingURL=logLevelLogger.js.map
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