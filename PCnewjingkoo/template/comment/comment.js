myApp.controller('commentController', function($scope, $rootScope, $stateParams, $state, $data) {

	$rootScope.change = true;
	$rootScope.isShow = false;

	$scope.orderId = $stateParams.orderid;
	// $scope.canWrite = null;
	$scope.orderData = null;
	/* 是否可以评论 */
	$scope.is_true = null;
   $scope.supplier_info = null;

	/* $scope.params = {
	   content: null,
	   comment_rank: null,
	   accord_rank: null,
	   service_rank: null,
	   delivery_rank: null,
	   comment_label: null,
	   img: null,
	}; */
	/* 是否可以评论 */
	$data.commentIsComment({
		order_id: $scope.orderId
	}).success(function(res) {
		if (res.status == 1) {
			$scope.is_true = res.is_true;
		}
	})
	/* 获取店铺评分 */
	$data.commentCommentReckon({
		order_id: $scope.orderId,
	}).success(function(res) {
		if (res.status == 1) {
			$scope.commentCommentReckon = res;
		}
	})
	/* 订单信息 */
	$data.getOrderInfo({
		order_id: $scope.orderId
	}).success(function(res) {
		if (res.status == 1) {
			$scope.orderData = res;
         $data.get_supplier_info({
				suppliers_id: res.order.suppliers_id
			}).success(function(res) {
            $scope.supplier_info = res;
         })
		}
	})
	$scope.selectImgs = function(img, item) {
		if (!item.img) {
			item.img = [];
		}
		item.img.push(img);
	}
	$scope.submit = function() {
      var params = {
         goods_list: [],
         accord_rank: $scope.orderData.accord_rank,
         service_rank: $scope.orderData.service_rank,
         delivery_rank: $scope.orderData.delivery_rank,
         is_anonymity: $scope.orderData.is_anonymity,
      }
      for (var i = 0; i < $scope.orderData.goods_list.length; i++) {
         var goods = $scope.orderData.goods_list[i];
         params.goods_list[i] = ({
            comment_rank: goods.comment_rank,
            content: goods.content,
            goods_id: goods.goods_id,
            rec_id: goods.rec_id,
            img: []
         })
         if (goods.img) {
            for (var j = 0; j < goods.img.length; j++) {
               var img = goods.img[j];
               params.goods_list[i].img[j] = img.img_url;
            }
         }
      }
		$data.commentInsertComment({
			data: params
		}).success(function(res) {
			if (res.status == 1) {
				$state.go('comment-over');
			} else {
				layer.msg(res.info);
			}
		})
	}
})