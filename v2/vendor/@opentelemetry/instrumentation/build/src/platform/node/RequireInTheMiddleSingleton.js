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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireInTheMiddleSingleton = void 0;
var require_in_the_middle_1 = require("require-in-the-middle");
var path = require("path");
var ModuleNameTrie_1 = require("./ModuleNameTrie");
/**
 * Whether Mocha is running in this process
 * Inspired by https://github.com/AndreasPizsa/detect-mocha
 *
 * @type {boolean}
 */
var isMocha = ['afterEach', 'after', 'beforeEach', 'before', 'describe', 'it'].every(function (fn) {
    // @ts-expect-error TS7053: Element implicitly has an 'any' type
    return typeof global[fn] === 'function';
});
/**
 * Singleton class for `require-in-the-middle`
 * Allows instrumentation plugins to patch modules with only a single `require` patch
 * WARNING: Because this class will create its own `require-in-the-middle` (RITM) instance,
 * we should minimize the number of new instances of this class.
 * Multiple instances of `@opentelemetry/instrumentation` (e.g. multiple versions) in a single process
 * will result in multiple instances of RITM, which will have an impact
 * on the performance of instrumentation hooks being applied.
 */

var RequireInTheMiddleSingleton = function () {
    function RequireInTheMiddleSingleton() {
        _classCallCheck(this, RequireInTheMiddleSingleton);

        this._moduleNameTrie = new ModuleNameTrie_1.ModuleNameTrie();
        this._initialize();
    }

    _createClass(RequireInTheMiddleSingleton, [{
        key: "_initialize",
        value: function _initialize() {
            var _this = this;

            new require_in_the_middle_1.Hook(
            // Intercept all `require` calls; we will filter the matching ones below
            null, { internals: true }, function (exports, name, basedir) {
                // For internal files on Windows, `name` will use backslash as the path separator
                var normalizedModuleName = normalizePathSeparators(name);
                var matches = _this._moduleNameTrie.search(normalizedModuleName, {
                    maintainInsertionOrder: true,
                    // For core modules (e.g. `fs`), do not match on sub-paths (e.g. `fs/promises').
                    // This matches the behavior of `require-in-the-middle`.
                    // `basedir` is always `undefined` for core modules.
                    fullOnly: basedir === undefined
                });
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _ref = _step.value;
                        var onRequire = _ref.onRequire;

                        exports = onRequire(exports, name, basedir);
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

                return exports;
            });
        }
        /**
         * Register a hook with `require-in-the-middle`
         *
         * @param {string} moduleName Module name
         * @param {OnRequireFn} onRequire Hook function
         * @returns {Hooked} Registered hook
         */

    }, {
        key: "register",
        value: function register(moduleName, onRequire) {
            var hooked = { moduleName: moduleName, onRequire: onRequire };
            this._moduleNameTrie.insert(hooked);
            return hooked;
        }
        /**
         * Get the `RequireInTheMiddleSingleton` singleton
         *
         * @returns {RequireInTheMiddleSingleton} Singleton of `RequireInTheMiddleSingleton`
         */

    }], [{
        key: "getInstance",
        value: function getInstance() {
            var _a;
            // Mocha runs all test suites in the same process
            // This prevents test suites from sharing a singleton
            if (isMocha) return new RequireInTheMiddleSingleton();
            return this._instance = (_a = this._instance) !== null && _a !== void 0 ? _a : new RequireInTheMiddleSingleton();
        }
    }]);

    return RequireInTheMiddleSingleton;
}();

exports.RequireInTheMiddleSingleton = RequireInTheMiddleSingleton;
/**
 * Normalize the path separators to forward slash in a module name or path
 *
 * @param {string} moduleNameOrPath Module name or path
 * @returns {string} Normalized module name or path
 */
function normalizePathSeparators(moduleNameOrPath) {
    return path.sep !== ModuleNameTrie_1.ModuleNameSeparator ? moduleNameOrPath.split(path.sep).join(ModuleNameTrie_1.ModuleNameSeparator) : moduleNameOrPath;
}
//# sourceMappingURL=RequireInTheMiddleSingleton.js.map