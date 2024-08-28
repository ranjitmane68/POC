import angular from "angular";

const opentelemetry = require("@opentelemetry/api");
const { trace } = require("@opentelemetry/api");

const tracer1 = opentelemetry.trace.getTracer(
  "instrumentation-scope-name",
  "instrumentation-scope-version"
);

export default function TodoListController() {
  console.log("starting tracer");

  const tracer = trace.getTracer("angularjs-datadogwithotel");
  console.log("tracer1", tracer1);
  console.log("tracer", tracer);

  tracer.startSpan("testing testing mock123");
  tracer1.startSpan("testing testing mock123");
  var todoList = this;
  todoList.todos = [
    { text: "learn AngularJS", done: true },
    { text: "build an AngularJS app", done: false },
  ];

  todoList.addTodo = function () {
    return tracer.startActiveSpan("addTodo", (span) => {
      console.log("entering span!!");
      // Be sure to end the span!
      span.end();
      console.log("exiting span!!");
    });

    todoList.todoText = "";
  };

  todoList.remaining = function () {
    var count = 0;
    angular.forEach(todoList.todos, function (todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  todoList.archive = function () {
    var oldTodos = todoList.todos;
    todoList.todos = [];
    angular.forEach(oldTodos, function (todo) {
      if (!todo.done) todoList.todos.push(todo);
    });
  };
}
