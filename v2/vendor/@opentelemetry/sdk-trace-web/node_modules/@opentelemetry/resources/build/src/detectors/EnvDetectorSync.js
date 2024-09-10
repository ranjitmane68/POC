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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.envDetectorSync = void 0;
var api_1 = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var Resource_1 = require("../Resource");
/**
 * EnvDetectorSync can be used to detect the presence of and create a Resource
 * from the OTEL_RESOURCE_ATTRIBUTES environment variable.
 */

var EnvDetectorSync = function () {
    function EnvDetectorSync() {
        _classCallCheck(this, EnvDetectorSync);

        // Type, attribute keys, and attribute values should not exceed 256 characters.
        this._MAX_LENGTH = 255;
        // OTEL_RESOURCE_ATTRIBUTES is a comma-separated list of attributes.
        this._COMMA_SEPARATOR = ',';
        // OTEL_RESOURCE_ATTRIBUTES contains key value pair separated by '='.
        this._LABEL_KEY_VALUE_SPLITTER = '=';
        this._ERROR_MESSAGE_INVALID_CHARS = 'should be a ASCII string with a length greater than 0 and not exceed ' + this._MAX_LENGTH + ' characters.';
        this._ERROR_MESSAGE_INVALID_VALUE = 'should be a ASCII string with a length not exceed ' + this._MAX_LENGTH + ' characters.';
    }
    /**
     * Returns a {@link Resource} populated with attributes from the
     * OTEL_RESOURCE_ATTRIBUTES environment variable. Note this is an async
     * function to conform to the Detector interface.
     *
     * @param config The resource detection config
     */


    _createClass(EnvDetectorSync, [{
        key: "detect",
        value: function detect(_config) {
            var attributes = {};
            var env = (0, core_1.getEnv)();
            var rawAttributes = env.OTEL_RESOURCE_ATTRIBUTES;
            var serviceName = env.OTEL_SERVICE_NAME;
            if (rawAttributes) {
                try {
                    var parsedAttributes = this._parseResourceAttributes(rawAttributes);
                    Object.assign(attributes, parsedAttributes);
                } catch (e) {
                    api_1.diag.debug("EnvDetector failed: " + e.message);
                }
            }
            if (serviceName) {
                attributes[semantic_conventions_1.SEMRESATTRS_SERVICE_NAME] = serviceName;
            }
            return new Resource_1.Resource(attributes);
        }
        /**
         * Creates an attribute map from the OTEL_RESOURCE_ATTRIBUTES environment
         * variable.
         *
         * OTEL_RESOURCE_ATTRIBUTES: A comma-separated list of attributes describing
         * the source in more detail, e.g. “key1=val1,key2=val2”. Domain names and
         * paths are accepted as attribute keys. Values may be quoted or unquoted in
         * general. If a value contains whitespace, =, or " characters, it must
         * always be quoted.
         *
         * @param rawEnvAttributes The resource attributes as a comma-separated list
         * of key/value pairs.
         * @returns The sanitized resource attributes.
         */

    }, {
        key: "_parseResourceAttributes",
        value: function _parseResourceAttributes(rawEnvAttributes) {
            if (!rawEnvAttributes) return {};
            var attributes = {};
            var rawAttributes = rawEnvAttributes.split(this._COMMA_SEPARATOR, -1);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = rawAttributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var rawAttribute = _step.value;

                    var keyValuePair = rawAttribute.split(this._LABEL_KEY_VALUE_SPLITTER, -1);
                    if (keyValuePair.length !== 2) {
                        continue;
                    }

                    var _keyValuePair = _slicedToArray(keyValuePair, 2),
                        key = _keyValuePair[0],
                        value = _keyValuePair[1];
                    // Leading and trailing whitespaces are trimmed.


                    key = key.trim();
                    value = value.trim().split(/^"|"$/).join('');
                    if (!this._isValidAndNotEmpty(key)) {
                        throw new Error("Attribute key " + this._ERROR_MESSAGE_INVALID_CHARS);
                    }
                    if (!this._isValid(value)) {
                        throw new Error("Attribute value " + this._ERROR_MESSAGE_INVALID_VALUE);
                    }
                    attributes[key] = decodeURIComponent(value);
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

            return attributes;
        }
        /**
         * Determines whether the given String is a valid printable ASCII string with
         * a length not exceed _MAX_LENGTH characters.
         *
         * @param str The String to be validated.
         * @returns Whether the String is valid.
         */

    }, {
        key: "_isValid",
        value: function _isValid(name) {
            return name.length <= this._MAX_LENGTH && this._isBaggageOctetString(name);
        }
        // https://www.w3.org/TR/baggage/#definition

    }, {
        key: "_isBaggageOctetString",
        value: function _isBaggageOctetString(str) {
            for (var i = 0; i < str.length; i++) {
                var ch = str.charCodeAt(i);
                if (ch < 0x21 || ch === 0x2c || ch === 0x3b || ch === 0x5c || ch > 0x7e) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Determines whether the given String is a valid printable ASCII string with
         * a length greater than 0 and not exceed _MAX_LENGTH characters.
         *
         * @param str The String to be validated.
         * @returns Whether the String is valid and not empty.
         */

    }, {
        key: "_isValidAndNotEmpty",
        value: function _isValidAndNotEmpty(str) {
            return str.length > 0 && this._isValid(str);
        }
    }]);

    return EnvDetectorSync;
}();

exports.envDetectorSync = new EnvDetectorSync();
//# sourceMappingURL=EnvDetectorSync.js.map