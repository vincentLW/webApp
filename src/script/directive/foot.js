'use strict'

angular.module('app').directive('appFoot',[function () {
	return{
		restrict:'A',
		replace:false,
		templateUrl:'view/template/foot.html' 
	};
}]);