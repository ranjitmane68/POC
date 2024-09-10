"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OTLPTraceExporter = undefined;

var _core = require("@opentelemetry/core");

var _otlpExporterBase = require("@opentelemetry/otlp-exporter-base");

var _version = require("../../version");

var _otlpTransformer = require("@opentelemetry/otlp-transformer");

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

var DEFAULT_COLLECTOR_RESOURCE_PATH = 'v1/traces';
var DEFAULT_COLLECTOR_URL = "http://localhost:4318/" + DEFAULT_COLLECTOR_RESOURCE_PATH;
var USER_AGENT = {
    'User-Agent': "OTel-OTLP-Exporter-JavaScript/" + _version.VERSION
};
/**
 * Collector Trace Exporter for Node
 */
var OTLPTraceExporter = /** @class */function (_super) {
    __extends(OTLPTraceExporter, _super);
    function OTLPTraceExporter(config) {
        if (config === void 0) {
            config = {};
        }
        var _this = _super.call(this, config, _otlpTransformer.JsonTraceSerializer, 'application/json') || this;
        _this.headers = __assign(__assign(__assign(__assign({}, _this.headers), USER_AGENT), _core.baggageUtils.parseKeyPairsIntoRecord((0, _core.getEnv)().OTEL_EXPORTER_OTLP_TRACES_HEADERS)), (0, _otlpExporterBase.parseHeaders)(config === null || config === void 0 ? void 0 : config.headers));
        return _this;
    }
    OTLPTraceExporter.prototype.getDefaultUrl = function (config) {
        return typeof config.url === 'string' ? config.url : (0, _core.getEnv)().OTEL_EXPORTER_OTLP_TRACES_ENDPOINT.length > 0 ? (0, _otlpExporterBase.appendRootPathToUrlIfNeeded)((0, _core.getEnv)().OTEL_EXPORTER_OTLP_TRACES_ENDPOINT) : (0, _core.getEnv)().OTEL_EXPORTER_OTLP_ENDPOINT.length > 0 ? (0, _otlpExporterBase.appendResourcePathToUrl)((0, _core.getEnv)().OTEL_EXPORTER_OTLP_ENDPOINT, DEFAULT_COLLECTOR_RESOURCE_PATH) : DEFAULT_COLLECTOR_URL;
    };
    return OTLPTraceExporter;
}(_otlpExporterBase.OTLPExporterNodeBase);
exports.OTLPTraceExporter = OTLPTraceExporter;
//# sourceMappingURL=OTLPTraceExporter.js.map