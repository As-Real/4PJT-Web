var app = angular.module('app');
app.controller('presentationController', function($scope, $resource, $http, $cookies) {
    $scope.test = 'Presentation controller is working';
    console.log($scope.test);
});
