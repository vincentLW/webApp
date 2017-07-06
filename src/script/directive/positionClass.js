'use strict'

angular.module('app').directive('appPositionClass', [function() {
    // Runs during compile
    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'view/template/positionClass.html',
        replace: true,
        scope: {
            com: '='
        },
        link: function($scope) {
            $scope.showPositionList = function(idx) {
                    $scope.positionList = $scope.com.positionClass[idx].positionList;
                    $scope.isActive = idx;
                };
                //set default btn
            $scope.$watch('com', function(newValue) {
                if(newValue){
                  $scope.showPositionList(0);  
                }
            });
            
        }
    };
}]);
