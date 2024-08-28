import angular from "angular";
import TodoListController from "./todoListController";
const app = angular.module("todoApp", []);
app.controller("TodoListController", TodoListController);
