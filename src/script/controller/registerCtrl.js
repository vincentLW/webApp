'use strict'

angular.module('app').controller('registerCtrl', ['$state','$interval', '$http', '$scope', function($state,$interval, $http, $scope) {
    $scope.submit = function() {
        $http.post('/data/regist.json', $scope.user).success(function (resp) {
        	console.log(resp);
        	$state.go('login');
        });
    };
    var count=60;
    $scope.send = function() {
        $http.get('/data/code.json').success(function(resp) {
            if (resp.state == 1) {
                count = 60;
                $scope.time = '60s';
                var interval = $interval(function() {
                    if (count <= 0) {
                        $interval.cancel(interval);
                        $scope.time = '';
                    } else {
                        count--;
                        $scope.time = count + 's';
                    }
                }, 1000);
            }
        });
    };

}]);
