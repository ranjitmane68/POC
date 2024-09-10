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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.OTLPExporterNodeBase = void 0;
var OTLPExporterBase_1 = require("../../OTLPExporterBase");
var util_1 = require("../../util");
var util_2 = require("./util");
var api_1 = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");
/**
 * Collector Metric Exporter abstract base class
 */

var OTLPExporterNodeBase = function (_OTLPExporterBase_1$O) {
    _inherits(OTLPExporterNodeBase, _OTLPExporterBase_1$O);

    function OTLPExporterNodeBase() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var serializer = arguments[1];
        var contentType = arguments[2];

        _classCallCheck(this, OTLPExporterNodeBase);

        var _this = _possibleConstructorReturn(this, (OTLPExporterNodeBase.__proto__ || Object.getPrototypeOf(OTLPExporterNodeBase)).call(this, config));

        _this.DEFAULT_HEADERS = {};
        _this._contentType = contentType;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (config.metadata) {
            api_1.diag.warn('Metadata cannot be set when using http');
        }
        _this.headers = Object.assign(_this.DEFAULT_HEADERS, (0, util_1.parseHeaders)(config.headers), core_1.baggageUtils.parseKeyPairsIntoRecord((0, core_1.getEnv)().OTEL_EXPORTER_OTLP_HEADERS));
        _this.agent = (0, util_2.createHttpAgent)(config);
        _this.compression = (0, util_2.configureCompression)(config.compression);
        _this._serializer = serializer;
        return _this;
    }

    _createClass(OTLPExporterNodeBase, [{
        key: "onInit",
        value: function onInit(_config) {}
    }, {
        key: "send",
        value: function send(objects, onSuccess, onError) {
            var _this2 = this;

            if (this._shutdownOnce.isCalled) {
                api_1.diag.debug('Shutdown already started. Cannot send objects');
                return;
            }
            var promise = new Promise(function (resolve, reject) {
                var _a;
                (0, util_2.sendWithHttp)(_this2, (_a = _this2._serializer.serializeRequest(objects)) !== null && _a !== void 0 ? _a : new Uint8Array(), _this2._contentType, resolve, reject);
            }).then(onSuccess, onError);
            this._sendingPromises.push(promise);
            var popPromise = function popPromise() {
                var index = _this2._sendingPromises.indexOf(promise);
                _this2._sendingPromises.splice(index, 1);
            };
            promise.then(popPromise, popPromise);
        }
    }, {
        key: "onShutdown",
        value: function onShutdown() {}
    }]);

    return OTLPExporterNodeBase;
}(OTLPExporterBase_1.OTLPExporterBase);

exports.OTLPExporterNodeBase = OTLPExporterNodeBase;
//# sourceMappingURL=OTLPExporterNodeBase.js.map