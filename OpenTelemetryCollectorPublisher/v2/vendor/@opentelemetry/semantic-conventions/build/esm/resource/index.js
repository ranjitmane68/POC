'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SemanticResourceAttributes = require('./SemanticResourceAttributes');

Object.keys(_SemanticResourceAttributes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SemanticResourceAttributes[key];
    }
  });
});