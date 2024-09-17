console.log("insider printer1.js");
logData("INFO", "testing info message using new logger version 2 ");

console.log(tracer);
const span = tracer.startSpan("button-click");
span.setAttribute("button.id", "myButton");
logData("INFO", "test");
span.end();
