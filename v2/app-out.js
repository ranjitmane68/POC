"use strict";

var _ref;
var _sdkLogs = require("@opentelemetry/sdk-logs");
var _exporterLogsOtlpHttp = require("@opentelemetry/exporter-logs-otlp-http");
var _exporterTraceOtlpHttp = require("@opentelemetry/exporter-trace-otlp-http");
var _apiLogs = require("@opentelemetry/api-logs");
var _resources = require("@opentelemetry/resources");
var _semanticConventions = require("@opentelemetry/semantic-conventions");
const { LogsAPI } = require("@opentelemetry/api-logs/build/src/api/logs");
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var collectorOptions = {
  url: "http://localhost:4318/v1/traces",
  // url is optional and can be omitted - default is http://localhost:4318/v1/traces
  headers: {},
  // an optional object containing custom headers to be sent with each request
  concurrencyLimit: 10 // an optional limit on pending requests
};

//const provider = new WebTracerProvider();
var exporter = new _exporterTraceOtlpHttp.OTLPTraceExporter(collectorOptions);
var loggerProvider = new _sdkLogs.LoggerProvider({
  resource: new _resources.Resource((_ref = {}, _defineProperty(_ref, _semanticConventions.SEMRESATTRS_SERVICE_NAME, "famwebclient"), _defineProperty(_ref, _semanticConventions.SEMRESATTRS_SERVICE_NAMESPACE, "famwebclient"), _ref))
});
loggerProvider.addLogRecordProcessor(new _sdkLogs.SimpleLogRecordProcessor(new _sdkLogs.ConsoleLogRecordExporter()));
loggerProvider.addLogRecordProcessor(new _sdkLogs.BatchLogRecordProcessor(new _exporterLogsOtlpHttp.OTLPLogExporter({
  //url: "http://localhost:4318/v1/logs", // URL of dev server
  url: "https://devtelemetry.cchaxcess.com/v1/logs",
  // URL of dev server
  headers: {
    Authorization: "Basic YWRtaW46YWRtaW4="
  },
  timeoutMillis: 10000
})));
_apiLogs.logs.setGlobalLoggerProvider(loggerProvider);
var logger = loggerProvider.getLogger("default", "1.0.0");
logger.emit({
  body: "Successfully logging to datadog server !!! ",
  attributes: "Testing attributes"
});

var logData = function(msg, attr) {
  console.log(msg);
  logger.emit({
    body: msg,
    attributes: attr
  });
}

// Register the provider globally
//provider.register();

module.exports = { logData };
console.log("OpenTelemetry initialized with Datadog exporter");
