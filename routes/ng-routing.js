var app = angular.module('app', ["ngRoute", "ngResource"]).config(
    function($routeProvider,$locationProvider) {
        $locationProvider.html5Mode(true);

            $routeProvider
                .when("/users/main", {
                    templateUrl: "/views/ng-routing/main.html"
                    , controller: "mainController"
                })
                .when("/users/add", {
                    templateUrl: "/views/ng-routing/addUser.html"
                    , controller: "userAddController"
                })
                .when("/users/list", {
                    templateUrl: "/views/ng-routing/listUser.html"
                    , controller: "userListController"
                })
    }
);
