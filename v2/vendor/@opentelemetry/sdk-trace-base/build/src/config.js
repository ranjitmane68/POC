"use strict";
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

Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSamplerFromEnv = exports.loadDefaultConfig = void 0;
var api_1 = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");
var AlwaysOffSampler_1 = require("./sampler/AlwaysOffSampler");
var AlwaysOnSampler_1 = require("./sampler/AlwaysOnSampler");
var ParentBasedSampler_1 = require("./sampler/ParentBasedSampler");
var TraceIdRatioBasedSampler_1 = require("./sampler/TraceIdRatioBasedSampler");
var env = (0, core_1.getEnv)();
var FALLBACK_OTEL_TRACES_SAMPLER = core_1.TracesSamplerValues.AlwaysOn;
var DEFAULT_RATIO = 1;
/**
 * Load default configuration. For fields with primitive values, any user-provided
 * value will override the corresponding default value. For fields with
 * non-primitive values (like `spanLimits`), the user-provided value will be
 * used to extend the default value.
 */
// object needs to be wrapped in this function and called when needed otherwise
// envs are parsed before tests are ran - causes tests using these envs to fail
function loadDefaultConfig() {
    return {
        sampler: buildSamplerFromEnv(env),
        forceFlushTimeoutMillis: 30000,
        generalLimits: {
            attributeValueLengthLimit: (0, core_1.getEnv)().OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT,
            attributeCountLimit: (0, core_1.getEnv)().OTEL_ATTRIBUTE_COUNT_LIMIT
        },
        spanLimits: {
            attributeValueLengthLimit: (0, core_1.getEnv)().OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT,
            attributeCountLimit: (0, core_1.getEnv)().OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT,
            linkCountLimit: (0, core_1.getEnv)().OTEL_SPAN_LINK_COUNT_LIMIT,
            eventCountLimit: (0, core_1.getEnv)().OTEL_SPAN_EVENT_COUNT_LIMIT,
            attributePerEventCountLimit: (0, core_1.getEnv)().OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
            attributePerLinkCountLimit: (0, core_1.getEnv)().OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT
        }
    };
}
exports.loadDefaultConfig = loadDefaultConfig;
/**
 * Based on environment, builds a sampler, complies with specification.
 * @param environment optional, by default uses getEnv(), but allows passing a value to reuse parsed environment
 */
function buildSamplerFromEnv() {
    var environment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, core_1.getEnv)();

    switch (environment.OTEL_TRACES_SAMPLER) {
        case core_1.TracesSamplerValues.AlwaysOn:
            return new AlwaysOnSampler_1.AlwaysOnSampler();
        case core_1.TracesSamplerValues.AlwaysOff:
            return new AlwaysOffSampler_1.AlwaysOffSampler();
        case core_1.TracesSamplerValues.ParentBasedAlwaysOn:
            return new ParentBasedSampler_1.ParentBasedSampler({
                root: new AlwaysOnSampler_1.AlwaysOnSampler()
            });
        case core_1.TracesSamplerValues.ParentBasedAlwaysOff:
            return new ParentBasedSampler_1.ParentBasedSampler({
                root: new AlwaysOffSampler_1.AlwaysOffSampler()
            });
        case core_1.TracesSamplerValues.TraceIdRatio:
            return new TraceIdRatioBasedSampler_1.TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment));
        case core_1.TracesSamplerValues.ParentBasedTraceIdRatio:
            return new ParentBasedSampler_1.ParentBasedSampler({
                root: new TraceIdRatioBasedSampler_1.TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment))
            });
        default:
            api_1.diag.error("OTEL_TRACES_SAMPLER value \"" + environment.OTEL_TRACES_SAMPLER + " invalid, defaulting to " + FALLBACK_OTEL_TRACES_SAMPLER + "\".");
            return new AlwaysOnSampler_1.AlwaysOnSampler();
    }
}
exports.buildSamplerFromEnv = buildSamplerFromEnv;
function getSamplerProbabilityFromEnv(environment) {
    if (environment.OTEL_TRACES_SAMPLER_ARG === undefined || environment.OTEL_TRACES_SAMPLER_ARG === '') {
        api_1.diag.error("OTEL_TRACES_SAMPLER_ARG is blank, defaulting to " + DEFAULT_RATIO + ".");
        return DEFAULT_RATIO;
    }
    var probability = Number(environment.OTEL_TRACES_SAMPLER_ARG);
    if (isNaN(probability)) {
        api_1.diag.error("OTEL_TRACES_SAMPLER_ARG=" + environment.OTEL_TRACES_SAMPLER_ARG + " was given, but it is invalid, defaulting to " + DEFAULT_RATIO + ".");
        return DEFAULT_RATIO;
    }
    if (probability < 0 || probability > 1) {
        api_1.diag.error("OTEL_TRACES_SAMPLER_ARG=" + environment.OTEL_TRACES_SAMPLER_ARG + " was given, but it is out of range ([0..1]), defaulting to " + DEFAULT_RATIO + ".");
        return DEFAULT_RATIO;
    }
    return probability;
}
//# sourceMappingURL=config.js.map