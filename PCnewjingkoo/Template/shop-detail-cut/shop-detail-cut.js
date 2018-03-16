angular.module('ShopDetailCutModule', [])
	//商品详情
	.controller('shopDetailCutControl', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ipCookie', '$window', '$location', '$anchorScroll', '$sce', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $window, $location, $anchorScroll, $sce) {
		$rootScope.isShow = false;
		$rootScope.change = true;

		$scope.goods_id = $stateParams.goods_id;
		$scope.cutting_id = $stateParams.cutting_id;
		//点击展开
		//商品详情获取商品初始类型接口
		$http({
			method: "POST",
			url: '' + $rootScope.ip + '/Cutting/cutting_info',
			data: { id: $scope.cutting_id },
			headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
		}).success(function (res) {
			if (res.status) {
				$scope.cutting_info = res;
				if (res.cutting_info.is_frame == 1) {
					$scope.getAttrList(res.cutting_info.default_info.goods_id);
				}
				//默认选中的镜片商品ID
				$scope.cutting_info.jingpianListGoodsId = res.cutting_list[0].goods_id;
				$scope.get_goods_attribute($scope.cutting_info.jingpianListGoodsId);
			}
		})
		$scope.get_goods_attribute = function (goods_id) {
			$scope.cutting_info.jingpianListGoodsId = goods_id;
			$scope.goodsSpectaclesCarParams.goods_id = goods_id;
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Cutting/get_goods_attribute',
				data: { goods_id: goods_id },
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			}).success(function (data) {
				if (data.status == 0 && data.info == "商品信息不存在") {
					layer.msg(data.info);
					$window.history.back();
				}
				$scope.spectaclesData = data;
				$scope.attrNumber = 1;
				//$scope.isGlass = false;
				$scope.isList = true;
				//控制积分商城商品和普通商品和镜片的区别
				$scope.isPointsMall = true;
				$scope.pointsMall = false;
				//如果主属性存在，获取主属性的每次需要加减的数量
				if ($scope.spectaclesData.data) {
					for (var i = 0; i < $scope.spectaclesData.data.length; i++) {
						if ($scope.spectaclesData.data[i].is_main == 1) {
							$scope.attrNumber = $scope.spectaclesData.data[i].values[0].number || 1;
							$scope.attrId = $scope.spectaclesData.data[i].values[0].id;
						}
					}
				}
				//根据商品初始类型选择情况
				if (data.goods_type == "goods") {

					//商品属性为goods时调用这个接口

					$scope.getAttrList(goods_id);
				}
				else if (data.goods_type == "goods_spectacles") {
					var arr = [];
					//获取球镜度数的最大值和最小值
					for (var i in data.spectacles_properties.list) {
						arr.push(data.spectacles_properties.list[i]);
					}
					$scope.high = Math.max.apply(null, arr).toFixed(2);
					$scope.low = Math.min.apply(null, arr).toFixed(2);

				}
			})
		}

		$scope.getAttrList = function (goods_id) {
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/get_attr_list',
				data: {
					goods_id: goods_id
				},
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					$scope.goodsData = data;
					//使得输入框中初始值为0
					for (var i = 0; i < $scope.goodsData.data.length; i++) {
						$scope.goodsData.data[i].num = 0;
					}
					$scope.numberChange = function () {
						//每次更新商品数量获取的数据
						$scope.goodsCarParams.goods.member = [];
						$scope.goodsCarParams.goods.spec = [];
						$scope.goodsCarParams.goods.attr = [];
						for (var t = 0; t < $scope.goodsData.data.length; t++) {
							if($scope.goodsData.data[t].num>0){
								$scope.goodsCarParams.goods.member.push($scope.goodsData.data[t].num);
								var arr1 = [];
								var attrs = $scope.goodsData.data[t].goods_attr_id;
								var sAttr = $scope.goodsData.data[t].str_goods_attr;
								//arr1.push(attrs);
								$scope.goodsCarParams.goods.spec.push(attrs);
								$scope.goodsCarParams.goods.attr.push(sAttr);
							}
						}
						//每次更新获取商品数量改变价格 接口
						//var cool = layer.load(0, { shade: [0.3, '#fff'] });
						$http({
							method: "POST",
							url: '' + $rootScope.ip + '/Goods/change_goods_number',
							data: $scope.goodsCarParams,
							headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
						})
							.success(function (data) {
								//layer.close(cool);
								if (data.status) {
									$scope.listTotalNumber = data.number;
									$scope.listTotalPrice = data.goods_total;
								} else {
									layer.msg(data.info, { time: 1000 });
								}
							})
					};
					$scope.isReduce = true;
					//增加
					$scope.add = function (trItem) {
						trItem.num += Number($scope.attrNumber);
						if (trItem.num > 0) {
							$scope.isCarParams = true;
						}
						$scope.numberChange();
					};
					//减少
					$scope.reduce = function (item) {
						item.num -= Number($scope.attrNumber);
						$scope.numberChange();
					};
				})
		};

		$scope.NumSelect = function (e) {

			angular.element(e.target).focus().select();
		};
		$scope.change1 = function (trItem) {
			trItem.select?trItem.num=1:trItem.num=0;
			if (Number(trItem.num) > Number(trItem.product_number)) {
				trItem.num = Number(trItem.product_number);
			} else if (Number(trItem.num) < 0 || Number(trItem.num) == '') {
				trItem.num = 0;
			}
			$scope.numberChange();
		};

		//商品详情接口
		$scope.shopDetailFn = function () {
			var cool = layer.load(0, { shade: [0.3, '#fff'] });
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/goods_infos',
				data: { type: 'cut', goods_id: $scope.goods_id },
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					if (data.status) {
						layer.close(cool);
					}
					$scope.data = data;
					document.title = data.data.goods_name;
					//积分详情页data.data.goods_name
					if (data.data.exchange_info) {
						//控制积分商城商品和普通商品和镜片的区别
						//个人信息面板信息
						$http({
							method: "POST",
							url: '' + $rootScope.ip + '/User/user_info',
							data: '',
							headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
						})
							.success(function (data) {
								$scope.payPoints = data.user_info.pay_points;
							})
					} else {
						$scope.isPointsMall = true;
						$scope.pointsMall = false;
					}
					//图文详情
					$scope.goodsDesc = $sce.trustAsHtml(data.data.goods_desc);
					//控制配送区域显隐
					$scope.selectArea = function () {
						$('.select-takeGoods-area').click(function () {
							$('.takeGoods-area-box').show();
						});
						$('.takeGoods-area-tit i').click(function () {
							$('.takeGoods-area-box').hide();
						});
					};

					//商品放大镜函数
					$scope.jqzoom = function () {

					}

					//商品详情详细信息
					$scope.shopDetailData = data;
					$scope.shopId = data.data.suppliers_id;
					$scope.goStore = function () {
						var url = $state.href('shopHomeNew', {
							shopId: $scope.shopId
						});
						window.open(url, '_blank');
					};
					//店铺关注
					$scope.shopGz = function () {
						if ($scope.shopDetailData.supplier_info.is_select) {
							$http({
								method: "POST",
								url: '' + $rootScope.ip + '/Goods/CollectShop',
								data: {
									id: $scope.shopId,
									type: 0
								},
								headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
							})
								.success(function (data) {
									layer.msg(data.info, { time: 1000 });
									if (data.status) {
										$scope.shopDetailData.supplier_info.is_select = 0;
									}
								})
						} else {
							$http({
								method: "POST",
								url: '' + $rootScope.ip + '/Goods/CollectShop',
								data: {
									id: $scope.shopId,
									type: 1
								},
								headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
							})
								.success(function (data) {
									layer.msg(data.info, { time: 1000 });
									if (data.status) {
										$scope.shopDetailData.supplier_info.is_select = 1;
									}
								})
						}
					};
					$scope.goodsName = data.data.goods_name;
					if (data.data.is_batch == 0) {
						$scope.isGlass = false;
					} else {
						$scope.isGlass = true;
					}
					$scope.goBack = function (category, categoryId) {
						$state.go('shop-list', {
							params: encodeURIComponent(JSON.stringify({
								cat_id: categoryId,
							}))
						});
					};
					//是否有促销价格
					$scope.is_promotion = data.data.is_promotion;
					//商品详情相册信息
					$scope.imgUrl = data.gallery[0].img_url;
					$scope.thumbUrl = data.gallery[0].thumb_url;
					//商品详情供货商信息
					$scope.name = data.supplier_info.name;
					$scope.region = data.supplier_info.city_name;
					$scope.address = data.supplier_info.address;
					$scope.logo = data.supplier_info.logo;
					$scope.invType = data.supplier_info.inv_type;
					$scope.company = data.supplier_info.company;
					$scope.tell = data.supplier_info.mobile;
					//积分商城信息
					$scope.pointsNum = 1;
					$scope.needJf = data.data.exchange_info ? data.data.exchange_info.exchange_integral : null;
					$scope.isExchange = data.data.exchange_info ? data.data.exchange_info.is_exchange : null;
					// console.log(data.data.exchange_info,$scope.needJf,$scope.isExchange)

				}).error(function (data, staus) {
					layer.close(cool);
					if (staus == 401) {
						////layer.msg('用户失效，请重新登录');
						ipCookie.remove('token');
						ipCookie.remove('has_login');
						location.href = "/default.html";
					}
				})
		};
		$scope.shopDetailFn();


		//领取优惠券
		$scope.lqYhq = function (tid) {
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/send_by_user',
				data: {
					type_id: tid
				},
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			}).success(function (data) {
				if (data.status) {
					layer.msg(data.info, { time: 1000 }, function () {
						$scope.shopDetailFn();
					});
				} else {
					layer.msg(data.info, { time: 1000 });
				}
			})
		};

		//商品推荐
		$scope.tuijianFn = function () {
			setTimeout(function () {
				$(".goods-recommended-content").slide({ mainCell: "ul", vis: 7, prevCell: ".sPrev", nextCell: ".sNext", effect: "leftLoop" });
			}, 100);
		};

		//商品关注
		//防止用户多次点击，多次请求
		var timeoutflag = 0;
		$scope.goodsCollect = function () {
			if (timeoutflag) {
				layer.msg('操作太频繁啦！', { time: 1000 });
				return;
			}
			timeoutflag = 1;
			timeoutflagfn = setTimeout(function () {
				timeoutflag = 0;
			}, 500);
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/get_goods_collect',
				data: { goods_id: $scope.goods_id },
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					if (data.status == '0') {
						layer.msg('关注失败', { time: 1000 });
						//$state.go('login');
					} else {
						layer.msg('关注成功', { time: 1000 });
						$scope.shopDetailData.data.is_collect = 1;
					}
				})
		};
		//商品取消关注
		$scope.goodsNotCollect = function () {
			if (timeoutflag) {
				layer.msg('操作太频繁啦！', { time: 1000 });
				return;
			}
			timeoutflag = 1;
			timeoutflagfn = setTimeout(function () {
				timeoutflag = 0;
			}, 500);
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/collect_del',
				data: { goods_id: $scope.goods_id },
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					if (data.status == '0') {
						layer.msg('取消关注失败', { time: 1000 });
						//$state.go('login');
					} else {
						layer.msg('已取消关注', { time: 1000 });
						$scope.shopDetailData.data.is_collect = 0;
					}
				})
		};


		$scope.regionArr = {
			goods_id: $scope.goods_id,
			region_id: ''
		};

		//商品切换收货地址
		$scope.chengeAddress = function (addressId, region) {
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/Goods_fee',
				data: {
					id: addressId,
					goods_id: $stateParams.goods_id
				},
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					if (data.status) {
						$scope.regionArr.region_id = region;
						$http({
							method: "POST",
							url: '' + $rootScope.ip + '/Goods/set_area',
							data: $scope.regionArr,
							headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
						})
							.success(function (data) {
								$rootScope.$broadcast('uploadCity');
								layer.msg('更换地址成功', { icon: 1, time: 1000 }, function () {
									$scope.shopDetailFn();
								});
							})
					} else {
						layer.msg('更换地址失败', { icon: 2, time: 1000 });
					}
				})
		};
		//商品切换销售区域
		$scope.regionTable = function (regionId) {
			$scope.regionArr.region_id = regionId;
		};
		//地区更新同步
		$rootScope.$on('uploadAddress', function () {
			$scope.shopDetailFn();
		});
		$scope.saveArea = function (e) {
			angular.element(e.target).parent().parent().hide();

			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/set_area',
				data: $scope.regionArr,
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					if (data.status) {
						layer.msg('更换地区成功', { icon: 1, time: 500 });
						$rootScope.$broadcast('uploadCity');
						$scope.shopDetailFn();
					} else {
						layer.msg('更换地区失败', { icon: 2, time: 500 });
					}
				})
		};

		//显示当前球镜柱镜选择度数框
		$scope.openDs = function (e, index) {
			$('#masks').show();
			//$('.dushu-box').show();
			angular.element(e.target).next().show();
		};
		//关闭当前球镜柱镜选择度数框
		$scope.hideDuShuBox = function (e) {
			angular.element(e.target).parent().parent().hide();
			$('#masks').hide();
		};
		$scope.openDsZj = function (e) {
			if (angular.element(e.target).parent().prev().find('.pick-text-qiujing').val() == '') {
				angular.element(e.target).next().show();
				setTimeout(function () {
					angular.element(e.target).next().hide();
				}, 2000)
			} else {
				$('#masks').show();
				//$('.dushuQiuJing-box').show();
				angular.element(e.target).next().next().show();
			}
		};

		//点击球镜数据给当前球镜设置度数，同时请求柱镜数据
		$scope.getDs = function (item) {
			//获取柱镜的数据
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/get_zhujing',
				data: {
					goods_id: $scope.cutting_info.jingpianListGoodsId,
					item: item.qiujing
				},
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					$scope.zhujingData = data;
					var arrs = [];
					for (var i in data.data) {
						arrs.push(data.data[i]);
					}
					$scope.highs = Math.max.apply(null, arrs).toFixed(2);
					$scope.lows = Math.min.apply(null, arrs).toFixed(2);
				})
			//$scope.pickTaList = dsItem;
			$scope.priceChange(item);

			$('#masks').hide();
			$('.dushu-box').hide();
		};
		//点击柱镜数据来给当前的柱镜给度数值
		$scope.getDsZj = function (item) {
			$scope.priceChange(item);

			$('#masks').hide();
			$('.dushuQiuJing-box').hide();
		};
		/* 属性价格改变 */
		$scope.priceChange = function (item) {
			var spcArr = [];
			for (var j = 0; j < $scope.spectaclesData.specification.length; j++) {
				var attr = item[$scope.spectaclesData.specification[j].name];
				if (attr) {
					spcArr.push(item[$scope.spectaclesData.specification[j].name])
				}
			}
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Goods/changeprice',
				data: {
					goods_id: $scope.cutting_info.jingpianListGoodsId,
					attr: spcArr,
					qiujing: item.qiujing,
					zhujing: item.zhujing
				},
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			}).success(function (res) {
				if (res.status) {
					item.price = res.data.price.toFixed(2);
					if (res.data.promotion_id > 0) {
						item.youhui = (res.data.promotion_price.substr(1));
						item.subprice = (item.member * item.youhui).toFixed(2);
					} else {
						item.subprice = (item.member * item.price).toFixed(2);
					}
				}
			})
		}
		//设置一个空数组用来新增一行
		//用来存放镜片属性的数组
		$scope.arr = [{ member: 1, subprice: '0.00', price: '0.00' }, { member: 1, subprice: '0.00', price: '0.00' }];
		//获取商品的各种属性值
		//传到购物车 镜片的数据
		$scope.goodsSpectaclesCarParams = {
			goods_id: '',
			goods: {
				member: [],
				qiujing: [],
				zhujing: [],
				zhouwei: [],
				spc: []
			}
		};
		//传到购物车 普通商品的数据
		$scope.goodsCarParams = {
			goods_id: $stateParams.goods_id,
			goods: {
				member: [],
				spec: [],
				attr: []
			}
		};
		$scope.add_to_cart_spec = function (success) {
			$scope.goodsSpectaclesCarParams.goods.member = [];
			$scope.goodsSpectaclesCarParams.goods.qiujing = [];
			$scope.goodsSpectaclesCarParams.goods.zhujing = [];
			$scope.goodsSpectaclesCarParams.goods.zhouwei = [];
			$scope.goodsSpectaclesCarParams.goods.spc = [];
			for (var i = 0; i < $scope.arr.length; i++) {
				$scope.goodsSpectaclesCarParams.goods.qiujing.push($scope.arr[i].qiujing);
				$scope.goodsSpectaclesCarParams.goods.zhujing.push($scope.arr[i].zhujing);
				$scope.goodsSpectaclesCarParams.goods.member.push($scope.arr[i].member);
				$scope.goodsSpectaclesCarParams.goods.zhouwei.push($scope.arr[i].zhouwei);
				$scope.spectaclesData.is_zuoyou ? $scope.goodsSpectaclesCarParams.goods.spc.push($scope.spectaclesData.zuoyou_spe.values[i].id) : null;
			}
			for (let i = 0; i < $scope.goodsSpectaclesCarParams.goods.zhujing.length; i++) {
				var element = $scope.goodsSpectaclesCarParams.goods.zhujing[i];
				if(!element){
					layer.msg('商品球镜柱镜属性不能为空',{time:1000});
					return;
				}
			}
			//镜片加入购物车接口
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/Cutting/add_to_cart_spec_cutting',
				data: { cutting_id: $scope.cutting_id, arr_goods_id: [$scope.goodsCarParams.goods_id, $scope.goodsSpectaclesCarParams.goods_id], arr_goods: [$scope.goodsCarParams.goods, $scope.goodsSpectaclesCarParams.goods] },
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					success ? success(data) : null;

				})
		}
		$scope.joinCar = function () {
			$scope.add_to_cart_spec(function (data) {
				if (data.status == -1) {
					layer.msg(data.info, { time: 1000 });
				} else if (data.status == 1) {
					layer.msg(data.info, { time: 1000 });
					layer.confirm('商品已添加至购物车', {
						btn: ['去结算', '继续选购'], //按钮
						title: '提示',
						btnAlign: 'c',
						yes: function (index) {
							$state.go('shop-car');
							layer.close(index);
						},
						btn2: function (index) {
							layer.close(index);
							$scope.getAttrList($scope.cutting_info.cutting_info.default_info.goods_id);
						}
						// closeBtn: 0
					});
					// $rootScope.$broadcast('upCarList');
				} else if (data.status == 0) {
					layer.msg(data.info, { time: 1000 });
				}
			})
		}
		//立即购买
		$scope.buyNow = function () {
			$scope.add_to_cart_spec(function (data) {
				if (data.status == -1) {
					layer.msg(data.info, { time: 1000 });
				} else if (data.status == 1) {
					layer.msg(data.info, { time: 1000 });
					// $rootScope.$broadcast('upCarList');
					$state.go('shop-car');
				} else if (data.status == 0) {
					layer.msg(data.info, { time: 1000 });
				}
			})
		};
		//立即兑换积分商品
		$scope.buyNow_jf = function () {
			layer.confirm('确认兑换？', {
				btn: ['确定', '取消'] //按钮
			}, function () {
				$http({
					method: "POST",
					url: '' + $rootScope.ip + '/Flow/exchangebuy',
					data: {
						goods_id: $scope.shopDetailData.data.exchange_info.goods_id
					},
					headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
				})
					.success(function (data) {
						if (data.status) {
							$state.go('shop-jiesuan');
							layer.msg(data.info, { icon: 1, time: 1000 });
							// $rootScope.$broadcast('upCarList');
						} else {
							layer.msg(data.info, { icon: 2, time: 1000 });
						}
					})
			}, function () {
				/* layer.msg('这个不满意么？再换一个看看吧~', {
					 icon: 3,
					 time: 2000, //2s后自动关闭
				}); */
			})
		};
		//清除浏览记录
		$scope.historyItem = {
			goods_ids: []
		};
		$scope.deleteHistory = function () {
			for (var h = 0; h < $scope.shopDetailData.history.length; h++) {
				$scope.historyItem.goods_ids.push($scope.shopDetailData.history[h].goods_id);
			}
			$http({
				method: "POST",
				url: '' + $rootScope.ip + '/user/del_watch',
				data: $scope.historyItem,
				headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
			})
				.success(function (data) {
					if (data.status) {
						layer.msg(data.info, { time: 1000 }, function () {
							$scope.shopDetailFn();
						});
					} else {
						layer.msg(data.info, { time: 1000 });
					}
				})
		}
		$scope.goBulkOrder = function () {
			window.open($state.href('bulk-order', {
				goods_id: $stateParams.goods_id,
				shop_price: $scope.shopDetailData.data.shop_price,
				is_promote: $scope.shopDetailData.data.is_promote,
				zhouwei: $scope.shopDetailData.data.zhouwei
			}));
		};
	}])