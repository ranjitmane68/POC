var logger = require("./app-babel");
var tracer = require("./tracer-babel");
window.logData = logger.logData;
window.tracer = tracer.getTracer("test-tracer");
