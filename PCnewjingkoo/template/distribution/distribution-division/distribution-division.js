myApp.controller('DistributionDivisionControl', function($scope, $rootScope,$http, $stateParams, $data) {
   //控制首页会员中心显隐
   $rootScope.isShow = false;
   //控制header和footer显隐
   $rootScope.change = true;

   $scope.selectIndex = -1;
   var cool = layer.load(0, {
      shade: [0.3, '#fff']
   });
   //闪购除了全部的数据

   $data.getCategoryDistribution().success(function(data) {
      layer.close(cool);
      if (data.status) {
         $scope.category = data;
         $scope.getPromote(-1);
      }
   })
   //获取全部闪购的数据
   $scope.getPromote = function(index) {
      var cat_id;
      if (index >= 0 && index < $scope.category.data.length) {
         $scope.selectIndex = index;
         cat_id = $scope.category.data[index].cat_id;
      } else {
         $scope.selectIndex = -1;
         cat_id = 0;
      }
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $http({
         method: "GET",
         url: '' + $rootScope.ip + '/Distribution/category_goods',
         params: {
            cat_id: cat_id
         },
      }).success(function(data) {
         layer.close(cool);
         if (data.status) {
            $scope.data = data;
         }
      })
   };

   $scope.next = function() {
      $scope.getPromote(++$scope.selectIndex);
   };
})