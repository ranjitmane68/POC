"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", { value: true });
exports.createExportTraceServiceRequest = void 0;
var internal_1 = require("./internal");
var common_1 = require("../common");
var internal_2 = require("../common/internal");
var internal_3 = require("../resource/internal");
function createExportTraceServiceRequest(spans, options) {
    var encoder = (0, common_1.getOtlpEncoder)(options);
    return {
        resourceSpans: spanRecordsToResourceSpans(spans, encoder)
    };
}
exports.createExportTraceServiceRequest = createExportTraceServiceRequest;
function createResourceMap(readableSpans) {
    var resourceMap = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = readableSpans[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var record = _step.value;

            var ilmMap = resourceMap.get(record.resource);
            if (!ilmMap) {
                ilmMap = new Map();
                resourceMap.set(record.resource, ilmMap);
            }
            // TODO this is duplicated in basic tracer. Consolidate on a common helper in core
            var instrumentationLibraryKey = record.instrumentationLibrary.name + "@" + (record.instrumentationLibrary.version || '') + ":" + (record.instrumentationLibrary.schemaUrl || '');
            var records = ilmMap.get(instrumentationLibraryKey);
            if (!records) {
                records = [];
                ilmMap.set(instrumentationLibraryKey, records);
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
function spanRecordsToResourceSpans(readableSpans, encoder) {
    var resourceMap = createResourceMap(readableSpans);
    var out = [];
    var entryIterator = resourceMap.entries();
    var entry = entryIterator.next();
    while (!entry.done) {
        var _entry$value = _slicedToArray(entry.value, 2),
            resource = _entry$value[0],
            ilmMap = _entry$value[1];

        var scopeResourceSpans = [];
        var ilmIterator = ilmMap.values();
        var ilmEntry = ilmIterator.next();
        while (!ilmEntry.done) {
            var scopeSpans = ilmEntry.value;
            if (scopeSpans.length > 0) {
                var spans = scopeSpans.map(function (readableSpan) {
                    return (0, internal_1.sdkSpanToOtlpSpan)(readableSpan, encoder);
                });
                scopeResourceSpans.push({
                    scope: (0, internal_2.createInstrumentationScope)(scopeSpans[0].instrumentationLibrary),
                    spans: spans,
                    schemaUrl: scopeSpans[0].instrumentationLibrary.schemaUrl
                });
            }
            ilmEntry = ilmIterator.next();
        }
        // TODO SDK types don't provide resource schema URL at this time
        var transformedSpans = {
            resource: (0, internal_3.createResource)(resource),
            scopeSpans: scopeResourceSpans,
            schemaUrl: undefined
        };
        out.push(transformedSpans);
        entry = entryIterator.next();
    }
    return out;
}
//# sourceMappingURL=index.js.map