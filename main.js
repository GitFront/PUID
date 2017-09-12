var app = angular.module('app', []);
app.controller('appCtrl', [
    '$scope', 
    '$http', 
    function($scope, $http) {

        // 商品列表
        $scope.list = [];
        // 成功回调，接收一个response对象，这个对象有一个data属性，用来获取请求回来的数据
        function getList() {
            $http.get('http://139.199.192.48:8888/api/getprodlist')
            .then(function(resp) {
                $scope.list = resp.data.message
            });
        };
        getList();

        // 删除商品
        $scope.del = function(id, i) {
            $http.get('http://139.199.192.48:8888/api/delproduct/' + id)
            .then(function(resp) {
                // 接口请求成功，证明后端已经把数据删除了，
                // 但是我们前端的list还没有删,
                // 我们要么再请求一次接口获取新的list，
                // 要么手动删除list中对应的数据。
                if(resp.data.status == 0) {
                    $scope.list.splice(i, 1);
                }
            });
        }

        // 添加商品
        $scope.newName = '';
        $scope.add = function() {
            // 效验
            if($scope.newName.trim() == '') {
                alert('请输入商品名称！');
                return;
            }
            // 接口请求
            $http({
                url: 'http://139.199.192.48:8888/api/addproduct/',
                method: 'post',
                data: 'name=' + $scope.newName,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(function(resp) {
                // 请求成功后证明后端数据已添加，但是前端视图也得添加，
                // 这里我们无法手动添加数据了，因为没有id、没有ctime,
                // 所以我们要么reload页面，要么重新请求接口
                if(resp.data.status == 0) {
                    getList();
                }
            });
        };

        // 搜索关键字
        $scope.filterKey = '';

        // 配需关键字
        $scope.orderByKey = '';
        $scope.upOrderBy = function(key) {
            $scope.orderByKey = key;
        };
    }
]);
