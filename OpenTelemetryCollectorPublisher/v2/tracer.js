// Import OpenTelemetry packages
import { Span, Tracer, WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
} from "@opentelemetry/semantic-conventions";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";

const provider = new WebTracerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "famwebclient",
    [SEMRESATTRS_SERVICE_NAMESPACE]: "famwebclient",
  }),
});

var environment = {
  production: false,
  OTEL_TRACE_URL: "https://devtelemetry.cchaxcess.com/v1/traces",
  OTEL_LOGS_URL: "https://devtelemetry.cchaxcess.com/v1/logs",
  OTEL_HEADER: { Authorization: "Basic YWRtaW46YWRtaW4=" },
};

const otlpExporter = new OTLPTraceExporter({
  url: environment.OTEL_TRACE_URL,
  headers: environment.OTEL_HEADER,
  timeoutMillis: 10000,
});

provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

provider.register();

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation(),
    new XMLHttpRequestInstrumentation(),
    new DocumentLoadInstrumentation(),
    new UserInteractionInstrumentation({
      eventNames: ["click", "submit"],
    }),
  ],
});

window.onerror = function (message, source, lineno, colno, error) {
  const tracer = provider.getTracer("error-tracer");

  const span = tracer.startSpan("error", {
    attributes: {
      "error.message": message,
      "error.source": source,
      "error.lineno": lineno,
      "error.colno": colno,
      "error.stack": error ? error.stack : "",
    },
  });

  span.end();
};

window.addEventListener("unhandledrejection", function (event) {
  const tracer = provider.getTracer("unhandled-rejection-tracer");

  const span = tracer.startSpan("unhandled-rejection", {
    attributes: {
      "error.message": event.reason ? event.reason.message : "unknown",
      "error.stack": event.reason ? event.reason.stack : "",
    },
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
  const span = provider.getTracer(tracerName).getCurrentSpan();

  if (span) {
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;

    console.log(`[TraceID: ${traceId}] [SpanID: ${spanId}] ${message}`);
  } else {
    console.log(message);
  }
}

module.exports = {
  getTracer: getCustomTracer,
  startSpan: startSpan,
  endSpan: endSpan,
  setAttribute: setAttribute,
  logWithTraceContext: logWithTraceContext,
};
