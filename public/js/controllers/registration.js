appTodos.controller('registrationController', function ($scope, $location, Users, SweetAlert) {
    $scope.users = {};

    $scope.register = function () {
        if ($scope.registerForm.$valid) {
            var count = 0;
            Users.get(null, 'email=' + $scope.user.email).then(function (data) {
                count = data.length;
                if (count == 0) {
                    Users.post($scope.user).then(function (data) {
                        SweetAlert.swal("User successfully created", "", "success");
                        $location.path('/login');
                    });
                } else {
                    SweetAlert.swal("User with same E-mail already exists", "", "error");
                }
            });
        }
    };

    $scope.reset = function (form) {
        if (form) {
            Users.get().then(function(data){
                console.log(data);
            });
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.user = {};
    };
});