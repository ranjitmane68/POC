'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /*
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


exports.serializeKeyPairs = serializeKeyPairs;
exports.getKeyPairs = getKeyPairs;
exports.parsePairKeyValue = parsePairKeyValue;
exports.parseKeyPairsIntoRecord = parseKeyPairsIntoRecord;

var _api = require('@opentelemetry/api');

var _constants = require('./constants');

function serializeKeyPairs(keyPairs) {
    return keyPairs.reduce(function (hValue, current) {
        var value = '' + hValue + (hValue !== '' ? _constants.BAGGAGE_ITEMS_SEPARATOR : '') + current;
        return value.length > _constants.BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
    }, '');
}
function getKeyPairs(baggage) {
    return baggage.getAllEntries().map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        var entry = encodeURIComponent(key) + '=' + encodeURIComponent(value.value);
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
    var metadata = void 0;
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