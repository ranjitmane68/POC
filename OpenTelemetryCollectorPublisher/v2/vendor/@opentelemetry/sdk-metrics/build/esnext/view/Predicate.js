'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
// https://tc39.es/proposal-regex-escaping
// escape ^ $ \ .  + ? ( ) [ ] { } |
// do not need to escape * as we interpret it as wildcard
var ESCAPE = /[\^$\\.+?()[\]{}|]/g;
/**
 * Wildcard pattern predicate, supports patterns like `*`, `foo*`, `*bar`.
 */

var PatternPredicate = exports.PatternPredicate = function () {
    function PatternPredicate(pattern) {
        _classCallCheck(this, PatternPredicate);

        if (pattern === '*') {
            this._matchAll = true;
            this._regexp = /.*/;
        } else {
            this._matchAll = false;
            this._regexp = new RegExp(PatternPredicate.escapePattern(pattern));
        }
    }

    _createClass(PatternPredicate, [{
        key: 'match',
        value: function match(str) {
            if (this._matchAll) {
                return true;
            }
            return this._regexp.test(str);
        }
    }], [{
        key: 'escapePattern',
        value: function escapePattern(pattern) {
            return '^' + pattern.replace(ESCAPE, '\\$&').replace('*', '.*') + '$';
        }
    }, {
        key: 'hasWildcard',
        value: function hasWildcard(pattern) {
            return pattern.includes('*');
        }
    }]);

    return PatternPredicate;
}();

var ExactPredicate = exports.ExactPredicate = function () {
    function ExactPredicate(pattern) {
        _classCallCheck(this, ExactPredicate);

        this._matchAll = pattern === undefined;
        this._pattern = pattern;
    }

    _createClass(ExactPredicate, [{
        key: 'match',
        value: function match(str) {
            if (this._matchAll) {
                return true;
            }
            if (str === this._pattern) {
                return true;
            }
            return false;
        }
    }]);

    return ExactPredicate;
}();
//# sourceMappingURL=Predicate.js.map