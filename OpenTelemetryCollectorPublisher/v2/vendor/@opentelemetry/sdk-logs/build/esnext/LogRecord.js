'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LogRecord = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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


var _api = require('@opentelemetry/api');

var api = _interopRequireWildcard(_api);

var _core = require('@opentelemetry/core');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogRecord = exports.LogRecord = function () {
    function LogRecord(_sharedState, instrumentationScope, logRecord) {
        _classCallCheck(this, LogRecord);

        this.attributes = {};
        this.totalAttributesCount = 0;
        this._isReadonly = false;
        var timestamp = logRecord.timestamp,
            observedTimestamp = logRecord.observedTimestamp,
            severityNumber = logRecord.severityNumber,
            severityText = logRecord.severityText,
            body = logRecord.body,
            _logRecord$attributes = logRecord.attributes,
            attributes = _logRecord$attributes === undefined ? {} : _logRecord$attributes,
            context = logRecord.context;

        var now = Date.now();
        this.hrTime = (0, _core.timeInputToHrTime)(timestamp !== null && timestamp !== void 0 ? timestamp : now);
        this.hrTimeObserved = (0, _core.timeInputToHrTime)(observedTimestamp !== null && observedTimestamp !== void 0 ? observedTimestamp : now);
        if (context) {
            var spanContext = api.trace.getSpanContext(context);
            if (spanContext && api.isSpanContextValid(spanContext)) {
                this.spanContext = spanContext;
            }
        }
        this.severityNumber = severityNumber;
        this.severityText = severityText;
        this.body = body;
        this.resource = _sharedState.resource;
        this.instrumentationScope = instrumentationScope;
        this._logRecordLimits = _sharedState.logRecordLimits;
        this.setAttributes(attributes);
    }

    _createClass(LogRecord, [{
        key: 'setAttribute',
        value: function setAttribute(key, value) {
            if (this._isLogRecordReadonly()) {
                return this;
            }
            if (value === null) {
                return this;
            }
            if (key.length === 0) {
                api.diag.warn('Invalid attribute key: ' + key);
                return this;
            }
            if (!(0, _core.isAttributeValue)(value) && !((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !Array.isArray(value) && Object.keys(value).length > 0)) {
                api.diag.warn('Invalid attribute value set for key: ' + key);
                return this;
            }
            this.totalAttributesCount += 1;
            if (Object.keys(this.attributes).length >= this._logRecordLimits.attributeCountLimit && !Object.prototype.hasOwnProperty.call(this.attributes, key)) {
                // This logic is to create drop message at most once per LogRecord to prevent excessive logging.
                if (this.droppedAttributesCount === 1) {
                    api.diag.warn('Dropping extra attributes.');
                }
                return this;
            }
            if ((0, _core.isAttributeValue)(value)) {
                this.attributes[key] = this._truncateToSize(value);
            } else {
                this.attributes[key] = value;
            }
            return this;
        }
    }, {
        key: 'setAttributes',
        value: function setAttributes(attributes) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var k = _ref2[0];
                    var v = _ref2[1];

                    this.setAttribute(k, v);
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

            return this;
        }
    }, {
        key: 'setBody',
        value: function setBody(body) {
            this.body = body;
            return this;
        }
    }, {
        key: 'setSeverityNumber',
        value: function setSeverityNumber(severityNumber) {
            this.severityNumber = severityNumber;
            return this;
        }
    }, {
        key: 'setSeverityText',
        value: function setSeverityText(severityText) {
            this.severityText = severityText;
            return this;
        }
        /**
         * @internal
         * A LogRecordProcessor may freely modify logRecord for the duration of the OnEmit call.
         * If logRecord is needed after OnEmit returns (i.e. for asynchronous processing) only reads are permitted.
         */

    }, {
        key: '_makeReadonly',
        value: function _makeReadonly() {
            this._isReadonly = true;
        }
    }, {
        key: '_truncateToSize',
        value: function _truncateToSize(value) {
            var _this = this;

            var limit = this._logRecordLimits.attributeValueLengthLimit;
            // Check limit
            if (limit <= 0) {
                // Negative values are invalid, so do not truncate
                api.diag.warn('Attribute value limit must be positive, got ' + limit);
                return value;
            }
            // String
            if (typeof value === 'string') {
                return this._truncateToLimitUtil(value, limit);
            }
            // Array of strings
            if (Array.isArray(value)) {
                return value.map(function (val) {
                    return typeof val === 'string' ? _this._truncateToLimitUtil(val, limit) : val;
                });
            }
            // Other types, no need to apply value length limit
            return value;
        }
    }, {
        key: '_truncateToLimitUtil',
        value: function _truncateToLimitUtil(value, limit) {
            if (value.length <= limit) {
                return value;
            }
            return value.substring(0, limit);
        }
    }, {
        key: '_isLogRecordReadonly',
        value: function _isLogRecordReadonly() {
            if (this._isReadonly) {
                _api.diag.warn('Can not execute the operation on emitted log record');
            }
            return this._isReadonly;
        }
    }, {
        key: 'severityText',
        set: function set(severityText) {
            if (this._isLogRecordReadonly()) {
                return;
            }
            this._severityText = severityText;
        },
        get: function get() {
            return this._severityText;
        }
    }, {
        key: 'severityNumber',
        set: function set(severityNumber) {
            if (this._isLogRecordReadonly()) {
                return;
            }
            this._severityNumber = severityNumber;
        },
        get: function get() {
            return this._severityNumber;
        }
    }, {
        key: 'body',
        set: function set(body) {
            if (this._isLogRecordReadonly()) {
                return;
            }
            this._body = body;
        },
        get: function get() {
            return this._body;
        }
    }, {
        key: 'droppedAttributesCount',
        get: function get() {
            return this.totalAttributesCount - Object.keys(this.attributes).length;
        }
    }]);

    return LogRecord;
}();
//# sourceMappingURL=LogRecord.js.map