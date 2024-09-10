'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoggerProvider = exports.DEFAULT_LOGGER_NAME = undefined;

var _api = require('@opentelemetry/api');

var _apiLogs = require('@opentelemetry/api-logs');

var _resources = require('@opentelemetry/resources');

var _core = require('@opentelemetry/core');

var _Logger = require('./Logger');

var _config = require('./config');

var _MultiLogRecordProcessor = require('./MultiLogRecordProcessor');

var _LoggerProviderSharedState = require('./internal/LoggerProviderSharedState');

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
var DEFAULT_LOGGER_NAME = exports.DEFAULT_LOGGER_NAME = 'unknown';
var LoggerProvider = /** @class */function () {
    function LoggerProvider(config) {
        if (config === void 0) {
            config = {};
        }
        var _a;
        var mergedConfig = (0, _core.merge)({}, (0, _config.loadDefaultConfig)(), config);
        var resource = _resources.Resource.default().merge((_a = mergedConfig.resource) !== null && _a !== void 0 ? _a : _resources.Resource.empty());
        this._sharedState = new _LoggerProviderSharedState.LoggerProviderSharedState(resource, mergedConfig.forceFlushTimeoutMillis, (0, _config.reconfigureLimits)(mergedConfig.logRecordLimits));
        this._shutdownOnce = new _core.BindOnceFuture(this._shutdown, this);
    }
    /**
     * Get a logger with the configuration of the LoggerProvider.
     */
    LoggerProvider.prototype.getLogger = function (name, version, options) {
        if (this._shutdownOnce.isCalled) {
            _api.diag.warn('A shutdown LoggerProvider cannot provide a Logger');
            return _apiLogs.NOOP_LOGGER;
        }
        if (!name) {
            _api.diag.warn('Logger requested without instrumentation scope name.');
        }
        var loggerName = name || DEFAULT_LOGGER_NAME;
        var key = loggerName + "@" + (version || '') + ":" + ((options === null || options === void 0 ? void 0 : options.schemaUrl) || '');
        if (!this._sharedState.loggers.has(key)) {
            this._sharedState.loggers.set(key, new _Logger.Logger({ name: loggerName, version: version, schemaUrl: options === null || options === void 0 ? void 0 : options.schemaUrl }, this._sharedState));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._sharedState.loggers.get(key);
    };
    /**
     * Adds a new {@link LogRecordProcessor} to this logger.
     * @param processor the new LogRecordProcessor to be added.
     */
    LoggerProvider.prototype.addLogRecordProcessor = function (processor) {
        if (this._sharedState.registeredLogRecordProcessors.length === 0) {
            // since we might have enabled by default a batchProcessor, we disable it
            // before adding the new one
            this._sharedState.activeProcessor.shutdown().catch(function (err) {
                return _api.diag.error('Error while trying to shutdown current log record processor', err);
            });
        }
        this._sharedState.registeredLogRecordProcessors.push(processor);
        this._sharedState.activeProcessor = new _MultiLogRecordProcessor.MultiLogRecordProcessor(this._sharedState.registeredLogRecordProcessors, this._sharedState.forceFlushTimeoutMillis);
    };
    /**
     * Notifies all registered LogRecordProcessor to flush any buffered data.
     *
     * Returns a promise which is resolved when all flushes are complete.
     */
    LoggerProvider.prototype.forceFlush = function () {
        // do not flush after shutdown
        if (this._shutdownOnce.isCalled) {
            _api.diag.warn('invalid attempt to force flush after LoggerProvider shutdown');
            return this._shutdownOnce.promise;
        }
        return this._sharedState.activeProcessor.forceFlush();
    };
    /**
     * Flush all buffered data and shut down the LoggerProvider and all registered
     * LogRecordProcessor.
     *
     * Returns a promise which is resolved when all flushes are complete.
     */
    LoggerProvider.prototype.shutdown = function () {
        if (this._shutdownOnce.isCalled) {
            _api.diag.warn('shutdown may only be called once per LoggerProvider');
            return this._shutdownOnce.promise;
        }
        return this._shutdownOnce.call();
    };
    LoggerProvider.prototype._shutdown = function () {
        return this._sharedState.activeProcessor.shutdown();
    };
    return LoggerProvider;
}();
exports.LoggerProvider = LoggerProvider;
//# sourceMappingURL=LoggerProvider.js.map