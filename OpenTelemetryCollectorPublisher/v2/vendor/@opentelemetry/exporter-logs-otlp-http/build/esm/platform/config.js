'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_COLLECTOR_URL = undefined;
exports.getDefaultUrl = getDefaultUrl;

var _core = require('@opentelemetry/core');

var _otlpExporterBase = require('@opentelemetry/otlp-exporter-base');

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DEFAULT_COLLECTOR_RESOURCE_PATH = 'v1/logs';
var DEFAULT_COLLECTOR_URL = exports.DEFAULT_COLLECTOR_URL = "http://localhost:4318/" + DEFAULT_COLLECTOR_RESOURCE_PATH;
/**
 * common get default url
 * @param config exporter config
 * @returns url string
 */
function getDefaultUrl(config) {
  return typeof config.url === 'string' ? config.url : (0, _core.getEnv)().OTEL_EXPORTER_OTLP_LOGS_ENDPOINT.length > 0 ? (0, _otlpExporterBase.appendRootPathToUrlIfNeeded)((0, _core.getEnv)().OTEL_EXPORTER_OTLP_LOGS_ENDPOINT) : (0, _core.getEnv)().OTEL_EXPORTER_OTLP_ENDPOINT.length > 0 ? (0, _otlpExporterBase.appendResourcePathToUrl)((0, _core.getEnv)().OTEL_EXPORTER_OTLP_ENDPOINT, DEFAULT_COLLECTOR_RESOURCE_PATH) : DEFAULT_COLLECTOR_URL;
}
//# sourceMappingURL=config.js.map