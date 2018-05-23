var app = angular.module('app');
app.controller('mainController', function($scope, $rootScope, $location) {
    $scope.test = 'index';
    console.log($scope.test);
});
