'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _platform = require('./platform');

Object.keys(_platform).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _platform[key];
    }
  });
});