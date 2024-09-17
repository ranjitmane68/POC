"use strict";

// Start a new span for the HTTP request
var span = tracer.startSpan("HTTP ".concat(config.method, " ").concat(config.url), {
  attributes: {
    "http.method": config.method,
    "http.url": config.url
  }
});
