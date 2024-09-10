'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BatchLogRecordProcessor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BatchLogRecordProcessorBase = require('../../../export/BatchLogRecordProcessorBase');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
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


var BatchLogRecordProcessor = exports.BatchLogRecordProcessor = function (_BatchLogRecordProces) {
    _inherits(BatchLogRecordProcessor, _BatchLogRecordProces);

    function BatchLogRecordProcessor(exporter, config) {
        _classCallCheck(this, BatchLogRecordProcessor);

        var _this = _possibleConstructorReturn(this, (BatchLogRecordProcessor.__proto__ || Object.getPrototypeOf(BatchLogRecordProcessor)).call(this, exporter, config));

        _this._onInit(config);
        return _this;
    }

    _createClass(BatchLogRecordProcessor, [{
        key: 'onShutdown',
        value: function onShutdown() {
            if (typeof document === 'undefined') {
                return;
            }
            if (this._visibilityChangeListener) {
                document.removeEventListener('visibilitychange', this._visibilityChangeListener);
            }
            if (this._pageHideListener) {
                document.removeEventListener('pagehide', this._pageHideListener);
            }
        }
    }, {
        key: '_onInit',
        value: function _onInit(config) {
            var _this2 = this;

            if ((config === null || config === void 0 ? void 0 : config.disableAutoFlushOnDocumentHide) === true || typeof document === 'undefined') {
                return;
            }
            this._visibilityChangeListener = function () {
                if (document.visibilityState === 'hidden') {
                    void _this2.forceFlush();
                }
            };
            this._pageHideListener = function () {
                void _this2.forceFlush();
            };
            document.addEventListener('visibilitychange', this._visibilityChangeListener);
            // use 'pagehide' event as a fallback for Safari; see https://bugs.webkit.org/show_bug.cgi?id=116769
            document.addEventListener('pagehide', this._pageHideListener);
        }
    }]);

    return BatchLogRecordProcessor;
}(_BatchLogRecordProcessorBase.BatchLogRecordProcessorBase);
//# sourceMappingURL=BatchLogRecordProcessor.js.map