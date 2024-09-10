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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.detectResourcesSync = exports.detectResources = void 0;
var Resource_1 = require("./Resource");
var api_1 = require("@opentelemetry/api");
var utils_1 = require("./utils");
/**
 * Runs all resource detectors and returns the results merged into a single Resource. Promise
 * does not resolve until all the underlying detectors have resolved, unlike
 * detectResourcesSync.
 *
 * @deprecated use detectResourcesSync() instead.
 * @param config Configuration for resource detection
 */
var detectResources = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var resources;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return Promise.all((config.detectors || []).map(function () {
                            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(d) {
                                var resource;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.prev = 0;
                                                _context.next = 3;
                                                return d.detect(config);

                                            case 3:
                                                resource = _context.sent;

                                                api_1.diag.debug(d.constructor.name + " found resource.", resource);
                                                return _context.abrupt("return", resource);

                                            case 8:
                                                _context.prev = 8;
                                                _context.t0 = _context["catch"](0);

                                                api_1.diag.debug(d.constructor.name + " failed: " + _context.t0.message);
                                                return _context.abrupt("return", Resource_1.Resource.empty());

                                            case 12:
                                            case "end":
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined, [[0, 8]]);
                            }));

                            return function (_x2) {
                                return _ref2.apply(this, arguments);
                            };
                        }()));

                    case 2:
                        resources = _context2.sent;

                        // Future check if verbose logging is enabled issue #1903
                        logResources(resources);
                        return _context2.abrupt("return", resources.reduce(function (acc, resource) {
                            return acc.merge(resource);
                        }, Resource_1.Resource.empty()));

                    case 5:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function detectResources() {
        return _ref.apply(this, arguments);
    };
}();
exports.detectResources = detectResources;
/**
 * Runs all resource detectors synchronously, merging their results. In case of attribute collision later resources will take precedence.
 *
 * @param config Configuration for resource detection
 */
var detectResourcesSync = function detectResourcesSync() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _a;
    var resources = ((_a = config.detectors) !== null && _a !== void 0 ? _a : []).map(function (d) {
        try {
            var resourceOrPromise = d.detect(config);
            var resource = void 0;
            if ((0, utils_1.isPromiseLike)(resourceOrPromise)) {
                var createPromise = function () {
                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                        var resolvedResource;
                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                            while (1) {
                                switch (_context3.prev = _context3.next) {
                                    case 0:
                                        _context3.next = 2;
                                        return resourceOrPromise;

                                    case 2:
                                        resolvedResource = _context3.sent;
                                        return _context3.abrupt("return", resolvedResource.attributes);

                                    case 4:
                                    case "end":
                                        return _context3.stop();
                                }
                            }
                        }, _callee3, undefined);
                    }));

                    return function createPromise() {
                        return _ref3.apply(this, arguments);
                    };
                }();
                resource = new Resource_1.Resource({}, createPromise());
            } else {
                resource = resourceOrPromise;
            }
            if (resource.waitForAsyncAttributes) {
                void resource.waitForAsyncAttributes().then(function () {
                    return api_1.diag.debug(d.constructor.name + " found resource.", resource);
                });
            } else {
                api_1.diag.debug(d.constructor.name + " found resource.", resource);
            }
            return resource;
        } catch (e) {
            api_1.diag.error(d.constructor.name + " failed: " + e.message);
            return Resource_1.Resource.empty();
        }
    });
    var mergedResources = resources.reduce(function (acc, resource) {
        return acc.merge(resource);
    }, Resource_1.Resource.empty());
    if (mergedResources.waitForAsyncAttributes) {
        void mergedResources.waitForAsyncAttributes().then(function () {
            // Future check if verbose logging is enabled issue #1903
            logResources(resources);
        });
    }
    return mergedResources;
};
exports.detectResourcesSync = detectResourcesSync;
/**
 * Writes debug information about the detected resources to the logger defined in the resource detection config, if one is provided.
 *
 * @param resources The array of {@link Resource} that should be logged. Empty entries will be ignored.
 */
var logResources = function logResources(resources) {
    resources.forEach(function (resource) {
        // Print only populated resources
        if (Object.keys(resource.attributes).length > 0) {
            var resourceDebugString = JSON.stringify(resource.attributes, null, 4);
            api_1.diag.verbose(resourceDebugString);
        }
    });
};
//# sourceMappingURL=detect-resources.js.map