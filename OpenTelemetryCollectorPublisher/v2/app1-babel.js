"use strict";

var _sdkLogs = require("@opentelemetry/sdk-logs");
var _apiLogs = require("@opentelemetry/api-logs");
var _exporterLogsOtlpHttp = require("@opentelemetry/exporter-logs-otlp-http");
var _resources = require("@opentelemetry/resources");
var _semanticConventions = require("@opentelemetry/semantic-conventions");
function _typeof(o) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (o) {
            return typeof o;
          }
        : function (o) {
            return o &&
              "function" == typeof Symbol &&
              o.constructor === Symbol &&
              o !== Symbol.prototype
              ? "symbol"
              : typeof o;
          }),
    _typeof(o)
  );
}
function _defineProperty(e, r, t) {
  return (
    (r = _toPropertyKey(r)) in e
      ? Object.defineProperty(e, r, {
          value: t,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[r] = t),
    e
  );
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var environment = {
  production: false,
  API_URL: "http://localhost:7076/",
  OTEL_TRACE_URL: "https://devtelemetry.cchaxcess.com/v1/traces",
  OTEL_LOGS_URL: "https://devtelemetry.cchaxcess.com/v1/logs",
  OTEL_HEADER: {
    Authorization: "Basic YWRtaW46YWRtaW4=",
  },
};
var loggerProvider = new _sdkLogs.LoggerProvider({
  resource: new _resources.Resource(
    _defineProperty(
      _defineProperty(
        {},
        _semanticConventions.SEMRESATTRS_SERVICE_NAME,
        "famwebclient"
      ),
      _semanticConventions.SEMRESATTRS_SERVICE_NAMESPACE,
      "famwebclient"
    )
  ),
});
loggerProvider.addLogRecordProcessor(
  new _sdkLogs.SimpleLogRecordProcessor(new _sdkLogs.ConsoleLogRecordExporter())
);
loggerProvider.addLogRecordProcessor(
  new _sdkLogs.BatchLogRecordProcessor(
    new _exporterLogsOtlpHttp.OTLPLogExporter({
      url: environment.OTEL_LOGS_URL,
      headers: environment.OTEL_HEADER,
      timeoutMillis: 10000,
    })
  )
);
_apiLogs.logs.setGlobalLoggerProvider(loggerProvider);
var logger = loggerProvider.getLogger("default", "1.0.0");
var ddLog = function ddLog(logType, messageBody, msg, attr) {
  console.log(msg);
  logger.emit({
    severityNumber: logType,
    severityText: _apiLogs.SeverityNumber[logType],
    body: messageBody,
    attributes: attr,
  });
};
module.exports = {
  logData: ddLog,
};
