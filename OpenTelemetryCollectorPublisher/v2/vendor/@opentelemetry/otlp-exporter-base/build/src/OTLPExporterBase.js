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
exports.OTLPExporterBase = void 0;
var api_1 = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");
var util_1 = require("./util");
/**
 * Collector Exporter abstract base class
 */

var OTLPExporterBase = function () {
    /**
     * @param config
     */
    function OTLPExporterBase() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, OTLPExporterBase);

        this._sendingPromises = [];
        this.url = this.getDefaultUrl(config);
        if (typeof config.hostname === 'string') {
            this.hostname = config.hostname;
        }
        this.shutdown = this.shutdown.bind(this);
        this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
        this._concurrencyLimit = typeof config.concurrencyLimit === 'number' ? config.concurrencyLimit : 30;
        this.timeoutMillis = (0, util_1.configureExporterTimeout)(config.timeoutMillis);
        // platform dependent
        this.onInit(config);
    }
    /**
     * Export items.
     * @param items
     * @param resultCallback
     */


    _createClass(OTLPExporterBase, [{
        key: "export",
        value: function _export(items, resultCallback) {
            if (this._shutdownOnce.isCalled) {
                resultCallback({
                    code: core_1.ExportResultCode.FAILED,
                    error: new Error('Exporter has been shutdown')
                });
                return;
            }
            if (this._sendingPromises.length >= this._concurrencyLimit) {
                resultCallback({
                    code: core_1.ExportResultCode.FAILED,
                    error: new Error('Concurrent export limit reached')
                });
                return;
            }
            this._export(items).then(function () {
                resultCallback({ code: core_1.ExportResultCode.SUCCESS });
            }).catch(function (error) {
                resultCallback({ code: core_1.ExportResultCode.FAILED, error: error });
            });
        }
    }, {
        key: "_export",
        value: function _export(items) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                try {
                    api_1.diag.debug('items to be sent', items);
                    _this.send(items, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        }
        /**
         * Shutdown the exporter.
         */

    }, {
        key: "shutdown",
        value: function shutdown() {
            return this._shutdownOnce.call();
        }
        /**
         * Exports any pending spans in the exporter
         */

    }, {
        key: "forceFlush",
        value: function forceFlush() {
            return Promise.all(this._sendingPromises).then(function () {
                /** ignore resolved values */
            });
        }
        /**
         * Called by _shutdownOnce with BindOnceFuture
         */

    }, {
        key: "_shutdown",
        value: function _shutdown() {
            api_1.diag.debug('shutdown started');
            this.onShutdown();
            return this.forceFlush();
        }
    }]);

    return OTLPExporterBase;
}();

exports.OTLPExporterBase = OTLPExporterBase;
//# sourceMappingURL=OTLPExporterBase.js.map