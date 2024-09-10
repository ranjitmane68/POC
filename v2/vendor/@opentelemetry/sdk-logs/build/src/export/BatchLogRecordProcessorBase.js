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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchLogRecordProcessorBase = void 0;
var api_1 = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");

var BatchLogRecordProcessorBase = function () {
    function BatchLogRecordProcessorBase(_exporter, config) {
        _classCallCheck(this, BatchLogRecordProcessorBase);

        var _a, _b, _c, _d;
        this._exporter = _exporter;
        this._finishedLogRecords = [];
        var env = (0, core_1.getEnv)();
        this._maxExportBatchSize = (_a = config === null || config === void 0 ? void 0 : config.maxExportBatchSize) !== null && _a !== void 0 ? _a : env.OTEL_BLRP_MAX_EXPORT_BATCH_SIZE;
        this._maxQueueSize = (_b = config === null || config === void 0 ? void 0 : config.maxQueueSize) !== null && _b !== void 0 ? _b : env.OTEL_BLRP_MAX_QUEUE_SIZE;
        this._scheduledDelayMillis = (_c = config === null || config === void 0 ? void 0 : config.scheduledDelayMillis) !== null && _c !== void 0 ? _c : env.OTEL_BLRP_SCHEDULE_DELAY;
        this._exportTimeoutMillis = (_d = config === null || config === void 0 ? void 0 : config.exportTimeoutMillis) !== null && _d !== void 0 ? _d : env.OTEL_BLRP_EXPORT_TIMEOUT;
        this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
        if (this._maxExportBatchSize > this._maxQueueSize) {
            api_1.diag.warn('BatchLogRecordProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize');
            this._maxExportBatchSize = this._maxQueueSize;
        }
    }

    _createClass(BatchLogRecordProcessorBase, [{
        key: "onEmit",
        value: function onEmit(logRecord) {
            if (this._shutdownOnce.isCalled) {
                return;
            }
            this._addToBuffer(logRecord);
        }
    }, {
        key: "forceFlush",
        value: function forceFlush() {
            if (this._shutdownOnce.isCalled) {
                return this._shutdownOnce.promise;
            }
            return this._flushAll();
        }
    }, {
        key: "shutdown",
        value: function shutdown() {
            return this._shutdownOnce.call();
        }
    }, {
        key: "_shutdown",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.onShutdown();
                                _context.next = 3;
                                return this._flushAll();

                            case 3:
                                _context.next = 5;
                                return this._exporter.shutdown();

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _shutdown() {
                return _ref.apply(this, arguments);
            }

            return _shutdown;
        }()
        /** Add a LogRecord in the buffer. */

    }, {
        key: "_addToBuffer",
        value: function _addToBuffer(logRecord) {
            if (this._finishedLogRecords.length >= this._maxQueueSize) {
                return;
            }
            this._finishedLogRecords.push(logRecord);
            this._maybeStartTimer();
        }
        /**
         * Send all LogRecords to the exporter respecting the batch size limit
         * This function is used only on forceFlush or shutdown,
         * for all other cases _flush should be used
         * */

    }, {
        key: "_flushAll",
        value: function _flushAll() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var promises = [];
                var batchCount = Math.ceil(_this._finishedLogRecords.length / _this._maxExportBatchSize);
                for (var i = 0; i < batchCount; i++) {
                    promises.push(_this._flushOneBatch());
                }
                Promise.all(promises).then(function () {
                    resolve();
                }).catch(reject);
            });
        }
    }, {
        key: "_flushOneBatch",
        value: function _flushOneBatch() {
            var _this2 = this;

            this._clearTimer();
            if (this._finishedLogRecords.length === 0) {
                return Promise.resolve();
            }
            return new Promise(function (resolve, reject) {
                (0, core_1.callWithTimeout)(_this2._export(_this2._finishedLogRecords.splice(0, _this2._maxExportBatchSize)), _this2._exportTimeoutMillis).then(function () {
                    return resolve();
                }).catch(reject);
            });
        }
    }, {
        key: "_maybeStartTimer",
        value: function _maybeStartTimer() {
            var _this3 = this;

            if (this._timer !== undefined) {
                return;
            }
            this._timer = setTimeout(function () {
                _this3._flushOneBatch().then(function () {
                    if (_this3._finishedLogRecords.length > 0) {
                        _this3._clearTimer();
                        _this3._maybeStartTimer();
                    }
                }).catch(function (e) {
                    (0, core_1.globalErrorHandler)(e);
                });
            }, this._scheduledDelayMillis);
            (0, core_1.unrefTimer)(this._timer);
        }
    }, {
        key: "_clearTimer",
        value: function _clearTimer() {
            if (this._timer !== undefined) {
                clearTimeout(this._timer);
                this._timer = undefined;
            }
        }
    }, {
        key: "_export",
        value: function _export(logRecords) {
            var _this4 = this;

            var doExport = function doExport() {
                return core_1.internal._export(_this4._exporter, logRecords).then(function (result) {
                    var _a;
                    if (result.code !== core_1.ExportResultCode.SUCCESS) {
                        (0, core_1.globalErrorHandler)((_a = result.error) !== null && _a !== void 0 ? _a : new Error("BatchLogRecordProcessor: log record export failed (status " + result + ")"));
                    }
                }).catch(core_1.globalErrorHandler);
            };
            var pendingResources = logRecords.map(function (logRecord) {
                return logRecord.resource;
            }).filter(function (resource) {
                return resource.asyncAttributesPending;
            });
            // Avoid scheduling a promise to make the behavior more predictable and easier to test
            if (pendingResources.length === 0) {
                return doExport();
            } else {
                return Promise.all(pendingResources.map(function (resource) {
                    var _a;return (_a = resource.waitForAsyncAttributes) === null || _a === void 0 ? void 0 : _a.call(resource);
                })).then(doExport, core_1.globalErrorHandler);
            }
        }
    }]);

    return BatchLogRecordProcessorBase;
}();

exports.BatchLogRecordProcessorBase = BatchLogRecordProcessorBase;
//# sourceMappingURL=BatchLogRecordProcessorBase.js.map