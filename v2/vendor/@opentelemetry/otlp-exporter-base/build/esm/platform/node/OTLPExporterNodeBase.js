"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPExporterNodeBase = undefined;

var _OTLPExporterBase = require("../../OTLPExporterBase");

var _util = require("../../util");

var _util2 = require("./util");

var _api = require("@opentelemetry/api");

var _core = require("@opentelemetry/core");

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
var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

/**
 * Collector Metric Exporter abstract base class
 */
var OTLPExporterNodeBase = /** @class */function (_super) {
    __extends(OTLPExporterNodeBase, _super);
    function OTLPExporterNodeBase(config, serializer, contentType) {
        if (config === void 0) {
            config = {};
        }
        var _this = _super.call(this, config) || this;
        _this.DEFAULT_HEADERS = {};
        _this._contentType = contentType;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (config.metadata) {
            _api.diag.warn('Metadata cannot be set when using http');
        }
        _this.headers = Object.assign(_this.DEFAULT_HEADERS, (0, _util.parseHeaders)(config.headers), _core.baggageUtils.parseKeyPairsIntoRecord((0, _core.getEnv)().OTEL_EXPORTER_OTLP_HEADERS));
        _this.agent = (0, _util2.createHttpAgent)(config);
        _this.compression = (0, _util2.configureCompression)(config.compression);
        _this._serializer = serializer;
        return _this;
    }
    OTLPExporterNodeBase.prototype.onInit = function (_config) {};
    OTLPExporterNodeBase.prototype.send = function (objects, onSuccess, onError) {
        var _this = this;
        if (this._shutdownOnce.isCalled) {
            _api.diag.debug('Shutdown already started. Cannot send objects');
            return;
        }
        var promise = new Promise(function (resolve, reject) {
            var _a;
            (0, _util2.sendWithHttp)(_this, (_a = _this._serializer.serializeRequest(objects)) !== null && _a !== void 0 ? _a : new Uint8Array(), _this._contentType, resolve, reject);
        }).then(onSuccess, onError);
        this._sendingPromises.push(promise);
        var popPromise = function popPromise() {
            var index = _this._sendingPromises.indexOf(promise);
            _this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
    };
    OTLPExporterNodeBase.prototype.onShutdown = function () {};
    return OTLPExporterNodeBase;
}(_OTLPExporterBase.OTLPExporterBase);
exports.OTLPExporterNodeBase = OTLPExporterNodeBase;
//# sourceMappingURL=OTLPExporterNodeBase.js.map