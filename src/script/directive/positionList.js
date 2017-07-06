'use strict'

angular.module('app').directive('appPositionList', ['$http', function($http) {
    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        replace: true,
        templateUrl: 'view/template/positionList.html',
        scope: {
            data: '=',
            filterObj: '=',
            isFavorite:'='
        },
        link: function($scope) {
            $scope.select = function(item) {
                $http.post('/data/favorite.json', {
                    id: item.id,
                    select:!item.select
                }).success(function(resp) { 
                    item.select = !item.select;
                })
            };
        }
    };
}]);
