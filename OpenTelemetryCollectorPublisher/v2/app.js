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
import os from 'os';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { Span, Tracer, WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import crypto from 'crypto';

var algorithm = 'aes256'; 
var key = '66FC55D2141A82E3F1FF3A1F28D875BDADB1843BB22AE9EE46B665D6292844BD';

function encrypt(plainText) {
  var cipher = crypto.createCipher(algorithm, key);  
  var encrypted = cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');
  return encrypted;  
}

var encyptedTraceUrl = encrypt('https://devtelemetry.cchaxcess.com/v1/traces');
console.log(encyptedTraceUrl);
var encryptedLogsUrl = encrypt('https://devtelemetry.cchaxcess.com/v1/logs');
console.log(encryptedLogsUrl);
var encryptedAuthToken = encrypt('YWRtaW46YWRtaW4=');
console.log(encryptedAuthToken);

function decrypt (encryptedText) {
  var decipher = crypto.createDecipher(algorithm, key);
  var decrypted = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
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

var res = Resource.default().merge(new Resource({   
  [SemanticResourceAttributes.SERVICE_NAME]: 'famwebclient',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  [SemanticResourceAttributes.OS_TYPE]: os.type(),
  [SemanticResourceAttributes.HOST_NAME]: os.hostname(),
  [SemanticResourceAttributes.HOST_ARCH]: os.arch(),
  [SemanticResourceAttributes.HOST_TYPE]: os.platform(),
  [SemanticResourceAttributes.OS_NAME]: os.release(),
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "dev",
  [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: '1.0.0'}));


const loggerProvider = new LoggerProvider({
   resource: res
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

var ddLog = function (severityText, messageBody, attr) {
  var severityTextNumber = severity[severityText];
  logger.emit({
    severityNumber: severityTextNumber,
    severityText: severityText,
    body: messageBody,
    attributes: attr
  });
};


const provider = new WebTracerProvider({
  resource: res
});


var tracer = provider.getTracer("famwebclient");

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


const otlpTraceExporter = new OTLPTraceExporter({
  url: environment.OTEL_TRACE_URL,
  headers: environment.OTEL_HEADER,
  timeoutMillis: 10000,
});

provider.addSpanProcessor(new SimpleSpanProcessor(otlpTraceExporter));

provider.register();

module.exports = {
  logData: ddLog,
  tracer: tracer
};
