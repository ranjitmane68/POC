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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentationBase = void 0;
var path = require("path");
var util_1 = require("util");
var semver_1 = require("semver");
var shimmer_1 = require("shimmer");
var instrumentation_1 = require("../../instrumentation");
var RequireInTheMiddleSingleton_1 = require("./RequireInTheMiddleSingleton");
var import_in_the_middle_1 = require("import-in-the-middle");
var api_1 = require("@opentelemetry/api");
var require_in_the_middle_1 = require("require-in-the-middle");
var fs_1 = require("fs");
var utils_1 = require("../../utils");
/**
 * Base abstract class for instrumenting node plugins
 */

var InstrumentationBase = function (_instrumentation_1$In) {
    _inherits(InstrumentationBase, _instrumentation_1$In);

    function InstrumentationBase(instrumentationName, instrumentationVersion, config) {
        _classCallCheck(this, InstrumentationBase);

        var _this = _possibleConstructorReturn(this, (InstrumentationBase.__proto__ || Object.getPrototypeOf(InstrumentationBase)).call(this, instrumentationName, instrumentationVersion, config));

        _this._hooks = [];
        _this._requireInTheMiddleSingleton = RequireInTheMiddleSingleton_1.RequireInTheMiddleSingleton.getInstance();
        _this._enabled = false;
        _this._wrap = function (moduleExports, name, wrapper) {
            if ((0, utils_1.isWrapped)(moduleExports[name])) {
                _this._unwrap(moduleExports, name);
            }
            if (!util_1.types.isProxy(moduleExports)) {
                return (0, shimmer_1.wrap)(moduleExports, name, wrapper);
            } else {
                var wrapped = (0, shimmer_1.wrap)(Object.assign({}, moduleExports), name, wrapper);
                return Object.defineProperty(moduleExports, name, {
                    value: wrapped
                });
            }
        };
        _this._unwrap = function (moduleExports, name) {
            if (!util_1.types.isProxy(moduleExports)) {
                return (0, shimmer_1.unwrap)(moduleExports, name);
            } else {
                return Object.defineProperty(moduleExports, name, {
                    value: moduleExports[name]
                });
            }
        };
        _this._massWrap = function (moduleExportsArray, names, wrapper) {
            if (!moduleExportsArray) {
                api_1.diag.error('must provide one or more modules to patch');
                return;
            } else if (!Array.isArray(moduleExportsArray)) {
                moduleExportsArray = [moduleExportsArray];
            }
            if (!(names && Array.isArray(names))) {
                api_1.diag.error('must provide one or more functions to wrap on modules');
                return;
            }
            moduleExportsArray.forEach(function (moduleExports) {
                names.forEach(function (name) {
                    _this._wrap(moduleExports, name, wrapper);
                });
            });
        };
        _this._massUnwrap = function (moduleExportsArray, names) {
            if (!moduleExportsArray) {
                api_1.diag.error('must provide one or more modules to patch');
                return;
            } else if (!Array.isArray(moduleExportsArray)) {
                moduleExportsArray = [moduleExportsArray];
            }
            if (!(names && Array.isArray(names))) {
                api_1.diag.error('must provide one or more functions to wrap on modules');
                return;
            }
            moduleExportsArray.forEach(function (moduleExports) {
                names.forEach(function (name) {
                    _this._unwrap(moduleExports, name);
                });
            });
        };
        var modules = _this.init();
        if (modules && !Array.isArray(modules)) {
            modules = [modules];
        }
        _this._modules = modules || [];
        if (_this._modules.length === 0) {
            api_1.diag.debug('No modules instrumentation has been defined for ' + ("'" + _this.instrumentationName + "@" + _this.instrumentationVersion + "'") + ', nothing will be patched');
        }
        if (_this._config.enabled) {
            _this.enable();
        }
        return _this;
    }

    _createClass(InstrumentationBase, [{
        key: "_warnOnPreloadedModules",
        value: function _warnOnPreloadedModules() {
            var _this2 = this;

            this._modules.forEach(function (module) {
                var name = module.name;

                try {
                    var resolvedModule = require.resolve(name);
                    if (require.cache[resolvedModule]) {
                        // Module is already cached, which means the instrumentation hook might not work
                        _this2._diag.warn("Module " + name + " has been loaded before " + _this2.instrumentationName + " so it might not work, please initialize it before requiring " + name);
                    }
                } catch (_a) {
                    // Module isn't available, we can simply skip
                }
            });
        }
    }, {
        key: "_extractPackageVersion",
        value: function _extractPackageVersion(baseDir) {
            try {
                var json = (0, fs_1.readFileSync)(path.join(baseDir, 'package.json'), {
                    encoding: 'utf8'
                });
                var version = JSON.parse(json).version;
                return typeof version === 'string' ? version : undefined;
            } catch (error) {
                api_1.diag.warn('Failed extracting version', baseDir);
            }
            return undefined;
        }
    }, {
        key: "_onRequire",
        value: function _onRequire(module, exports, name, baseDir) {
            var _this3 = this;

            var _a;
            if (!baseDir) {
                if (typeof module.patch === 'function') {
                    module.moduleExports = exports;
                    if (this._enabled) {
                        this._diag.debug('Applying instrumentation patch for nodejs core module on require hook', {
                            module: module.name
                        });
                        return module.patch(exports);
                    }
                }
                return exports;
            }
            var version = this._extractPackageVersion(baseDir);
            module.moduleVersion = version;
            if (module.name === name) {
                // main module
                if (isSupported(module.supportedVersions, version, module.includePrerelease)) {
                    if (typeof module.patch === 'function') {
                        module.moduleExports = exports;
                        if (this._enabled) {
                            this._diag.debug('Applying instrumentation patch for module on require hook', {
                                module: module.name,
                                version: module.moduleVersion,
                                baseDir: baseDir
                            });
                            return module.patch(exports, module.moduleVersion);
                        }
                    }
                }
                return exports;
            }
            // internal file
            var files = (_a = module.files) !== null && _a !== void 0 ? _a : [];
            var normalizedName = path.normalize(name);
            var supportedFileInstrumentations = files.filter(function (f) {
                return f.name === normalizedName;
            }).filter(function (f) {
                return isSupported(f.supportedVersions, version, module.includePrerelease);
            });
            return supportedFileInstrumentations.reduce(function (patchedExports, file) {
                file.moduleExports = patchedExports;
                if (_this3._enabled) {
                    _this3._diag.debug('Applying instrumentation patch for nodejs module file on require hook', {
                        module: module.name,
                        version: module.moduleVersion,
                        fileName: file.name,
                        baseDir: baseDir
                    });
                    // patch signature is not typed, so we cast it assuming it's correct
                    return file.patch(patchedExports, module.moduleVersion);
                }
                return patchedExports;
            }, exports);
        }
    }, {
        key: "enable",
        value: function enable() {
            var _this4 = this;

            if (this._enabled) {
                return;
            }
            this._enabled = true;
            // already hooked, just call patch again
            if (this._hooks.length > 0) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this._modules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var module = _step.value;

                        if (typeof module.patch === 'function' && module.moduleExports) {
                            this._diag.debug('Applying instrumentation patch for nodejs module on instrumentation enabled', {
                                module: module.name,
                                version: module.moduleVersion
                            });
                            module.patch(module.moduleExports, module.moduleVersion);
                        }
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = module.files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var file = _step2.value;

                                if (file.moduleExports) {
                                    this._diag.debug('Applying instrumentation patch for nodejs module file on instrumentation enabled', {
                                        module: module.name,
                                        version: module.moduleVersion,
                                        fileName: file.name
                                    });
                                    file.patch(file.moduleExports, module.moduleVersion);
                                }
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

                return;
            }
            this._warnOnPreloadedModules();

            var _loop = function _loop(_module) {
                var hookFn = function hookFn(exports, name, baseDir) {
                    return _this4._onRequire(_module, exports, name, baseDir);
                };
                var onRequire = function onRequire(exports, name, baseDir) {
                    return _this4._onRequire(_module, exports, name, baseDir);
                };
                // `RequireInTheMiddleSingleton` does not support absolute paths.
                // For an absolute paths, we must create a separate instance of the
                // require-in-the-middle `Hook`.
                var hook = path.isAbsolute(_module.name) ? new require_in_the_middle_1.Hook([_module.name], { internals: true }, onRequire) : _this4._requireInTheMiddleSingleton.register(_module.name, onRequire);
                _this4._hooks.push(hook);
                var esmHook = new import_in_the_middle_1.Hook([_module.name], { internals: false }, hookFn);
                _this4._hooks.push(esmHook);
            };

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this._modules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _module = _step3.value;

                    _loop(_module);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: "disable",
        value: function disable() {
            if (!this._enabled) {
                return;
            }
            this._enabled = false;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this._modules[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var module = _step4.value;

                    if (typeof module.unpatch === 'function' && module.moduleExports) {
                        this._diag.debug('Removing instrumentation patch for nodejs module on instrumentation disabled', {
                            module: module.name,
                            version: module.moduleVersion
                        });
                        module.unpatch(module.moduleExports, module.moduleVersion);
                    }
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = module.files[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var file = _step5.value;

                            if (file.moduleExports) {
                                this._diag.debug('Removing instrumentation patch for nodejs module file on instrumentation disabled', {
                                    module: module.name,
                                    version: module.moduleVersion,
                                    fileName: file.name
                                });
                                file.unpatch(file.moduleExports, module.moduleVersion);
                            }
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: "isEnabled",
        value: function isEnabled() {
            return this._enabled;
        }
    }]);

    return InstrumentationBase;
}(instrumentation_1.InstrumentationAbstract);

exports.InstrumentationBase = InstrumentationBase;
function isSupported(supportedVersions, version, includePrerelease) {
    if (typeof version === 'undefined') {
        // If we don't have the version, accept the wildcard case only
        return supportedVersions.includes('*');
    }
    return supportedVersions.some(function (supportedVersion) {
        return (0, semver_1.satisfies)(version, supportedVersion, { includePrerelease: includePrerelease });
    });
}
//# sourceMappingURL=instrumentation.js.map