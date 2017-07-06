'use strict';

angular.module('app',['ui.router','ngCookies','validation','ngAnimate']);
'use strict'

angular.module('app').value('dict',{}).run(['dict','$http', function(dict,$http){
	$http.get('data/city.json').success(function (resp) {
		dict.city=resp;
	});
	$http.get('data/salary.json').success(function (resp) {
		dict.salary=resp;
	});
	$http.get('data/scale.json').success(function (resp) {
		dict.scale=resp;
	});
	
}]);
'use strict'
angular.module('app').config(['$provide',function($provide) {
	$provide.decorator('$http', ['$delegate','$q', function($delegate,$q){
		$delegate.post=function (url,data,config) {
			var def=$q.defer();
			$delegate.get(url).success(function (resp) {
				def.resolve(resp);
			}).error(function (err) {
				def.reject(err);
			});
			return{
				success:function(cb) {
					def.promise.then(cb);
				},
				error:function (cb) {
					def.promise.then(null,cb);
				}
			}
		}
		return $delegate;
	}]);
	
}]);
'use strict'

angular.module('app').config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
	$stateProvider.state('main',{
		url:'/main',
		templateUrl:'view/main.html',
		controller:'mainCtrl'
	}).state('position',{
		url:'/position/:id',
		templateUrl:'view/position.html',
		controller:'positionCtrl'
	}).state('company',{
		url:'/company/:id',
		templateUrl:'view/company.html',
		controller:'companyCtrl'
	}).state('search',{
		url:'/search',
		templateUrl:'view/search.html',
		controller:'searchCtrl'
	}).state('login',{
		url:'/login',
		templateUrl:'view/login.html',
		controller:'loginCtrl'
	}).state('register',{
		url:'/register',
		templateUrl:'view/register.html',
		controller:'registerCtrl'
	}).state('me',{
		url:'/me',
		templateUrl:'view/me.html',
		controller:'meCtrl'
	}).state('favorite',{
		url:'/favorite',
		templateUrl:'view/favorite.html',
		controller:'favoriteCtrl'
	}).state('post',{
		url:'/post',
		templateUrl:'view/post.html',
		controller:'postCtrl'
	});
	$urlRouterProvider.otherwise('main');
}]);
'use strict'
angular.module('app').config(['$validationProvider', function($validationProvider) {
    var expression = {
        phone: /^1[\d]{10}$/,
        password: function(value) {
        	var str=value+'';
            return str.length > 5;
        },
        required:function (value) {
        	return !!value;
        }
    };
    var defaultMsg = {
        phone: {
            success: '',
            error: '必须是11位手机号'
        },
        password: {
            success: '',
            error: '长度至少6位'
        },
        required:{
        	success: '',
            error: '不能为空'
        }
    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);

'use strict'

angular.module('app').controller('companyCtrl', ['$http','$state','$scope',function ($http,$state,$scope) {
	$http.get('data/company.json?id='+$state.params.id).success(function (resp) {
		$scope.company=resp;
	}); 
}]);
'use strict'

angular.module('app').controller('favoriteCtrl', ['$http','$scope',function ($http,$scope) {
	$http.get('/data/myFavorite.json').success(function (resp) {
		$scope.list=resp;
	});
}]);
'use strict'

angular.module('app').controller('loginCtrl', ['cache','$state','$http','$scope',function (cache,$state,$http,$scope) {
	
	$scope.submit=function () {
		$http.post('/data/login.json', $scope.user).success(function (resp) {
			cache.put('id',resp.id);
			cache.put('name',resp.name);
			cache.put('image',resp.image);
			$state.go('main');
		});
	};

}]);
'use strict'

angular.module('app').controller('mainCtrl', ['$http','$scope',function ($http,$scope) {
	$http.get('/data/positionList.json').success(function (resp) {
		console.log(resp);
		$scope.list=resp;
	}).error(function () {
		
	});

}]);
'use strict'

angular.module('app').controller('meCtrl', ['$state','cache','$http','$scope',function ($state,cache,$http,$scope) {
	if(cache.get('name')){
		$scope.name=cache.get('name');
		$scope.image=cache.get('image');

	}
	$scope.logout=function () {
		cache.remove('id');
		cache.remove('name');
		cache.remove('image');
		$state.go('main');

	};

}]);
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

'use strict'

angular.module('app').controller('postCtrl', ['$http', '$scope', function($http, $scope) {
    $scope.tabList = [{
        id: 'all',
        name: '全部'
    }, {
        id: 'pass',
        name: '面试邀请'
    }, {
        id: 'fail',
        name: '不合适'
    }]
    $http.get('/data/myPost.json').success(function(resp) {
        $scope.positionList = resp;
    });
    $scope.filterObj = {};
    $scope.tClick = function(id, name) {
        switch (id) {
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;
        }
    }

}]);

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

'use strict'

angular.module('app').controller('searchCtrl', ['dict', '$http', '$state', '$scope', function(dict, $http, $state, $scope) {
    $scope.name = '';
    $scope.search = function() {
        $http.get('data/positionList.json?name=' + $scope.name).success(function(resp) {
            $scope.positionList = resp;
        });
    };
    $scope.sheet = {};
    $scope.search();
    $scope.tabList = [{
        id: 'city',
        name: '全国'
    }, {
        id: 'salary',
        name: '薪水'

    }, {
        id: 'scale',
        name: '公司规模'
    }];
    $scope.filterObj={};
    var tabId = '';
    //tab 的点击事件 记录item.id 和item.name
    $scope.tClick = function(id, name) {
        tabId = id;
        $scope.sheet.list = dict[id];
        $scope.sheet.visiable = true;
        console.log(id, name);
    };
    //selec弹出标签的点击事件 记录item.id 和item.name
    $scope.sClick = function(id, name) {
        //select 的id
        if (id) {
            angular.forEach($scope.tabList, function(item) {
                //show which tab is selected
                if (item.id == tabId) {
                    item.name = name;
                }

            });
        //给过滤obj设置值 比如{cityId: c2}
        $scope.filterObj[tabId+'Id']=id;

        } else {
            //不限制的话把 filterObj 限制条件删除
            delete $scope.filterObj[tabId+'Id'];
            //when select 全国 薪水 不限的时候 select id=‘’
            angular.forEach($scope.tabList, function(item) {
                //找出选择的tab 标签
                if (item.id == tabId) {
                    switch (item.id) {
                        case 'city':
                            item.name = '全国';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                        default:
                    }
                }

            });

        }
    }

}]);

'use strict'

angular.module('app').directive('appCompany', [ function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			com:'='
		}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'view/template/company.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {

		}
	};
}]);
'use strict'

