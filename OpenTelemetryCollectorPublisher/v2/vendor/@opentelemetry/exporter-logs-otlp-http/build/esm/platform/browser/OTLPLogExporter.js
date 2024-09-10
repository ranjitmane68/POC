"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPLogExporter = undefined;

var _otlpExporterBase = require("@opentelemetry/otlp-exporter-base");

var _core = require("@opentelemetry/core");

var _otlpTransformer = require("@opentelemetry/otlp-transformer");

var _config = require("../config");

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
var __assign = undefined && undefined.__assign || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) {
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * Collector Logs Exporter for Web
 */
var OTLPLogExporter = /** @class */function (_super) {
    __extends(OTLPLogExporter, _super);
    function OTLPLogExporter(config) {
        if (config === void 0) {
            config = {};
        }
        var _this =
        // load  OTEL_EXPORTER_OTLP_LOGS_TIMEOUT env var
        _super.call(this, __assign({ timeoutMillis: (0, _core.getEnv)().OTEL_EXPORTER_OTLP_LOGS_TIMEOUT }, config), _otlpTransformer.JsonLogsSerializer, 'application/json') || this;
        _this._headers = __assign(__assign({}, _this._headers), _core.baggageUtils.parseKeyPairsIntoRecord((0, _core.getEnv)().OTEL_EXPORTER_OTLP_LOGS_HEADERS));
        return _this;
    }
    OTLPLogExporter.prototype.getDefaultUrl = function (config) {
        return (0, _config.getDefaultUrl)(config);
    };
    return OTLPLogExporter;
}(_otlpExporterBase.OTLPExporterBrowserBase);
exports.OTLPLogExporter = OTLPLogExporter;
//# sourceMappingURL=OTLPLogExporter.js.map