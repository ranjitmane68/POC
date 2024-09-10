'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JsonLogsSerializer = exports.JsonMetricsSerializer = exports.JsonTraceSerializer = undefined;

var _trace = require('../trace');

var _metrics = require('../metrics');

var _logs = require('../logs');

var JsonTraceSerializer = exports.JsonTraceSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, _trace.createExportTraceServiceRequest)(arg, {
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
var JsonMetricsSerializer = exports.JsonMetricsSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, _metrics.createExportMetricsServiceRequest)(arg, {
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
var JsonLogsSerializer = exports.JsonLogsSerializer = {
    serializeRequest: function serializeRequest(arg) {
        var request = (0, _logs.createExportLogsServiceRequest)(arg, {
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