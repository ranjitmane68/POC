'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BatchSpanProcessorBase = undefined;

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Implementation of the {@link SpanProcessor} that batches spans exported by
 * the SDK then pushes them to the exporter pipeline.
 */
var BatchSpanProcessorBase = exports.BatchSpanProcessorBase = function () {
    function BatchSpanProcessorBase(_exporter, config) {
        _classCallCheck(this, BatchSpanProcessorBase);

        this._exporter = _exporter;
        this._isExporting = false;
        this._finishedSpans = [];
        this._droppedSpansCount = 0;
        var env = (0, _core.getEnv)();
        this._maxExportBatchSize = typeof (config === null || config === void 0 ? void 0 : config.maxExportBatchSize) === 'number' ? config.maxExportBatchSize : env.OTEL_BSP_MAX_EXPORT_BATCH_SIZE;
        this._maxQueueSize = typeof (config === null || config === void 0 ? void 0 : config.maxQueueSize) === 'number' ? config.maxQueueSize : env.OTEL_BSP_MAX_QUEUE_SIZE;
        this._scheduledDelayMillis = typeof (config === null || config === void 0 ? void 0 : config.scheduledDelayMillis) === 'number' ? config.scheduledDelayMillis : env.OTEL_BSP_SCHEDULE_DELAY;
        this._exportTimeoutMillis = typeof (config === null || config === void 0 ? void 0 : config.exportTimeoutMillis) === 'number' ? config.exportTimeoutMillis : env.OTEL_BSP_EXPORT_TIMEOUT;
        this._shutdownOnce = new _core.BindOnceFuture(this._shutdown, this);
        if (this._maxExportBatchSize > this._maxQueueSize) {
            _api.diag.warn('BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize');
            this._maxExportBatchSize = this._maxQueueSize;
        }
    }

    _createClass(BatchSpanProcessorBase, [{
        key: 'forceFlush',
        value: function forceFlush() {
            if (this._shutdownOnce.isCalled) {
                return this._shutdownOnce.promise;
            }
            return this._flushAll();
        }
        // does nothing.

    }, {
        key: 'onStart',
        value: function onStart(_span, _parentContext) {}
    }, {
        key: 'onEnd',
        value: function onEnd(span) {
            if (this._shutdownOnce.isCalled) {
                return;
            }
            if ((span.spanContext().traceFlags & _api.TraceFlags.SAMPLED) === 0) {
                return;
            }
            this._addToBuffer(span);
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {
            return this._shutdownOnce.call();
        }
    }, {
        key: '_shutdown',
        value: function _shutdown() {
            var _this = this;

            return Promise.resolve().then(function () {
                return _this.onShutdown();
            }).then(function () {
                return _this._flushAll();
            }).then(function () {
                return _this._exporter.shutdown();
            });
        }
        /** Add a span in the buffer. */

    }, {
        key: '_addToBuffer',
        value: function _addToBuffer(span) {
            if (this._finishedSpans.length >= this._maxQueueSize) {
                // limit reached, drop span
                if (this._droppedSpansCount === 0) {
                    _api.diag.debug('maxQueueSize reached, dropping spans');
                }
                this._droppedSpansCount++;
                return;
            }
            if (this._droppedSpansCount > 0) {
                // some spans were dropped, log once with count of spans dropped
                _api.diag.warn('Dropped ' + this._droppedSpansCount + ' spans because maxQueueSize reached');
                this._droppedSpansCount = 0;
            }
            this._finishedSpans.push(span);
            this._maybeStartTimer();
        }
        /**
         * Send all spans to the exporter respecting the batch size limit
         * This function is used only on forceFlush or shutdown,
         * for all other cases _flush should be used
         * */

    }, {
        key: '_flushAll',
        value: function _flushAll() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var promises = [];
                // calculate number of batches
                var count = Math.ceil(_this2._finishedSpans.length / _this2._maxExportBatchSize);
                for (var i = 0, j = count; i < j; i++) {
                    promises.push(_this2._flushOneBatch());
                }
                Promise.all(promises).then(function () {
                    resolve();
                }).catch(reject);
            });
        }
    }, {
        key: '_flushOneBatch',
        value: function _flushOneBatch() {
            var _this3 = this;

            this._clearTimer();
            if (this._finishedSpans.length === 0) {
                return Promise.resolve();
            }
            return new Promise(function (resolve, reject) {
                var timer = setTimeout(function () {
                    // don't wait anymore for export, this way the next batch can start
                    reject(new Error('Timeout'));
                }, _this3._exportTimeoutMillis);
                // prevent downstream exporter calls from generating spans
                _api.context.with((0, _core.suppressTracing)(_api.context.active()), function () {
                    // Reset the finished spans buffer here because the next invocations of the _flush method
                    // could pass the same finished spans to the exporter if the buffer is cleared
                    // outside the execution of this callback.
                    var spans = void 0;
                    if (_this3._finishedSpans.length <= _this3._maxExportBatchSize) {
                        spans = _this3._finishedSpans;
                        _this3._finishedSpans = [];
                    } else {
                        spans = _this3._finishedSpans.splice(0, _this3._maxExportBatchSize);
                    }
                    var doExport = function doExport() {
                        return _this3._exporter.export(spans, function (result) {
                            var _a;
                            clearTimeout(timer);
                            if (result.code === _core.ExportResultCode.SUCCESS) {
                                resolve();
                            } else {
                                reject((_a = result.error) !== null && _a !== void 0 ? _a : new Error('BatchSpanProcessor: span export failed'));
                            }
                        });
                    };
                    var pendingResources = null;
                    for (var i = 0, len = spans.length; i < len; i++) {
                        var span = spans[i];
                        if (span.resource.asyncAttributesPending && span.resource.waitForAsyncAttributes) {
                            pendingResources !== null && pendingResources !== void 0 ? pendingResources : pendingResources = [];
                            pendingResources.push(span.resource.waitForAsyncAttributes());
                        }
                    }
                    // Avoid scheduling a promise to make the behavior more predictable and easier to test
                    if (pendingResources === null) {
                        doExport();
                    } else {
                        Promise.all(pendingResources).then(doExport, function (err) {
                            (0, _core.globalErrorHandler)(err);
                            reject(err);
                        });
                    }
                });
            });
        }
    }, {
        key: '_maybeStartTimer',
        value: function _maybeStartTimer() {
            var _this4 = this;

            if (this._isExporting) return;
            var flush = function flush() {
                _this4._isExporting = true;
                _this4._flushOneBatch().finally(function () {
                    _this4._isExporting = false;
                    if (_this4._finishedSpans.length > 0) {
                        _this4._clearTimer();
                        _this4._maybeStartTimer();
                    }
                }).catch(function (e) {
                    _this4._isExporting = false;
                    (0, _core.globalErrorHandler)(e);
                });
            };
            // we only wait if the queue doesn't have enough elements yet
            if (this._finishedSpans.length >= this._maxExportBatchSize) {
                return flush();
            }
            if (this._timer !== undefined) return;
            this._timer = setTimeout(function () {
                return flush();
            }, this._scheduledDelayMillis);
            (0, _core.unrefTimer)(this._timer);
        }
    }, {
        key: '_clearTimer',
        value: function _clearTimer() {
            if (this._timer !== undefined) {
                clearTimeout(this._timer);
                this._timer = undefined;
            }
        }
    }]);

    return BatchSpanProcessorBase;
}();
//# sourceMappingURL=BatchSpanProcessorBase.js.map