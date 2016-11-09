appTodos.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController',
            title: 'Todos - Home Page'
        })
        .when('/registration', {
            templateUrl: 'pages/registration.html',
            controller: 'registrationController',
            title: 'Todos - Registration Page'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'loginController',
            title: 'Todos - Login Page'
        })
        .when('/about', {
            templateUrl: 'pages/about.html',
            controller: 'aboutController',
            title: 'Todos - About Page'
        })
        .when('/users', {
            templateUrl: 'pages/users/users.html',
            controller: 'UsersController',
            title: 'Todos - Users Page'
        })
        .when('/todos', {
            templateUrl: 'pages/todos/index.html',
            controller: 'TodosController',
            title: 'Todos - Todos Page'
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});
appTodos.factory('accessFactory', function ($localStorage) {
    var object = {};
    var userRoleUrls = ['home', 'todos', 'about', 'logout'];
    var guestRoleUrls = ['home', 'about', 'login', 'registration'];
    var adminRoleUrls = ['home', 'todos', 'about', 'users', 'logout'];
    object.checkPermission = function (url) {
        var permission = [];
        if ($localStorage.userRole == 'admin') {
            permission = adminRoleUrls;
        } else if ($localStorage.userRole == 'user') {
            permission = userRoleUrls;
        } else {
            permission = guestRoleUrls;
        }
        if (permission.indexOf(url) !== -1) {
            return true;
        }
        return false;
    };
    return object;
});
appTodos.run(function ($location, $rootScope, $localStorage, accessFactory) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        var currentUrl = current.$$route.originalPath.substring(1);
        if(currentUrl.length == 0) {
            currentUrl = 'home';
        }
        if(!accessFactory.checkPermission(currentUrl)) {
            if (typeof previous === 'undefined') {
                $location.path('/');
            } else {
                $location.path(previous.$$route.originalPath);
            }
        }
    });
    $localStorage.$default({
        isAuthenticated: false,
        userRole: 'guest',
        userId: null,
        opened: ''
    });
    $rootScope.logout = function () {
        $localStorage.$reset({
            isAuthenticated: false,
            userRole: 'guest',
            userId: null,
            opened: ''
        });
        $location.path('/');
    };
});