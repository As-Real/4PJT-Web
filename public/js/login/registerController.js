var app = angular.module('app');
app.controller('registerController', function($scope, $resource, $http, $cookies, $window) {

    $scope.create = function(){
        $http.post('/api/users', {name:$scope.name, username: $scope.username, password : $scope.password} ,
            {
                headers : {'Authorization' : $cookies.get('auth')}
            })
            .then(function(response) {
                $scope.authParam = "Basic " + window.btoa($scope.username + ":" + $scope.password);
                $cookies.put('auth', $scope.authParam);
                $window.location.href = '/front/';
            },function (error) {
                $scope.showSnackBar("Une erreur est survenue : " +  error.data)
            });

    }

    $scope.showSnackBar = function(message){
        var snackbarContainer = document.querySelector('#alert-snackbar');
        var data = {message: message, timeout : 5000};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

});
