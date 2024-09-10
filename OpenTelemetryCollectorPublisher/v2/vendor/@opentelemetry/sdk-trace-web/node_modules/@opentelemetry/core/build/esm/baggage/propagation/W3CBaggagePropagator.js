'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.W3CBaggagePropagator = undefined;

var _api = require('@opentelemetry/api');

var _suppressTracing = require('../../trace/suppress-tracing');

var _constants = require('../constants');

var _utils = require('../utils');

/**
 * Propagates {@link Baggage} through Context format propagation.
 *
 * Based on the Baggage specification:
 * https://w3c.github.io/baggage/
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
var W3CBaggagePropagator = /** @class */function () {
    function W3CBaggagePropagator() {}
    W3CBaggagePropagator.prototype.inject = function (context, carrier, setter) {
        var baggage = _api.propagation.getBaggage(context);
        if (!baggage || (0, _suppressTracing.isTracingSuppressed)(context)) return;
        var keyPairs = (0, _utils.getKeyPairs)(baggage).filter(function (pair) {
            return pair.length <= _constants.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
        }).slice(0, _constants.BAGGAGE_MAX_NAME_VALUE_PAIRS);
        var headerValue = (0, _utils.serializeKeyPairs)(keyPairs);
        if (headerValue.length > 0) {
            setter.set(carrier, _constants.BAGGAGE_HEADER, headerValue);
        }
    };
    W3CBaggagePropagator.prototype.extract = function (context, carrier, getter) {
        var headerValue = getter.get(carrier, _constants.BAGGAGE_HEADER);
        var baggageString = Array.isArray(headerValue) ? headerValue.join(_constants.BAGGAGE_ITEMS_SEPARATOR) : headerValue;
        if (!baggageString) return context;
        var baggage = {};
        if (baggageString.length === 0) {
            return context;
        }
        var pairs = baggageString.split(_constants.BAGGAGE_ITEMS_SEPARATOR);
        pairs.forEach(function (entry) {
            var keyPair = (0, _utils.parsePairKeyValue)(entry);
            if (keyPair) {
                var baggageEntry = { value: keyPair.value };
                if (keyPair.metadata) {
                    baggageEntry.metadata = keyPair.metadata;
                }
                baggage[keyPair.key] = baggageEntry;
            }
        });
        if (Object.entries(baggage).length === 0) {
            return context;
        }
        return _api.propagation.setBaggage(context, _api.propagation.createBaggage(baggage));
    };
    W3CBaggagePropagator.prototype.fields = function () {
        return [_constants.BAGGAGE_HEADER];
    };
    return W3CBaggagePropagator;
}();
exports.W3CBaggagePropagator = W3CBaggagePropagator;
//# sourceMappingURL=W3CBaggagePropagator.js.map