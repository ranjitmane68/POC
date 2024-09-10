'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ParentBasedSampler = undefined;

var _api = require('@opentelemetry/api');

var _globalErrorHandler = require('../../common/global-error-handler');

var _AlwaysOffSampler = require('./AlwaysOffSampler');

var _AlwaysOnSampler = require('./AlwaysOnSampler');

/**
 * @deprecated Use the one defined in @opentelemetry/sdk-trace-base instead.
 * A composite sampler that either respects the parent span's sampling decision
 * or delegates to `delegateSampler` for root spans.
 */
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
var ParentBasedSampler = /** @class */function () {
    function ParentBasedSampler(config) {
        var _a, _b, _c, _d;
        this._root = config.root;
        if (!this._root) {
            (0, _globalErrorHandler.globalErrorHandler)(new Error('ParentBasedSampler must have a root sampler configured'));
            this._root = new _AlwaysOnSampler.AlwaysOnSampler();
        }
        this._remoteParentSampled = (_a = config.remoteParentSampled) !== null && _a !== void 0 ? _a : new _AlwaysOnSampler.AlwaysOnSampler();
        this._remoteParentNotSampled = (_b = config.remoteParentNotSampled) !== null && _b !== void 0 ? _b : new _AlwaysOffSampler.AlwaysOffSampler();
        this._localParentSampled = (_c = config.localParentSampled) !== null && _c !== void 0 ? _c : new _AlwaysOnSampler.AlwaysOnSampler();
        this._localParentNotSampled = (_d = config.localParentNotSampled) !== null && _d !== void 0 ? _d : new _AlwaysOffSampler.AlwaysOffSampler();
    }
    ParentBasedSampler.prototype.shouldSample = function (context, traceId, spanName, spanKind, attributes, links) {
        var parentContext = _api.trace.getSpanContext(context);
        if (!parentContext || !(0, _api.isSpanContextValid)(parentContext)) {
            return this._root.shouldSample(context, traceId, spanName, spanKind, attributes, links);
        }
        if (parentContext.isRemote) {
            if (parentContext.traceFlags & _api.TraceFlags.SAMPLED) {
                return this._remoteParentSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
            }
            return this._remoteParentNotSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
        }
        if (parentContext.traceFlags & _api.TraceFlags.SAMPLED) {
            return this._localParentSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
        }
        return this._localParentNotSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
    };
    ParentBasedSampler.prototype.toString = function () {
        return "ParentBased{root=" + this._root.toString() + ", remoteParentSampled=" + this._remoteParentSampled.toString() + ", remoteParentNotSampled=" + this._remoteParentNotSampled.toString() + ", localParentSampled=" + this._localParentSampled.toString() + ", localParentNotSampled=" + this._localParentNotSampled.toString() + "}";
    };
    return ParentBasedSampler;
}();
exports.ParentBasedSampler = ParentBasedSampler;
//# sourceMappingURL=ParentBasedSampler.js.map