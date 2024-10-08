'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadDefaultConfig = loadDefaultConfig;
exports.buildSamplerFromEnv = buildSamplerFromEnv;

var _api = require('@opentelemetry/api');

var _core = require('@opentelemetry/core');

var _AlwaysOffSampler = require('./sampler/AlwaysOffSampler');

var _AlwaysOnSampler = require('./sampler/AlwaysOnSampler');

var _ParentBasedSampler = require('./sampler/ParentBasedSampler');

var _TraceIdRatioBasedSampler = require('./sampler/TraceIdRatioBasedSampler');

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
var env = (0, _core.getEnv)();
var FALLBACK_OTEL_TRACES_SAMPLER = _core.TracesSamplerValues.AlwaysOn;
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
            attributeValueLengthLimit: (0, _core.getEnv)().OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT,
            attributeCountLimit: (0, _core.getEnv)().OTEL_ATTRIBUTE_COUNT_LIMIT
        },
        spanLimits: {
            attributeValueLengthLimit: (0, _core.getEnv)().OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT,
            attributeCountLimit: (0, _core.getEnv)().OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT,
            linkCountLimit: (0, _core.getEnv)().OTEL_SPAN_LINK_COUNT_LIMIT,
            eventCountLimit: (0, _core.getEnv)().OTEL_SPAN_EVENT_COUNT_LIMIT,
            attributePerEventCountLimit: (0, _core.getEnv)().OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
            attributePerLinkCountLimit: (0, _core.getEnv)().OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT
        }
    };
}
/**
 * Based on environment, builds a sampler, complies with specification.
 * @param environment optional, by default uses getEnv(), but allows passing a value to reuse parsed environment
 */
function buildSamplerFromEnv(environment) {
    if (environment === void 0) {
        environment = (0, _core.getEnv)();
    }
    switch (environment.OTEL_TRACES_SAMPLER) {
        case _core.TracesSamplerValues.AlwaysOn:
            return new _AlwaysOnSampler.AlwaysOnSampler();
        case _core.TracesSamplerValues.AlwaysOff:
            return new _AlwaysOffSampler.AlwaysOffSampler();
        case _core.TracesSamplerValues.ParentBasedAlwaysOn:
            return new _ParentBasedSampler.ParentBasedSampler({
                root: new _AlwaysOnSampler.AlwaysOnSampler()
            });
        case _core.TracesSamplerValues.ParentBasedAlwaysOff:
            return new _ParentBasedSampler.ParentBasedSampler({
                root: new _AlwaysOffSampler.AlwaysOffSampler()
            });
        case _core.TracesSamplerValues.TraceIdRatio:
            return new _TraceIdRatioBasedSampler.TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment));
        case _core.TracesSamplerValues.ParentBasedTraceIdRatio:
            return new _ParentBasedSampler.ParentBasedSampler({
                root: new _TraceIdRatioBasedSampler.TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment))
            });
        default:
            _api.diag.error("OTEL_TRACES_SAMPLER value \"" + environment.OTEL_TRACES_SAMPLER + " invalid, defaulting to " + FALLBACK_OTEL_TRACES_SAMPLER + "\".");
            return new _AlwaysOnSampler.AlwaysOnSampler();
    }
}
function getSamplerProbabilityFromEnv(environment) {
    if (environment.OTEL_TRACES_SAMPLER_ARG === undefined || environment.OTEL_TRACES_SAMPLER_ARG === '') {
        _api.diag.error("OTEL_TRACES_SAMPLER_ARG is blank, defaulting to " + DEFAULT_RATIO + ".");
        return DEFAULT_RATIO;
    }
    var probability = Number(environment.OTEL_TRACES_SAMPLER_ARG);
    if (isNaN(probability)) {
        _api.diag.error("OTEL_TRACES_SAMPLER_ARG=" + environment.OTEL_TRACES_SAMPLER_ARG + " was given, but it is invalid, defaulting to " + DEFAULT_RATIO + ".");
        return DEFAULT_RATIO;
    }
    if (probability < 0 || probability > 1) {
        _api.diag.error("OTEL_TRACES_SAMPLER_ARG=" + environment.OTEL_TRACES_SAMPLER_ARG + " was given, but it is out of range ([0..1]), defaulting to " + DEFAULT_RATIO + ".");
        return DEFAULT_RATIO;
    }
    return probability;
}
//# sourceMappingURL=config.js.map