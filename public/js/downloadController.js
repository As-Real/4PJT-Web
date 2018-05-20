var app = angular.module('upApp');
app.controller('downloadController', function($scope, $resource, $http) {
    $scope.test = 'download';
    console.log($scope.test);

    $scope.down = function() {
        //Call API
        $http.get('/api/files/download' + "?" + "id=1" + "&" + "path=%2FTeamViewer_Setup.exe",
            {
                responseType: 'arraybuffer'
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

});


