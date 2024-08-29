import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SeverityNumber, logs } from "@opentelemetry/api-logs";
import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
} from "@opentelemetry/semantic-conventions";
const collectorOptions = {
  url: "http://localhost:4318/v1/traces", // url is optional and can be omitted - default is http://localhost:4318/v1/traces
  headers: {}, // an optional object containing custom headers to be sent with each request
  concurrencyLimit: 10, // an optional limit on pending requests
};

//const provider = new WebTracerProvider();
const exporter = new OTLPTraceExporter(collectorOptions);

const loggerProvider = new LoggerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "angular-otel-observability",
    [SEMRESATTRS_SERVICE_NAMESPACE]: "angular-otel-observability",
  }),
});
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);

loggerProvider.addLogRecordProcessor(
  new BatchLogRecordProcessor(
    new OTLPLogExporter({
      //url: "http://localhost:4318/v1/logs", // URL of dev server
      url: "http://localhost:4318/v1/logs", // URL of dev server
      headers: { Authorization: "Basic YWRtaW46YWRtaW4=" },
      timeoutMillis: 10000,
    })
  )
);

logs.setGlobalLoggerProvider(loggerProvider);

loggerProvider.getLogger("default", "1.0.0").emit({
  body: "Testing message body 987654321",
  attributes: "Testing attributes",
});

// Register the provider globally
//provider.register();

console.log("OpenTelemetry initialized with Datadog exporter");
