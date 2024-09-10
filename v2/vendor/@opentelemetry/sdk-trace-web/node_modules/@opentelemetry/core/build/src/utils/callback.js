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
exports.BindOnceFuture = void 0;
var promise_1 = require("./promise");
/**
 * Bind the callback and only invoke the callback once regardless how many times `BindOnceFuture.call` is invoked.
 */

var BindOnceFuture = function () {
    function BindOnceFuture(_callback, _that) {
        _classCallCheck(this, BindOnceFuture);

        this._callback = _callback;
        this._that = _that;
        this._isCalled = false;
        this._deferred = new promise_1.Deferred();
    }

    _createClass(BindOnceFuture, [{
        key: "call",
        value: function call() {
            var _this = this;

            if (!this._isCalled) {
                this._isCalled = true;
                try {
                    var _callback2;

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    Promise.resolve((_callback2 = this._callback).call.apply(_callback2, [this._that].concat(args))).then(function (val) {
                        return _this._deferred.resolve(val);
                    }, function (err) {
                        return _this._deferred.reject(err);
                    });
                } catch (err) {
                    this._deferred.reject(err);
                }
            }
            return this._deferred.promise;
        }
    }, {
        key: "isCalled",
        get: function get() {
            return this._isCalled;
        }
    }, {
        key: "promise",
        get: function get() {
            return this._deferred.promise;
        }
    }]);

    return BindOnceFuture;
}();

exports.BindOnceFuture = BindOnceFuture;
//# sourceMappingURL=callback.js.map