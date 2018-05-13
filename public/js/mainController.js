var app = angular.module('app');
app.controller('mainController', function($scope) {
    $scope.test = 'index';
    console.log($scope.test);
});
