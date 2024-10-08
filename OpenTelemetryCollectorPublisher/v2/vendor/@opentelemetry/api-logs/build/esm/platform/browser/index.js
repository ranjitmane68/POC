'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _globalThis = require('./globalThis');

Object.keys(_globalThis).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _globalThis[key];
    }
  });
});