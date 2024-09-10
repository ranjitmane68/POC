'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NonRecordingSpan = undefined;

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


var _invalidSpanConstants = require('./invalid-span-constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The NonRecordingSpan is the default {@link Span} that is used when no Span
 * implementation is available. All operations are no-op including context
 * propagation.
 */
var NonRecordingSpan = exports.NonRecordingSpan = function () {
    function NonRecordingSpan() {
        var _spanContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _invalidSpanConstants.INVALID_SPAN_CONTEXT;

        _classCallCheck(this, NonRecordingSpan);

        this._spanContext = _spanContext;
    }
    // Returns a SpanContext.


    _createClass(NonRecordingSpan, [{
        key: 'spanContext',
        value: function spanContext() {
            return this._spanContext;
        }
        // By default does nothing

    }, {
        key: 'setAttribute',
        value: function setAttribute(_key, _value) {
            return this;
        }
        // By default does nothing

    }, {
        key: 'setAttributes',
        value: function setAttributes(_attributes) {
            return this;
        }
        // By default does nothing

    }, {
        key: 'addEvent',
        value: function addEvent(_name, _attributes) {
            return this;
        }
    }, {
        key: 'addLink',
        value: function addLink(_link) {
            return this;
        }
    }, {
        key: 'addLinks',
        value: function addLinks(_links) {
            return this;
        }
        // By default does nothing

    }, {
        key: 'setStatus',
        value: function setStatus(_status) {
            return this;
        }
        // By default does nothing

    }, {
        key: 'updateName',
        value: function updateName(_name) {
            return this;
        }
        // By default does nothing

    }, {
        key: 'end',
        value: function end(_endTime) {}
        // isRecording always returns false for NonRecordingSpan.

    }, {
        key: 'isRecording',
        value: function isRecording() {
            return false;
        }
        // By default does nothing

    }, {
        key: 'recordException',
        value: function recordException(_exception, _time) {}
    }]);

    return NonRecordingSpan;
}();
//# sourceMappingURL=NonRecordingSpan.js.map