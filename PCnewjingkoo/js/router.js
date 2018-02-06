
angular.module("myApp.router", ["ui.router"])
    .config(function ($stateProvider, $urlRouterProvider,$locationProvider) {
        //重定向首页

        //location.href = 'http://newwww.jingkoo.net/';

        $urlRouterProvider.otherwise('/home');
        //一级栏目
        //首页
        $stateProvider
            //首页路由
            .state("home", {
                title:'镜库首页',
                url: '/home',
                templateUrl: 'template/index_v_1.0.html',
                controller: "index_parentControl"
            })
            //品牌路由
            .state("fashion", {
                title:'品牌',
                url: '/fashion', 
                templateUrl: 'template/fashion.html',
                controller: "fashion-control"
            })
            //预售路由
            .state("waitingSale", {
                title:'预售',
                url: '/waitingSale',
                templateUrl: 'template/waiting_sale.html',
                controller: "waitingSale-control"
            })
            //闪购路由
            .state("flashSale", {
                title:'闪购',
                url: '/flashSale',
                templateUrl: 'template/flash_sale.html',
                controller: "flashSale-control"
            })
            //积分商城路由
            .state("pointsMall", {
                title:'积分商城',
                url: '/pointsMall',
                templateUrl: 'template/points_mall.html',
                controller: "pointsMall-control"
            })
            //优惠券路由
            .state("yhq", {
                title:'优惠券',
                url: '/yhq',
                templateUrl: 'template/youhuiquan.html',
                controller: "yhq-control"
            })
            //设计路由
            .state("sheji", {
                title:'镜库设计',
                url: '/sheji',
                templateUrl: 'template/sheji.html',
                controller: "sheji-control"
            })
            //登录路由
            .state("login", {
                title:'登录',
                url: '/login',
                templateUrl: 'template/login.html',
                controller: "login-control"
            })
            //注册路由
            .state("register", {
                title:'注册',
                url: '/register',
                templateUrl: 'template/register.html',
                controller: "register-control"
            })
            //忘记密码路由
            .state("forgotPassword", {
                title:'忘记密码',
                url: '/forgotPassword',
                templateUrl: 'template/forgot_password.html',
                controller: "forgotPassword-control"
            })
            //充值路由
            .state("recharge", {
                title:'充值',
                url: '/recharge',
                templateUrl: 'template/recharge.html',
                controller: "recharge-control"
            })
            //商品列表路由
            /* .state("shop-list", {
                title:'商品列表',
                url: '/shop-list/:brand_id/:cat_id/:filter/:keywords/:page/:random',
                templateUrl: 'template/shop_list.html',
                controller: "shopList-control"
            }) */
            .state("shop-list", {
                title:'商品列表',
                url: '/shop-list/:params',
                templateUrl: 'template/shop-list/shop-list.html',
                controller: "ShopListControl"
            })
            //切边镜片商品列表
            .state("shop-list-cut", {
                title:'商品列表',
                url: '/shop-list-cut/:params',
                templateUrl: 'template/shop-list-cut/shop-list-cut.html',
                controller: "ShopListCutControl"
            })
            //切边镜片商品详情路由
            .state("shop-detail-cut", {
                title:'',
                url: '/shop-detail-cut/:goods_id/:cutting_id',
                templateUrl: 'template/shop-detail-cut/shop-detail-cut.html',
                controller: "shopDetailCutControl"
            })
            //商品列表路由
            .state("shop-list-ano", {
                title:'商品列表',
                url: '/shop-list-ano/:cat_id',
                templateUrl: 'template/shop_list_ano.html',
                controller: "shopListAno-control"
            })
            //商品详情路由
            .state("shop-detail", {
                title:'',
                url: '/shop-detail/:goods_id',
                templateUrl: 'template/shop_detail.html',
                controller: "shopDetail-control"
            })
            //批量下单路由
            .state("bulk-order", {
                title:'批量下单',
                url: '/bulk-order/:goods_id/:shop_price/:is_promote/:zhouwei',
                templateUrl: 'template/bulk_order.html',
                controller: "bulkOrder-control"
            })
            //购物车路由
            .state("shop-car", {
                title:'购物车',
                url: '/shop-car',
                templateUrl: 'template/shop_car.html',
                controller: "shopCar-control"
            })
            //购物车结算路由
            .state("shop-jiesuan", {
                title:'结算页',
                url: '/shop-jiesuan',
                templateUrl: 'template/shop_jiesuan.html',
                controller: "shopJiesuan-control"
            })
            //购物车结算页copy
            .state("shop-jiesuan-copy", {
                title:'结算页',
                url: '/shop-jiesuan-copy/:sn',
                templateUrl: 'template/shop_jiesuan_copy.html',
                controller: "shopJiesuanCopy-control"
            })
            //支付页路由
            .state("payment", {
                title:'支付',
                url: '/payment/:order_id/:log_id/:type',
                templateUrl: 'template/payment.html',
                controller: "payment-control"
            })
            //新支付页路由
            .state("paymentNew", {
                title:'支付',
                url: '/paymentNew/:order_id/:log_id/:type',
                templateUrl: 'template/paymentNew.html',
                controller: "paymentNew-control"
            })
            //余额路由
            .state("yue", {
                title:'余额支付',
                url: '/yue/:url/:id/:type/:laijingId',
                templateUrl: 'template/yue.html',
                controller: "yue-control"
            })
            //微信路由
            .state("erweima", {
                title:'微信支付',
                url: '/erweima/:url/:id/:type',
                templateUrl: 'template/erweima.html',
                controller: "erweima-control"
            })
            //微信路由-加余额支付
            .state("erweimaNew", {
                title:'微信支付',
                url: '/erweimaNew/:url/:id/:type',
                templateUrl: 'template/erweimaNew.html',
                controller: "erweimaNew-control"
            })
            //微信路由-资金管理付款
            .state("erweimaPayNew", {
                title:'微信支付',
                url: '/erweimaNew/:url',
                templateUrl: 'template/erweimaPayNew.html',
                controller: "erweimaPayNew-control"
            })
            //微信路由-充值
            .state("erweimaRecharge", {
                title:'微信支付',
                url: '/erweimaRecharge/:log_id',
                templateUrl: 'template/erweimaRecharge.html',
                controller: "erweimaRecharge-control"
            })
            //支付宝路由
            .state("alipay", {
                title:'支付宝支付',
                url: '/alipay/:url/:type',
                templateUrl: 'template/alipay.html',
                controller: "alipay-control"
            })
            //支付宝路由-加余额支付
            .state("alipayNew", {
                title:'支付宝支付',
                url: '/alipayNew/:url/:type',
                templateUrl: 'template/alipayNew.html',
                controller: "alipayNew-control"
            })
            //支付宝路由-充值
            .state("alipayRecharge", {
                title:'支付宝支付',
                url: '/alipayRecharge/:log_id',
                templateUrl: 'template/alipayRecharge.html',
                controller: "alipayRecharge-control"
            })
            //银联路由
            .state("unionPay", {
                title:'银联支付',
                url: '/unionPay/:url/:type',
                templateUrl: 'template/unionPay.html',
                controller: "unionPay-control"
            })
            //银联路由-加余额支付
            .state("unionPayNew", {
                title:'银联支付',
                url: '/unionPayNew/:url/:type',
                templateUrl: 'template/unionPayNew.html',
                controller: "unionPayNew-control"
            })
            //银联路由-充值
            .state("unionPayRecharge", {
                title:'银联支付',
                url: '/unionPayRecharge/:log_id',
                templateUrl: 'template/unionPayRecharge.html',
                controller: "unionPayRecharge-control"
            })
            //店铺路由
            .state("shopHome", {
                title:'店铺首页',
                url: '/shopHome/:shopId',
                templateUrl: 'template/shop_home.html',
                controller: "shopHome-control"
            })
            //新店铺路由
            .state("shopHomeNew", {
                title:'店铺首页',
                url: '/shopHomeNew/:shopId',
                templateUrl: 'template/shop_home_new.html',
                controller: "shopHomeNew-control"
            })
            //帮助中心公司简介路由
            .state("help_company", {
                title:'公司简介',
                url: '/help_company/:id',
                templateUrl: 'template/help_company.html',
                controller: "helpCompany-control"
            })
            //来镜加工路由
            .state("glassMachining", {
                title:'来镜加工',
                url: '/glassMachining/:order_id',
                templateUrl: 'template/glass_machining.html',
                controller: "glassMachining-control"
            })
            //来镜加工第二步路由
            .state("glassMachiningTwo", {
                title:'来镜加工',
                url: '/glassMachiningTwo/:order_id',
                templateUrl: 'template/glass_machining_two.html',
                controller: "glassMachiningTwo-control"
            })
            //个人中心-发票管理-发票列表
            .state("person-invoices",{
                title:'发票管理',
                url:'/person-invoices',
                templateUrl:'template/person_invoices.html',
                controller:"invoices-control"
            })
            //个人中心-发票管理-发票索取
            .state("person-inv-select",{
                title:'发票管理',
                url:'/person-inv-select',
                templateUrl:'template/person_inv_select.html',
                controller:"invSelect-control"
            })
            //个人中心-发票管理-发票信息管理
            .state("person-inv-message",{
                title:'发票管理',
                url:'/person-inv-message',
                templateUrl:'template/person_inv_message.html',
                controller:"invMessage-control"
            })
            //个人中心-返修退换货-返修/退换货
            .state("person-return-repair",{
                title:'返修退换货',
                url:'/person-return-repair',
                templateUrl:'template/return_repair.html',
                controller:"returnRepair-control"
            })
            //个人中心-返修退换货-返修/退换货
            .state("return-repair-content",{
                title:'返修退换货-申请售后',
                url:'/return-repair-content/:id/:rec_ids/:order_ids/:type',
                templateUrl:'template/return_repair_content.html',
                controller:"returnRepairContent-control"
            })
            //个人中心-返修退换货-返修/退换货记录
            .state("person-return-repair-history",{
                title:'返修退换货记录',
                url:'/person-return-repair-history',
                templateUrl:'template/return_repair_history.html',
                controller:"returnRepairHistory-control"
            })
            //个人中心-返修退换货-退款明细
            .state("person-repair-refund",{
                title:'退款明细',
                url:'/person-repair-refund',
                templateUrl:'template/repair_refund.html',
                controller:"repairRefund-control"
            })
            //个人中心-返修退换货-明细详情
            .state("person-repair-refund-content",{
                title:'申请服务单详情',
                url:'/person-repair-refund-content/:order_id',
                templateUrl:'template/repair_refund_content.html',
                controller:"repairRefundContent-control"
            })
            //个人中心-返修退换货-返修明细
            .state("person-return-money",{
                title:'返修明细',
                url:'/person-return-money',
                templateUrl:'template/return_money.html',
                controller:"returnMoney-control"
            })
            .state("user-logo-center", {
            	title:'logo设置',
                url: '/user-logo-center',
                templateUrl: 'template/logo_center.html',
                controller: "logoCenter-control"
            })
            .state("parson-msg-center",{
            	title:'消息中心',
            	url:'/parson-msg-center',
            	templateUrl:'template/person_msg_center.html',
            	controller:"msgCenter-control"
            })
            //个人中心-安全中心
            .state("person-save-center",{
            	title:'安全中心',
            	url:'/person-save-center',
            	templateUrl:'template/person_save.html',
            	controller:"saveCenter-control"
            })
            //个人中心-地区申请
            .state("person-addr-apply",{
            	title:'地区申请',
            	url:'/person-addr-apply',
            	templateUrl:'template/person_add_apply.html',
            	controller:"applyAddress-control"
            })
             //个人中心-地区申请审核
            .state("person-addr-applysh",{
            	title:'地区审核',
            	url:'/person-addr-applysh',
            	templateUrl:'template/person_add_applysh.html',
            	controller:"applyAddressSh-control"
            })
			//个人中心-积分管理
            .state("person-integral",{
            	title:'积分管理',
            	url:'/person-integral',
            	templateUrl:'template/person_integral.html',
            	controller:"integralMana-control"
            })
			//个人中心-提现
            .state("person-deposit",{
	          	title:'用户提现',
            	url:'/person-deposit',
            	templateUrl:'template/person_deposit.html',
            	controller:"depositMana-control"
            })
			//个人中心-企业设置-联系人信息
            .state("person-qy-lxrmsg",{
            	title:'联系人信息',
            	url:'/person-qy-lxrmsg',
            	templateUrl:'template/person_qy_lxrmsg.html',
            	controller:"lxrMsg-control"
            })
			//个人中心-企业设置-企业资料
            .state("person-qy-msg",{
            	title:'企业资料',
            	url:'/person-qy-msg',
            	templateUrl:'template/person_qy_msg.html',
            	controller:"qyMsg-control"
            })
			//个人中心-企业设置-重置
            .state("person-qy-reset",{
            	title:'重置',
            	url:'/person-qy-reset',
            	templateUrl:'template/person_qy_reset.html',
            	controller:"qyReset-control"
            })
			//个人中心-管理地址
            .state("person-mana-addr",{
            	title:'管理地址',
            	url:'/person-mana-addr',
            	templateUrl:'template/person_mana_addr.html',
            	controller:"addressMana-control"
            })
			//个人中心-消息中心-无
//          .state("person-msg-no",{
//          	title:'暂无消息',
//          	url:'/person-msg-no',
//          	templateUrl:'template/person_msg_no.html',
//          	controller:"noMessage-control"
//          })
			//个人中心-资金管理-提现账户明细
            .state("deposit-detail",{
            	title:'提现账户明细',
            	url:'/deposit-detail',
            	templateUrl:'template/person_zj_depositdetail.html',
            	controller:"depositDetail-control"
            })
			//个人中心-充值
            .state("person-pay",{
            	title:'充值',
            	url:'/person-pay',
            	templateUrl:'template/person_pay.html',
            	controller:"personPay-control"
            })
			//个人中心-安全中心-手机验证1
            .state("save-telone",{
            	title:'修改手机号',
            	url:'/save-telone',
            	templateUrl:'template/person_save_tel1.html',
            	controller:"telOne-control"
            })
			//个人中心-安全中心-手机验证2
            .state("save-teltwo",{
            	title:'修改手机号',
            	url:'/save-teltwo/:phone',
            	templateUrl:'template/person_save_tel2.html',
            	controller:"telTwo-control"
            })
			//个人中心-安全中心-手机验证3
            .state("save-telthree",{
            	title:'修改手机号',
            	url:'/save-telthree/:phone',
            	templateUrl:'template/person_save_tel3.html',
            	controller:"telThree-control"
            })
            
			//个人中心-安全中心-密码验证1
            .state("save-passone",{
            	title:'修改密码',
            	url:'/save-passone',
            	templateUrl:'template/person_save_pas1.html',
            	controller:"passOne-control"
            })
			//个人中心-安全中心-密码验证2
            .state("save-passtwo",{
            	title:'修改密码',
            	url:'/save-passtwo',
            	templateUrl:'template/person_save_pas2.html',
            	controller:"passTwo-control"
            })
			//个人中心-安全中心-密码验证3
            .state("save-passthree",{
            	title:'修改密码',
            	url:'/save-telthree',
            	templateUrl:'template/person_save_pas3.html',
            	controller:"passThree-control"
            })
            
			//个人中心-安全中心-邮箱验证1
            .state("save-emailone",{
            	title:'修改邮箱',
            	url:'/save-emailone',
            	templateUrl:'template/person_save_yx1.html',
            	controller:"emailOne-control"
            })
			//个人中心-安全中心-邮箱验证2
            .state("save-emailtwo",{
            	title:'修改邮箱',
            	url:'/save-emailtwo/:email',
            	templateUrl:'template/person_save_yx2.html',
            	controller:"emailTwo-control"
            })
			//个人中心-安全中心-邮箱验证3
            .state("save-emailthree",{
            	title:'修改邮箱',
            	url:'/save-emailthree/:email',
            	templateUrl:'template/person_save_yx3.html',
            	controller:"emailThree-control"
            })
            //个人中心-安全中心-支付密码验证1
            .state("save-payPass",{
                title:'设置支付密码',
                url:'/save-payPass',
                templateUrl:'template/person_save_payPass1.html',
                controller:"payPassOne-control"
            })
            //个人中心-安全中心-支付密码验证2
            .state("save-payPasstwo",{
                title:'设置支付密码',
                url:'/save-payPasstwo/:verify',
                templateUrl:'template/person_save_payPass2.html',
                controller:"payPassTwo-control"
            })
            //个人中心-安全中心-支付密码验证3
            .state("save-payPassthree",{
                title:'设置支付密码',
                url:'/save-payPassthree',
                templateUrl:'template/person_save_payPass3.html',
                controller:"payPassThree-control"
            })
			//个人中心-资金管理
            .state("zijin-mana",{
            	title:'资金管理',
            	url:'/zijin-mana',
            	templateUrl:'template/person_zj_mana.html',
            	controller:"zijinMana-control"
            })
			//个人中心-优惠券
            .state("person-yhq",{
            	title:'优惠券领取',
            	url:'/person-yhq',
            	templateUrl:'template/person_yhq.html',
            	controller:"personYhq-control"
            })
//          个人中心-我的订单全部
            .state("order-all",{
            	title:'我的订单',
            	url:'/order-all/:type1',
            	templateUrl:'template/my_order_all.html',
            	controller:"orderAll-control"
            })
            .state("order-detail",{
            	title:'订单详情',
            	url:'/order-detail/:orderId',
            	templateUrl:'template/my_order_detail.html',
            	controller:"orderDetail-control"
            })
            .state("order-print",{
            	title:'订单打印',
            	url:'/order-print/:orderId',
            	templateUrl:'template/order/order-print.html',
            	controller:"order-print-control"
            })
            //			收藏的商品
            .state("myCollect",{
                title:'收藏的商品',
                url:'/myCollect',
                templateUrl:'template/person_myCollection.html',
                controller:"collectGoods-control"
            })
            //			收藏的店铺
            .state("myCollectShop",{
                title:'收藏的店铺',
                url:'/myCollectShop',
                templateUrl:'template/person_myCollectionShop.html',
                controller:"collectShop-control"
            })
//			控制面板
			.state("control-mb",{
				title:'控制面板',
            	url:'/control-mb',
            	templateUrl:'template/control_mb.html',
            	controller:"controlMb-control"
            })
//			已取消
			.state("order-cancel",{
				title:'取消订单',
            	url:'/order-cancel/:orderId',
            	templateUrl:'template/order_cancel.html',
            	controller:"orderCancel-control"
            })
            //个人中心-来镜加工
            .state("person-process",{
                title:'来镜加工',
                url:'/person-process',
                templateUrl:'template/person_process.html',
                controller:"personProcess-control"
            })
            //个人中心-来镜加工详情
            .state("person-process-content",{
                title:'来镜加工',
                url:'/person-process-content/:mid',
                templateUrl:'template/person_process_content.html',
                controller:"personProcessContent-control"
            })
            //个人中心-来镜加工打印
            .state("person-process-print",{
                title:'来镜加工打印',
                url:'/person-process-print/:mid',
                templateUrl:'template/person-process/person-process-print.html',
                controller:"person-process-print-control"
            })
            //个人中心-来镜加工预览
            .state("person-process-preview",{
                title:'批量下单预览',
                url:'/person-process-preview/:params',
                templateUrl:'template/person-process/person-process-preview.html',
                controller:"person-process-preview-control"
            })
            //个人中心-来镜加工预览
            .state("person-process-print-preview",{
                title:'批量下单预览',
                url:'/person-process-print-preview/:params',
                templateUrl:'template/person-process/person-process-print-preview.html',
                controller:"person-process-print-preview-control"
            })
            //新品专区
            .state("newGoods",{
                title:'新品专区',
                url:'/newGoods',
                templateUrl:'template/newGoods.html',
                controller:"newgoods-control"
            })
            // $locationProvider.html5Mode(true);y

    })