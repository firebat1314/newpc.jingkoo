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
		$scope.$apply($scope.orderData);
	}
	$scope.submit = function() {
		console.log($scope.orderData)
		$data.commentInsertComment({
			data: $scope.orderData
		}).success(function(res) {
			if (res.status == 1) {
				$state.go('comment-over');
			} else {
				layer.msg(res.info);
			}
		})
	}
})