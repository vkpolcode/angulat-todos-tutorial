appTodos.controller('MainController', function ($scope, $localStorage, accessFactory) {
    $scope.isAuthenticated = $localStorage.isAuthenticated;

    $scope.checkIfVisible = function(url) {
        return accessFactory.checkPermission(url);
    };
});