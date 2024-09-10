'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createInstrumentationScope = createInstrumentationScope;
exports.toAttributes = toAttributes;
exports.toKeyValue = toKeyValue;
exports.toAnyValue = toAnyValue;
function createInstrumentationScope(scope) {
    return {
        name: scope.name,
        version: scope.version
    };
}
function toAttributes(attributes) {
    return Object.keys(attributes).map(function (key) {
        return toKeyValue(key, attributes[key]);
    });
}
function toKeyValue(key, value) {
    return {
        key: key,
        value: toAnyValue(value)
    };
}
function toAnyValue(value) {
    var t = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    if (t === 'string') return { stringValue: value };
    if (t === 'number') {
        if (!Number.isInteger(value)) return { doubleValue: value };
        return { intValue: value };
    }
    if (t === 'boolean') return { boolValue: value };
    if (value instanceof Uint8Array) return { bytesValue: value };
    if (Array.isArray(value)) return { arrayValue: { values: value.map(toAnyValue) } };
    if (t === 'object' && value != null) return {
        kvlistValue: {
            values: Object.entries(value).map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    k = _ref2[0],
                    v = _ref2[1];

                return toKeyValue(k, v);
            })
        }
    };
    return {};
}
//# sourceMappingURL=internal.js.map