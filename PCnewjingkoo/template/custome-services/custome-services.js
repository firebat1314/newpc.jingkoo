myApp.controller('CustomeServicesControl', function ($scope, $rootScope, $stateParams, $data, IMServ, locals, ipCookie, $state) {
   //控制首页会员中心显隐
   $rootScope.isShow = false;
   //控制header和footer显隐
   $rootScope.change = false;

   $scope.params = JSON.parse(decodeURIComponent($stateParams.params) || {})
   // console.log(($scope.params))

   $scope.showtab = 1;

   var inde = layer.load(2)

   if ($scope.params.is_other == 1) {
      $data.fastCustomerService({
         fastToken: $scope.params.token
      }).success(function (res) {
         $('.chatpart-body-r').hide();
         layer.close(inde)
         if (res.status == 1) {
            window.loginInfo = {
               'sdkAppID': 1400158766, //用户所属应用id,必填
               'identifier': res.txim.identifier, //当前用户ID,必须是否字符串类型，必填
               // 'identifier': "user_b", //当前用户ID,必须是否字符串类型，必填
               'accountType': 2, //用户所属应用帐号类型，必填
               'userSig': res.txim.usersig,
               //当前用户身份凭证，必须是字符串类型，必填
               'identifierNick': res.txim.name, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
               'headurl': res.txim.avatar //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
            };
            window.webimLogin();
         } else {
            alert(res.info)
         }
      })
   } else if ($scope.params.linshi == 1) {
      var LINSHI_TOKEN = locals.getObject('LINSHI_TOKEN');
      if (LINSHI_TOKEN.txim) {
         layer.close(inde)
         window.loginInfo = {
            'sdkAppID': 1400158766, //用户所属应用id,必填
            'identifier': LINSHI_TOKEN.txim.identifier, //当前用户ID,必须是否字符串类型，必填
            'accountType': 2, //用户所属应用帐号类型，必填
            'userSig': LINSHI_TOKEN.txim.usersig[1],
            // 'identifierNick': LINSHI_TOKEN.txim.user_name, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
            // 'headurl': LINSHI_TOKEN.txim.avatar //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
         };
         window.webimLogin();
      } else {
         $data.LinShiUserig().success(function (res) {
            layer.close(inde)
            if (res.status == 1) {
               locals.setObject('LINSHI_TOKEN', res)
               window.loginInfo = {
                  'sdkAppID': 1400158766, //用户所属应用id,必填
                  'identifier': res.txim.identifier, //当前用户ID,必须是否字符串类型，必填
                  'accountType': 2, //用户所属应用帐号类型，必填
                  'userSig': res.txim.usersig[1],
                  // 'identifierNick': res.txim.user_name, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
                  // 'headurl': res.txim.avatar //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
               };
               window.webimLogin();
            } else {
               alert(res.info)
            }
         })
      }
   } else {

      var TxImInfo = locals.getObject(ipCookie('username') + '_TxImInfo');
      if (TxImInfo) {
         /* layer.close(inde)
         window.loginInfo = {
            'sdkAppID': 1400158766, //用户所属应用id,必填
            'identifier': 'ceshi_1146', //当前用户ID,必须是否字符串类型，必填
            // 'identifier': "user_b", //当前用户ID,必须是否字符串类型，必填
            'accountType': 1, //用户所属应用帐号类型，必填
            'userSig': "eJxlkE9PgzAYh*98CsJVoy20tZh4QGRzEbINWeKtQXg33xGhQlU243fXMRMxnp8n*f35sGzbdrL4-iwviua1NsrsNDj2pe0Q5-QXao2lyo3y2vIfhF5jCypfG2gH6HLfJWSsYAm1wTX*CAV0T6goZWLkdGWlhpxBoYwQyuWF*KPgZoBJtApnEzITIKv33RZSFk-7h16ccx0s7rLQQIqic2-E5CXsH2*nAUaBaTJaeomXzBearyRrl0sm2b4Krn2f5ifxdgNF2om6bqKrUaTB5*MdlDOPcSZ9d0TfoO2wqY*rv-tSSn1ymG59Wl-1Tlzb",
            //当前用户身份凭证，必须是字符串类型，必填
            'identifierNick': "muyu", //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
            'headurl': "https://img.jingku.cn/data/avatar/APP_20181109145123218597.png" //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
         };
         window.webimLogin(); */
         $data.CustomerService({
            order_id: $scope.params.order_id,
            goods_id: $scope.params.goods_id,
            suppliers_id: $scope.params.suppliers_id
         }).success(function (res) {
            layer.close(inde)
            if (res.status == 1) {
               window.loginInfo = {
                  'sdkAppID': 1400158766, //用户所属应用id,必填
                  'identifier': TxImInfo.txim.identifier, //当前用户ID,必须是否字符串类型，必填
                  // 'identifier': "user_b", //当前用户ID,必须是否字符串类型，必填
                  'accountType': 1, //用户所属应用帐号类型，必填
                  'userSig': TxImInfo.txim.usersig,
                  //当前用户身份凭证，必须是字符串类型，必填
                  'identifierNick': TxImInfo.txim.user_name, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
                  'headurl': TxImInfo.txim.avatar //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
               };
               window.openedSessionId = res.group_id; //当前访问的群组
               window.webimLogin();
            } else {
               alert(res.info)
            }
         })
      } else {
         /* 云通讯信息 */
         $data.TxImInfo().success(function (TxImInfo) {
            if (TxImInfo.status == 1) {
               $data.CustomerService({
                  order_id: $scope.params.order_id,
                  goods_id: $scope.params.goods_id,
                  suppliers_id: $scope.params.suppliers_id
               }).success(function (res) {
                  layer.close(inde)
                  if (res.status == 1) {
                     window.loginInfo = {
                        'sdkAppID': 1400158766, //用户所属应用id,必填
                        'identifier': TxImInfo.txim.identifier, //当前用户ID,必须是否字符串类型，必填
                        // 'identifier': "user_b", //当前用户ID,必须是否字符串类型，必填
                        'accountType': 1, //用户所属应用帐号类型，必填
                        'userSig': TxImInfo.txim.usersig,
                        //当前用户身份凭证，必须是字符串类型，必填
                        'identifierNick': TxImInfo.txim.user_name, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
                        'headurl': TxImInfo.txim.avatar //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
                     };
                     window.webimLogin();
                  } else {
                     alert(res.info)
                  }
               })
            }
         });
      }
      //正在查看
      $data.goods_infos({
         goods_id: $scope.params.goods_id
      }).success(function (res) {
         if (res.status == 1) {
            $scope.goodsData = res;
         } else {
            $scope.showtab = 3;
         }
      })

      //浏览记录
      $data.customer_get_history({
         is_list: 1
      }).success(function (res) {
         if (res.status == 1) {
            $scope.historyData = res;
         }
      })
      $scope.getSupplierInfo = function () {

         $data.getAllOrder({
            suppliers_id: $scope.params.suppliers_id
         }).success(function (res) {
            if (res.status == 1) {
               $scope.orderData = res;
            } else {
               $scope.showtab = 3;
            }
         })
         //店铺信息
         $data.customer_get_supplier_info({
            suppliers_id: $scope.params.suppliers_id
         }).success(function (res) {
            if (res.status == 1) {
               $scope.supplierData = res;
            }
         })
         //推荐商品
         $data.customer_get_category_recommend_goods({
            suppliers_id: $scope.params.suppliers_id,
            type: 'best'
         }).success(function (res) {
            if (res.status == 1) {
               $scope.recommendData = res;
            }
         })
      }
      $scope.get_suppliers_id = function (selToID) {
         $data.CustomerServiceGroup({
            group_id: selType == 'GROUP' ? selToID : undefined,
         }).success(function (res) {
            if (res.status == 1) {
               $scope.params.suppliers_id = res.id;
               $scope.getSupplierInfo();
            }
         })
      }
   }
   $scope.clicktab = function (type) {
      $scope.showtab = type;
   }

   $(".custome-services .supplier-info .tab2 li").on('click', function () {
      $(this).addClass("cur").siblings().removeClass('cur');
      $(".supplier-info .tab2 .box").hide().eq($(this).index()).show();
   });
   $scope.sendgoods = function (goods_id) {
      var inde = layer.load(2)
      $data.CustomerServiceCustom({
         goods_id: goods_id,
         suppliers_id: $scope.params.suppliers_id,
         group_id: selType == 'GROUP' ? selToID : undefined,
         identifier: loginInfo.identifier,
      }).success(function (res) {
         layer.close(inde)
         if (res.status == 1) {
            console.log('已发送')
         }
      })
   }
   $scope.sendOrder = function (order_id) {
      var inde = layer.load(2)
      $data.CustomerServiceCustom({
         order_id: order_id,
         suppliers_id: $scope.params.suppliers_id,
         group_id: selType == 'GROUP' ? selToID : undefined,
         identifier: loginInfo.identifier,
      }).success(function (res) {
         layer.close(inde)
         if (res.status == 1) {
            console.log('已发送')
         }
      })
   }
   $scope.goGoodsDataPage = function (id) {
      var href = $state.href('shop-detail', {
         goods_id: id
      });
      window.open(href);
   }
   $scope.goOrderDataPage = function (id) {
      var href = $state.href('order-detail', {
         order_id: id
      });
      window.open(href);
   }
   $scope.CustomerServiceGroupSource = function (id) { //发送来源
      $data.CustomerServiceGroupSource({}).success(function (res) {
         if (res.status == 1) {}
      })
   }
   $scope.onpaste = function (e) {

      var cbd = e.clipboardData || e.originalEvent.clipboardData;
      var ua = window.navigator.userAgent;
      var items = cbd.items;
      for (var i = 0; i < items.length; i++) {
         var item = items[i];
         if (item.kind == "file") {
            selectPicClick()
            var blob = item.getAsFile();
            if (blob.size === 0) {
               return;
            }
            clipboardData = blob;
            //预览图片
            var reader = new FileReader();
            var preDiv = document.getElementById('previewPicDiv');
            reader.onload = (function (file) {
               return function (e) {
                  preDiv.innerHTML = '';
                  var span = document.createElement('span');
                  span.innerHTML = '<img class="img-responsive" src="' + this.result + '" alt="' + file.name +
                     '" />';
                  //span.innerHTML = '<img class="img-thumbnail" src="' + this.result + '" alt="' + file.name + '" />';
                  preDiv.insertBefore(span, null);
               };
            })(blob);
            //预览图片
            reader.readAsDataURL(blob);
         }
      }
   }
})