var app = angular.module('app');
app.controller('userListController', function($scope, $resource, $http) {
    $scope.users = [];
    $scope.test = 'users';
    console.log($scope.test);

    $scope.getUsers = function(){

        $http.get('/api/users/',
            {
                headers : {'Authorization' : "Basic " + window.btoa("admin:admin")}
            })
            .then(function(result){
                $scope.users = JSON.parse(angular.toJson(result.data));
                console.log($scope.users);
                console.log(typeof $scope.users)
        });
    };

    $scope.getUsers();
});
