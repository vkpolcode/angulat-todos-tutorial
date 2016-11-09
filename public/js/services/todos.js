appTodos.factory('Todos', function ($http) {
    var mainUrl = 'http://api.tutorials.loc/api/todos.php';
    var get = function ($_id, $filter) {
        var $url = mainUrl;
        if (typeof $_id != 'undefined' && $_id != null) {
            $url = mainUrl + '?_id=' + $_id;
            if (typeof $filter != 'undefined' && $filter.length > 0) {
                $url = $url + '&' + $filter;
            }
        } else if (typeof $filter != 'undefined' && $filter.length > 0) {
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
    var post = function (todo) {
        return $http.post(mainUrl, todo)
            .then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    console.log('Error: ');
                    console.log(response.data);
                    return response;
                }
            );
    };
    var put = function ($_id, $todo) {
        return $http.put(mainUrl + '?_id=' + $_id, $todo)
            .then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    console.log('Error: ');
                    console.log(response.data);
                    return response;
                }
            );
    };
    var remove = function ($_id) {
        var $url = mainUrl;
        if (typeof $_id != 'undefined') {
            $url = mainUrl + '?_id=' + $_id;
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
    return {
        get: get,
        post: post,
        put: put,
        remove: remove
    }
});