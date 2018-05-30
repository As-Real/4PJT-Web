var app = angular.module('app', ["ngRoute", "ngResource", 'ngCookies'])


    .config(
    function($routeProvider,$locationProvider) {

        var $cookies;
        angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
            $cookies = _$cookies_;
        }]);

        $locationProvider.html5Mode(true);

            $routeProvider
                .when("/front/", {
                    templateUrl: "/views/main/main.html"
                    , controller: "mainController"
                })
                .when("/front/login", {
                    templateUrl: "/views/login.html"
                    , controller: "loginController"
                })
                .when("/front/users/add", {
                    templateUrl: "/views/users/addUser.html"
                    , controller: "userAddController"
                })
                .when("/front/users/list", {
                    templateUrl: "/views/users/listUser.html"
                    , controller: "userListController"

                })
                .when("/front/files/upload", {
                    templateUrl: "/views/files/upload.html"
                    , controller: "uploadController"

                })
                .when("/front/files/download", {
                    templateUrl: "/views/files/download.html"
                    , controller: "downloadController"
                })
    })
    .run(
        function($rootScope, $cookies, $location) {

        $rootScope.$on('$routeChangeStart', function (event, next) {
            if(next.$$route.originalPath !== "/front/login"){
                if ($cookies.get('auth') === undefined || $cookies.get('auth') === null) {
                    event.preventDefault();
                    $rootScope.$evalAsync(function() {
                        $location.path('/front/login');
                    });
                }
            }
        });
    });
