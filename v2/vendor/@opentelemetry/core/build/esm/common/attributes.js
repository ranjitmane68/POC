"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.sanitizeAttributes = sanitizeAttributes;
exports.isAttributeKey = isAttributeKey;
exports.isAttributeValue = isAttributeValue;

var _api = require("@opentelemetry/api");

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
var __values = undefined && undefined.__values || function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
        m = s && o[s],
        i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function next() {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
function sanitizeAttributes(attributes) {
    var e_1, _a;
    var out = {};
    if ((typeof attributes === "undefined" ? "undefined" : _typeof(attributes)) !== 'object' || attributes == null) {
        return out;
    }
    try {
        for (var _b = __values(Object.entries(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2),
                key = _d[0],
                val = _d[1];
            if (!isAttributeKey(key)) {
                _api.diag.warn("Invalid attribute key: " + key);
                continue;
            }
            if (!isAttributeValue(val)) {
                _api.diag.warn("Invalid attribute value set for key: " + key);
                continue;
            }
            if (Array.isArray(val)) {
                out[key] = val.slice();
            } else {
                out[key] = val;
            }
        }
    } catch (e_1_1) {
        e_1 = { error: e_1_1 };
    } finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
            if (e_1) throw e_1.error;
        }
    }
    return out;
}
function isAttributeKey(key) {
    return typeof key === 'string' && key.length > 0;
}
function isAttributeValue(val) {
    if (val == null) {
        return true;
    }
    if (Array.isArray(val)) {
        return isHomogeneousAttributeValueArray(val);
    }
    return isValidPrimitiveAttributeValue(val);
}
function isHomogeneousAttributeValueArray(arr) {
    var e_2, _a;
    var type;
    try {
        for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
            var element = arr_1_1.value;
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
    } catch (e_2_1) {
        e_2 = { error: e_2_1 };
    } finally {
        try {
            if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) _a.call(arr_1);
        } finally {
            if (e_2) throw e_2.error;
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