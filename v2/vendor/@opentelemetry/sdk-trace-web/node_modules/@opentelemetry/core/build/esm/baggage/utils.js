"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.serializeKeyPairs = serializeKeyPairs;
exports.getKeyPairs = getKeyPairs;
exports.parsePairKeyValue = parsePairKeyValue;
exports.parseKeyPairsIntoRecord = parseKeyPairsIntoRecord;

var _api = require("@opentelemetry/api");

var _constants = require("./constants");

var __read = undefined && undefined.__read || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
};
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
function serializeKeyPairs(keyPairs) {
    return keyPairs.reduce(function (hValue, current) {
        var value = "" + hValue + (hValue !== '' ? _constants.BAGGAGE_ITEMS_SEPARATOR : '') + current;
        return value.length > _constants.BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
    }, '');
}
function getKeyPairs(baggage) {
    return baggage.getAllEntries().map(function (_a) {
        var _b = __read(_a, 2),
            key = _b[0],
            value = _b[1];
        var entry = encodeURIComponent(key) + "=" + encodeURIComponent(value.value);
        // include opaque metadata if provided
        // NOTE: we intentionally don't URI-encode the metadata - that responsibility falls on the metadata implementation
        if (value.metadata !== undefined) {
            entry += _constants.BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
        }
        return entry;
    });
}
function parsePairKeyValue(entry) {
    var valueProps = entry.split(_constants.BAGGAGE_PROPERTIES_SEPARATOR);
    if (valueProps.length <= 0) return;
    var keyPairPart = valueProps.shift();
    if (!keyPairPart) return;
    var separatorIndex = keyPairPart.indexOf(_constants.BAGGAGE_KEY_PAIR_SEPARATOR);
    if (separatorIndex <= 0) return;
    var key = decodeURIComponent(keyPairPart.substring(0, separatorIndex).trim());
    var value = decodeURIComponent(keyPairPart.substring(separatorIndex + 1).trim());
    var metadata;
    if (valueProps.length > 0) {
        metadata = (0, _api.baggageEntryMetadataFromString)(valueProps.join(_constants.BAGGAGE_PROPERTIES_SEPARATOR));
    }
    return { key: key, value: value, metadata: metadata };
}
/**
 * Parse a string serialized in the baggage HTTP Format (without metadata):
 * https://github.com/w3c/baggage/blob/master/baggage/HTTP_HEADER_FORMAT.md
 */
function parseKeyPairsIntoRecord(value) {
    if (typeof value !== 'string' || value.length === 0) return {};
    return value.split(_constants.BAGGAGE_ITEMS_SEPARATOR).map(function (entry) {
        return parsePairKeyValue(entry);
    }).filter(function (keyPair) {
        return keyPair !== undefined && keyPair.value.length > 0;
    }).reduce(function (headers, keyPair) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        headers[keyPair.key] = keyPair.value;
        return headers;
    }, {});
}
//# sourceMappingURL=utils.js.map