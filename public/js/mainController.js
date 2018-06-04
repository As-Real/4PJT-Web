var app = angular.module('app');
app.controller('mainController', function ($scope, $rootScope, $location, $http, $cookies) {

    // $scope.root stores all data from user files/folder, recursively with a .children attribute for every folder
    // When a button is clicked from a file/folder's menu (individual menu for each file/folder),
    // with a ng-click, a reference to its location in $scope.root is given as an argument to the function
    $scope.root = {children: {}};

	//Can be null, "move" or "create"
	$scope.mode = null;

	$scope.toMove = null;

	//region LIST & DISPLAY

    $scope.reactOnClick = function (object) {
        if (object.type === "folder") {
            if (!object.children) {
                $scope.getFolderContent(object.path + "/", object);
            }
            else {
                object.children = null;
            }
        }
    };


    $scope.getFolderContent = function (path, container) {
		$http.get('/api/files/list?path=' + path,
			{
				headers: {'Authorization': $cookies.get('auth')}
			})
			.then(function (response) {
					container.children = response.data;
					container.displayChildren = true;
				},
				function (error) {
					$scope.showSnackBar("Une erreur est survenue : " + error.data)
				});
	};
	$scope.getFolderContent('/', $scope.root);
	//endregion

	//region DOWNLOAD

	$scope.startDownload = function (object) {
		var apiPath = object.type === "folder" ? "/api/folders/download" : "/api/files/download";
		//Call API
		$http.post(apiPath, {path: object.path},
			{
				responseType: 'arraybuffer',
				headers: {'Authorization': $cookies.get('auth')}
			})
			.then(function (response) {
					var fileName = getFileName(response.headers('Content-Disposition'));
					var blob = new Blob(
						[response.data], {type: response.headers('Content-Type')}
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
					$scope.showSnackBar("Une erreur est survenue : " + bToString(error.data))
				});
	};

	function getFileName(contentDisposition) {
		var fileName = contentDisposition.split(';')[1].trim().split('=')[1];
		return fileName.replace(/"/g, '');
	}

	//endregion

	//region DELETE

	$scope.startDelete = function (object) {
		//Call API
		var route;
		if (object.type === "folder") {
			route = '/api/folders/remove'
		} else {
			route = '/api/files/remove'
		}
		$http.post(route, {path: object.path},
			{
				headers: {'Authorization': $cookies.get('auth')}
			})
			.then(function (response) {
					object.deleted = true;
					$scope.showSnackBar("Element supprimé")
				},
				function (error) {
					$scope.showSnackBar("Une erreur est survenue : " + error.data)
				});

	};
	//endregion

    //region RENAME

    //When ths user clicks on "Rename" button, $scope.renaming boolean is set to true
    // ,so the name of the file/folder in the view is replaced by an input form
    // A var $scope.newName is created. This var will hold the new name the folder/file should have after renaming
    // ,$scope.newName is bound to the input with a ng-model
    // The button "Rename" is replaced by a "Validate" button. When clicked, name is updated to newName in the storage

    $scope.startRenaming = function (object) {
        //Call API
        var newPath;
        var n = object.path.lastIndexOf(object.name);
        if (n >= 0 && n + object.name.length >= object.path.length) {
            newPath = object.path.substring(0, n) + object.newName;
        } else {
            return;
        }

        $http.post('/api/files/rename', {path: object.path, newPath: newPath},
            {
                headers: {'Authorization': $cookies.get('auth')}
            })
            .then(function (response) {
                    object.renaming = false;
                    object.name = object.newName;
                    object.path = newPath;
                    $scope.showSnackBar("Element renommé")

                },
                function (error) {
                    $scope.showSnackBar("Une erreur est survenue : " + error.data)
                });

    };

    //endregion

    //region MOVE,ADD,UPLOAD

	//When one of the buttons Move (on a file/folder); Create Folder (top menu) or Upload File (top menu) is clicked
	//, the $scope.mode is set to a value.
	//When this $scope.mode is different from null, folder icons are replaced by an red arrow.
	//The user can then click on one of these arrows to choose this folder as the destination
	//(move the file to this folder, create a folder in this folder or upload a file to this folder)
	//The action triggered depends on the $scope.mode
	//It is then set to null again

	//When Move is clicked, the file to move is set in $scope.toMove

    $scope.chooseFolder = function (folderParent) {
        if ($scope.mode === "move") {
            $scope.move(folderParent)
        }
        if ($scope.mode === "createFolder") {
            $scope.createFolder(folderParent)
        }
        if ($scope.mode === "uploadFile") {
            $scope.uploadFile(folderParent)
        }
    };


	$scope.startMove = function (file) {
		$scope.mode = 'move';
		$scope.toMove = file;
	};
	$scope.move = function (parent) {
		if (!$scope.toMove) {
			return;
		}
		var newPath = parent.path + '/' + $scope.toMove.name;
		$http.post('/api/files/rename', {path: $scope.toMove.path, newPath: newPath},
			{
				headers: {'Authorization': $cookies.get('auth')}
			})
			.then(function (response) {
					$scope.getFolderContent(parent.path + "/", parent);
					$scope.mode = null;
					$scope.toMove.deleted = true;
					if ($scope.toMove.type === "folder") {
						$scope.toMove.children = null;
					}
					$scope.showSnackBar("Element déplacé")

				},
				function (error) {
					$scope.showSnackBar("Une erreur est survenue : " + error.data)
				});
	};

    $scope.createFolder = function (parent) {
        var folderName = prompt("Nom du dossier");
        if (folderName) {
            $http.post('/api/folders/add', {path: parent.path + '/', folderName: folderName},
                {
                    headers: {'Authorization': $cookies.get('auth')}
                })
                .then(function (response) {
                        $scope.getFolderContent(parent.path + "/", parent)
                        $scope.mode = null;
                        $scope.showSnackBar("Dossier crée")
                    },
                    function (error) {
                        $scope.showSnackBar("Une erreur est survenue : " + error.data)
                    });
        }
    };


    //FileLoaded is called when the user chooses a file to upload from its computer
	//It keeps that file in memory, as itwill be uploaded in the storage
    $scope.fileLoaded = function (ele) {
        $scope.theFile = ele.files[0];
    };

    $scope.uploadFile = function (parent) {
		$scope.startUpload(parent);
		$scope.mode = null;
	};
    $scope.startUpload = function (object) {
        if (!$scope.theFile) {
            return
        }
        //That phase of FormData is needed to send a file to the API
        var fd = new FormData();
        fd.append('incoming', $scope.theFile);
        fd.append('path', object.path + "/");
        //Call API
        $http.post('/api/files/upload', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'Authorization': $cookies.get('auth')
            }
        })
            .then(function (response) {
                $scope.getFolderContent(object.path + "/", object);
                $scope.showSnackBar("Fichier upload")

            })
            .catch(function (error) {
                $scope.showSnackBar("Une erreur est survenue : " + error.data)
            });
    };
    //endregion

	$scope.showSnackBar = function (message) {
		var snackbarContainer = document.querySelector('#alert-snackbar');
		var data = {message: message, timeout: 5000};
		snackbarContainer.MaterialSnackbar.showSnackbar(data);
	};

	$scope.bToString = function (buffer) {
		var unitArray = new Uint8Array(buffer);
		return String.fromCharCode.apply(String, unitArray);
	}

});
