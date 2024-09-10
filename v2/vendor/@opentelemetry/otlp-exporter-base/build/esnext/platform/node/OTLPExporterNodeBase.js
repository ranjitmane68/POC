'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPExporterNodeBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OTLPExporterBase2 = require('../../OTLPExporterBase');

var _util = require('../../util');

var _util2 = require('./util');

var _api = require('@opentelemetry/api');

var _core = require('@opentelemetry/core');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
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


/**
 * Collector Metric Exporter abstract base class
 */
var OTLPExporterNodeBase = exports.OTLPExporterNodeBase = function (_OTLPExporterBase) {
    _inherits(OTLPExporterNodeBase, _OTLPExporterBase);

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
            _api.diag.warn('Metadata cannot be set when using http');
        }
        _this.headers = Object.assign(_this.DEFAULT_HEADERS, (0, _util.parseHeaders)(config.headers), _core.baggageUtils.parseKeyPairsIntoRecord((0, _core.getEnv)().OTEL_EXPORTER_OTLP_HEADERS));
        _this.agent = (0, _util2.createHttpAgent)(config);
        _this.compression = (0, _util2.configureCompression)(config.compression);
        _this._serializer = serializer;
        return _this;
    }

    _createClass(OTLPExporterNodeBase, [{
        key: 'onInit',
        value: function onInit(_config) {}
    }, {
        key: 'send',
        value: function send(objects, onSuccess, onError) {
            var _this2 = this;

            if (this._shutdownOnce.isCalled) {
                _api.diag.debug('Shutdown already started. Cannot send objects');
                return;
            }
            var promise = new Promise(function (resolve, reject) {
                var _a;
                (0, _util2.sendWithHttp)(_this2, (_a = _this2._serializer.serializeRequest(objects)) !== null && _a !== void 0 ? _a : new Uint8Array(), _this2._contentType, resolve, reject);
            }).then(onSuccess, onError);
            this._sendingPromises.push(promise);
            var popPromise = function popPromise() {
                var index = _this2._sendingPromises.indexOf(promise);
                _this2._sendingPromises.splice(index, 1);
            };
            promise.then(popPromise, popPromise);
        }
    }, {
        key: 'onShutdown',
        value: function onShutdown() {}
    }]);

    return OTLPExporterNodeBase;
}(_OTLPExporterBase2.OTLPExporterBase);
//# sourceMappingURL=OTLPExporterNodeBase.js.map