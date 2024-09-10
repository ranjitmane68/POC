'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createExportMetricsServiceRequest = createExportMetricsServiceRequest;

var _internal = require('./internal');

function createExportMetricsServiceRequest(resourceMetrics, options) {
    return {
        resourceMetrics: resourceMetrics.map(function (metrics) {
            return (0, _internal.toResourceMetrics)(metrics, options);
        })
    };
}
//# sourceMappingURL=index.js.map