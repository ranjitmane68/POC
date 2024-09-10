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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
exports.FilteringAttributesProcessor = exports.NoopAttributesProcessor = exports.AttributesProcessor = void 0;
/**
 * The {@link AttributesProcessor} is responsible for customizing which
 * attribute(s) are to be reported as metrics dimension(s) and adding
 * additional dimension(s) from the {@link Context}.
 */

var AttributesProcessor = function () {
    function AttributesProcessor() {
        _classCallCheck(this, AttributesProcessor);
    }

    _createClass(AttributesProcessor, null, [{
        key: "Noop",
        value: function Noop() {
            return NOOP;
        }
    }]);

    return AttributesProcessor;
}();

exports.AttributesProcessor = AttributesProcessor;

var NoopAttributesProcessor = function (_AttributesProcessor) {
    _inherits(NoopAttributesProcessor, _AttributesProcessor);

    function NoopAttributesProcessor() {
        _classCallCheck(this, NoopAttributesProcessor);

        return _possibleConstructorReturn(this, (NoopAttributesProcessor.__proto__ || Object.getPrototypeOf(NoopAttributesProcessor)).apply(this, arguments));
    }

    _createClass(NoopAttributesProcessor, [{
        key: "process",
        value: function process(incoming, _context) {
            return incoming;
        }
    }]);

    return NoopAttributesProcessor;
}(AttributesProcessor);

exports.NoopAttributesProcessor = NoopAttributesProcessor;
/**
 * {@link AttributesProcessor} that filters by allowed attribute names and drops any names that are not in the
 * allow list.
 */

var FilteringAttributesProcessor = function (_AttributesProcessor2) {
    _inherits(FilteringAttributesProcessor, _AttributesProcessor2);

    function FilteringAttributesProcessor(_allowedAttributeNames) {
        _classCallCheck(this, FilteringAttributesProcessor);

        var _this2 = _possibleConstructorReturn(this, (FilteringAttributesProcessor.__proto__ || Object.getPrototypeOf(FilteringAttributesProcessor)).call(this));

        _this2._allowedAttributeNames = _allowedAttributeNames;
        return _this2;
    }

    _createClass(FilteringAttributesProcessor, [{
        key: "process",
        value: function process(incoming, _context) {
            var _this3 = this;

            var filteredAttributes = {};
            Object.keys(incoming).filter(function (attributeName) {
                return _this3._allowedAttributeNames.includes(attributeName);
            }).forEach(function (attributeName) {
                return filteredAttributes[attributeName] = incoming[attributeName];
            });
            return filteredAttributes;
        }
    }]);

    return FilteringAttributesProcessor;
}(AttributesProcessor);

exports.FilteringAttributesProcessor = FilteringAttributesProcessor;
var NOOP = new NoopAttributesProcessor();
//# sourceMappingURL=AttributesProcessor.js.map