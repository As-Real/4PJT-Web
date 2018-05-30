var app = angular.module('app');
app.controller('registerController', function($scope, $resource, $http, $cookies, $window) {
    $scope.test = 'register';
    console.log($scope.test);

    $scope.create = function(){
        $http.post('/api/users', {name:$scope.name, username: $scope.username, password : $scope.password} ,
            {
                headers : {'Authorization' : $cookies.get('auth')}
            })
            .then(function(response) {
                console.log(response);
                $scope.authParam = "Basic " + window.btoa($scope.username + ":" + $scope.password);
                $cookies.put('auth', $scope.authParam);
                $window.location.href = '/front/';
            },function (error) {
                var prefixPath = storageConfig.path + '/' + id;

            });

    }
});
