'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConsoleSpanExporter = undefined;

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


var _core = require('@opentelemetry/core');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This is implementation of {@link SpanExporter} that prints spans to the
 * console. This class can be used for diagnostic purposes.
 */
/* eslint-disable no-console */
var ConsoleSpanExporter = exports.ConsoleSpanExporter = function () {
    function ConsoleSpanExporter() {
        _classCallCheck(this, ConsoleSpanExporter);
    }

    _createClass(ConsoleSpanExporter, [{
        key: 'export',

        /**
         * Export spans.
         * @param spans
         * @param resultCallback
         */
        value: function _export(spans, resultCallback) {
            return this._sendSpans(spans, resultCallback);
        }
        /**
         * Shutdown the exporter.
         */

    }, {
        key: 'shutdown',
        value: function shutdown() {
            this._sendSpans([]);
            return this.forceFlush();
        }
        /**
         * Exports any pending spans in exporter
         */

    }, {
        key: 'forceFlush',
        value: function forceFlush() {
            return Promise.resolve();
        }
        /**
         * converts span info into more readable format
         * @param span
         */

    }, {
        key: '_exportInfo',
        value: function _exportInfo(span) {
            var _a;
            return {
                resource: {
                    attributes: span.resource.attributes
                },
                traceId: span.spanContext().traceId,
                parentId: span.parentSpanId,
                traceState: (_a = span.spanContext().traceState) === null || _a === void 0 ? void 0 : _a.serialize(),
                name: span.name,
                id: span.spanContext().spanId,
                kind: span.kind,
                timestamp: (0, _core.hrTimeToMicroseconds)(span.startTime),
                duration: (0, _core.hrTimeToMicroseconds)(span.duration),
                attributes: span.attributes,
                status: span.status,
                events: span.events,
                links: span.links
            };
        }
        /**
         * Showing spans in console
         * @param spans
         * @param done
         */

    }, {
        key: '_sendSpans',
        value: function _sendSpans(spans, done) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = spans[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var span = _step.value;

                    console.dir(this._exportInfo(span), { depth: 3 });
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

            if (done) {
                return done({ code: _core.ExportResultCode.SUCCESS });
            }
        }
    }]);

    return ConsoleSpanExporter;
}();
//# sourceMappingURL=ConsoleSpanExporter.js.map