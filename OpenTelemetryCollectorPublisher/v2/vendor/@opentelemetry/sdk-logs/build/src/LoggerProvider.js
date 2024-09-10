"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerProvider = exports.DEFAULT_LOGGER_NAME = void 0;
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
var api_1 = require("@opentelemetry/api");
var api_logs_1 = require("@opentelemetry/api-logs");
var resources_1 = require("@opentelemetry/resources");
var core_1 = require("@opentelemetry/core");
var Logger_1 = require("./Logger");
var config_1 = require("./config");
var MultiLogRecordProcessor_1 = require("./MultiLogRecordProcessor");
var LoggerProviderSharedState_1 = require("./internal/LoggerProviderSharedState");
exports.DEFAULT_LOGGER_NAME = 'unknown';

var LoggerProvider = function () {
    function LoggerProvider() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, LoggerProvider);

        var _a;
        var mergedConfig = (0, core_1.merge)({}, (0, config_1.loadDefaultConfig)(), config);
        var resource = resources_1.Resource.default().merge((_a = mergedConfig.resource) !== null && _a !== void 0 ? _a : resources_1.Resource.empty());
        this._sharedState = new LoggerProviderSharedState_1.LoggerProviderSharedState(resource, mergedConfig.forceFlushTimeoutMillis, (0, config_1.reconfigureLimits)(mergedConfig.logRecordLimits));
        this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
    }
    /**
     * Get a logger with the configuration of the LoggerProvider.
     */


    _createClass(LoggerProvider, [{
        key: "getLogger",
        value: function getLogger(name, version, options) {
            if (this._shutdownOnce.isCalled) {
                api_1.diag.warn('A shutdown LoggerProvider cannot provide a Logger');
                return api_logs_1.NOOP_LOGGER;
            }
            if (!name) {
                api_1.diag.warn('Logger requested without instrumentation scope name.');
            }
            var loggerName = name || exports.DEFAULT_LOGGER_NAME;
            var key = loggerName + "@" + (version || '') + ":" + ((options === null || options === void 0 ? void 0 : options.schemaUrl) || '');
            if (!this._sharedState.loggers.has(key)) {
                this._sharedState.loggers.set(key, new Logger_1.Logger({ name: loggerName, version: version, schemaUrl: options === null || options === void 0 ? void 0 : options.schemaUrl }, this._sharedState));
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this._sharedState.loggers.get(key);
        }
        /**
         * Adds a new {@link LogRecordProcessor} to this logger.
         * @param processor the new LogRecordProcessor to be added.
         */

    }, {
        key: "addLogRecordProcessor",
        value: function addLogRecordProcessor(processor) {
            if (this._sharedState.registeredLogRecordProcessors.length === 0) {
                // since we might have enabled by default a batchProcessor, we disable it
                // before adding the new one
                this._sharedState.activeProcessor.shutdown().catch(function (err) {
                    return api_1.diag.error('Error while trying to shutdown current log record processor', err);
                });
            }
            this._sharedState.registeredLogRecordProcessors.push(processor);
            this._sharedState.activeProcessor = new MultiLogRecordProcessor_1.MultiLogRecordProcessor(this._sharedState.registeredLogRecordProcessors, this._sharedState.forceFlushTimeoutMillis);
        }
        /**
         * Notifies all registered LogRecordProcessor to flush any buffered data.
         *
         * Returns a promise which is resolved when all flushes are complete.
         */

    }, {
        key: "forceFlush",
        value: function forceFlush() {
            // do not flush after shutdown
            if (this._shutdownOnce.isCalled) {
                api_1.diag.warn('invalid attempt to force flush after LoggerProvider shutdown');
                return this._shutdownOnce.promise;
            }
            return this._sharedState.activeProcessor.forceFlush();
        }
        /**
         * Flush all buffered data and shut down the LoggerProvider and all registered
         * LogRecordProcessor.
         *
         * Returns a promise which is resolved when all flushes are complete.
         */

    }, {
        key: "shutdown",
        value: function shutdown() {
            if (this._shutdownOnce.isCalled) {
                api_1.diag.warn('shutdown may only be called once per LoggerProvider');
                return this._shutdownOnce.promise;
            }
            return this._shutdownOnce.call();
        }
    }, {
        key: "_shutdown",
        value: function _shutdown() {
            return this._sharedState.activeProcessor.shutdown();
        }
    }]);

    return LoggerProvider;
}();

exports.LoggerProvider = LoggerProvider;
//# sourceMappingURL=LoggerProvider.js.map