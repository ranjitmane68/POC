'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xhr = require('./xhr');

Object.keys(_xhr).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _xhr[key];
    }
  });
});