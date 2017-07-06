'use strict'

angular.module('app').directive('appHeadBar', [function() {
    // Runs during compile
    return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'view/template/headBar.html',
        replace: true,
        scope: {
            text: '@'
        },
        link: function(scope) {
            scope.back = function() {
                window.history.back();
            };
        }
    };
}]);
