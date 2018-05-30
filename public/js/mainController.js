var app = angular.module('app');
app.controller('mainController', function($scope, $rootScope, $location, $http, $cookies) {
    $scope.test = 'file list';
    console.log($scope.test);
    $scope.root = {children : {}};


    $scope.reactOnClick = function(object){
        if(object.type !== "folder"){
            alert('ok');
        }
        else{
            if(!object.children){
                $scope.getFolderContent(object.path+"/", object);
            }
            else{
                object.children = null;
            }
        }
    };

    $scope.getFolderContent = function(path, container){
        $http.get('/api/files/list?path=' + path,
            {
                headers : {'Authorization' :  $cookies.get('auth')}
            })
            .then(function (response) {
                container.children = response.data;
                container.displayChildren = true;
                console.log(container);
                },
                function (error) {
                    console.log(error);
                });
    };
    $scope.getFolderContent('/', $scope.root);


    $scope.startDownload = function(object) {
        //Call API
        $http.post('/api/files/download', {path : object.path} ,
            {
                responseType: 'arraybuffer',
                headers : {'Authorization' :  $cookies.get('auth')}
            })
            .then(function (response) {
                    var fileName = getFileName(response.headers('Content-Disposition'));
                    var blob = new Blob(
                        [response.data], { type: response.headers('Content-Type') }
                    );
                    var url = URL.createObjectURL(blob);

                    var anchor = angular.element('<a/>');
                    angular.element(document.body).append(anchor)
                    anchor.attr({
                        href: url,
                        target: '_blank',
                        download: fileName
                    })[0].click();
                },
                function (error) {
                    var a = 1;
                });
    };
    function getFileName(contentDisposition) {
        var fileName = contentDisposition.split(';')[1].trim().split('=')[1];
        return fileName.replace(/"/g, '');
    }

    $scope.fileLoaded = function (ele) {
        $scope.theFile = ele.files[0];
        console.log($scope.theFile);
    };

    $scope.startUpload = function(object){
        if(!$scope.theFile){
            return
        }
        //That phase of FormData is needed to send a file to the API
        var fd = new FormData();
        fd.append('incoming', $scope.theFile);
        fd.append('path', object.path+"/");
        //Call API
        $http.post('/api/files/upload', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,
                'Authorization' :  $cookies.get('auth')}
        })
            .then(function(response) {
                $scope.getFolderContent(object.path+"/", object)
                console.log(response.status);
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    $scope.startRenaming = function(object) {
        //Call API
        var newPath;
        var n = object.path.lastIndexOf(object.name);
        if (n >= 0 && n + object.name.length >= object.path.length) {
            newPath = object.path.substring(0, n) + object.newName;
        }else{
            return;
        }

        $http.post('/api/files/rename', {path : object.path, newPath: newPath } ,
            {
                headers : {'Authorization' :  $cookies.get('auth')}
            })
            .then(function (response) {
                    object.renaming = false;
                    object.name = object.newName;
                    object.path = newPath;
                },
                function (error) {
                    var a = 1;
                });

    };

    $scope.startDelete = function(object) {
        //Call API
        var route;
        if(object.type === "folder"){
            route = '/api/folders/remove'
        }else{
            route = '/api/files/remove'
        }
        $http.post(route, {path : object.path} ,
            {
                headers : {'Authorization' :  $cookies.get('auth')}
            })
            .then(function (response) {
                    object.deleted = true;
                },
                function (error) {
                    var a = 1;
                });

    };

});
