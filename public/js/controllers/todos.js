appTodos.controller('TodosController', function ($scope, $localStorage, Users, Lists, Todos, ngDialog, SweetAlert) {
    $scope.lists = {};
    $scope.todos = {};

    $scope.reload = function () {
        Lists.get(null, 'userId=' + $localStorage.userId).then(function (data) {
            $scope.lists = data;
        });
    };

    $scope.todosLoad = function() {
        if($localStorage.opened.length > 0) {
            Todos.get(null, 'userId=' + $localStorage.userId + '&listId=' + $localStorage.opened).then(function (data) {
                $scope.todos[$localStorage.opened] = data;
            });
        }

    };

    $scope.createList = function () {
        ngDialog.open({
            template: 'pages/todos/addlist.html',
            scope: $scope,
            controller: function ($scope) {
                $scope.list = {};
                $scope.saveList = function () {
                    if ($scope.addListForm.$valid) {
                        $scope.list.userId = $localStorage.userId;
                        Lists.post($scope.list).then(function (data) {
                            SweetAlert.swal("List successfully added", "", "success");
                            $scope.reload();
                            ngDialog.closeAll();
                        });
                    }
                }
            }
        });
    };

    $scope.editList = function (listId) {
        Lists.get(listId).then(function (data) {
            $scope.list = data[0];
            ngDialog.open({
                template: 'pages/todos/addlist.html',
                scope: $scope,
                controller: function ($scope) {
                    $scope.saveList = function () {
                        if ($scope.addListForm.$valid) {
                            Lists.put($scope.list._id, $scope.list).then(function (data) {
                                SweetAlert.swal("List successfully updated", "", "success");
                                $scope.reload();
                                ngDialog.closeAll();
                            });
                        }
                    }
                }
            });
        });
    };

    $scope.removeList = function (listId) {
        Lists.get(listId).then(function (data) {
            $scope.list = data[0];
            ngDialog.open({
                template: 'pages/todos/removelist.html',
                scope: $scope,
                controller: function ($scope) {
                    $scope.confirmRemoving = function () {
                        Lists.remove($scope.list._id).then(function (data) {
                            if (data.result == true) {
                                SweetAlert.swal("List successfully remove", "", "success");
                            } else {
                                SweetAlert.swal("Something went wrong while removing!", "", "danger");
                            }
                            $scope.reload();
                            ngDialog.closeAll();
                        });
                    };
                }
            });
        });
    };

    $scope.openList = function (listId) {
        $localStorage.opened = listId;
        $scope.todosLoad();
    };

    $scope.isOpened = function(listId) {
        if(listId == $localStorage.opened) {
            return true;
        }
        return false;
    };

    $scope.addTodo = function(listId) {
        ngDialog.open({
            template: 'pages/todos/addtodo.html',
            scope: $scope,
            controller: function ($scope) {
                $scope.todo = {};
                $scope.saveTodo = function () {
                    if ($scope.addTodoForm.$valid) {
                        $scope.todo.userId = $localStorage.userId;
                        $scope.todo.listId = listId;
                        Todos.post($scope.todo).then(function (data) {
                            SweetAlert.swal("Todo Item successfully added", "", "success");
                            $scope.todosLoad();
                            ngDialog.closeAll();
                        });
                    }
                }
            }
        });
    };

    $scope.removeTodo = function (todoId) {
        Todos.get(todoId).then(function (data) {
            $scope.todo = data[0];
            ngDialog.open({
                template: 'pages/todos/removetodo.html',
                scope: $scope,
                controller: function ($scope) {
                    $scope.confirmRemoving = function () {
                        Todos.remove($scope.todo._id).then(function (data) {
                            if (data.result == true) {
                                SweetAlert.swal("Todo successfully remove", "", "success");
                            } else {
                                SweetAlert.swal("Something went wrong while removing!", "", "danger");
                            }
                            $scope.todosLoad();
                            ngDialog.closeAll();
                        });
                    };
                }
            });
        });
    };

    $scope.completeTodo = function (todoId) {
        Todos.get(todoId).then(function (data) {
            $scope.todo = data[0];
            ngDialog.open({
                template: 'pages/todos/completetodo.html',
                scope: $scope,
                controller: function ($scope) {
                    $scope.confirmComplete = function () {
                        $scope.todo.completed = true;
                        Todos.put($scope.todo._id, $scope.todo).then(function (data) {
                            SweetAlert.swal("Todo successfully completed", "", "success");
                            $scope.todosLoad();
                            ngDialog.closeAll();
                        });
                    };
                }
            });
        });
    };

    $scope.reopenTodo = function (todoId) {
        Todos.get(todoId).then(function (data) {
            $scope.todo = data[0];
            ngDialog.open({
                template: 'pages/todos/reopentodo.html',
                scope: $scope,
                controller: function ($scope) {
                    $scope.confirmReopen = function () {
                        $scope.todo.completed = false;
                        Todos.put($scope.todo._id, $scope.todo).then(function (data) {
                            SweetAlert.swal("Todo successfully Re-Opened", "", "success");
                            $scope.todosLoad();
                            ngDialog.closeAll();
                        });
                    };
                }
            });
        });
    };

    $scope.editTodo = function (todoId) {
        Todos.get(todoId).then(function (data) {
            $scope.todo = data[0];
            ngDialog.open({
                template: 'pages/todos/addtodo.html',
                scope: $scope,
                controller: function ($scope) {
                    $scope.saveTodo = function () {
                        if ($scope.addTodoForm.$valid) {
                            Todos.put($scope.todo._id, $scope.todo).then(function (data) {
                                SweetAlert.swal("Todo successfully updated", "", "success");
                                $scope.todosLoad();
                                ngDialog.closeAll();
                            });
                        }
                    }
                }
            });
        });
    };

    $scope.reload();
    $scope.todosLoad();
});