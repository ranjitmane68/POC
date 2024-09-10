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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
var api_1 = require("@opentelemetry/api");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var core_1 = require("@opentelemetry/core");
var platform_1 = require("./platform");
/**
 * A Resource describes the entity for which a signals (metrics or trace) are
 * collected.
 */

var Resource = function () {
    function Resource(
    /**
     * A dictionary of attributes with string keys and values that provide
     * information about the entity as numbers, strings or booleans
     * TODO: Consider to add check/validation on attributes.
     */
    attributes, asyncAttributesPromise) {
        var _this = this;

        _classCallCheck(this, Resource);

        var _a;
        this._attributes = attributes;
        this.asyncAttributesPending = asyncAttributesPromise != null;
        this._syncAttributes = (_a = this._attributes) !== null && _a !== void 0 ? _a : {};
        this._asyncAttributesPromise = asyncAttributesPromise === null || asyncAttributesPromise === void 0 ? void 0 : asyncAttributesPromise.then(function (asyncAttributes) {
            _this._attributes = Object.assign({}, _this._attributes, asyncAttributes);
            _this.asyncAttributesPending = false;
            return asyncAttributes;
        }, function (err) {
            api_1.diag.debug("a resource's async attributes promise rejected: %s", err);
            _this.asyncAttributesPending = false;
            return {};
        });
    }
    /**
     * Returns an empty Resource
     */


    _createClass(Resource, [{
        key: "waitForAsyncAttributes",

        /**
         * Returns a promise that will never be rejected. Resolves when all async attributes have finished being added to
         * this Resource's attributes. This is useful in exporters to block until resource detection
         * has finished.
         */
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this.asyncAttributesPending) {
                                    _context.next = 3;
                                    break;
                                }

                                _context.next = 3;
                                return this._asyncAttributesPromise;

                            case 3:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function waitForAsyncAttributes() {
                return _ref.apply(this, arguments);
            }

            return waitForAsyncAttributes;
        }()
        /**
         * Returns a new, merged {@link Resource} by merging the current Resource
         * with the other Resource. In case of a collision, other Resource takes
         * precedence.
         *
         * @param other the Resource that will be merged with this.
         * @returns the newly merged Resource.
         */

    }, {
        key: "merge",
        value: function merge(other) {
            var _this2 = this;

            var _a;
            if (!other) return this;
            // SpanAttributes from other resource overwrite attributes from this resource.
            var mergedSyncAttributes = Object.assign(Object.assign({}, this._syncAttributes), (_a = other._syncAttributes) !== null && _a !== void 0 ? _a : other.attributes);
            if (!this._asyncAttributesPromise && !other._asyncAttributesPromise) {
                return new Resource(mergedSyncAttributes);
            }
            var mergedAttributesPromise = Promise.all([this._asyncAttributesPromise, other._asyncAttributesPromise]).then(function (_ref2) {
                var _ref3 = _slicedToArray(_ref2, 2),
                    thisAsyncAttributes = _ref3[0],
                    otherAsyncAttributes = _ref3[1];

                var _a;
                return Object.assign(Object.assign(Object.assign(Object.assign({}, _this2._syncAttributes), thisAsyncAttributes), (_a = other._syncAttributes) !== null && _a !== void 0 ? _a : other.attributes), otherAsyncAttributes);
            });
            return new Resource(mergedSyncAttributes, mergedAttributesPromise);
        }
    }, {
        key: "attributes",
        get: function get() {
            var _a;
            if (this.asyncAttributesPending) {
                api_1.diag.error('Accessing resource attributes before async attributes settled');
            }
            return (_a = this._attributes) !== null && _a !== void 0 ? _a : {};
        }
    }], [{
        key: "empty",
        value: function empty() {
            return Resource.EMPTY;
        }
        /**
         * Returns a Resource that identifies the SDK in use.
         */

    }, {
        key: "default",
        value: function _default() {
            var _ref4;

            return new Resource((_ref4 = {}, _defineProperty(_ref4, semantic_conventions_1.SEMRESATTRS_SERVICE_NAME, (0, platform_1.defaultServiceName)()), _defineProperty(_ref4, semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, core_1.SDK_INFO[semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE]), _defineProperty(_ref4, semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_NAME, core_1.SDK_INFO[semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_NAME]), _defineProperty(_ref4, semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_VERSION, core_1.SDK_INFO[semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_VERSION]), _ref4));
        }
    }]);

    return Resource;
}();

exports.Resource = Resource;
Resource.EMPTY = new Resource({});
//# sourceMappingURL=Resource.js.map