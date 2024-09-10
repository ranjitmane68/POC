'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SemanticAttributes = require('./SemanticAttributes');

Object.keys(_SemanticAttributes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SemanticAttributes[key];
    }
  });
});