var app = angular.module('upApp');
app.controller('uploadController', function($scope, $resource, $http) {
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
            headers: {'Content-Type': undefined, 'Authorization' : "Basic " + window.btoa("admin:admin")}
        })
            .then(function(response) {
                console.log(response.status);
                console.log(response.data);
                })
            .catch(function(error) {
                console.log(error);
            });
    }

});
