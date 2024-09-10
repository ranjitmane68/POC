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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.W3CBaggagePropagator = void 0;
var api_1 = require("@opentelemetry/api");
var suppress_tracing_1 = require("../../trace/suppress-tracing");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
/**
 * Propagates {@link Baggage} through Context format propagation.
 *
 * Based on the Baggage specification:
 * https://w3c.github.io/baggage/
 */

var W3CBaggagePropagator = function () {
    function W3CBaggagePropagator() {
        _classCallCheck(this, W3CBaggagePropagator);
    }

    _createClass(W3CBaggagePropagator, [{
        key: "inject",
        value: function inject(context, carrier, setter) {
            var baggage = api_1.propagation.getBaggage(context);
            if (!baggage || (0, suppress_tracing_1.isTracingSuppressed)(context)) return;
            var keyPairs = (0, utils_1.getKeyPairs)(baggage).filter(function (pair) {
                return pair.length <= constants_1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
            }).slice(0, constants_1.BAGGAGE_MAX_NAME_VALUE_PAIRS);
            var headerValue = (0, utils_1.serializeKeyPairs)(keyPairs);
            if (headerValue.length > 0) {
                setter.set(carrier, constants_1.BAGGAGE_HEADER, headerValue);
            }
        }
    }, {
        key: "extract",
        value: function extract(context, carrier, getter) {
            var headerValue = getter.get(carrier, constants_1.BAGGAGE_HEADER);
            var baggageString = Array.isArray(headerValue) ? headerValue.join(constants_1.BAGGAGE_ITEMS_SEPARATOR) : headerValue;
            if (!baggageString) return context;
            var baggage = {};
            if (baggageString.length === 0) {
                return context;
            }
            var pairs = baggageString.split(constants_1.BAGGAGE_ITEMS_SEPARATOR);
            pairs.forEach(function (entry) {
                var keyPair = (0, utils_1.parsePairKeyValue)(entry);
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
            return api_1.propagation.setBaggage(context, api_1.propagation.createBaggage(baggage));
        }
    }, {
        key: "fields",
        value: function fields() {
            return [constants_1.BAGGAGE_HEADER];
        }
    }]);

    return W3CBaggagePropagator;
}();

exports.W3CBaggagePropagator = W3CBaggagePropagator;
//# sourceMappingURL=W3CBaggagePropagator.js.map