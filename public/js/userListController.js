var app = angular.module('app');
app.controller('userListController', function($scope, $resource) {
    $scope.users = [];
    $scope.test = 'users';
    console.log($scope.test);

    $scope.resource = $resource('/api/users/');

    $scope.getUsers = function(){
        $scope.resource.query(function(result){
           $scope.users = JSON.parse(angular.toJson(result));
           console.log($scope.users);
           console.log(typeof $scope.users)
        });
    };

    $scope.getUsers();
});
