var app = angular.module('app');
app.controller('userAddController', function($scope, $resource) {
    $scope.test = 'users';
    console.log($scope.test);

    $scope.resource = $resource('/api/users/');

    $scope.addUser = function(){
        $scope.user = {
            name:$scope.name,
            username: $scope.username,
            password : $scope.password};

        $scope.resource.save($scope.user, function(response){
            console.log(response);
        })
    }
});
