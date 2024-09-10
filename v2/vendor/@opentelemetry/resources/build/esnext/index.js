'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Resource = require('./Resource');

Object.defineProperty(exports, 'Resource', {
  enumerable: true,
  get: function get() {
    return _Resource.Resource;
  }
});

var _platform = require('./platform');

Object.defineProperty(exports, 'defaultServiceName', {
  enumerable: true,
  get: function get() {
    return _platform.defaultServiceName;
  }
});

var _detectors = require('./detectors');

Object.defineProperty(exports, 'browserDetector', {
  enumerable: true,
  get: function get() {
    return _detectors.browserDetector;
  }
});
Object.defineProperty(exports, 'browserDetectorSync', {
  enumerable: true,
  get: function get() {
    return _detectors.browserDetectorSync;
  }
});
Object.defineProperty(exports, 'envDetector', {
  enumerable: true,
  get: function get() {
    return _detectors.envDetector;
  }
});
Object.defineProperty(exports, 'envDetectorSync', {
  enumerable: true,
  get: function get() {
    return _detectors.envDetectorSync;
  }
});
Object.defineProperty(exports, 'hostDetector', {
  enumerable: true,
  get: function get() {
    return _detectors.hostDetector;
  }
});
Object.defineProperty(exports, 'hostDetectorSync', {
  enumerable: true,
  get: function get() {
    return _detectors.hostDetectorSync;
  }
});
Object.defineProperty(exports, 'osDetector', {
  enumerable: true,
  get: function get() {
    return _detectors.osDetector;
  }
});
Object.defineProperty(exports, 'osDetectorSync', {
  enumerable: true,
  get: function get() {
    return _detectors.osDetectorSync;
  }
});
Object.defineProperty(exports, 'processDetector', {
  enumerable: true,
  get: function get() {
    return _detectors.processDetector;
  }
});
Object.defineProperty(exports, 'processDetectorSync', {
  enumerable: true,
  get: function get() {
    return _detectors.processDetectorSync;
  }
});
Object.defineProperty(exports, 'serviceInstanceIdDetectorSync', {
  enumerable: true,
  get: function get() {
    return _detectors.serviceInstanceIdDetectorSync;
  }
});

var _detectResources = require('./detect-resources');

Object.defineProperty(exports, 'detectResourcesSync', {
  enumerable: true,
  get: function get() {
    return _detectResources.detectResourcesSync;
  }
});
Object.defineProperty(exports, 'detectResources', {
  enumerable: true,
  get: function get() {
    return _detectResources.detectResources;
  }
});