var app = angular.module('app');
app.controller('userAddController', function($scope, $resource, $http) {
    $scope.test = 'users';
    console.log($scope.test);

    $scope.addUser = function(){
        $http.post('/api/users', {name:$scope.name, username: $scope.username, password : $scope.password} ,
            {
                headers : {'Authorization' : "Basic " + window.btoa("admin:admin")}
            })
            .then(function(response){
                console.log(response);
        })
    }
});
