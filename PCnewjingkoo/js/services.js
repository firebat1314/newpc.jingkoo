angular.module('myApp.HttServices', [])
   .config(function($httpProvider) {
      $httpProvider.interceptors.push('MyInterceptor');
   })
   /*http拦截器*/
   .factory('MyInterceptor', function($q, ipCookie) {
      var showToastTime = true;
      return {
         // 可选，拦截成功的请求
         request: function(config) {
            config.headers = config.headers || {};
            config.timeout = 20000;
            if (ipCookie('token')) {
               config.headers.Authorization = 'Basic ' + btoa(ipCookie('token') + ':');
            }
            return config || $q.when(config);
         },
         // 可选，拦截失败的请求
         requestError: function(rejection) {
            // 对失败的请求进行处理

            return $q.reject(rejection);
         },
         // 可选，拦截成功的响应
         response: function(response) {
            // 进行预处理
            if (response.data.status == 1) {
               // locals(response.config.url.split('/').slice(3).join('/'), response.data)
            }
            return response || $q.when(reponse);
         },
         // 可选，拦截失败的响应
         responseError: function(rejection) {
            // 对失败的响应进行处理
            layer.closeAll('loading');

            if (showToastTime) {
               showToastTime = false;
               if (rejection.status == 401) {
                  ipCookie.remove('token');
                  ipCookie.remove('has_login');
                  if (location.href.indexOf('custome-services') == -1) {
                     location.href = "#/login"
                  }
               }
               if (rejection.status == 404) {
                  layer.msg('数据异常，请稍后再试');
               }
               if (rejection.status == 500) {
                  layer.msg('数据异常，请稍后再试');
               }
               setTimeout(function() {
                  showToastTime = true;
               }, 3000);
            }
            return $q.reject(rejection);
         }
      };
   })
   .factory('locals', ['$window', function($window) {
      return { //存储单个属性
         set: function(key, value) {
            $window.localStorage[key] = value;
         }, //读取单个属性
         get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
         }, //存储对象，以JSON格式存储
         setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value); //将对象以字符串保存
         }, //读取对象
         getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}'); //获取字符串并解析成对象
         }

      }
   }])
   .factory('$qimoChat', ['$state', function($state) { /* 新增客服功能 */
      return {
         chatClick: function(ids) {
            window.open($state.href('custome-services', {
               params: encodeURIComponent(JSON.stringify({
                  order_id: ids && ids.order_id,
                  goods_id: ids && ids.goods_id,
                  suppliers_id: ids && ids.suppliers_id
               }))
            }))
         }
      }
   }])
   .factory('$myPublic', function($state) {
      return {
         openCoupon: function(bonus_id) {
            window.open($state.href('shop-list', {
               params: encodeURIComponent(JSON.stringify({
                  keywords: '',
                  bonus_id: bonus_id
               }))
            }))
         },
         goListPage: function(parmas, is_blank) {
            if (is_blank) {
               window.open($state.href('shop-list', {
                  params: encodeURIComponent(JSON.stringify(parmas))
               }))
            } else {
               $state.go('shop-list', {
                  params: encodeURIComponent(JSON.stringify(parmas))
               })
            }
         }
      }
   })
   .factory('$data', ['$http', '$window', '$timeout', 'ipCookie', function($http, $window, $timeout, ipCookie) {

      // var isAccessFormalEnv = true;
      var isAccessFormalEnv = false;

      if (isAccessFormalEnv) {
         var ip = 'https://www.jingku.cn'; //正式
         var admin_ip = 'https://admin.jingku.cn';
         var supplier_ip = 'https://supplier.jingku.cn';
      } else {
         // var ip = 'http://v401app.jingkoo.net'; //测试
         var ip = 'http://newpc.jingkoo.net'; //测试
         var admin_ip = 'http://newadmin.jingkoo.net';
         var supplier_ip = 'http://newsupplier.jingkoo.net';
      }


      return {
         //7)获取商品价格优惠区间
         ip: ip,
         parseURL: function(url) {

            if (url && url.indexOf("?") == -1) return {}

            var startIndex = url.indexOf("?") + 1;
            var str = url.substr(startIndex);
            var strs = str.split("&");
            var param = {}
            for (var i = 0; i < strs.length; i++) {
               var result = strs[i].split("=");
               var key = result[0];
               var value = result[1];
               param[key] = value;
            }
            return param

         },
         getPriceSection: function(data) {
            return $http({
               method: 'POST',
               url: ip + "/Goods/get_price_section",
               data: data
            })
         },
         //获取图形验证码
         getVerify: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/Login/verify',
               params: data
            })
         },
         getCityList: function(data) {
            return $http({
               method: 'GET',
               url: ip + '/Login/verify',
               params: data
            })
         },
         getMobileCode: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/Login/getMobileCode',
               data: data
            })
         },
         getRegionApply: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/region_apply',
               params: data
            })
         },
         postRegionApply: function(data) {
            return $http({
               method: 'post',
               url: ip + '/User/region_apply',
               data: data
            })
         },
         //			编辑提交收货地址
         PosteditAddress: function(data) {
            return $http({
               method: 'post',
               url: ip + '/User/edit_address',
               data: data
            })
         },
         //编辑收货地址
         getEditAddressPr: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/edit_address',
               params: data
            })
         },
         delAddress: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/del_address',
               params: data
            })
         },
         GetMoneyDetial: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/accountLog',
               params: data
            })
         },
         postCityList: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/Login/getMobileCode',
               data: data
            })
         },
         changeRegion: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/change_region',
               params: data
            })
         },
         //联系人信息
         getUserMsg: function(data) {
            return $http({
               method: 'post',
               url: ip + '/User/user_info',
               data: data
            })
         },
         //          优惠券
         getYhqData: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/get_user_bonus',
               params: data
            })
         },
         //          修改手机号
         getEditMobile: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/edit_mobile',
               data: data
            })
         },
         //          修改密码
         getEditPwd: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/edit_pwd',
               data: data
            })
         },
         //          确认收货
         QrGetGoods: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/affirm_received',
               data: data
            })
         },
         //          用户订单详情
         getOrderInfo: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/order_info',
               params: data
            })
         },
         //          用户订单
         getAllOrder: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/order',
               params: data
            })
         },
         //          用户订单
         getAllOrderD: function(data) {
            return $http({
               method: 'get',
               url: ip + '/Distribution/orders',
               params: data
            })
         },
         //           设置默认
         setDefault: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/default_address',
               params: data
            })
         },
         //          获取头像
         setDefault: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/default_address',
               params: data
            })
         },
         //          修改头像
         changeAvater: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/avatar',
               data: data
            })
         },
         //          修改联系人信息
         changePersonMsg: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/profile',
               data: data
            })
         },
         //          修改企业信息
         changeQyMsg: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/edit_company',
               data: data,
               timeout: 15000
            })
         },
         //          获取手机验证码
         getMobileCode: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/Login/getMobileCode',
               data: data
            })
         },
         //          发送邮箱验证
         getEmailYz: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/edit_email',
               data: data
            })
         },
         //          订单物流信息
         getWlMsg: function(data) {
            return $http({
               method: 'GET',
               url: ip + '/User/shipping_log',
               params: data
            })
         },
         //          取消订单
         cancelOrder: function(data) {
            return $http({
               method: 'GET',
               url: ip + '/User/cancel_order',
               params: data
            })
         },

         //         收藏
         //          收藏店铺的列表
         collectionShop: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/collection_shop',
               data: data
            })
         },

         //          收藏的商品列表
         collectionList: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/collection_list',
               data: data
            })
         },
         //          取消收藏店铺
         delCollectionShop: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/del_collection_shop',
               data: data
            })
         },

         //          取消收藏商品
         delCollectionGoods: function(data) {
            return $http({
               method: 'POST',
               url: ip + '/User/del_collection_goods',
               data: data
            })
         },
         //          用户物流消息接口
         getWuLiuTidings: function(data) {
            return $http({
               method: 'GET',
               url: ip + '/User/shipping_log',
               params: data
            })
         },
         //          资金管理
         userMoneyRecord: function(data) {
            return $http({
               method: 'post',
               url: ip + '/User/recharge_list',
               data: data
            })
         },

         //          充值
         addAccount: function(data) {
            return $http({
               method: 'post',
               url: ip + '/User/recharge_money',
               data: data
            })
         },
         //          充值的支付方式
         getAccountPayList: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/getAccountPayList',
               params: data
            })
         },
         //          用户提现
         userWithdrawal: function(data) {
            return $http({
               method: 'post',
               url: ip + '/User/withdrawal',
               data: data
            })
         },
         //          删除订单
         delOrder: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/del_order',
               params: data
            })
         },
         //          个人中心获取用户统计
         getUsercount: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/usercount',
               params: data
            })
         },
         //          猜你喜欢
         guessYouLike: function(data) {
            return $http({
               method: 'get',
               url: ip + '/Category/guess_like',
               params: data
            })
         },
         //领取优惠券
         sendByUser: function(data) {
            return $http({
               method: 'get',
               url: ip + '/Goods/send_by_user',
               params: data
            })
         },
         //来镜加工
         machiningList: function(data) {
            return $http({
               method: 'post',
               url: ip + '/User/machining',
               data: data
            })
         },
         //积分兑换列表
         IntegralOrder: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/exchangeGoods',
               params: data
            })
         },
         //积分兑换详情
         IntegralDetail: function(data) {
            return $http({
               method: 'get',
               url: ip + '/User/exchangeGoodsInfo',
               params: data
            })
         },
         //来镜加工打印
         machiningInfoPrint: function(data) {
            return $http({
               method: 'get',
               url: ip + '/Machining/machining_info_print',
               params: data
            })
         },
         Shd_add_user: function(data) {
            return $http({
               method: 'post',
               url: ip + '/App/Shd/add_user',
               data: data
            })
         },
         Shd_product_list: function(data) {
            return $http({
               method: 'get',
               url: ip + '/App/Shd/product_list',
               params: data
            })
         },
         Shd_detail: function(data) {
            return $http({
               method: 'get',
               url: ip + '/App/Shd/detail',
               data: data
            })
         },
         Shd_bindCard: function(data) {
            return $http({
               method: 'post',
               url: ip + '/App/Shd/bindCard',
               data: data
            })
         },
         Shd_bankConfirm: function(data) {
            return $http({
               method: 'post',
               url: ip + '/App/Shd/bankConfirm',
               data: data
            })
         },
         Shd_preApply: function(data) {
            return $http({
               method: 'post',
               url: ip + '/App/Shd/preApply',
               data: data
            })
         },
         Shd_sendSignCheckCode: function(data) {
            return $http({
               method: 'post',
               url: ip + '/App/Shd/sendSignCheckCode',
               data: data
            })
         },
         Shd_loanSetup: function(data) {
            return $http({
               method: 'post',
               url: ip + '/App/Shd/loanSetup',
               data: data
            })
         },
         Shd_get_shd_info: function(data) {
            return $http({
               method: 'post',
               url: ip + '/App/Shd/get_shd_info',
               data: data
            })
         },
         jingku_finance: function(data) {
            return $http({
               method: 'post',
               url: ip + '/App/Index/jingku_finance',
               data: data
            })
         },
         search_census: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Public/search_census ',
               data: data
            })
         },
         search_census: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Public/search_census ',
               data: data
            })
         },
         click_census: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Public/click_census ',
               data: data
            })
         },
         commentIndex: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Comment/index ',
               data: data
            })
         },
         commentCommentLaud: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Comment/CommentLaud ',
               data: data
            })
         },
         commentCommentReckon: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Comment/CommentReckon ',
               data: data
            })
         },
         commentIsComment: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Comment/is_comment ',
               data: data
            })
         },
         commentInsertComment: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Comment/insert_comment ',
               data: data
            })
         },
         get_supplier_info: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Goods/get_supplier_info ',
               data: data
            })
         },
         commentNoComment: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Comment/NoComment ',
               data: data
            })
         },
         searchList: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/SearchList ',
               data: data
            })
         },
         delSearch: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/DelSearch',
               data: data
            })
         },
         delAllSearch: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/DelAllSearch ',
               data: data
            })
         },
         suppliers_bouns_list: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Flow/suppliers_bouns_list ',
               data: data
            })
         },
         change_machining: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Flow/change_machining ',
               data: data
            })
         },
         getCategoryPromote: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/getCategoryPromote ',
               data: data
            })
         },
         presell: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/presell ',
               data: data
            })
         },
         recommendGoods: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/andomGoods ',
               data: data
            })
         },
         getCategoryAd: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/ads ',
               data: data
            })
         },
         IndexData: function(data) {
            return $http({
               method: 'post',
               url: ip + '/index/IndexData ',
               data: data
            })
         },
         getCategoryDistribution: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Distribution/getCategoryDistribution ',
               data: data
            })
         },
         GetFileImg: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Public/GetFileImg',
               data: data
            })
         },
         GetFileImgs: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Public/GetFileImgs',
               data: data
            })
         },
         CatCoupon: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/CatCoupon',
               data: data
            })
         },
         CustomerService: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/CustomerService',
               data: data
            })
         },
         adminLoginInfo: function(data) {
            return $http({
               method: 'post',
               url: admin_ip + '/Admin/Public/loginInfo ',
               data: data
            })
         },
         supplierLoginInfo: function(data) {
            return $http({
               method: 'post',
               url: supplier_ip + '/Suppliers/Public/loginInfo ',
               data: data
            })
         },
         fastCustomerService: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Login/fastCustomerService ',
               data: data
            })
         },
         customer_get_supplier_info: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Category/get_supplier_info ',
               data: data
            })
         },
         customer_get_history: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Goods/get_history ',
               data: data
            })
         },
         customer_get_category_recommend_goods: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/get_category_recommend_goods ',
               data: data
            })
         },
         goods_infos: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Goods/goods_infos ',
               data: data
            })
         },
         /* 非登录状态客服 */
         LinShiUserig: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Public/LinShiUserig ',
               data: data
            })
         },
         /* 发送商品信息 */
         CustomerServiceCustom: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/CustomerServiceCustom ',
               data: data
            })
         },
         //通过群组ID找供应商id
         CustomerServiceGroup: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/CustomerServiceGroup ',
               data: data
            })
         },
         /* 云通讯参数 */
         TxImInfo: function(data) {
            return $http({
               method: 'post',
               url: ip + '/User/TxImInfo ',
               data: data
            })
         },
         /* 切换会话：来源 */
         CustomerServiceGroupSource: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/CustomerServiceGroupSource ',
               data: data
            })
         },
         /* 促销专题广告位 */
         showSpecial: function(data) {
            return $http({
               method: 'post',
               url: ip + '/Index/newAds ',
               data: data
            })
         }
         
      }
   }])