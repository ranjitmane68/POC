"use strict";

var _sdkLogs = require("@opentelemetry/sdk-logs");
var _apiLogs = _interopRequireWildcard(require("@opentelemetry/api-logs"));
var logsAPI = _apiLogs;
var _exporterLogsOtlpHttp = require("@opentelemetry/exporter-logs-otlp-http");
var _resources = require("@opentelemetry/resources");
var _semanticConventions = require("@opentelemetry/semantic-conventions");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var environment = {
  production: false,
  OTEL_TRACE_URL: "https://devtelemetry.cchaxcess.com/v1/traces",
  OTEL_LOGS_URL: "https://devtelemetry.cchaxcess.com/v1/logs",
  OTEL_HEADER: {
    Authorization: "Basic YWRtaW46YWRtaW4="
  }
};
var loggerProvider = new _sdkLogs.LoggerProvider({
  resource: new _resources.Resource(_defineProperty(_defineProperty({
    'service.name': 'famwebclient',
    'service.instance.id': '627cc493-f310-47de-96bd-71410b7dec09',
    source: 'web-app',
    'host.name': 'HP-Pavilion-Laptop-14-dv1xxx',
    'host.arch': 'amd64',
    'host.type': 'n1-standard-1',
    'os.name': 'linux',
    'os.version': '6.0',
    'process.pid': 1,
    'process.executable.name': 'node',
    'process.command': '/usr/src/app/app.js',
    'process.command_line': '/usr/local/bin/node /usr/src/app/app.js',
    'process.runtime.version': '18.9.0',
    'process.runtime.name': 'nodejs',
    'process.runtime.description': 'Node.js'
  }, _semanticConventions.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT, 'development'), _semanticConventions.SemanticResourceAttributes.SERVICE_INSTANCE_ID, '123'))
});
loggerProvider.addLogRecordProcessor(new _sdkLogs.SimpleLogRecordProcessor(new _sdkLogs.ConsoleLogRecordExporter()));
loggerProvider.addLogRecordProcessor(new _sdkLogs.BatchLogRecordProcessor(new _exporterLogsOtlpHttp.OTLPLogExporter({
  url: environment.OTEL_LOGS_URL,
  headers: environment.OTEL_HEADER,
  timeoutMillis: 10000
})));
_apiLogs.logs.setGlobalLoggerProvider(loggerProvider);
var logger = loggerProvider.getLogger("famwebclientlogger", "1.0.0");
var severity = {
  UNSPECIFIED: 0,
  TRACE: 1,
  TRACE2: 2,
  TRACE3: 3,
  TRACE4: 4,
  DEBUG: 5,
  DEBUG2: 6,
  DEBUG3: 7,
  DEBUG4: 8,
  INFO: 9,
  INFO2: 10,
  INFO3: 11,
  INFO4: 12,
  WARN: 13,
  WARN2: 14,
  WARN3: 15,
  WARN4: 16,
  ERROR: 17,
  ERROR2: 18,
  ERROR3: 19,
  ERROR4: 20,
  FATAL: 21,
  FATAL2: 22,
  FATAL3: 23,
  FATAL4: 24
};
var ddLog = function ddLog(severityText, messageBody, hostname, attr) {
  var severityTextNumber = severity[severityText];
  logger.emit({
    severityNumber: severityTextNumber,
    severityText: severityText,
    body: messageBody,
    attributes: attr,
    hostname: hostname
  });
};
module.exports = {
  logData: ddLog
};
