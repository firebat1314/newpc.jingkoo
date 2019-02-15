myApp.controller('DistributionDivisionControl', function ($scope, $rootScope, $http, $stateParams, $data) {
   //控制首页会员中心显隐
   $rootScope.isShow = false;
   //控制header和footer显隐
   $rootScope.change = true;

   $scope.selectIndex = -1;
   var cool = layer.load(0, {
      shade: [0.3, '#fff']
   });
   //闪购除了全部的数据

   $data.getCategoryDistribution().success(function (data) {
      layer.close(cool);
      if (data.status) {
         $scope.category = data;
         $scope.getPromote(-1);
      }
   })
   //获取全部闪购的数据
   $scope.getPromote = function (index) {
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
      }).success(function (data) {
         layer.close(cool);
         if (data.status) {
            $scope.data = data;
         }
      })
   };

   $scope.next = function () {
      $scope.getPromote(++$scope.selectIndex);
   };

   $scope.render = function (index) {
      setTimeout(function () {
         (function (e) {
            var cle = document.querySelector(".cle");
            for (var j = 0, items = cle.children; j < items.length; j++) {

               var box = items[j];
               var as = box.children;
               if(as.length==1){
                  as[0].style.flex = '1';
                  return 
               }else{

               }
               var between = 0;

               var imgWidth = 400;

               //循环遍历 as 绑定背景图
               for (var i = 0; i < as.length; i++) {
                  if (i == 0) {
                     $(as[0]).animate({
                        "width": Math.floor(imgWidth)
                     })
                  } else {
                     $(as[i]).animate({
                        "width": Math.floor((box.offsetWidth - imgWidth) / (as.length - 1)) - between
                     })
                  }
                  //给每一个li注册鼠标经过事件 鼠标经过后要排他
                  (function (list) {
                     list[i].onmouseenter = function () {
                        $(this).stop().css({
                           "width": Math.floor(imgWidth)
                        }).siblings().css({
                           "width": Math.floor((box.offsetWidth - imgWidth) / (list.length - 1)) - between
                        });
                     };
                  })(as)

               }

            }

         })(this)

      }, 1000);
   }
})