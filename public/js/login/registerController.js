var app = angular.module('app');
app.controller('registerController', function($scope, $resource, $http, $cookies) {
    $scope.test = 'users';
    console.log($scope.test);

    $scope.addUser = function(){
        $http.post('/api/users', {name:$scope.name, username: $scope.username, password : $scope.password} ,
            {
                headers : {'Authorization' : $cookies.get('auth')}
            })
            .then(function(response){
                console.log(response);
        })
    }
});
