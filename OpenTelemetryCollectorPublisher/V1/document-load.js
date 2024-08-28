import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { SeverityNumber, logs, type } from "@opentelemetry/api-logs";
import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
} from "@opentelemetry/semantic-conventions";
import { LogsAPI } from "@opentelemetry/api-logs/build/src/api/logs";

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
      url: "http://localhost:4318/v1/logs", // URL of dev server
      headers: { Authorization: "Basic YWRtaW46YWRtaW4=" },
      timeoutMillis: 10000,
    })
  )
);

logs.setGlobalLoggerProvider(loggerProvider);

loggerProvider.getLogger("default", "1.0.0").emit({
  severityNumber: SeverityNumber.DEBUG,
  severityText: SeverityNumber[SeverityNumber.DEBUG],
  body: "Logs with SeverityNumber.DEBUG from Sample AngularJS App",
  attributes: "Testing attributes",
});
loggerProvider.getLogger("default", "1.0.0").log();

console.log("OpenTelemetry initialized with Datadog exporter", Date.now());
