"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonLogsSerializer = exports.JsonMetricsSerializer = exports.JsonTraceSerializer = void 0;
var trace_1 = require("../trace");
var metrics_1 = require("../metrics");
var logs_1 = require("../logs");
exports.JsonTraceSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, trace_1.createExportTraceServiceRequest)(arg, {
            useHex: true,
            useLongBits: false
        });
        var encoder = new TextEncoder();
        return encoder.encode(JSON.stringify(request));
    },
    deserializeResponse: function deserializeResponse(arg) {
        var decoder = new TextDecoder();
        return JSON.parse(decoder.decode(arg));
    }
};
exports.JsonMetricsSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, metrics_1.createExportMetricsServiceRequest)(arg, {
            useLongBits: false
        });
        var encoder = new TextEncoder();
        return encoder.encode(JSON.stringify(request));
    },
    deserializeResponse: function deserializeResponse(arg) {
        var decoder = new TextDecoder();
        return JSON.parse(decoder.decode(arg));
    }
};
exports.JsonLogsSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, logs_1.createExportLogsServiceRequest)(arg, {
            useHex: true,
            useLongBits: false
        });
        var encoder = new TextEncoder();
        return encoder.encode(JSON.stringify(request));
    },
    deserializeResponse: function deserializeResponse(arg) {
        var decoder = new TextDecoder();
        return JSON.parse(decoder.decode(arg));
    }
};
//# sourceMappingURL=serializers.js.map