"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createExportMetricsServiceRequest = void 0;
var internal_1 = require("./internal");
function createExportMetricsServiceRequest(resourceMetrics, options) {
    return {
        resourceMetrics: resourceMetrics.map(function (metrics) {
            return (0, internal_1.toResourceMetrics)(metrics, options);
        })
    };
}
exports.createExportMetricsServiceRequest = createExportMetricsServiceRequest;
//# sourceMappingURL=index.js.map