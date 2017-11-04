angular.module('myApp.services', [])
	/*http拦截器*/
	/*.factory('AuthInterceptor', function($rootScope, $q, $location) {
	    return {
	        request: function(config) {
	            config.headers = config.headers || {};
	            if (localStorage.userInfo && angular.fromJson(localStorage.userInfo).data.token) {
	                config.headers.Authorization = 'Basic ' + btoa(angular.fromJson(localStorage.userInfo).data.token + ':');
	            }
	            return config;
	        },
	        requestError: function(err) {

	            return $q.reject(err);
	        },
	        response: function(res) {

	            return res;
	        },
	        responseError: function(err) {
	            if (-1 === err.status) {
	                // 远程服务器无响应
	            } else if (500 === err.status) {
	                // 处理各类自定义错误
	            } else if (501 === err.status) {
	                // ...
	            } else if (err.status == 401 || err.status == 403) {
	                $location.path('/login');
	            }
	            return $q.reject(err);
	        }
	    };
	})*//* 新增客服功能 */
	.factory('$qimoChat', [function () {
		return {
			qimoChatClick: function (access_id) {
				console.log(access_id)
				if (!access_id) {
					layer.msg('该店铺暂无客服', { time: 1000, icon: 2 });
					return
				}
				var old = document.getElementsByClassName('qimo')[0]
				//console.log(old)
				if (old) {
					old.parentNode.removeChild(old);
				}
				var qimo = document.createElement('script');
				qimo.src = 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=' + access_id + '&autoShow=false'
				qimo.classList = 'qimo'
				document.body.append(qimo)
				qimo.onload = function () {
					setTimeout(function () {
						//console.log('七陌加载完成')
						qimoChatClick();
					}, 400);
				}
			}
		}
	}])
	.factory('$data', ['$http', '$window', '$timeout', 'ipCookie', function ($http, $window, $timeout, ipCookie) {
		// var ip = 'http://v401app.jingkoo.net'; //测试
		var ip = 'http://www.jingku.cn'; //正式
		return {
			//7)获取商品价格优惠区间
			getPriceSection: function (data) {
				return $http({
					method: 'POST',
					url: ip + "/Goods/get_price_section",
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//获取图形验证码
			getVerify: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/Login/verify',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			getCityList: function (data) {
				return $http({
					method: 'GET',
					cache: false,
					url: ip + '/Login/verify',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			getMobileCode: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/Login/getMobileCode',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			getRegionApply: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/region_apply',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			postRegionApply: function (data) {
				return $http({
					method: 'post',
					cache: false,
					url: ip + '/User/region_apply',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//			编辑提交收货地址
			PosteditAddress: function (data) {
				return $http({
					method: 'post',
					cache: false,
					url: ip + '/User/edit_address',
					data: data,
					timeout: 5000,
					headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
				})
			},
			//编辑收货地址
			getEditAddressPr: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/edit_address',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			delAddress: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/del_address',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			GetMoneyDetial: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/accountLog',
					parmas: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			postCityList: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/Login/getMobileCode',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			changeRegion: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/change_region',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//联系人信息
			getUserMsg: function (data) {
				return $http({
					method: 'post',
					cache: false,
					url: ip + '/User/user_info',
					data: data,
					timeout: 5000,
					headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
				})
			},
			//          优惠券
			getYhqData: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/get_user_bonus',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          修改手机号
			getEditMobile: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/edit_mobile',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          修改密码
			getEditPwd: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/edit_pwd',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          确认收货
			QrGetGoods: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/affirm_received',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          用户订单详情
			getOrderInfo: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/order_info',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          用户订单
			getAllOrder: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/order',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//           设置默认
			setDefault: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/default_address',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          获取头像
			setDefault: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/default_address',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          修改头像
			changeAvater: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/avatar',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          修改联系人信息
			changePersonMsg: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/profile',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          修改企业信息
			changeQyMsg: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/edit_company',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          获取手机验证码
			getMobileCode: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/Login/getMobileCode',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          发送邮箱验证
			getEmailYz: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/edit_email',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          订单物流信息
			getWlMsg: function (data) {
				return $http({
					method: 'GET',
					cache: false,
					url: ip + '/User/shipping_log',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          取消订单
			cancelOrder: function (data) {
				return $http({
					method: 'GET',
					cache: false,
					url: ip + '/User/cancel_order',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},

			//         收藏
			//          收藏店铺的列表
			collectionShop: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/collection_shop',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},

			//          收藏的商品列表
			collectionList: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/collection_list',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          取消收藏店铺
			delCollectionShop: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/del_collection_shop',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},

			//          取消收藏商品
			delCollectionGoods: function (data) {
				return $http({
					method: 'POST',
					cache: false,
					url: ip + '/User/del_collection_goods',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          用户物流消息接口
			getWuLiuTidings: function (data) {
				return $http({
					method: 'GET',
					cache: false,
					url: ip + '/User/shipping_log',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          资金管理
			userMoneyRecord: function (data) {
				return $http({
					method: 'post',
					cache: false,
					url: ip + '/User/recharge_list',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},

			//          充值
			addAccount: function (data) {
				return $http({
					method: 'post',
					cache: false,
					url: ip + '/User/recharge_money',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          充值的支付方式
			getAccountPayList: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/getAccountPayList',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          用户提现
			userWithdrawal: function (data) {
				return $http({
					method: 'post',
					cache: false,
					url: ip + '/User/withdrawal',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          删除订单
			delOrder: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/del_order',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          个人中心获取用户统计
			getUsercount: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/usercount',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          猜你喜欢
			guessYouLike: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/Category/guess_like',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//领取优惠券
			sendByUser: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/Goods/send_by_user',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//来镜加工
			machiningList: function (data) {
				return $http({
					method: 'post',
					cache: false,
					url: ip + '/User/machining',
					data: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          积分兑换列表
			IntegralOrder: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/exchangeGoods',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          积分兑换详情
			IntegralDetail: function (data) {
				return $http({
					method: 'get',
					cache: false,
					url: ip + '/User/exchangeGoodsInfo',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},
			//          来镜加工打印
			machiningInfoPrint: function (data) {
				return $http({
					method: 'get',
					url: ip + '/Machining/machining_info_print',
					params: data,
					timeout: 5000,
					headers: {
						'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
					}
				})
			},

		}
	}])