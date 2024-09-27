"use strict";

var _sdkLogs = require("@opentelemetry/sdk-logs");
var _apiLogs = _interopRequireWildcard(require("@opentelemetry/api-logs"));
var logsAPI = _apiLogs;
var _exporterLogsOtlpHttp = require("@opentelemetry/exporter-logs-otlp-http");
var _resources = require("@opentelemetry/resources");
var _os = _interopRequireDefault(require("os"));
var _semanticConventions = require("@opentelemetry/semantic-conventions");
var _sdkTraceWeb = require("@opentelemetry/sdk-trace-web");
var _sdkTraceBase = require("@opentelemetry/sdk-trace-base");
var _instrumentation = require("@opentelemetry/instrumentation");
var _instrumentationFetch = require("@opentelemetry/instrumentation-fetch");
var _instrumentationXmlHttpRequest = require("@opentelemetry/instrumentation-xml-http-request");
var _instrumentationDocumentLoad = require("@opentelemetry/instrumentation-document-load");
var _exporterTraceOtlpHttp = require("@opentelemetry/exporter-trace-otlp-http");
var _instrumentationUserInteraction = require("@opentelemetry/instrumentation-user-interaction");
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var algorithm = 'aes256';
var key = '66FC55D2141A82E3F1FF3A1F28D875BDADB1843BB22AE9EE46B665D6292844BD';
function encrypt(plainText) {
  var cipher = _crypto["default"].createCipher(algorithm, key);
  var encrypted = cipher.update(plainText, 'utf8', 'hex') + cipher["final"]('hex');
  return encrypted;
}
var encyptedTraceUrl = encrypt('https://devtelemetry.cchaxcess.com/v1/traces');
console.log(encyptedTraceUrl);
var encryptedLogsUrl = encrypt('https://devtelemetry.cchaxcess.com/v1/logs');
console.log(encryptedLogsUrl);
var encryptedAuthToken = encrypt('YWRtaW46YWRtaW4=');
console.log(encryptedAuthToken);
function decrypt(encryptedText) {
  var decipher = _crypto["default"].createDecipher(algorithm, key);
  var decrypted = decipher.update(encryptedText, 'hex', 'utf8') + decipher["final"]('utf8');
  return decrypted;
}
var token = decrypt('6f872bccac6996374905707c1f76fa04b98610516ac381f7fd5b1970378a69da');
var authToken = 'basic ' + token;
var environment = {
  production: false,
  OTEL_TRACE_URL: "https://devtelemetry.cchaxcess.com/v1/traces",
  OTEL_LOGS_URL: "https://devtelemetry.cchaxcess.com/v1/logs",
  OTEL_HEADER: {
    Authorization: authToken
  }
};
var res = _resources.Resource["default"]().merge(new _resources.Resource(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _semanticConventions.SemanticResourceAttributes.SERVICE_NAME, 'famwebclient'), _semanticConventions.SemanticResourceAttributes.SERVICE_VERSION, '1.0.0'), _semanticConventions.SemanticResourceAttributes.OS_TYPE, _os["default"].type()), _semanticConventions.SemanticResourceAttributes.HOST_NAME, _os["default"].hostname()), _semanticConventions.SemanticResourceAttributes.HOST_ARCH, _os["default"].arch()), _semanticConventions.SemanticResourceAttributes.HOST_TYPE, _os["default"].platform()), _semanticConventions.SemanticResourceAttributes.OS_NAME, _os["default"].release()), _semanticConventions.SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT, "dev"), _semanticConventions.SemanticResourceAttributes.SERVICE_INSTANCE_ID, '1.0.0')));
var loggerProvider = new _sdkLogs.LoggerProvider({
  resource: res
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
var ddLog = function ddLog(severityText, messageBody, attr) {
  var severityTextNumber = severity[severityText];
  logger.emit({
    severityNumber: severityTextNumber,
    severityText: severityText,
    body: messageBody,
    attributes: attr
  });
};
var provider = new _sdkTraceWeb.WebTracerProvider({
  resource: res
});
var tracer = provider.getTracer("famwebclient");
(0, _instrumentation.registerInstrumentations)({
  instrumentations: [new _instrumentationFetch.FetchInstrumentation(), new _instrumentationXmlHttpRequest.XMLHttpRequestInstrumentation(), new _instrumentationDocumentLoad.DocumentLoadInstrumentation(), new _instrumentationUserInteraction.UserInteractionInstrumentation({
    eventNames: ["click", "submit"]
  })]
});
window.onerror = function (message, source, lineno, colno, error) {
  var tracer = provider.getTracer("error-tracer");
  var span = tracer.startSpan("error", {
    attributes: {
      "error.message": message,
      "error.source": source,
      "error.lineno": lineno,
      "error.colno": colno,
      "error.stack": error ? error.stack : ""
    }
  });
  span.end();
};
window.addEventListener("unhandledrejection", function (event) {
  var tracer = provider.getTracer("unhandled-rejection-tracer");
  var span = tracer.startSpan("unhandled-rejection", {
    attributes: {
      "error.message": event.reason ? event.reason.message : "unknown",
      "error.stack": event.reason ? event.reason.stack : ""
    }
  });
  span.end();
});
var otlpTraceExporter = new _exporterTraceOtlpHttp.OTLPTraceExporter({
  url: environment.OTEL_TRACE_URL,
  headers: environment.OTEL_HEADER,
  timeoutMillis: 10000
});
provider.addSpanProcessor(new _sdkTraceBase.SimpleSpanProcessor(otlpTraceExporter));
provider.register();
module.exports = {
  logData: ddLog,
  tracer: tracer
};
