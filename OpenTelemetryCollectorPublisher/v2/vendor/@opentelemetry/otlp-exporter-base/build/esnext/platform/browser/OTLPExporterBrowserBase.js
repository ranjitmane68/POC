'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPExporterBrowserBase = undefined;

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
var OTLPExporterBrowserBase = exports.OTLPExporterBrowserBase = function (_OTLPExporterBase) {
    _inherits(OTLPExporterBrowserBase, _OTLPExporterBase);

    /**
     * @param config
     * @param serializer
     * @param contentType
     */
    function OTLPExporterBrowserBase() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var serializer = arguments[1];
        var contentType = arguments[2];

        _classCallCheck(this, OTLPExporterBrowserBase);

        var _this = _possibleConstructorReturn(this, (OTLPExporterBrowserBase.__proto__ || Object.getPrototypeOf(OTLPExporterBrowserBase)).call(this, config));

        _this._useXHR = false;
        _this._serializer = serializer;
        _this._contentType = contentType;
        _this._useXHR = !!config.headers || typeof navigator.sendBeacon !== 'function';
        if (_this._useXHR) {
            _this._headers = Object.assign({}, (0, _util.parseHeaders)(config.headers), _core.baggageUtils.parseKeyPairsIntoRecord((0, _core.getEnv)().OTEL_EXPORTER_OTLP_HEADERS));
        } else {
            _this._headers = {};
        }
        return _this;
    }

    _createClass(OTLPExporterBrowserBase, [{
        key: 'onInit',
        value: function onInit() {}
    }, {
        key: 'onShutdown',
        value: function onShutdown() {}
    }, {
        key: 'send',
        value: function send(items, onSuccess, onError) {
            var _this2 = this;

            var _a;
            if (this._shutdownOnce.isCalled) {
                _api.diag.debug('Shutdown already started. Cannot send objects');
                return;
            }
            var body = (_a = this._serializer.serializeRequest(items)) !== null && _a !== void 0 ? _a : new Uint8Array();
            var promise = new Promise(function (resolve, reject) {
                if (_this2._useXHR) {
                    (0, _util2.sendWithXhr)(body, _this2.url, Object.assign(Object.assign({}, _this2._headers), { 'Content-Type': _this2._contentType }), _this2.timeoutMillis, resolve, reject);
                } else {
                    (0, _util2.sendWithBeacon)(body, _this2.url, { type: _this2._contentType }, resolve, reject);
                }
            }).then(onSuccess, onError);
            this._sendingPromises.push(promise);
            var popPromise = function popPromise() {
                var index = _this2._sendingPromises.indexOf(promise);
                _this2._sendingPromises.splice(index, 1);
            };
            promise.then(popPromise, popPromise);
        }
    }]);

    return OTLPExporterBrowserBase;
}(_OTLPExporterBase2.OTLPExporterBase);
//# sourceMappingURL=OTLPExporterBrowserBase.js.map