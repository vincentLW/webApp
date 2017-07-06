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
