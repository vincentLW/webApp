'use strict'

angular.module('app').directive('appTab', [function(){
	
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			list:'=',
			tabClick:'&'
		}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'view/template/tab.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope) {
			$scope.click=function (tab) {
				$scope.selectId=tab.id;
				$scope.tabClick(tab);
			}
		}
	};
}]);