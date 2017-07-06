'use strict'

angular.module('app').controller('positionCtrl', ['$log','$q', '$http', '$state', '$scope','cache',function($log,$q, $http, $state, $scope,cache) {
    cache.remove('to');
    //强行转换成Boolean 值
    $scope.isLogin = !!cache.get('name');
    $scope.message=$scope.isLogin?'投个简历':'去登陆';
    function getPosition() {
        var def = $q.defer();
        $http.get('/data/position.json',{
            params:{
                id:$state.params.id
            }
        }).success(function(resp) {
            $scope.position = resp;
            def.resolve(resp);
        }).error(function(err) {
            def.reject(err);
        });
        return def.promise;
    }

    function getCompany(id) {
        $http.get('/data/company.json?id=' + id).success(function(resp) {
            $scope.company = resp;
        })
    }
    
    getPosition().then(function(obj) {
        getCompany(obj.companyId);
    });
    $scope.go=function () {
        if($scope.isLogin){
            $http.post('/data/handle.json', {
                id:$scope.position.id
            }).success(function (resp) {
                $log.info(resp);
                $scope.message='已投递';
            });

        }else{
            $state.go('login');
        }
    };

}]);
