import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { Logger, SeverityNumber, logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
} from "@opentelemetry/semantic-conventions";
import type * as logsAPI from "@opentelemetry/api-logs";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  private logger: Logger;

  constructor() {
    this.logger = this.getLoggerService();
  }

  public shareData = new Subject<SharedData>();

  private getLoggerService(): Logger {
    const loggerProvider = new LoggerProvider({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: "angular-observability",
        [SEMRESATTRS_SERVICE_NAMESPACE]: "angular-observability",
      }),
    });

    loggerProvider.addLogRecordProcessor(
      new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
    );

    loggerProvider.addLogRecordProcessor(
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: environment.OTEL_LOGS_URL, // URL of dev server
          headers: environment.OTEL_HEADER,
          timeoutMillis: 10000,
        })
      )
    );

    logs.setGlobalLoggerProvider(loggerProvider);

    return loggerProvider.getLogger("default", "1.0.0");
  }

  //Below function implements the actual logging.
  //This function accepts the Severity whether its Error/Info/Warn etc, and next parameter accepts log text to be logged. Last parameter accepts custom attributes which needs to be added tp logs
  logData(
    logType: logsAPI.SeverityNumber,
    messageBody: string,
    attributes: logsAPI.LogAttributes
  ) {
    this.logger.emit({
      severityNumber: logType,
      severityText: SeverityNumber[logType],
      body: messageBody,
      attributes: attributes,
    });
  }
}

export declare interface SharedData {
  error?: HttpErrorResponse;
}
