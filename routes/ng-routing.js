var app = angular.module('app', ["ngRoute", "ngResource", 'ngCookies'])


	.config(
		function ($routeProvider, $locationProvider) {

			var $cookies;
			angular.injector(['ngCookies']).invoke(['$cookies', function (_$cookies_) {
				$cookies = _$cookies_;
			}]);

			$locationProvider.html5Mode(true);

			$routeProvider
				.when("/anon/main", {
					templateUrl: "/views/unauthentified/presentation.html"
					, controller: "presentationController"
				})
				.when("/anon/login", {
					templateUrl: "/views/unauthentified/login.html"
					, controller: "loginController"
				})
				.when("/anon/register", {
					templateUrl: "/views/unauthentified/register.html"
					, controller: "registerController"
				})
				.when("/front/", {
					templateUrl: "/views/main/main.html"
					, controller: "mainController"
				})
				.when("/front/logout", {
					templateUrl: "/views/logout.html"
					, controller: "loginController"
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
		function ($rootScope, $cookies, $window) {

			$rootScope.$on('$routeChangeStart', function (event, next) {
				if (next.$$route.originalPath !== "/anon/login"
					&& next.$$route.originalPath !== "/anon/register"
					&& next.$$route.originalPath !== "/anon/main") {
					if ($cookies.get('auth') === undefined || $cookies.get('auth') === null) {
						event.preventDefault();
						$rootScope.$evalAsync(function () {
							$window.location.href = '/anon/login';
						});
					}
				}
				else {
					if ($cookies.get('auth') !== undefined && $cookies.get('auth') !== null) {
						event.preventDefault();
						$rootScope.$evalAsync(function () {
							$window.location.href = '/front/';
						});
					}

				}
			});
		});
