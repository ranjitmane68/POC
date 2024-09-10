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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
exports.isAttributeValue = exports.isAttributeKey = exports.sanitizeAttributes = void 0;
var api_1 = require("@opentelemetry/api");
function sanitizeAttributes(attributes) {
    var out = {};
    if ((typeof attributes === "undefined" ? "undefined" : _typeof(attributes)) !== 'object' || attributes == null) {
        return out;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.entries(attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var val = _ref2[1];

            if (!isAttributeKey(key)) {
                api_1.diag.warn("Invalid attribute key: " + key);
                continue;
            }
            if (!isAttributeValue(val)) {
                api_1.diag.warn("Invalid attribute value set for key: " + key);
                continue;
            }
            if (Array.isArray(val)) {
                out[key] = val.slice();
            } else {
                out[key] = val;
            }
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

    return out;
}
exports.sanitizeAttributes = sanitizeAttributes;
function isAttributeKey(key) {
    return typeof key === 'string' && key.length > 0;
}
exports.isAttributeKey = isAttributeKey;
function isAttributeValue(val) {
    if (val == null) {
        return true;
    }
    if (Array.isArray(val)) {
        return isHomogeneousAttributeValueArray(val);
    }
    return isValidPrimitiveAttributeValue(val);
}
exports.isAttributeValue = isAttributeValue;
function isHomogeneousAttributeValueArray(arr) {
    var type = void 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = arr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var element = _step2.value;

            // null/undefined elements are allowed
            if (element == null) continue;
            if (!type) {
                if (isValidPrimitiveAttributeValue(element)) {
                    type = typeof element === "undefined" ? "undefined" : _typeof(element);
                    continue;
                }
                // encountered an invalid primitive
                return false;
            }
            if ((typeof element === "undefined" ? "undefined" : _typeof(element)) === type) {
                continue;
            }
            return false;
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return true;
}
function isValidPrimitiveAttributeValue(val) {
    switch (typeof val === "undefined" ? "undefined" : _typeof(val)) {
        case 'number':
        case 'boolean':
        case 'string':
            return true;
    }
    return false;
}
//# sourceMappingURL=attributes.js.map