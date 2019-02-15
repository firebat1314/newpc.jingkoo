angular.module("myApp.router", ["ui.router", 'oc.lazyLoad'])
   .config(function($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {

      $ocLazyLoadProvider.config({
         debug: false, //知否启用调试模式  
         events: false //事件绑定是否启用  
      });
      $urlRouterProvider.when("", "/jump/").otherwise('/error');
      //一级栏目
      //首页
      $stateProvider
         .state("jump", {
            title: '转跳中...',
            url: '/jump/:token',
            templateUrl: 'template/jump/jump.html?' + new Date().getTime(),
            controller: "jumpControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load("template/jump/jump.js");
               }]
            }
         })
         //首页路由
         .state("home", {
            title: '镜库首页',
            url: '/home',
            templateUrl: 'template/index_v_1.0.html?' + new Date().getTime(),
            controller: "index_parentControl"
         })
         //品牌路由
         .state("fashion", {
            title: '品牌',
            url: '/fashion',
            templateUrl: 'template/fashion.html?' + new Date().getTime(),
            controller: "fashion-control"
         })
         //预售路由
         .state("waitingSale", {
            title: '预售',
            url: '/waitingSale',
            templateUrl: 'template/waiting_sale.html?' + new Date().getTime(),
            controller: "waitingSale-control"
         })
         //闪购路由
         .state("flashSale", {
            title: '闪购',
            url: '/flashSale',
            templateUrl: 'template/flash_sale.html?' + new Date().getTime(),
            controller: "flashSale-control"
         })
         //积分商城路由
         .state("pointsMall", {
            title: '积分商城',
            url: '/pointsMall',
            templateUrl: 'template/points_mall.html?' + new Date().getTime(),
            controller: "pointsMall-control"
         })
         //优惠券路由
         .state("yhq", {
            title: '优惠券',
            url: '/yhq',
            templateUrl: 'template/youhuiquan.html?' + new Date().getTime(),
            controller: "yhq-control"
         })
         //设计路由
         .state("sheji", {
            title: '镜库设计',
            url: '/sheji',
            templateUrl: 'template/sheji.html?' + new Date().getTime(),
            controller: "sheji-control"
         })
         //登录路由
         .state("login", {
            title: '登录',
            url: '/login',
            templateUrl: 'template/login.html?' + new Date().getTime(),
            controller: "login-control"
         })
         //注册路由
         .state("register", {
            title: '注册',
            url: '/register',
            templateUrl: 'template/register.html?' + new Date().getTime(),
            controller: "register-control"
         })
         //注册路由
         .state("registerCompany", {
            title: '企业认证',
            url: '/register-company/:user_id',
            templateUrl: 'template/register-company.html?' + new Date().getTime(),
            controller: "register-company-control"
         })
         //忘记密码路由
         .state("forgotPassword", {
            title: '忘记密码',
            url: '/forgotPassword',
            templateUrl: 'template/forgot_password.html?' + new Date().getTime(),
            controller: "forgotPassword-control"
         })
         //充值路由
         .state("recharge", {
            title: '充值',
            url: '/recharge',
            templateUrl: 'template/recharge.html?' + new Date().getTime(),
            controller: "recharge-control"
         })
         //商品列表路由
         /* .state("shop-list", {
             title:'商品列表',
             url: '/shop-list/:brand_id/:cat_id/:filter/:keywords/:page/:random',
             templateUrl: 'template/shop_list.html?'+new Date().getTime(),
             controller: "shopList-control"
         }) */
         .state("shop-list", {
            title: '商品列表',
            url: '/shop-list/:params',
            templateUrl: 'template/shop-list/shop-list.html?' + new Date().getTime(),
            controller: "ShopListControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load("template/shop-list/shop-list.js");
               }]
            }
         })
         //切边镜片商品列表
         .state("shop-list-cut", {
            title: '商品列表',
            url: '/shop-list-cut/:params',
            templateUrl: 'template/shop-list-cut/shop-list-cut.html?' + new Date().getTime(),
            controller: "ShopListCutControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load("template/shop-list-cut/shop-list-cut.js");
               }]
            }
         })
         .state("shop-list-distribution", {
            title: '铺货专区',
            url: '/shop-list-distribution/:params',
            templateUrl: 'template/distribution/shop-list-distribution/shop-list-distribution.html?' + new Date().getTime(),
            controller: "ShopListDistributionControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load([
                     "template/distribution/shop-list-distribution/shop-list-distribution.js",
                     "template/distribution/shop-list-distribution/shop-list-distribution.css"
                  ]);
               }]
            }
         })
         //切边镜片商品详情路由
         .state("shop-detail-cut", {
            title: '商品详情',
            url: '/shop-detail-cut/:goods_id/:id',
            templateUrl: 'template/shop-detail-cut/shop-detail-cut.html?' + new Date().getTime(),
            controller: "shopDetailCutControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load("template/shop-detail-cut/shop-detail-cut.js");
               }]
            }
         })
         //切边镜片商品详情路由
         .state("shop-detail-distribution", {
            title: '铺货详情',
            url: '/shop-detail-distribution/:did',
            templateUrl: 'template/distribution/shop-detail-distribution/shop-detail-distribution.html?' + new Date().getTime(),
            controller: "shopDetailDistributionControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load("template/distribution/shop-detail-distribution/shop-detail-distribution.js");
               }]
            }
         })
         //切边镜片商品详情路由
         .state("checkout-distribution", {
            title: '结算铺货',
            url: '/checkout-distribution/:did',
            templateUrl: 'template/distribution/jiesuan-distribution/jiesuan-distribution.html?' + new Date().getTime(),
            controller: "checkoutDistributionControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load("template/distribution/jiesuan-distribution/jiesuan-distribution.js");
               }]
            }
         })
         //
         .state("order-list-d", {
            title: '铺货订单',
            url: '/order-list-d',
            templateUrl: 'template/distribution/order-list/order-list.html?' + new Date().getTime(),
            controller: "orderListDistributionControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load("template/distribution/order-list/order-list.js");
               }]
            }
         })
         .state("order-detail-d", {
            title: '订单详情',
            url: '/order-detail-d/:orderId',
            templateUrl: 'template/distribution/order-detail/order-detail.html?' + new Date().getTime(),
            controller: "orderDetailDistributionControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load("template/distribution/order-detail/order-detail.js");
               }]
            }
         })
         //商品列表路由
         .state("shop-list-ano", {
            title: '商品列表',
            url: '/shop-list-ano/:cat_id',
            templateUrl: 'template/shop_list_ano.html?' + new Date().getTime(),
            controller: "shopListAno-control"
         })
         //商品详情路由
         .state("shop-detail", {
            title: '商品详情',
            url: '/shop-detail/:goods_id/:isActivity',
            templateUrl: 'template/shop_detail.html?' + new Date().getTime(),
            controller: "shopDetail-control"
         })
         //批量下单路由
         .state("bulk-order", {
            title: '批量下单',
            url: '/bulk-order/:goods_id/:shop_price/:is_promote/:zhouwei',
            templateUrl: 'template/bulk_order.html?' + new Date().getTime(),
            controller: "bulkOrder-control"
         })
         //购物车路由
         .state("shop-car", {
            title: '购物车',
            url: '/shop-car',
            templateUrl: 'template/shop_car.html?' + new Date().getTime(),
            controller: "shopCar-control"
         })
         //购物车结算路由
         .state("shop-jiesuan", {
            title: '结算页',
            url: '/shop-jiesuan',
            templateUrl: 'template/shop_jiesuan.html?' + new Date().getTime(),
            controller: "shopJiesuan-control"
         })
         //购物车结算页copy
         .state("shop-jiesuan-copy", {
            title: '结算页',
            url: '/shop-jiesuan-copy/:sn',
            templateUrl: 'template/shop_jiesuan_copy.html?' + new Date().getTime(),
            controller: "shopJiesuanCopy-control"
         })
         //支付页路由
         .state("payment", {
            title: '支付',
            url: '/payment/:order_id/:log_id/:type',
            templateUrl: 'template/payment.html?' + new Date().getTime(),
            controller: "payment-control"
         })
         //新支付页路由
         .state("paymentNew", {
            title: '支付',
            url: '/paymentNew/:order_id/:log_id/:type/:is_distribution',
            templateUrl: 'template/paymentNew.html?' + new Date().getTime(),
            controller: "paymentNew-control"
         })
         //余额路由
         .state("yue", {
            title: '余额支付',
            url: '/yue/:url/:id/:type/:laijingId',
            templateUrl: 'template/yue.html?' + new Date().getTime(),
            controller: "yue-control"
         })
         //微信路由
         .state("erweima", {
            title: '微信支付',
            url: '/erweima/:url/:id/:type',
            templateUrl: 'template/erweima.html?' + new Date().getTime(),
            controller: "erweima-control"
         })
         //微信路由-加余额支付
         .state("erweimaNew", {
            title: '微信支付',
            url: '/erweimaNew/:url/:id/:type',
            templateUrl: 'template/erweimaNew.html?' + new Date().getTime(),
            controller: "erweimaNew-control"
         })
         //微信路由-资金管理付款
         .state("erweimaPayNew", {
            title: '微信支付',
            url: '/erweimaNew/:url',
            templateUrl: 'template/erweimaPayNew.html?' + new Date().getTime(),
            controller: "erweimaPayNew-control"
         })
         //微信路由-充值
         .state("erweimaRecharge", {
            title: '微信支付',
            url: '/erweimaRecharge/:log_id',
            templateUrl: 'template/erweimaRecharge.html?' + new Date().getTime(),
            controller: "erweimaRecharge-control"
         })
         //支付宝路由
         .state("alipay", {
            title: '支付宝支付',
            url: '/alipay/:url/:type',
            templateUrl: 'template/alipay.html?' + new Date().getTime(),
            controller: "alipay-control"
         })
         //支付宝路由-加余额支付
         .state("alipayNew", {
            title: '支付宝支付',
            url: '/alipayNew/:url/:type',
            templateUrl: 'template/alipayNew.html?' + new Date().getTime(),
            controller: "alipayNew-control"
         })
         //支付宝路由-充值
         .state("alipayRecharge", {
            title: '支付宝支付',
            url: '/alipayRecharge/:log_id',
            templateUrl: 'template/alipayRecharge.html?' + new Date().getTime(),
            controller: "alipayRecharge-control"
         })
         //银联路由
         .state("unionPay", {
            title: '银联支付',
            url: '/unionPay/:url/:type',
            templateUrl: 'template/unionPay.html?' + new Date().getTime(),
            controller: "unionPay-control"
         })
         //银联路由-加余额支付
         .state("unionPayNew", {
            title: '银联支付',
            url: '/unionPayNew/:url/:type',
            templateUrl: 'template/unionPayNew.html?' + new Date().getTime(),
            controller: "unionPayNew-control"
         })
         //银联路由-充值
         .state("unionPayRecharge", {
            title: '银联支付',
            url: '/unionPayRecharge/:log_id',
            templateUrl: 'template/unionPayRecharge.html?' + new Date().getTime(),
            controller: "unionPayRecharge-control"
         })
         //店铺路由
         .state("shopHome", {
            title: '店铺首页',
            url: '/shopHome/:shopId',
            templateUrl: 'template/shop_home.html?' + new Date().getTime(),
            controller: "shopHome-control"
         })
         //新店铺路由
         .state("shopHomeNew", {
            title: '店铺首页',
            url: '/shopHomeNew/:shopId',
            templateUrl: 'template/shop_home_new.html?' + new Date().getTime(),
            controller: "shopHomeNew-control"
         })
         //帮助中心公司简介路由
         .state("help_company", {
            title: '公司简介',
            url: '/help_company/:id',
            templateUrl: 'template/help_company.html?' + new Date().getTime(),
            controller: "helpCompany-control"
         })
         //来镜加工路由
         .state("glassMachining", {
            title: '来镜加工',
            url: '/glassMachining/:order_id',
            templateUrl: 'template/glass_machining.html?' + new Date().getTime(),
            controller: "glassMachining-control"
         })
         //来镜加工第二步路由
         .state("glassMachiningTwo", {
            title: '来镜加工',
            url: '/glassMachiningTwo/:order_id',
            templateUrl: 'template/glass_machining_two.html?' + new Date().getTime(),
            controller: "glassMachiningTwo-control"
         })
         //个人中心-发票管理-发票列表
         .state("person-invoices", {
            title: '发票管理',
            url: '/person-invoices',
            templateUrl: 'template/person_invoices.html?' + new Date().getTime(),
            controller: "invoices-control"
         })
         //个人中心-发票管理-发票索取
         .state("person-inv-select", {
            title: '发票管理',
            url: '/person-inv-select',
            templateUrl: 'template/person_inv_select.html?' + new Date().getTime(),
            controller: "invSelect-control"
         })
         //个人中心-发票管理-发票信息管理
         .state("person-inv-message", {
            title: '发票管理',
            url: '/person-inv-message',
            templateUrl: 'template/person_inv_message.html?' + new Date().getTime(),
            controller: "invMessage-control"
         })
         //个人中心-返修退换货-返修/退换货
         .state("person-return-repair", {
            title: '返修退换货',
            url: '/person-return-repair',
            templateUrl: 'template/return_repair.html?' + new Date().getTime(),
            controller: "returnRepair-control"
         })
         //个人中心-返修退换货-返修/退换货
         .state("return-repair-content", {
            title: '返修退换货-申请售后',
            url: '/return-repair-content/:id/:rec_ids/:order_ids/:type',
            templateUrl: 'template/return_repair_content.html?' + new Date().getTime(),
            controller: "returnRepairContent-control"
         })
         //个人中心-返修退换货-返修/退换货记录
         .state("person-return-repair-history", {
            title: '返修退换货记录',
            url: '/person-return-repair-history',
            templateUrl: 'template/return_repair_history.html?' + new Date().getTime(),
            controller: "returnRepairHistory-control"
         })
         //个人中心-返修退换货-退款明细
         .state("person-repair-refund", {
            title: '退款明细',
            url: '/person-repair-refund',
            templateUrl: 'template/repair_refund.html?' + new Date().getTime(),
            controller: "repairRefund-control"
         })
         //个人中心-返修退换货-明细详情
         .state("person-repair-refund-content", {
            title: '申请服务单详情',
            url: '/person-repair-refund-content/:order_id',
            templateUrl: 'template/repair_refund_content.html?' + new Date().getTime(),
            controller: "repairRefundContent-control"
         })
         //个人中心-返修退换货-返修明细
         .state("person-return-money", {
            title: '返修明细',
            url: '/person-return-money',
            templateUrl: 'template/return_money.html?' + new Date().getTime(),
            controller: "returnMoney-control"
         })
         .state("user-logo-center", {
            title: 'logo设置',
            url: '/user-logo-center',
            templateUrl: 'template/logo_center.html?' + new Date().getTime(),
            controller: "logoCenter-control"
         })
         .state("parson-msg-center", {
            title: '消息中心',
            url: '/parson-msg-center',
            templateUrl: 'template/person_msg_center.html?' + new Date().getTime(),
            controller: "msgCenter-control"
         })
         //个人中心-安全中心
         .state("person-save-center", {
            title: '安全中心',
            url: '/person-save-center',
            templateUrl: 'template/person_save.html?' + new Date().getTime(),
            controller: "saveCenter-control"
         })
         //个人中心-地区申请
         .state("person-addr-apply", {
            title: '地区申请',
            url: '/person-addr-apply',
            templateUrl: 'template/person_add_apply.html?' + new Date().getTime(),
            controller: "applyAddress-control"
         })
         //个人中心-地区申请审核
         .state("person-addr-applysh", {
            title: '地区审核',
            url: '/person-addr-applysh',
            templateUrl: 'template/person_add_applysh.html?' + new Date().getTime(),
            controller: "applyAddressSh-control"
         })
         //个人中心-积分管理
         .state("person-integral", {
            title: '积分管理',
            url: '/person-integral',
            templateUrl: 'template/person_integral.html?' + new Date().getTime(),
            controller: "integralMana-control"
         })
         //个人中心-提现
         .state("person-deposit", {
            title: '用户提现',
            url: '/person-deposit',
            templateUrl: 'template/person_deposit.html?' + new Date().getTime(),
            controller: "depositMana-control"
         })
         //个人中心-企业设置-联系人信息
         .state("person-qy-lxrmsg", {
            title: '联系人信息',
            url: '/person-qy-lxrmsg',
            templateUrl: 'template/person_qy_lxrmsg.html?' + new Date().getTime(),
            controller: "lxrMsg-control"
         })
         //个人中心-企业设置-企业资料
         .state("person-qy-msg", {
            title: '企业资料',
            url: '/person-qy-msg',
            templateUrl: 'template/person_qy_msg.html?' + new Date().getTime(),
            controller: "qyMsg-control"
         })
         //个人中心-企业设置-重置
         .state("person-qy-reset", {
            title: '重置',
            url: '/person-qy-reset',
            templateUrl: 'template/person_qy_reset.html?' + new Date().getTime(),
            controller: "qyReset-control"
         })
         //个人中心-管理地址
         .state("person-mana-addr", {
            title: '管理地址',
            url: '/person-mana-addr',
            templateUrl: 'template/person_mana_addr.html?' + new Date().getTime(),
            controller: "addressMana-control"
         })
         //个人中心-消息中心-无
         //          .state("person-msg-no",{
         //          	title:'暂无消息',
         //          	url:'/person-msg-no',
         //          	templateUrl:'template/person_msg_no.html?'+new Date().getTime(),
         //          	controller:"noMessage-control"
         //          })
         //个人中心-资金管理-提现账户明细
         .state("deposit-detail", {
            title: '提现账户明细',
            url: '/deposit-detail',
            templateUrl: 'template/person_zj_depositdetail.html?' + new Date().getTime(),
            controller: "depositDetail-control"
         })
         //个人中心-充值
         .state("person-pay", {
            title: '充值',
            url: '/person-pay',
            templateUrl: 'template/person_pay.html?' + new Date().getTime(),
            controller: "personPay-control"
         })
         //个人中心-安全中心-手机验证1
         .state("save-telone", {
            title: '修改手机号',
            url: '/save-telone',
            templateUrl: 'template/person_save_tel1.html?' + new Date().getTime(),
            controller: "telOne-control"
         })
         //个人中心-安全中心-手机验证2
         .state("save-teltwo", {
            title: '修改手机号',
            url: '/save-teltwo/:phone',
            templateUrl: 'template/person_save_tel2.html?' + new Date().getTime(),
            controller: "telTwo-control"
         })
         //个人中心-安全中心-手机验证3
         .state("save-telthree", {
            title: '修改手机号',
            url: '/save-telthree/:phone',
            templateUrl: 'template/person_save_tel3.html?' + new Date().getTime(),
            controller: "telThree-control"
         })

         //个人中心-安全中心-密码验证1
         .state("save-passone", {
            title: '修改密码',
            url: '/save-passone',
            templateUrl: 'template/person_save_pas1.html?' + new Date().getTime(),
            controller: "passOne-control"
         })
         //个人中心-安全中心-密码验证2
         .state("save-passtwo", {
            title: '修改密码',
            url: '/save-passtwo',
            templateUrl: 'template/person_save_pas2.html?' + new Date().getTime(),
            controller: "passTwo-control"
         })
         //个人中心-安全中心-密码验证3
         .state("save-passthree", {
            title: '修改密码',
            url: '/save-telthree',
            templateUrl: 'template/person_save_pas3.html?' + new Date().getTime(),
            controller: "passThree-control"
         })

         //个人中心-安全中心-邮箱验证1
         .state("save-emailone", {
            title: '修改邮箱',
            url: '/save-emailone',
            templateUrl: 'template/person_save_yx1.html?' + new Date().getTime(),
            controller: "emailOne-control"
         })
         //个人中心-安全中心-邮箱验证2
         .state("save-emailtwo", {
            title: '修改邮箱',
            url: '/save-emailtwo/:email',
            templateUrl: 'template/person_save_yx2.html?' + new Date().getTime(),
            controller: "emailTwo-control"
         })
         //个人中心-安全中心-邮箱验证3
         .state("save-emailthree", {
            title: '修改邮箱',
            url: '/save-emailthree/:email',
            templateUrl: 'template/person_save_yx3.html?' + new Date().getTime(),
            controller: "emailThree-control"
         })
         //个人中心-安全中心-支付密码验证1
         .state("save-payPass", {
            title: '设置支付密码',
            url: '/save-payPass',
            templateUrl: 'template/person_save_payPass1.html?' + new Date().getTime(),
            controller: "payPassOne-control"
         })
         //个人中心-安全中心-支付密码验证2
         .state("save-payPasstwo", {
            title: '设置支付密码',
            url: '/save-payPasstwo/:verify',
            templateUrl: 'template/person_save_payPass2.html?' + new Date().getTime(),
            controller: "payPassTwo-control"
         })
         //个人中心-安全中心-支付密码验证3
         .state("save-payPassthree", {
            title: '设置支付密码',
            url: '/save-payPassthree',
            templateUrl: 'template/person_save_payPass3.html?' + new Date().getTime(),
            controller: "payPassThree-control"
         })
         //个人中心-资金管理
         .state("zijin-mana", {
            title: '资金管理',
            url: '/zijin-mana',
            templateUrl: 'template/person_zj_mana.html?' + new Date().getTime(),
            controller: "zijinMana-control"
         })
         //个人中心-优惠券
         .state("person-yhq", {
            title: '优惠券领取',
            url: '/person-yhq',
            templateUrl: 'template/person_yhq.html?' + new Date().getTime(),
            controller: "personYhq-control"
         })
         //个人中心-我的订单全部
         .state("order-all", {
            title: '我的订单',
            url: '/order-all/:type1',
            templateUrl: 'template/my_order_all.html?' + new Date().getTime(),
            controller: "orderAll-control"
         })
         .state("order-detail", {
            title: '订单详情',
            url: '/order-detail/:orderId',
            templateUrl: 'template/my_order_detail.html?' + new Date().getTime(),
            controller: "orderDetail-control"
         })
         .state("order-print", {
            title: '订单打印',
            url: '/order-print/:orderId',
            templateUrl: 'template/order/order-print.html?' + new Date().getTime(),
            controller: "order-print-control"
         })
         //			收藏的商品
         .state("myCollect", {
            title: '收藏的商品',
            url: '/myCollect',
            templateUrl: 'template/person_myCollection.html?' + new Date().getTime(),
            controller: "collectGoods-control"
         })
         //			收藏的店铺
         .state("myCollectShop", {
            title: '收藏的店铺',
            url: '/myCollectShop',
            templateUrl: 'template/person_myCollectionShop.html?' + new Date().getTime(),
            controller: "collectShop-control"
         })
         //			控制面板
         .state("control-mb", {
            title: '控制面板',
            url: '/control-mb',
            templateUrl: 'template/control_mb.html?' + new Date().getTime(),
            controller: "controlMb-control"
         })
         //			已取消
         .state("order-cancel", {
            title: '取消订单',
            url: '/order-cancel/:orderId',
            templateUrl: 'template/order_cancel.html?' + new Date().getTime(),
            controller: "orderCancel-control"
         })
         //个人中心-来镜加工
         .state("person-process", {
            title: '来镜加工',
            url: '/person-process',
            templateUrl: 'template/person_process.html?' + new Date().getTime(),
            controller: "personProcess-control"
         })
         //个人中心-来镜加工详情
         .state("person-process-content", {
            title: '来镜加工',
            url: '/person-process-content/:mid',
            templateUrl: 'template/person_process_content.html?' + new Date().getTime(),
            controller: "personProcessContent-control"
         })
         //个人中心-来镜加工打印
         .state("person-process-print", {
            title: '来镜加工打印',
            url: '/person-process-print/:mid',
            templateUrl: 'template/person-process/person-process-print.html?' + new Date().getTime(),
            controller: "person-process-print-control"
         })
         //个人中心-来镜加工预览
         .state("person-process-preview", {
            title: '批量下单预览',
            url: '/person-process-preview/:params',
            templateUrl: 'template/person-process/person-process-preview.html?' + new Date().getTime(),
            controller: "person-process-preview-control"
         })
         //个人中心-来镜加工预览
         .state("person-process-print-preview", {
            title: '批量下单预览',
            url: '/person-process-print-preview/:params',
            templateUrl: 'template/person-process/person-process-print-preview.html?' + new Date().getTime(),
            controller: "person-process-print-preview-control"
         })
         //新品专区
         .state("newGoods", {
            title: '新品专区',
            url: '/newGoods',
            templateUrl: 'template/newGoods.html?' + new Date().getTime(),
            controller: "newgoods-control"
         })
         //员工管理
         .state("EmployeeM", {
            title: '员工管理',
            url: '/EmployeeM',
            templateUrl: 'template/Employee-mana.html?' + new Date().getTime(),
            controller: "EmployeeM-control"
         })
         //error
         .state("error", {
            title: 'error',
            url: '/error',
            templateUrl: 'template/error/error.html?' + new Date().getTime(),
            controller: "errorControl",
            resolve: {
               deps: ["$ocLazyLoad", function($ocLazyLoad) {
                  return $ocLazyLoad.load([
                     "template/error/error.js",
                     "template/error/error.css",
                  ]);
               }]
            }
         })
         //商户贷
         .state("SHD", {
            title: '商户贷',
            url: '/SHD',
            views: {
               '': {
                  templateUrl: 'template/SHD/SHD.html?' + new Date().getTime(),
                  controller: "SHDControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/SHD/SHD.css",
                           "template/SHD/SHD.js",
                        ]);
                     }]
                  }
               },
               "userMain@SHD": {
                  title: '商户贷222',
                  templateUrl: 'template/SHD/index/index.html?' + new Date().getTime(),
                  controller: "SHDIndexControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/SHD/index/index.css",
                           "template/SHD/index/index.js",
                        ]);
                     }]
                  },
               }
            }
         })
         .state("SHD.borrowings", {
            title: '借款',
            url: '/borrowings',
            views: {
               'userMain@SHD': {
                  templateUrl: 'template/SHD/borrowings/borrowings.html?' + new Date().getTime(),
                  controller: "SHDBorrowingsControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/SHD/borrowings/borrowings.css",
                           "template/SHD/borrowings/borrowings.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("SHD.borrowingsInfo", {
            title: '借款信息',
            url: '/borrowingsInfo',
            views: {
               'userMain@SHD': {
                  templateUrl: 'template/SHD/borrowings-info/borrowings-info.html?' + new Date().getTime(),
                  controller: "SHDBorrowingsInfoControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/SHD/borrowings-info/borrowings-info.css",
                           "template/SHD/borrowings-info/borrowings-info.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("SHD.borrowingsPersonInfo", {
            title: '借款人信息',
            url: '/borrowingsPersonInfo',
            views: {
               'userMain@SHD': {
                  templateUrl: 'template/SHD/borrowings-person-info/borrowings-person-info.html?' + new Date().getTime(),
                  controller: "SHDBorrowingsPersonInfoControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/SHD/borrowings-person-info/borrowings-person-info.css",
                           "template/SHD/borrowings-person-info/borrowings-person-info.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("SHD.companyInfo", {
            title: '公司信息',
            url: '/companyInfo',
            views: {
               'userMain@SHD': {
                  templateUrl: 'template/SHD/company-info/company-info.html?' + new Date().getTime(),
                  controller: "SHDCompanyInfoControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/SHD/company-info/company-info.css",
                           "template/SHD/company-info/company-info.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("SHD.tiedCard", {
            title: '实名绑卡认证',
            url: '/tiedCard',
            views: {
               'userMain@SHD': {
                  templateUrl: 'template/SHD/tied-card/tied-card.html?' + new Date().getTime(),
                  controller: "SHDTiedCardControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/SHD/tied-card/tied-card.css",
                           "template/SHD/tied-card/tied-card.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("jingku-finance", {
            title: '镜库金融',
            url: '/jingku-finance',
            views: {
               '': {
                  templateUrl: 'template/jingku-finance/jingku-finance.html?' + new Date().getTime(),
                  controller: "jingkuFinanceController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/jingku-finance/jingku-finance.css",
                           "template/jingku-finance/jingku-finance.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("comment", {
            title: '评论晒单',
            url: '/comment/:orderid',
            views: {
               '': {
                  templateUrl: 'template/comment/comment.html?' + new Date().getTime(),
                  controller: "commentController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/comment/comment.css",
                           "template/comment/comment.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("comment-over", {
            title: '评论完成',
            url: '/comment-over',
            views: {
               '': {
                  templateUrl: 'template/comment/comment-over/comment-over.html?' + new Date().getTime(),
                  controller: "commentOverController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/comment/comment-over/comment-over.css",
                           "template/comment/comment-over/comment-over.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("no-comment", {
            title: '我的评价',
            url: '/no-comment',
            views: {
               '': {
                  templateUrl: 'template/comment/no-comment-list/no-comment-list.html?' + new Date().getTime(),
                  controller: "noCommentListController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/comment/no-comment-list/no-comment-list.css",
                           "template/comment/no-comment-list/no-comment-list.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("plus", {
            title: '镜库PLUS会员',
            url: '/plus',
            views: {
               '': {
                  templateUrl: 'template/plus/plus.html?' + new Date().getTime(),
                  controller: "plusController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/plus/plus.css",
                           "template/plus/plus.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("plus.index", {
            title: '镜库PLUS会员',
            url: '/index',
            views: {
               'plus@plus': {
                  templateUrl: 'template/plus/index/index.html?' + new Date().getTime(),
                  controller: "plusIndexController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/plus/index/index.css",
                           "template/plus/index/index.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("plus.coupon", {
            title: '镜库PLUS会员',
            url: '/coupon',
            views: {
               'plus@plus': {
                  templateUrl: 'template/plus/coupon/coupon.html?' + new Date().getTime(),
                  controller: "plusCouponController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/plus/coupon/coupon.css",
                           "template/plus/coupon/coupon.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("plus.rebate", {
            title: '我的购物回馈',
            url: '/rebate',
            views: {
               'plus@plus': {
                  templateUrl: 'template/plus/rebate/rebate.html?' + new Date().getTime(),
                  controller: "plusRebateController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/plus/rebate/rebate.css",
                           "template/plus/rebate/rebate.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("plus.order", {
            title: '开通镜库PLUS会员',
            url: '/order',
            views: {
               'plus@plus': {
                  templateUrl: 'template/plus/order/order.html?' + new Date().getTime(),
                  controller: "plusOrderController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/plus/order/order.css",
                           "template/plus/order/order.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("plus.protocol", {
            title: '镜库PLUS会员',
            url: '/protocol',
            views: {
               'plus@plus': {
                  templateUrl: 'template/plus/order/protocol/protocol.html?' + new Date().getTime(),
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/plus/order/protocol/protocol.css",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("distribution-qualification", {
            title: '铺货资质',
            url: '/distribution-qualification',
            views: {
               '': {
                  templateUrl: 'template/business-management/distribution-qualification/distribution-qualification.html?' + new Date().getTime(),
                  controller: "distributionQualificationController",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/business-management/distribution-qualification/distribution-qualification.css",
                           "template/business-management/distribution-qualification/distribution-qualification.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("distribution-division", {
            title: '铺货专区',
            url: '/distribution-division',
            views: {
               '': {
                  templateUrl: 'template/distribution/distribution-division/distribution-division.html?' + new Date().getTime(),
                  controller: "DistributionDivisionControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/distribution/distribution-division/distribution-division.css",
                           "template/distribution/distribution-division/distribution-division.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("custome-services", {
            title: '在线客服',
            url: '/custome-services/:params',
            views: {
               '': {
                  templateUrl: 'template/custome-services/custome-services.html?' + new Date().getTime(),
                  controller: "CustomeServicesControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "css/bootstrap.css",
                           "css/bootstrap-table.css",
                           "css/jquery-ui.css",
                           "js/lib/jquery/jquery-ui.js",
                           "js/lib/lodash.min.js",
                           "js/lib/bootstrap/bootstrap.js",
                           "js/lib/bootstrap/bootstrap-table.js",
                           "js/lib/bootstrap/bootstrap-collapse.js",
                           "js/lib/xss.js",
                           "js/lib/md5/spark-md5.js",
                           "js/lib/IMSDK_V1.7.2/webim.min.js",
                           "js/lib/IMSDK_V1.7.2/json2.js",
                           
                           "template/custome-services/custome-services.services.js",
                           "template/custome-services/custome-services.css",
                           "template/custome-services/custome-services.js",
                        ]);
                     }]
                  }
               }
            }
         })
         .state("show-special", {
            title: '专题页',
            url: '/show-special',
            views: {
               '': {
                  templateUrl: 'template/show-special/show-special.html?' + new Date().getTime(),
                  controller: "ShowSpecialControl",
                  resolve: {
                     deps: ["$ocLazyLoad", function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                           "template/show-special/show-special.css",
                           "template/show-special/show-special.js",
                        ]);
                     }]
                  }
               }
            }
         })
   })