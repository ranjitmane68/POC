'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BasicTracerProvider = exports.ForceFlushState = undefined;

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


var _api = require('@opentelemetry/api');

var _core = require('@opentelemetry/core');

var _resources = require('@opentelemetry/resources');

var _ = require('.');

var _config = require('./config');

var _MultiSpanProcessor = require('./MultiSpanProcessor');

var _NoopSpanProcessor = require('./export/NoopSpanProcessor');

var _platform = require('./platform');

var _utility = require('./utility');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ForceFlushState = exports.ForceFlushState = undefined;
(function (ForceFlushState) {
    ForceFlushState[ForceFlushState["resolved"] = 0] = "resolved";
    ForceFlushState[ForceFlushState["timeout"] = 1] = "timeout";
    ForceFlushState[ForceFlushState["error"] = 2] = "error";
    ForceFlushState[ForceFlushState["unresolved"] = 3] = "unresolved";
})(ForceFlushState || (exports.ForceFlushState = ForceFlushState = {}));
/**
 * This class represents a basic tracer provider which platform libraries can extend
 */

var BasicTracerProvider = exports.BasicTracerProvider = function () {
    function BasicTracerProvider() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, BasicTracerProvider);

        var _a;
        this._registeredSpanProcessors = [];
        this._tracers = new Map();
        var mergedConfig = (0, _core.merge)({}, (0, _config.loadDefaultConfig)(), (0, _utility.reconfigureLimits)(config));
        this.resource = (_a = mergedConfig.resource) !== null && _a !== void 0 ? _a : _resources.Resource.empty();
        this.resource = _resources.Resource.default().merge(this.resource);
        this._config = Object.assign({}, mergedConfig, {
            resource: this.resource
        });
        var defaultExporter = this._buildExporterFromEnv();
        if (defaultExporter !== undefined) {
            var batchProcessor = new _platform.BatchSpanProcessor(defaultExporter);
            this.activeSpanProcessor = batchProcessor;
        } else {
            this.activeSpanProcessor = new _NoopSpanProcessor.NoopSpanProcessor();
        }
    }

    _createClass(BasicTracerProvider, [{
        key: 'getTracer',
        value: function getTracer(name, version, options) {
            var key = name + '@' + (version || '') + ':' + ((options === null || options === void 0 ? void 0 : options.schemaUrl) || '');
            if (!this._tracers.has(key)) {
                this._tracers.set(key, new _.Tracer({ name: name, version: version, schemaUrl: options === null || options === void 0 ? void 0 : options.schemaUrl }, this._config, this));
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this._tracers.get(key);
        }
        /**
         * Adds a new {@link SpanProcessor} to this tracer.
         * @param spanProcessor the new SpanProcessor to be added.
         */

    }, {
        key: 'addSpanProcessor',
        value: function addSpanProcessor(spanProcessor) {
            if (this._registeredSpanProcessors.length === 0) {
                // since we might have enabled by default a batchProcessor, we disable it
                // before adding the new one
                this.activeSpanProcessor.shutdown().catch(function (err) {
                    return _api.diag.error('Error while trying to shutdown current span processor', err);
                });
            }
            this._registeredSpanProcessors.push(spanProcessor);
            this.activeSpanProcessor = new _MultiSpanProcessor.MultiSpanProcessor(this._registeredSpanProcessors);
        }
    }, {
        key: 'getActiveSpanProcessor',
        value: function getActiveSpanProcessor() {
            return this.activeSpanProcessor;
        }
        /**
         * Register this TracerProvider for use with the OpenTelemetry API.
         * Undefined values may be replaced with defaults, and
         * null values will be skipped.
         *
         * @param config Configuration object for SDK registration
         */

    }, {
        key: 'register',
        value: function register() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _api.trace.setGlobalTracerProvider(this);
            if (config.propagator === undefined) {
                config.propagator = this._buildPropagatorFromEnv();
            }
            if (config.contextManager) {
                _api.context.setGlobalContextManager(config.contextManager);
            }
            if (config.propagator) {
                _api.propagation.setGlobalPropagator(config.propagator);
            }
        }
    }, {
        key: 'forceFlush',
        value: function forceFlush() {
            var timeout = this._config.forceFlushTimeoutMillis;
            var promises = this._registeredSpanProcessors.map(function (spanProcessor) {
                return new Promise(function (resolve) {
                    var state = void 0;
                    var timeoutInterval = setTimeout(function () {
                        resolve(new Error('Span processor did not completed within timeout period of ' + timeout + ' ms'));
                        state = ForceFlushState.timeout;
                    }, timeout);
                    spanProcessor.forceFlush().then(function () {
                        clearTimeout(timeoutInterval);
                        if (state !== ForceFlushState.timeout) {
                            state = ForceFlushState.resolved;
                            resolve(state);
                        }
                    }).catch(function (error) {
                        clearTimeout(timeoutInterval);
                        state = ForceFlushState.error;
                        resolve(error);
                    });
                });
            });
            return new Promise(function (resolve, reject) {
                Promise.all(promises).then(function (results) {
                    var errors = results.filter(function (result) {
                        return result !== ForceFlushState.resolved;
                    });
                    if (errors.length > 0) {
                        reject(errors);
                    } else {
                        resolve();
                    }
                }).catch(function (error) {
                    return reject([error]);
                });
            });
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            return this.activeSpanProcessor.shutdown();
        }
        /**
         * TS cannot yet infer the type of this.constructor:
         * https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
         * There is no need to override either of the getters in your child class.
         * The type of the registered component maps should be the same across all
         * classes in the inheritance tree.
         */

    }, {
        key: '_getPropagator',
        value: function _getPropagator(name) {
            var _a;
            return (_a = this.constructor._registeredPropagators.get(name)) === null || _a === void 0 ? void 0 : _a();
        }
    }, {
        key: '_getSpanExporter',
        value: function _getSpanExporter(name) {
            var _a;
            return (_a = this.constructor._registeredExporters.get(name)) === null || _a === void 0 ? void 0 : _a();
        }
    }, {
        key: '_buildPropagatorFromEnv',
        value: function _buildPropagatorFromEnv() {
            var _this = this;

            // per spec, propagators from env must be deduplicated
            var uniquePropagatorNames = Array.from(new Set((0, _core.getEnv)().OTEL_PROPAGATORS));
            var propagators = uniquePropagatorNames.map(function (name) {
                var propagator = _this._getPropagator(name);
                if (!propagator) {
                    _api.diag.warn('Propagator "' + name + '" requested through environment variable is unavailable.');
                }
                return propagator;
            });
            var validPropagators = propagators.reduce(function (list, item) {
                if (item) {
                    list.push(item);
                }
                return list;
            }, []);
            if (validPropagators.length === 0) {
                return;
            } else if (uniquePropagatorNames.length === 1) {
                return validPropagators[0];
            } else {
                return new _core.CompositePropagator({
                    propagators: validPropagators
                });
            }
        }
    }, {
        key: '_buildExporterFromEnv',
        value: function _buildExporterFromEnv() {
            var exporterName = (0, _core.getEnv)().OTEL_TRACES_EXPORTER;
            if (exporterName === 'none' || exporterName === '') return;
            var exporter = this._getSpanExporter(exporterName);
            if (!exporter) {
                _api.diag.error('Exporter "' + exporterName + '" requested through environment variable is unavailable.');
            }
            return exporter;
        }
    }]);

    return BasicTracerProvider;
}();

BasicTracerProvider._registeredPropagators = new Map([['tracecontext', function () {
    return new _core.W3CTraceContextPropagator();
}], ['baggage', function () {
    return new _core.W3CBaggagePropagator();
}]]);
BasicTracerProvider._registeredExporters = new Map();
//# sourceMappingURL=BasicTracerProvider.js.map