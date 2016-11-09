appTodos.directive("passwordConfirm", function() {
    return {
        require: "ngModel",
        scope: {
            passwordConfirm: '='
        },
        link: function(scope, element, attributes, controller) {
            scope.$watch(function(){
                var combined;

                if(scope.passwordConfirm || controller.$viewValue) {
                    combined = scope.passwordConfirm + '_' + controller.$viewValue;
                }
                return combined;
            }, function(value) {
                if(value) {
                    controller.$parsers.unshift(function (viewValue) {
                        var origin = scope.passwordConfirm;
                        if (origin !== viewValue) {
                            controller.$setValidity('passwordConfirm', false);
                            return undefined;
                        } else {
                            controller.$setValidity('passwordConfirm', true);
                            return viewValue;
                        }
                    })
                }
            })
        }
    };
});