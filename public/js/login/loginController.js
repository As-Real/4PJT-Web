var app = angular.module('app');
app.controller('loginController', function($scope, $resource, $http, $cookies, $window, $location) {
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
                    $cookies.put('auth', $scope.authParam);
                    $window.location.href = '/front/';
                },
                function (error) {
                    console.log(error);
                    $scope.showSnackBar("Une erreur est survenue : " +  error.data)
                });
    };

    $scope.logout = function(){
        $cookies.remove('auth');
        $window.location.href = '/anon/login';
    };

    $scope.showSnackBar = function(message){
        var snackbarContainer = document.querySelector('#alert-snackbar');
        var data = {message: message, timeout : 5000};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };
});
