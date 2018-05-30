var app = angular.module('app');
app.controller('loginController', function($scope, $resource, $http, $cookies) {
    $scope.test = 'Login controller is working';
    console.log($scope.test);

    $scope.username = "";
    $scope.password = "";

    $scope.login = function(){
        $http.post('/api/users/auth', {username: $scope.username, password : $scope.password})
            .then(
                function(response){
                    console.log(response);
                    $scope.authParam = "Basic " + window.btoa($scope.username + ":" + $scope.password);
                    $cookies.put('auth', authParam);
                    $window.location.href = '/';
                },
                function (error) {
                    console.log(error);
                });
    };
});
