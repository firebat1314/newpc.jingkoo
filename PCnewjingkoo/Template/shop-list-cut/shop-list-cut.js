
angular.module('ShopListCutModule', [])

	.controller('ShopListCutControl', function ($scope, $rootScope, $stateParams, $http, ipCookie, $window, $location, $data, $state, $timeout) {
		$rootScope.isShow = false;
		$rootScope.change = true;
		$scope.params = JSON.parse(decodeURIComponent($stateParams.params) || {})
		console.log($scope.params)
		$rootScope.keywords = $scope.params.keywords;
		
		$scope.stateGo = function (data) {
			if (typeof Object.assign != 'function') {
				// Must be writable: true, enumerable: false, configurable: true
				Object.defineProperty(Object, "assign", {
					value: function assign(target, varArgs) { // .length of function is 2
						'use strict';
						if (target == null) { // TypeError if undefined or null
							throw new TypeError('Cannot convert undefined or null to object');
						}

						var to = Object(target);

						for (var index = 1; index < arguments.length; index++) {
							var nextSource = arguments[index];

							if (nextSource != null) { // Skip over if undefined or null
								for (var nextKey in nextSource) {
									// Avoid bugs when hasOwnProperty is shadowed
									if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
										to[nextKey] = nextSource[nextKey];
									}
								}
							}
						}
						return to;
					},
					writable: true,
					configurable: true
				});
			}
			$state.go('shop-list', {
				params: data ? JSON.stringify(Object.assign($scope.params, data)) : {}
			})
		}
		$scope.keyFn = function (id) {
			$scope.stateGo({
				cat_id: id
			})
		};
		//控制收起和更多选项
		$scope.shouQi = false;
		$scope.moreXx = true;
		$scope.moreXxFn = function () {
			$scope.shouQi = true;
			$scope.moreXx = false;
		};
		$scope.shouQiFn = function () {
			$scope.shouQi = false;
			$scope.moreXx = true;
		};

		$scope.ListPage = {
			brand_id: $scope.params.brand_id || null,
			cat_id: $scope.params.cat_id || null,
			filter: $scope.params.filter || null,
			order: $scope.params.order || '',
			stort: $scope.params.stort || null,
			max_price: $scope.params.max_price || null,
			min_price: $scope.params.min_price || null,
			keywords: $scope.params.keywords || null,
			page: $scope.params.page || 1,
			size: 20
		};
		$scope.InitList = function () {
			var cool = layer.load(0, { shade: [0.3, '#fff'] });
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Cutting/cutting_list',
				data: $scope.ListPage,
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					layer.close(cool);
					if (data.status) {
						$scope.shopListData = data;
						$scope.getGoods(data);
						$scope.listControl();//图像延迟加载
						$scope.qxsjFn();

						if ($scope.shopListData.goods_attr_arr[3].data.length == 0) {
							$scope.shouQi = false;
							$scope.moreXx = false;
						} else {
							$scope.shouQi = false;
							$scope.moreXx = true;
						}
						$scope.fashionAllName = data.goods_attr_arr[0].name;
						$scope.fashionPriceName = data.goods_attr_arr[2].name;
						$scope.fashionMonthName = data.goods_attr_arr[1].name;

					}

				}).error(function (data, staus) {
					// layer.close(cool);
					if (staus == 401) {
						////layer.msg('用户失效，请重新登录');
						ipCookie.remove('has_login');
						ipCookie.remove('token');
						location.href = "/default.html";
					}
				})
		};
		$scope.qxsjFn = function () {
			$scope.qxsjAd = null;
			$http({
				method: "GET",
				url: '' + $rootScope.ip + '/Index/get_category_recommend_goods',
				params: {
					type: 'hot',
					is_return: 1,
					cats: $scope.shopListData.ding_id || null
				},
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					//console.log(data);
					$scope.qxsjAd = data;
				});
		};
		$scope.InitList();
		//分页操作
		$scope.options = {
			num_edge_entries: 1, //边缘页数
			num_display_entries: 4, //主体页数
			items_per_page: 1, //每页显示1项
			// prev_text: "上一页",
			// next_text: "下一页",
			link_to: 'javascript:;',
			prev_show_always: false,
			next_show_always: false,
			current_page: $scope.ListPage.page - 1,
			callback: pageIndex
		};
		function pageIndex(index) {
			$scope.stateGo({
				page: index + 1
			})
		};
		//价格筛选
		$scope.enterPrice = function () {
			$scope.stateGo({
				max_price: $scope.ListPage.max_price,
				min_price: $scope.ListPage.min_price,
				page: 1
			})
		};
		//价格清空
		$scope.clearPrice = function () {
			$scope.stateGo({
				max_price: null,
				min_price: null,
				page: 1
			})
		};
		$scope.prevList = function () {//前一页
			$scope.pagination[0].prevPage();
		};
		$scope.nextList = function () {//后一页
			$scope.pagination[0].nextPage();
		};
		$scope.itemFn = function () {
			$(".likeTui").slide({ mainCell: "ul", vis: 4, prevCell: ".sPrev", nextCell: ".sNext", effect: "leftLoop", autoPlay: true });
		};
		$scope.getGoods = function (data) {
			$scope.pagination = $('#Pagination').pagination(data.pages, $scope.options);
		};
		//清空所有已选条件
		$scope.deleteSelect = function () {
			$scope.stateGo({
				max_price: null,
				min_price: null,
				page: 1,
				keywords: null,
				cat_id: null,
				filter: null,
				brand_id: null,
			})
		};
		//取消商品品牌筛选的内容
		$scope.closeFashion = function (e) {
			$scope.stateGo({
				page: 1,
				// keywords: null,
				brand_id: null,
			})
		};
		//获取商品品牌筛选的内容
		$scope.getAllValue = function (value, id) {
			$scope.stateGo({
				page: 1,
				// keywords: null,
				brand_id: id,
			})
			$('.shopList-select-conditions .more-fashion:first').prev().css({
				height: '62'
			})
			$('.shopList-select-conditions .more-fashion:not(:first)').prev().css({
				height: '30'
			})
			$("body,html").animate({
				"scrollTop": $('.shopList-main-tit').offset().top
			}, 100)

			$('.shopList-select-conditions .more-fashion:first').find('i').html('+');
			$('.shopList-select-conditions .more-fashion:not(:first)').find('i').html('+');
		};
		//获取商品价格区间筛选的内容
		$scope.getPriceValue = function (value1, value2) {
			$scope.stateGo({
				page: 1,
				min_price: value1,
				max_price: value2,
			})
			$('.shopList-select-conditions .more-fashion:first').prev().css({
				height: '62'
			})
			$('.shopList-select-conditions .more-fashion:not(:first)').prev().css({
				height: '30'
			})
			$("body,html").animate({
				"scrollTop": $('.shopList-main-tit').offset().top
			}, 100)

			$('.shopList-select-conditions .more-fashion:first').find('i').html('+');
			$('.shopList-select-conditions .more-fashion:not(:first)').find('i').html('+');
		};
		//取消商品分类筛选的内容
		$scope.closeFenlei = function (e) {
			$scope.stateGo({
				page: 1,
				keywords: null,
				cat_id: null,
			})
		};
		$scope.cateAll = function () {
			$scope.stateGo({
				page: 1,
				cat_id: 0,
			})
			$('.shopList-select-conditions .more-fashion:first').prev().css({
				height: '62'
			})
			$('.shopList-select-conditions .more-fashion:not(:first)').prev().css({
				height: '30'
			})
			$("body,html").animate({
				"scrollTop": $('.shopList-main-tit').offset().top
			}, 100)

			$('.shopList-select-conditions .more-fashion:first').find('i').html('+');
			$('.shopList-select-conditions .more-fashion:not(:first)').find('i').html('+');
		};
		//获取商品分类区间筛选的内容
		$scope.getMonthValue = function (value, id) {
			$scope.stateGo({
				page: 1,
				cat_id: id,
			})
			$('.shopList-select-conditions .more-fashion:first').find('i').html('+');
			$('.shopList-select-conditions .more-fashion:not(:first)').find('i').html('+');
		};
		//取消商品属性筛选的内容
		$scope.closeShuxing = function (filter) {
			$scope.stateGo({
				page: 1,
				filter: filter,
			})
		};
		//获取商品属性筛选的内容
		$scope.getAttrValue = function (value, id) {
			$scope.stateGo({
				page: 1,
				filter: id,
			})
			$('.shopList-select-conditions .more-fashion:first').find('i').html('+');
			$('.shopList-select-conditions .more-fashion:not(:first)').find('i').html('+');
			$scope.shouQi = false;
			$scope.moreXx = true;
		};

		//商品综合排序
		$scope.allOrder = function () {
			$scope.stateGo({
				page: 1,
				order: '',
				stort: 'DESC',
			})
		};
		//商品推荐排序
		$scope.tuijianOrder = function () {
			$scope.stateGo({
				page: 1,
				order: 'sales_num',
				stort: 'DESC',
			})
		};
		//商品价格排序
		var good_price = 1;
		$scope.priceOrder = function () {
			if (good_price == 1) {
				$scope.PriceAsOrder();
				good_price = 0;
			} else {
				$scope.PriceDsOrder();
				good_price = 1;
			}
		};
		//价格升序
		$scope.PriceAsOrder = function () {
			$scope.stateGo({
				page: 1,
				order: 'shop_price',
				stort: 'ASC',
			})
		};
		//价格降序
		$scope.PriceDsOrder = function () {
			$scope.stateGo({
				page: 1,
				order: 'shop_price',
				stort: 'DESC',
			})
		};
		//商品时间排序
		$scope.timeOrder = function () {
			$scope.stateGo({
				page: 1,
				order: 'add_time',
			})
		};
		//时间升序
		$scope.timeAsOrder = function () {
			$scope.stateGo({
				page: 1,
				order: 'add_time',
				stort: 'ASC',
			})
		};
		//时间降序
		$scope.timeDsOrder = function () {
			$scope.stateGo({
				page: 1,
				order: 'add_time',
				stort: 'DESC',
			})
		};
		//图片处理函数
		$scope.listControl = function () {
			$timeout(function () {
				$(".picFocus").slide({
					mainCell: ".goods-items-img ul",
					effect: "left",
					autoPlay: false,
					// prevCell: ".sPrev",
					// nextCell: ".sNext",
					//vis:num
				});
			}, 1000)
		};

		//点击更多展开
		$scope.clickMore = function () {
			var more = true;

			$('.shopList-select-conditions .more-fashion:not(:first)').click(function () {
				if (more) {
					more = false;
					$(this).prev().css({
						height: 'auto'
					})
					$(this).find('i').html('-');
				} else {
					$(this).prev().css({
						height: '30'
					})
					more = true;
					$(this).find('i').html('+');
				}
			});
			$('.shopList-select-conditions .more-fashion:first').click(function () {
				if (more) {
					more = false;
					$(this).prev().css({
						height: 'auto'
					})
					$(this).find('i').html('-');
				} else {
					$(this).prev().css({
						height: '62'
					})
					more = true;
					$(this).find('i').html('+');
				}
			});
		};
		$scope.clickMore();

		//猜你喜欢
		$data.guessYouLike().success(function (data) {
			$scope.YouLike = data;
			//console.log(data);
		});

		$scope.likeGoodsFn = function () {
			setTimeout(function () {
				$(".hot-sale-goods").slide({ mainCell: "ul", vis: 6, prevCell: ".sPrev", nextCell: ".sNext", effect: "leftLoop" });
			}, 200)
		};
		//商品关注
		//防止用户多次点击，多次请求
		var timeoutflag = 0;
		$scope.goodsCollect = function (collect, id, index) {
			if (timeoutflag) {
				layer.msg('操作太频繁啦！');
				return;
			}
			timeoutflag = 1;
			timeoutflagfn = setTimeout(function () {
				timeoutflag = 0;
			}, 500);

			if (collect == 0) {
				$http({
					method: "POST",
					url: '' + $rootScope.ip + '/Goods/get_goods_collect',
					data: {
						goods_id: id
					},
					headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
				})
					.success(function (data) {
						//console.log(data);
						if (data.status == '0') {
							//layer.msg('关注失败',{time:100});
							//$state.go('login');
						} else {
							//layer.msg('关注成功',{time:100});
							$scope.shopListData.goods[index].is_collect = 1;
						}
					})
			} else {
				$http({
					method: "POST",
					url: '' + $rootScope.ip + '/Goods/collect_del',
					data: {
						goods_id: id
					},
					headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
				})
					.success(function (data) {
						//console.log(data);
						if (data.status == '0') {
							//layer.msg('取消关注失败',{time:100});
							//$state.go('login');
						} else {
							//layer.msg('取消关注成功',{time:100});
							$scope.shopListData.goods[index].is_collect = 0;
						}
					})
			}
		};
	})