'use strict'
angular.module('app').directive('appPositionInfo', ['$http',function($http){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			isActive:'=',
			isLogin:'=',
			pos:'='
		}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'view/template/positionInfo.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope) {
			$scope.$watch('pos', function(newValue) {
				if(newValue){
					$scope.pos.select=$scope.pos.select||false;
					$scope.imagePath=$scope.pos.select?'image/star-active.png':'image/star.png';
				}		
			});
			$scope.favorite=function () {
				$http.post('/data/favorite.json', {
					id: $scope.pos.id,
					select: !$scope.pos.select
				}).success(function (resp) {
					$scope.pos.select=!$scope.pos.select;
					$scope.imagePath=$scope.pos.select?'image/star-active.png':'image/star.png';
				})
			}
		}
	};
}]);