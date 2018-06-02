var app = angular.module('app');
app.controller('uploadController', function($scope, $resource, $http, $cookies) {
    $scope.test = 'upload';
    console.log($scope.test);

    $scope.path = "";

    $scope.theFile = {};

    $scope.fileLoaded = function (ele) {
        $scope.theFile = ele.files[0];
        console.log($scope.theFile);
    };

    $scope.up = function(){
        if(!$scope.path){
            return
        }
        //That phase of FormData is needed to send a file to the API
        var fd = new FormData();
        fd.append('incoming', $scope.theFile);
        fd.append('path', $scope.path);
        //Call API
        $http.post('/api/files/upload', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,
                'Authorization' :  $cookies.get('auth')}
        })
            .then(function(response) {
                $scope.showSnackBar("Fichier upload")
            })
            .catch(function(error) {
                $scope.showSnackBar("Une erreur est survenue : " +  error.data)
            });
    }
    $scope.showSnackBar = function(message){
        var snackbarContainer = document.querySelector('#alert-snackbar');
        var data = {message: message, timeout : 5000};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

});
