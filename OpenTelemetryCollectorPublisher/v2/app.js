import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { logs } from "@opentelemetry/api-logs";
import * as logsAPI from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  HOSTARCHVALUES_ARM64,
  SEMRESATTRS_HOST_ID,
  SEMRESATTRS_HOST_NAME,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE
} from "@opentelemetry/semantic-conventions";
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

var environment = {
  production: false,
  OTEL_TRACE_URL: "https://devtelemetry.cchaxcess.com/v1/traces",
  OTEL_LOGS_URL: "https://devtelemetry.cchaxcess.com/v1/logs",
  OTEL_HEADER: { Authorization: "Basic YWRtaW46YWRtaW4=" },
};

const loggerProvider = new LoggerProvider({
   resource: new Resource({   
    'service.name': 'famwebclient',
    'service.instance.id': '627cc493-f310-47de-96bd-71410b7dec09',
      source: 'web-app',
    'host.name': 'HP-Pavilion-Laptop-14-dv1xxx', 
    'host.arch':'amd64',
    'host.type': 'n1-standard-1',
    'os.name': 'linux',
    'os.version': '6.0' ,
    'process.pid': 1,
    'process.executable.name': 'node',
    'process.command': '/usr/src/app/app.js',
    'process.command_line': '/usr/local/bin/node /usr/src/app/app.js',
    'process.runtime.version': '18.9.0',
    'process.runtime.name': 'nodejs',
    'process.runtime.description': 'Node.js',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development',
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: '123',

  })
});

loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);

loggerProvider.addLogRecordProcessor(
  new BatchLogRecordProcessor(
    new OTLPLogExporter({
      url: environment.OTEL_LOGS_URL,
      headers: environment.OTEL_HEADER,
      timeoutMillis: 10000
    })
  )
);

logs.setGlobalLoggerProvider(loggerProvider);

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
  FATAL4: 24,
};

var ddLog = function (severityText, messageBody, hostname, attr) {
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
  logData: ddLog,
};
