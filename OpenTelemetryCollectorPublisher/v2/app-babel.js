"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// Example usage
var key64 = '23A6AB1AD0A65E719689FF714BF62464487BF0CA655C7C75704E7DAAD3DFDD63';
var encryptedTraceUrl = '6mKephgC7JJvQOZZnyzxcg==:KFEwzy90Dx5orANyCNKMmXmUE4PCMmEabO8LDV+oLC4FlsRaWzjsMoTiJ8t+iX1y';
var encryptedLogsUrl = 'HG+n75rakLyzVECuQfaiKA==:xPBX8t2NWgTm0IyTxVpR/Qb4jtmt9qEwWvf2vtUeiOKjqwWeEr2Di2mtjEJg9BnF';
var encryptedBasicAuthToken = 'dClFnHesQoyb25upxDG+QA==:BA+FzLlv0KhcjkPJmzcNRCMpVYZU6s7KbQy68UOGrEg=';

// Function to decrypt AES-256-CBC encrypted text
function decryptAES(encryptedText, key64) {
  // Split the encrypted text into IV and ciphertext
  var _encryptedText$split = encryptedText.split(':'),
    _encryptedText$split2 = _slicedToArray(_encryptedText$split, 2),
    ivBase64 = _encryptedText$split2[0],
    encryptedBase64 = _encryptedText$split2[1];

  // Decode Base64 strings to byte arrays
  var iv = Buffer.from(ivBase64, 'base64');
  var encrypted = Buffer.from(encryptedBase64, 'base64');

  // Truncate the key to 32 bytes (AES-256 key size)
  var key = Buffer.from(key64.slice(0, 32), 'utf-8');

  // Create a decipher object
  var decipher = _crypto["default"].createDecipheriv('aes-256-cbc', key, iv);
  decipher.setAutoPadding(true);

  // Decrypt the ciphertext
  var decrypted = decipher.update(encrypted, 'base64', 'utf-8');
  decrypted += decipher["final"]('utf-8');
  return decrypted;
}
var decryptedMessage1 = decryptAES(encryptedTraceUrl, key64);
console.log('Decrypted message:', decryptedMessage1);
var decryptedMessage2 = decryptAES(encryptedLogsUrl, key64);
console.log('Decrypted message:', decryptedMessage2);
var decryptedMessage3 = decryptAES(encryptedBasicAuthToken, key64);
console.log('Decrypted message:', decryptedMessage3);
var authToken = 'basic ' + decryptedMessage3;
var environment = {
  production: false,
  OTEL_TRACE_URL: decryptedMessage1,
  OTEL_LOGS_URL: decryptedMessage2,
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
