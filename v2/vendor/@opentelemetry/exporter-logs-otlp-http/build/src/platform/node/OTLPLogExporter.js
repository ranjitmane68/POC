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
exports.OTLPLogExporter = void 0;
var core_1 = require("@opentelemetry/core");
var otlp_exporter_base_1 = require("@opentelemetry/otlp-exporter-base");
var otlp_transformer_1 = require("@opentelemetry/otlp-transformer");
var config_1 = require("../config");
var version_1 = require("../../version");
var USER_AGENT = {
    'User-Agent': "OTel-OTLP-Exporter-JavaScript/" + version_1.VERSION
};
/**
 * Collector Logs Exporter for Node
 */

var OTLPLogExporter = function (_otlp_exporter_base_) {
    _inherits(OTLPLogExporter, _otlp_exporter_base_);

    function OTLPLogExporter() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, OTLPLogExporter);

        var _this = _possibleConstructorReturn(this, (OTLPLogExporter.__proto__ || Object.getPrototypeOf(OTLPLogExporter)).call(this, Object.assign({ timeoutMillis: (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_LOGS_TIMEOUT }, config), otlp_transformer_1.JsonLogsSerializer, 'application/json'));
        // load  OTEL_EXPORTER_OTLP_LOGS_TIMEOUT env


        _this.headers = Object.assign(Object.assign(Object.assign(Object.assign({}, _this.headers), USER_AGENT), core_1.baggageUtils.parseKeyPairsIntoRecord((0, core_1.getEnv)().OTEL_EXPORTER_OTLP_LOGS_HEADERS)), (0, otlp_exporter_base_1.parseHeaders)(config === null || config === void 0 ? void 0 : config.headers));
        return _this;
    }

    _createClass(OTLPLogExporter, [{
        key: "getDefaultUrl",
        value: function getDefaultUrl(config) {
            return (0, config_1.getDefaultUrl)(config);
        }
    }]);

    return OTLPLogExporter;
}(otlp_exporter_base_1.OTLPExporterNodeBase);

exports.OTLPLogExporter = OTLPLogExporter;
//# sourceMappingURL=OTLPLogExporter.js.map