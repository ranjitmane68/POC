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
exports.MetricStorageRegistry = void 0;
var InstrumentDescriptor_1 = require("../InstrumentDescriptor");
var api = require("@opentelemetry/api");
var RegistrationConflicts_1 = require("../view/RegistrationConflicts");
/**
 * Internal class for storing {@link MetricStorage}
 */

var MetricStorageRegistry = function () {
    function MetricStorageRegistry() {
        _classCallCheck(this, MetricStorageRegistry);

        this._sharedRegistry = new Map();
        this._perCollectorRegistry = new Map();
    }

    _createClass(MetricStorageRegistry, [{
        key: "getStorages",
        value: function getStorages(collector) {
            var storages = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._sharedRegistry.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var metricStorages = _step.value;

                    storages = storages.concat(metricStorages);
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

            var perCollectorStorages = this._perCollectorRegistry.get(collector);
            if (perCollectorStorages != null) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = perCollectorStorages.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _metricStorages = _step2.value;

                        storages = storages.concat(_metricStorages);
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
            return storages;
        }
    }, {
        key: "register",
        value: function register(storage) {
            this._registerStorage(storage, this._sharedRegistry);
        }
    }, {
        key: "registerForCollector",
        value: function registerForCollector(collector, storage) {
            var storageMap = this._perCollectorRegistry.get(collector);
            if (storageMap == null) {
                storageMap = new Map();
                this._perCollectorRegistry.set(collector, storageMap);
            }
            this._registerStorage(storage, storageMap);
        }
    }, {
        key: "findOrUpdateCompatibleStorage",
        value: function findOrUpdateCompatibleStorage(expectedDescriptor) {
            var storages = this._sharedRegistry.get(expectedDescriptor.name);
            if (storages === undefined) {
                return null;
            }
            // If the descriptor is compatible, the type of their metric storage
            // (either SyncMetricStorage or AsyncMetricStorage) must be compatible.
            return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
        }
    }, {
        key: "findOrUpdateCompatibleCollectorStorage",
        value: function findOrUpdateCompatibleCollectorStorage(collector, expectedDescriptor) {
            var storageMap = this._perCollectorRegistry.get(collector);
            if (storageMap === undefined) {
                return null;
            }
            var storages = storageMap.get(expectedDescriptor.name);
            if (storages === undefined) {
                return null;
            }
            // If the descriptor is compatible, the type of their metric storage
            // (either SyncMetricStorage or AsyncMetricStorage) must be compatible.
            return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
        }
    }, {
        key: "_registerStorage",
        value: function _registerStorage(storage, storageMap) {
            var descriptor = storage.getInstrumentDescriptor();
            var storages = storageMap.get(descriptor.name);
            if (storages === undefined) {
                storageMap.set(descriptor.name, [storage]);
                return;
            }
            storages.push(storage);
        }
    }, {
        key: "_findOrUpdateCompatibleStorage",
        value: function _findOrUpdateCompatibleStorage(expectedDescriptor, existingStorages) {
            var compatibleStorage = null;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = existingStorages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var existingStorage = _step3.value;

                    var existingDescriptor = existingStorage.getInstrumentDescriptor();
                    if ((0, InstrumentDescriptor_1.isDescriptorCompatibleWith)(existingDescriptor, expectedDescriptor)) {
                        // Use the longer description if it does not match.
                        if (existingDescriptor.description !== expectedDescriptor.description) {
                            if (expectedDescriptor.description.length > existingDescriptor.description.length) {
                                existingStorage.updateDescription(expectedDescriptor.description);
                            }
                            api.diag.warn('A view or instrument with the name ', expectedDescriptor.name, ' has already been registered, but has a different description and is incompatible with another registered view.\n', 'Details:\n', (0, RegistrationConflicts_1.getIncompatibilityDetails)(existingDescriptor, expectedDescriptor), 'The longer description will be used.\nTo resolve the conflict:', (0, RegistrationConflicts_1.getConflictResolutionRecipe)(existingDescriptor, expectedDescriptor));
                        }
                        // Storage is fully compatible. There will never be more than one pre-existing fully compatible storage.
                        compatibleStorage = existingStorage;
                    } else {
                        // The implementation SHOULD warn about duplicate instrument registration
                        // conflicts after applying View configuration.
                        api.diag.warn('A view or instrument with the name ', expectedDescriptor.name, ' has already been registered and is incompatible with another registered view.\n', 'Details:\n', (0, RegistrationConflicts_1.getIncompatibilityDetails)(existingDescriptor, expectedDescriptor), 'To resolve the conflict:\n', (0, RegistrationConflicts_1.getConflictResolutionRecipe)(existingDescriptor, expectedDescriptor));
                    }
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

            return compatibleStorage;
        }
    }], [{
        key: "create",
        value: function create() {
            return new MetricStorageRegistry();
        }
    }]);

    return MetricStorageRegistry;
}();

exports.MetricStorageRegistry = MetricStorageRegistry;
//# sourceMappingURL=MetricStorageRegistry.js.map