var app = angular.module('app');
app.controller('downloadController', function($scope, $resource, $http, $cookies) {
    $scope.test = 'download';
    console.log($scope.test);

    $scope.path = "";

    $scope.down = function() {
        if(!$scope.path){
            return;
        }
        //Call API
        $http.post('/api/files/download', {path : $scope.path} ,
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
                $scope.showSnackBar("Une erreur est survenue : " +  error.data)
            });
    };

    function getFileName(contentDisposition) {
        var fileName = contentDisposition.split(';')[1].trim().split('=')[1];
        return fileName.replace(/"/g, '');
    }
    $scope.showSnackBar = function(message){
        var snackbarContainer = document.querySelector('#alert-snackbar');
        var data = {message: message, timeout : 5000};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

});


