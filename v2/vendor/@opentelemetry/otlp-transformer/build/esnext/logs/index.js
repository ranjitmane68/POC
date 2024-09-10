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


exports.createExportLogsServiceRequest = createExportLogsServiceRequest;
exports.toLogAttributes = toLogAttributes;

var _common = require('../common');

var _internal = require('../common/internal');

var _internal2 = require('../resource/internal');

function createExportLogsServiceRequest(logRecords, options) {
    var encoder = (0, _common.getOtlpEncoder)(options);
    return {
        resourceLogs: logRecordsToResourceLogs(logRecords, encoder)
    };
}
function createResourceMap(logRecords) {
    var resourceMap = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = logRecords[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var record = _step.value;
            var resource = record.resource,
                _record$instrumentati = record.instrumentationScope,
                name = _record$instrumentati.name,
                _record$instrumentati2 = _record$instrumentati.version,
                version = _record$instrumentati2 === undefined ? '' : _record$instrumentati2,
                _record$instrumentati3 = _record$instrumentati.schemaUrl,
                schemaUrl = _record$instrumentati3 === undefined ? '' : _record$instrumentati3;

            var ismMap = resourceMap.get(resource);
            if (!ismMap) {
                ismMap = new Map();
                resourceMap.set(resource, ismMap);
            }
            var ismKey = name + '@' + version + ':' + schemaUrl;
            var records = ismMap.get(ismKey);
            if (!records) {
                records = [];
                ismMap.set(ismKey, records);
            }
            records.push(record);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return resourceMap;
}
function logRecordsToResourceLogs(logRecords, encoder) {
    var resourceMap = createResourceMap(logRecords);
    return Array.from(resourceMap, function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            resource = _ref2[0],
            ismMap = _ref2[1];

        return {
            resource: (0, _internal2.createResource)(resource),
            scopeLogs: Array.from(ismMap, function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    scopeLogs = _ref4[1];

                return {
                    scope: (0, _internal.createInstrumentationScope)(scopeLogs[0].instrumentationScope),
                    logRecords: scopeLogs.map(function (log) {
                        return toLogRecord(log, encoder);
                    }),
                    schemaUrl: scopeLogs[0].instrumentationScope.schemaUrl
                };
            }),
            schemaUrl: undefined
        };
    });
}
function toLogRecord(log, encoder) {
    var _a, _b, _c;
    return {
        timeUnixNano: encoder.encodeHrTime(log.hrTime),
        observedTimeUnixNano: encoder.encodeHrTime(log.hrTimeObserved),
        severityNumber: toSeverityNumber(log.severityNumber),
        severityText: log.severityText,
        body: (0, _internal.toAnyValue)(log.body),
        attributes: toLogAttributes(log.attributes),
        droppedAttributesCount: log.droppedAttributesCount,
        flags: (_a = log.spanContext) === null || _a === void 0 ? void 0 : _a.traceFlags,
        traceId: encoder.encodeOptionalSpanContext((_b = log.spanContext) === null || _b === void 0 ? void 0 : _b.traceId),
        spanId: encoder.encodeOptionalSpanContext((_c = log.spanContext) === null || _c === void 0 ? void 0 : _c.spanId)
    };
}
function toSeverityNumber(severityNumber) {
    return severityNumber;
}
function toLogAttributes(attributes) {
    return Object.keys(attributes).map(function (key) {
        return (0, _internal.toKeyValue)(key, attributes[key]);
    });
}
//# sourceMappingURL=index.js.map