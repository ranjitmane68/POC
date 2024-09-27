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

// Example usage
var key64 = '23A6AB1AD0A65E719689FF714BF62464487BF0CA655C7C75704E7DAAD3DFDD63';
var encryptedTraceUrl = '6mKephgC7JJvQOZZnyzxcg==:KFEwzy90Dx5orANyCNKMmXmUE4PCMmEabO8LDV+oLC4FlsRaWzjsMoTiJ8t+iX1y'; 
var encryptedLogsUrl = 'HG+n75rakLyzVECuQfaiKA==:xPBX8t2NWgTm0IyTxVpR/Qb4jtmt9qEwWvf2vtUeiOKjqwWeEr2Di2mtjEJg9BnF'; 
var encryptedBasicAuthToken = 'dClFnHesQoyb25upxDG+QA==:BA+FzLlv0KhcjkPJmzcNRCMpVYZU6s7KbQy68UOGrEg='; 


// Function to decrypt AES-256-CBC encrypted text
function decryptAES(encryptedText, key64) {
    // Split the encrypted text into IV and ciphertext
    const [ivBase64, encryptedBase64] = encryptedText.split(':');

    // Decode Base64 strings to byte arrays
    const iv = Buffer.from(ivBase64, 'base64');
    const encrypted = Buffer.from(encryptedBase64, 'base64');

    // Truncate the key to 32 bytes (AES-256 key size)
    const key = Buffer.from(key64.slice(0, 32), 'utf-8');

    // Create a decipher object
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(true);

    // Decrypt the ciphertext
    let decrypted = decipher.update(encrypted, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}


const decryptedMessage1 = decryptAES(encryptedTraceUrl, key64);
console.log('Decrypted message:', decryptedMessage1);

const decryptedMessage2 = decryptAES(encryptedLogsUrl, key64);
console.log('Decrypted message:', decryptedMessage2);

const decryptedMessage3 = decryptAES(encryptedBasicAuthToken, key64);
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
