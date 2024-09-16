"use strict";

var _sdkTraceWeb = require("@opentelemetry/sdk-trace-web");
var _sdkTraceBase = require("@opentelemetry/sdk-trace-base");
var _instrumentation = require("@opentelemetry/instrumentation");
var _instrumentationFetch = require("@opentelemetry/instrumentation-fetch");
var _instrumentationXmlHttpRequest = require("@opentelemetry/instrumentation-xml-http-request");
var _instrumentationDocumentLoad = require("@opentelemetry/instrumentation-document-load");
var _exporterTraceOtlpHttp = require("@opentelemetry/exporter-trace-otlp-http");
var _resources = require("@opentelemetry/resources");
var _semanticConventions = require("@opentelemetry/semantic-conventions");
var _instrumentationUserInteraction = require("@opentelemetry/instrumentation-user-interaction");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // Import OpenTelemetry packages
var provider = new _sdkTraceWeb.WebTracerProvider({
  resource: new _resources.Resource(_defineProperty(_defineProperty({}, _semanticConventions.SEMRESATTRS_SERVICE_NAME, "famwebclient"), _semanticConventions.SEMRESATTRS_SERVICE_NAMESPACE, "famwebclient"))
});
var environment = {
  production: false,
  OTEL_TRACE_URL: "https://devtelemetry.cchaxcess.com/v1/traces",
  OTEL_LOGS_URL: "https://devtelemetry.cchaxcess.com/v1/logs",
  OTEL_HEADER: {
    Authorization: "Basic YWRtaW46YWRtaW4="
  }
};
var otlpExporter = new _exporterTraceOtlpHttp.OTLPTraceExporter({
  url: environment.OTEL_TRACE_URL,
  headers: environment.OTEL_HEADER,
  timeoutMillis: 10000
});
provider.addSpanProcessor(new _sdkTraceBase.SimpleSpanProcessor(otlpExporter));
provider.register();
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
var customTracer;
var customSpan;
function getCustomTracer(tracerName) {
  customTracer = provider.getTracer(tracerName);
  return customTracer;
}
function startSpan(spanName) {
  customSpan = customTracer.startSpan(spanName);
  return customSpan;
}
function endSpan() {
  customSpan.end();
}
function setAttribute(attr, value) {
  customSpan.setAttribute(attr, value);
}

// Custom logger that includes trace and span context
function logWithTraceContext(tracerName, message) {
  // Get the active tracer and span
  var span = provider.getTracer(tracerName).getCurrentSpan();
  if (span) {
    var traceId = span.spanContext().traceId;
    var spanId = span.spanContext().spanId;
    console.log("[TraceID: ".concat(traceId, "] [SpanID: ").concat(spanId, "] ").concat(message));
  } else {
    console.log(message);
  }
}
module.exports = {
  getTracer: getCustomTracer,
  startSpan: startSpan,
  endSpan: endSpan,
  setAttribute: setAttribute,
  logWithTraceContext: logWithTraceContext
};
