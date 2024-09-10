'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPLogExporter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('@opentelemetry/core');

var _otlpExporterBase = require('@opentelemetry/otlp-exporter-base');

var _otlpTransformer = require('@opentelemetry/otlp-transformer');

var _config = require('../config');

var _version = require('../../version');

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


var USER_AGENT = {
    'User-Agent': 'OTel-OTLP-Exporter-JavaScript/' + _version.VERSION
};
/**
 * Collector Logs Exporter for Node
 */

var OTLPLogExporter = exports.OTLPLogExporter = function (_OTLPExporterNodeBase) {
    _inherits(OTLPLogExporter, _OTLPExporterNodeBase);

    function OTLPLogExporter() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, OTLPLogExporter);

        var _this = _possibleConstructorReturn(this, (OTLPLogExporter.__proto__ || Object.getPrototypeOf(OTLPLogExporter)).call(this, Object.assign({ timeoutMillis: (0, _core.getEnv)().OTEL_EXPORTER_OTLP_LOGS_TIMEOUT }, config), _otlpTransformer.JsonLogsSerializer, 'application/json'));
        // load  OTEL_EXPORTER_OTLP_LOGS_TIMEOUT env


        _this.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, _this.headers), USER_AGENT), _core.baggageUtils.parseKeyPairsIntoRecord((0, _core.getEnv)().OTEL_EXPORTER_OTLP_LOGS_HEADERS)), (0, _otlpExporterBase.parseHeaders)(config === null || config === void 0 ? void 0 : config.headers));
        return _this;
    }

    _createClass(OTLPLogExporter, [{
        key: 'getDefaultUrl',
        value: function getDefaultUrl(config) {
            return (0, _config.getDefaultUrl)(config);
        }
    }]);

    return OTLPLogExporter;
}(_otlpExporterBase.OTLPExporterNodeBase);
//# sourceMappingURL=OTLPLogExporter.js.map