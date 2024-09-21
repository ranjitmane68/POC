// Start a new span for the HTTP request
const span = tracer.startSpan(`HTTP ${config.method} ${config.url}`, {
  attributes: {
    "http.method": config.method,
    "http.url": config.url,
  },
});
