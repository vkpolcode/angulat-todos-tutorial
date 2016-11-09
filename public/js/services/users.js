appTodos.factory('Users', function ($http) {
    var get = function ($_id, $filter) {
        var $url = 'http://api.tutorials.loc/api/users.php';
        if(typeof $_id != 'undefined' && $_id != null) {
            $url = 'http://api.tutorials.loc/api/users.php?_id=' + $_id;
            if(typeof $filter != 'undefined' && $filter.length > 0) {
                $url = $url + '&' + $filter;
            }
        } else if(typeof $filter != 'undefined' && $filter.length > 0) {
            $url = $url + '?' + $filter;
        }
        return $http
            .get($url)
            .then(
                function (response) {
                    return response.data;
                }, function (response) {
                    console.log('Error: ');
                    console.log(response);
                    return response;
                }
            );
    };
    var post = function (user) {
        return $http.post('http://api.tutorials.loc/api/users.php', user)
            .then(
                function(response){
                    return response.data;
                },
                function(response){
                    console.log('Error: ');
                    console.log(response.data);
                    return response;
                }
            );
    };
    var put = function($_id, $user){
        return $http.put('http://api.tutorials.loc/api/users.php?_id=' + $_id, $user)
            .then(
                function(response){
                    return response.data;
                },
                function(response){
                    console.log('Error: ');
                    console.log(response.data);
                    return response;
                }
            );
    };
    var remove = function($_id) {
        var $url = 'http://api.tutorials.loc/api/users.php';
        if(typeof $_id != 'undefined') {
            $url = 'http://api.tutorials.loc/api/users.php?_id=' + $_id;
        }
        return $http.delete($url)
            .then(
                function (response) {
                    return response.data;
                }, function (response) {
                    console.log('Error: ');
                    console.log(response);
                    return response;
                }
            );
    };
    var login = function(user) {
        return $http.post('http://api.tutorials.loc/api/login.php', user)
            .then(
                function(response){
                    return response.data;
                },
                function(response){
                    console.log('Error: ');
                    console.log(response);
                    return response;
                }
            );
    };
    return {
        get: get,
        post: post,
        put: put,
        remove: remove,
        login: login
    }
});