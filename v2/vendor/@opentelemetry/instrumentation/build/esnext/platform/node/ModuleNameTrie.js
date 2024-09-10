'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var ModuleNameSeparator = exports.ModuleNameSeparator = '/';
/**
 * Node in a `ModuleNameTrie`
 */

var ModuleNameTrieNode = function ModuleNameTrieNode() {
    _classCallCheck(this, ModuleNameTrieNode);

    this.hooks = [];
    this.children = new Map();
};
/**
 * Trie containing nodes that represent a part of a module name (i.e. the parts separated by forward slash)
 */


var ModuleNameTrie = exports.ModuleNameTrie = function () {
    function ModuleNameTrie() {
        _classCallCheck(this, ModuleNameTrie);

        this._trie = new ModuleNameTrieNode();
        this._counter = 0;
    }
    /**
     * Insert a module hook into the trie
     *
     * @param {Hooked} hook Hook
     */


    _createClass(ModuleNameTrie, [{
        key: 'insert',
        value: function insert(hook) {
            var trieNode = this._trie;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = hook.moduleName.split(ModuleNameSeparator)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var moduleNamePart = _step.value;

                    var nextNode = trieNode.children.get(moduleNamePart);
                    if (!nextNode) {
                        nextNode = new ModuleNameTrieNode();
                        trieNode.children.set(moduleNamePart, nextNode);
                    }
                    trieNode = nextNode;
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

            trieNode.hooks.push({ hook: hook, insertedId: this._counter++ });
        }
        /**
         * Search for matching hooks in the trie
         *
         * @param {string} moduleName Module name
         * @param {boolean} maintainInsertionOrder Whether to return the results in insertion order
         * @param {boolean} fullOnly Whether to return only full matches
         * @returns {Hooked[]} Matching hooks
         */

    }, {
        key: 'search',
        value: function search(moduleName) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                maintainInsertionOrder = _ref.maintainInsertionOrder,
                fullOnly = _ref.fullOnly;

            var trieNode = this._trie;
            var results = [];
            var foundFull = true;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = moduleName.split(ModuleNameSeparator)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var moduleNamePart = _step2.value;

                    var nextNode = trieNode.children.get(moduleNamePart);
                    if (!nextNode) {
                        foundFull = false;
                        break;
                    }
                    if (!fullOnly) {
                        results.push.apply(results, _toConsumableArray(nextNode.hooks));
                    }
                    trieNode = nextNode;
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

            if (fullOnly && foundFull) {
                results.push.apply(results, _toConsumableArray(trieNode.hooks));
            }
            if (results.length === 0) {
                return [];
            }
            if (results.length === 1) {
                return [results[0].hook];
            }
            if (maintainInsertionOrder) {
                results.sort(function (a, b) {
                    return a.insertedId - b.insertedId;
                });
            }
            return results.map(function (_ref2) {
                var hook = _ref2.hook;
                return hook;
            });
        }
    }]);

    return ModuleNameTrie;
}();
//# sourceMappingURL=ModuleNameTrie.js.map