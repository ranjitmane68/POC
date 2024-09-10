'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPExporterBase = undefined;

var _api = require('@opentelemetry/api');

var _core = require('@opentelemetry/core');

var _util = require('./util');

/**
 * Collector Exporter abstract base class
 */
var OTLPExporterBase = /** @class */function () {
    /**
     * @param config
     */
    function OTLPExporterBase(config) {
        if (config === void 0) {
            config = {};
        }
        this._sendingPromises = [];
        this.url = this.getDefaultUrl(config);
        if (typeof config.hostname === 'string') {
            this.hostname = config.hostname;
        }
        this.shutdown = this.shutdown.bind(this);
        this._shutdownOnce = new _core.BindOnceFuture(this._shutdown, this);
        this._concurrencyLimit = typeof config.concurrencyLimit === 'number' ? config.concurrencyLimit : 30;
        this.timeoutMillis = (0, _util.configureExporterTimeout)(config.timeoutMillis);
        // platform dependent
        this.onInit(config);
    }
    /**
     * Export items.
     * @param items
     * @param resultCallback
     */
    OTLPExporterBase.prototype.export = function (items, resultCallback) {
        if (this._shutdownOnce.isCalled) {
            resultCallback({
                code: _core.ExportResultCode.FAILED,
                error: new Error('Exporter has been shutdown')
            });
            return;
        }
        if (this._sendingPromises.length >= this._concurrencyLimit) {
            resultCallback({
                code: _core.ExportResultCode.FAILED,
                error: new Error('Concurrent export limit reached')
            });
            return;
        }
        this._export(items).then(function () {
            resultCallback({ code: _core.ExportResultCode.SUCCESS });
        }).catch(function (error) {
            resultCallback({ code: _core.ExportResultCode.FAILED, error: error });
        });
    };
    OTLPExporterBase.prototype._export = function (items) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _api.diag.debug('items to be sent', items);
                _this.send(items, resolve, reject);
            } catch (e) {
                reject(e);
            }
        });
    };
    /**
     * Shutdown the exporter.
     */
    OTLPExporterBase.prototype.shutdown = function () {
        return this._shutdownOnce.call();
    };
    /**
     * Exports any pending spans in the exporter
     */
    OTLPExporterBase.prototype.forceFlush = function () {
        return Promise.all(this._sendingPromises).then(function () {
            /** ignore resolved values */
        });
    };
    /**
     * Called by _shutdownOnce with BindOnceFuture
     */
    OTLPExporterBase.prototype._shutdown = function () {
        _api.diag.debug('shutdown started');
        this.onShutdown();
        return this.forceFlush();
    };
    return OTLPExporterBase;
}(); /*
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
exports.OTLPExporterBase = OTLPExporterBase;
//# sourceMappingURL=OTLPExporterBase.js.map