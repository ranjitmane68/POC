import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { SeverityNumber, logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
} from "@opentelemetry/semantic-conventions";

var environment = {
  production: false,
  API_URL: "http://localhost:7076/",
  OTEL_TRACE_URL: "https://devtelemetry.cchaxcess.com/v1/traces",
  OTEL_LOGS_URL: "https://devtelemetry.cchaxcess.com/v1/logs",
  OTEL_HEADER: { Authorization: "Basic YWRtaW46YWRtaW4=" },
};

var loggerProvider = new LoggerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "famwebclient",
    [SEMRESATTRS_SERVICE_NAMESPACE]: "famwebclient",
  }),
});

loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);

loggerProvider.addLogRecordProcessor(
  new BatchLogRecordProcessor(
    new OTLPLogExporter({
      url: environment.OTEL_LOGS_URL,
      headers: environment.OTEL_HEADER,
      timeoutMillis: 10000,
    })
  )
);

logs.setGlobalLoggerProvider(loggerProvider);

var logger = loggerProvider.getLogger("default", "1.0.0");

var ddLog = function (logType, messageBody, msg, attr) {
  console.log(msg);
  logger.emit({
    severityNumber: logType,
    severityText: SeverityNumber[logType],
    body: messageBody,
    attributes: attr,
  });
};

module.exports = {
  logData: ddLog,
};
