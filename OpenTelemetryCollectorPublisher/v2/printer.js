console.log("insider printer1.js");
logData("INFO", "testing info message using new logger version 2 ");

var tracer = getTracer("test-tracer-fam");
const span = tracer.startSpan("button-click");
span.setAttribute("button.id", "myButton");
logData("INFO", "test");
span.end();
