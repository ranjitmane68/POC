'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trace = require('./trace');

Object.keys(_trace).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _trace[key];
    }
  });
});

var _resource = require('./resource');

Object.keys(_resource).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _resource[key];
    }
  });
});