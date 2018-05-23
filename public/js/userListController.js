var app = angular.module('app');
app.controller('userListController', function($scope, $resource, $http, $cookies) {
    $scope.users = [];
    $scope.test = 'users';
    console.log($scope.test);
    $scope.errorMessage = "";

    $scope.getUsers = function(){

        $http.get('/api/users/',
            {
                headers : {'Authorization' : $cookies.get('auth')}
            })
            .then(function(result){
                $scope.users = JSON.parse(angular.toJson(result.data));
                console.log($scope.users);
                console.log(typeof $scope.users)
        }, function(err){
                console.log(err);
                if(err.status === 401){
                    $scope.errorMessage = "Vous n'êtes pas autorisé à afficher cette page"
                }
            });
    };

    $scope.getUsers();
});