angular.module('app').directive('appFoot',[function () {
	return{
		restrict:'A',
		replace:false,
		templateUrl:'view/template/foot.html' 
	};
}]);
'use strict'
angular.module('app').directive('appHead', ['cache', function(cache) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/head.html',
        link: function($scope) {
        		$scope.name=cache.get('name')||'';
        }

    };
}]);

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

'use strict'

angular.module('app').directive('appSheet', [function(){
	
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			list:'=',
			visiable:'=',
			select:'&'
		}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'view/template/sheet.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
		}
	};
}]);
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
'use strict'
angular.module('app').filter('filterByObj',[function () {
	return function (list,obj) {
		var result=[];
		angular.forEach(list, function(item){
			var isEqual=true;
			for(var e in obj){
				if(item[e]!==obj[e]){
					isEqual=false;
				}
			}
			if(isEqual){
				result.push(item);
			}
		});
		return result;
	};
}])
'use strict'
angular.module('app').
// service('cache', ['$cookies', function($cookies) {
//     this.put = function(key, value) {
//         $cookies.put(key, value);
//     };
//     this.get = function(key) {
//         return $cookies.get(key);
//     };
//     this.remove = function(key) {
//         $cookies.remove(key);
//     };

// }]);
factory('cache', ['$cookies', function($cookies){
	return {
		put:function (key,value) {
			 $cookies.put(key, value);
		},
		get:function(key) {
        return $cookies.get(key);
    	},
    	remove:function (key) {
    		$cookies.remove(key);
    	}
	};
}]);
