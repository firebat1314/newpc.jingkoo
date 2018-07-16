myApp.controller('orderDetailDistributionControl', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', '$stateParams', '$anchorScroll', '$location', function ($scope, $rootScope, $state, $http, ipCookie, $window, $data, $stateParams, $anchorScroll, $location) {
   //控制首页会员中心显隐
   $rootScope.isShow = false;
   //控制header和footer显隐
   $rootScope.change = true;

   //搜索框显隐
   $scope.jf = 2;
   //		接收id
   $scope.orderid = $stateParams.orderId;

   var cool = layer.load(0, { shade: [0.3, '#fff'] });
   $data.getOrderInfo({ order_id: $scope.orderid }).success(function (data) {
      layer.close(cool);
      $scope.orderDetail = data;
      $scope.butie_price = (Number(data.order.supp_subsidy_amount) + Number(data.order.subsidy_amount)).toFixed(2);
   }).error(function (data, staus) {
      layer.close(cool);
      if (staus == 401) {
         ////layer.msg('用户失效，请重新登录');
         ipCookie.remove('has_login');
         ipCookie.remove('token');
         location.href = "/default.html";
      }
   })

   $data.getWlMsg({ order_id: $scope.orderid }).success(function (data) {
      $scope.WlMsg = data;
      $scope.wlData = data.data;
   })

   //再次购买
   $scope.buyAgain1 = function (order_id) {
      $http({
         method: "POST",
         url: '' + $rootScope.ip + '/User/align_buy',
         data: { order_id: order_id },
      }).success(function (data) {
         if (data.status == 0) {
            layer.msg(data.info, { icon: 2, time: 3000 })
         } else {
            $rootScope.$broadcast('upCarList');
            $state.go('shop-car');
         }
      })
   }
   //取消订单
   $scope.cancleOrder = function (order_id) {
      layer.confirm('您确定取消么？', {
         btn: ['确定', '取消'] //按钮
      }, function () {
         $data.cancelOrder({
            order_id: order_id
         })
            .success(function (data) {
               if (data.status) {
                  layer.msg('删除成功', {
                     icon: 1
                  });
                  $state.go('order-all', { type1: '' });
               } else {
                  layer.msg('删除失败', {
                     icon: 2
                  });
               }
            })
      })

   }
   //		跳到支付页
   $scope.goOverPage = function (order_id) {
      if(!$rootScope.canCheckout){
         layer.msg('无结算权限，请联系企业管理员', { time: 2000 });
         return 
     }
      if (order_id) {
         $state.go('paymentNew', { order_id: order_id, log_id: '', type: 'order' });
      } else {
         layer.msg('请检查商品是否存在', { icon: 1, time: 3000 });
      }
   }

   //		确认收货
   $scope.QrGet = function (order_id) {
      $data.QrGetGoods({
         order_id: order_id
      }).success(function (data) {
         if (data.status == 0) {
            layer.msg(data.info, { icon: 2, time: 3000 });
         } else {
            layer.msg(data.info, { icon: 1, time: 3000 });
            $state.go('order-all', { type1: '' })
         }
      })
   }
   //删除订单

   //		去商品详情
   $scope.goGoodsDetail = function (goods_id, cutting_id) {
      if (cutting_id > 0) {
         window.open($state.href('shop-detail-cut', {
            goods_id: goods_id,
            cutting_id: cutting_id
         }), '_blank');
      } else {
         window.open($state.href('shop-detail', {
            goods_id: goods_id
         }), '_blank');
      }
   }
   //详情返修

   //多个提交申请-退货

   $scope.allGoods = {
      type: '',
      orders: {
         order_ids: [$scope.orderid],
         rec_ids: []
      }
   };

   //      var cli = true;
   //      $scope.chooseSingle = function(select,index){
   //      	if(cli){
   //      		cli = false;
   //      		$scope.orderDetail.goods_list[index].select = true;	
   //      	}else{
   //      		cli = true;
   //   			$scope.orderDetail.goods_list[index].select = false;
   //      	}
   //      };
   $scope.chooseAll = function (selectall) {
      var arr = [];
      if (selectall) {
         for (var i = 0; i < $scope.orderDetail.goods_list.length; i++) {
            $scope.orderDetail.goods_list[i].select = true;
            arr.push($scope.orderDetail.goods_list[i].rec_id)
         }
      } else {
         for (var i = 0; i < $scope.orderDetail.goods_list.length; i++) {
            $scope.orderDetail.goods_list[i].select = false;
            arr = [];
         }

      }
   }

   $scope.tuihuoa = function (type) {
      $scope.allGoods.type = type;
      $scope.allGoods.orders.rec_ids = [];
      for (var i = 0; i < $scope.orderDetail.goods_list.length; i++) {
         if ($scope.orderDetail.goods_list[i].select) {
            $scope.allGoods.orders.rec_ids.push($scope.orderDetail.goods_list[i].rec_id);
         }

      }
      $http({
         method: "POST",
         url: '' + $rootScope.ip + '/User/is_goods_repair',
         data: $scope.allGoods,
      }).success(function (data) {
         if (data.status) {
            $state.go('return-repair-content', {
               id: '',
               order_ids: $scope.allGoods.orders.order_ids,
               rec_ids: $scope.allGoods.orders.rec_ids,
               type: $scope.allGoods.type
            });
         } else {
            layer.msg(data.info);
         }
      })
   };

}])