appTodos.controller('loginController', function ($rootScope, $scope, $location, $localStorage, Users, SweetAlert) {
    $scope.message = 'Login Everyone come and see how good i look!';
    $scope.users = {};

    $scope.login = function () {
        if ($scope.loginForm.$valid) {
            Users.login($scope.user).then(function (data) {
                if (data.result == true) {
                    $localStorage.isAuthenticated = true;
                    $localStorage.userRole = data.role;
                    $localStorage.userId = data.id;
                    SweetAlert.swal("You are successfully logged in.", "", "success");
                    $location.path('/');
                } else if (data.result == false) {
                    SweetAlert.swal(data.message, "", "error");
                }
            });
        }
    };

    $scope.reset = function (form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.user = {};
    };

});