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

Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufTraceSerializer = exports.ProtobufMetricsSerializer = exports.ProtobufLogsSerializer = void 0;
var root = require("../generated/root");
var trace_1 = require("../trace");
var metrics_1 = require("../metrics");
var logs_1 = require("../logs");
var logsResponseType = root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse;
var logsRequestType = root.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
var metricsResponseType = root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse;
var metricsRequestType = root.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
var traceResponseType = root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse;
var traceRequestType = root.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
exports.ProtobufLogsSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, logs_1.createExportLogsServiceRequest)(arg);
        return logsRequestType.encode(request).finish();
    },
    deserializeResponse: function deserializeResponse(arg) {
        return logsResponseType.decode(arg);
    }
};
exports.ProtobufMetricsSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, metrics_1.createExportMetricsServiceRequest)(arg);
        return metricsRequestType.encode(request).finish();
    },
    deserializeResponse: function deserializeResponse(arg) {
        return metricsResponseType.decode(arg);
    }
};
exports.ProtobufTraceSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, trace_1.createExportTraceServiceRequest)(arg);
        return traceRequestType.encode(request).finish();
    },
    deserializeResponse: function deserializeResponse(arg) {
        return traceResponseType.decode(arg);
    }
};
//# sourceMappingURL=serializers.js.map