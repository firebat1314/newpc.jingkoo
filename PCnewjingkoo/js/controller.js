
angular.module('myApp.controllers', ['ipCookie', 'ngSanitize'])
    // 路由监听事件 每个页面标题
    .run(['$location', '$rootScope', '$window', function ($location, $rootScope, $window) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.title = toState.title;
            if (toState.title == "镜库首页") {
                $rootScope.allFenLei = true;
            } else {
                $rootScope.allFenLei = false;
            }
            if (toState.title == "店铺首页") {
                $rootScope.allNavs = true;
            } else if (toState.title == "购物车") {
                $rootScope.allNav = true;
            } else if (toState.title == "批量下单") {
                $rootScope.allNav = true;
            } else if (toState.title == "结算页") {
                $rootScope.allNav = true;
            } else if (toState.title == "支付") {
                $rootScope.allNav = true;
            } else {
                $rootScope.allNav = false;
                $rootScope.allNavs = false;
            }
            if (toState.name == "bulk-order") {
                $rootScope.showHomeBtn = true;
            } else {
                $rootScope.showHomeBtn = false;
            }
        });
    }])

    //主控制
    .controller('ParentControl', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$anchorScroll', '$location', '$qimoChat', function ($scope, $rootScope, $state, $http, ipCookie, $anchorScroll, $location, $qimoChat) {
        this.$qimoChat = $qimoChat;
        //控制首页楼梯效果
        $(window).scroll(function () {
            if ($(document).scrollTop() > 500) {
                $('.goTop').show();
            } else {
                $('.goTop').hide();
            }
        });
        $rootScope.goto = function () {
            $location.hash('');
            $anchorScroll.yOffset = 1;
            $anchorScroll();
        };
        $scope.goto();

        //去购物车
        $scope.goCar = function () {
            $state.go('shop-car');
        };
        $scope.goControlMb = function () {
            $state.go('control-mb');
        };
        //去登陆
        $scope.goLogin = function () {
            $state.go('login');

        };
        // $rootScope.ip = 'http://newapp.jingkoo.net'; //测试
        // $rootScope.ip = 'http://newm.jingkoo.net'; //测试
        $rootScope.ip = 'http://newpc.jingkoo.net'; //测试
        // $rootScope.ip = 'https://www.jingku.cn'; //正式

        $scope.loginOut = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/logout',
                data: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        ipCookie.remove("token");
                        location.href = "/default.html";
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //购物车接口同步
        $scope.carFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/get_flow_goods',
                data: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.shopCarHomeData = data;
                    if (data.suppliers_goods_list.length == 0) {
                        $scope.carRight = false;
                    } else {
                        $scope.carRight = true;
                    }
                    $scope.totalNum = data.total.zong_goods_count;
                    $scope.totalPrice = data.total.goods_price;
                })
            //     .error(function(data){
            //     //console.log(data);
            //     if(data.status == 0){
            //         //layer.msg('用户失效，请重新登录');
            //         location.href=$rootScope.ip + "/default.html";
            //     }
            // })
        };
        $scope.carFn();
        //购物车更新同步
        $rootScope.$on('upCarList', function () {
            $scope.carFn();
        });
        //pc 手机客服，支付微信只有微信跳URL 
        /* 新增客服功能 */
        $rootScope.qimoChatClick = function (access_id) {
            //this.native.showLoading();
            var cool = layer.load(0, { shade: [0.3, '#fff'] });

            var old = document.getElementsByClassName('qimo')[0]
            //console.log(old);
            if (old) {
                old.parentNode.removeChild(old);
            }
            var qimo = document.createElement('script');
            qimo.type = 'text/javascript';
            qimo.src = 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=' + (access_id || 'b441f710-80d9-11e7-8ddd-b18e4f0e2471') + '&autoShow=false';
            qimo.className = 'qimo';
            document.getElementsByTagName('body')[0].appendChild(qimo);
            var that = this;
            var timer = setInterval(function () {
                if (typeof qimoChatClick != "undefined") {
                    layer.close(cool);
                    clearInterval(timer)
                    setTimeout(function () {
                        qimoChatClick();
                    }, 500);
                }
            }, 500)
            /* qimo.onload = qimo['onreadystatechange'] = function () {
                    layer.close(cool);
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                  setTimeout(function () {
                    qimoChatClick();
                  }, 1000);
                  qimo.onload = qimo['onreadystatechange'] = null;
                }
              }; */
        }
    }])
    //首页头部
    .controller('index_header_parentControl', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$stateParams', '$data', '$qimoChat', function ($scope, $rootScope, $state, $http, ipCookie, $stateParams, $data, $qimoChat) {
        $scope.$qimoChat = $qimoChat;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Index/indexs',
            params: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.IndexData = data;

                //get_html(document.getElementsByTagName('header')[0].cloneNode(true));

                //首页广告大img
                $scope.jsjmImg = data.list.ads_jsjm[0].ad_img;
                $scope.jjzyImg = data.list.ads_jjzy[0].ad_img;
                // for(var i = 0;i<data.list.getAreaList.length;i++){
                //     if(data.list.getAreaList[i].selected){
                //         $('.header-top .header-top-content .header-top-content-left .trans-city .item a').eq(i).addClass('selected');
                //     }else{
                //         //$('.header-top .header-top-content .header-top-content-left .trans-city .item a').removeClass('selected');
                //     }
                // }
                $scope.areaListAdd = function (e, index) {
                    for (var i = 0; i < data.list.getAreaList.length; i++) {
                        $scope.IndexData.list.getAreaList[i].selected = 0;
                    }
                    $scope.IndexData.list.getAreaList[index].selected = 1;
                };
            });
        //个人信息面板信息
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/user_info',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.userData = data;
                $scope.username = data.user_info.user_name;
                $scope.userImg = data.user_info.avatar;
                $scope.userMoney = data.user_info.user_money;
                $scope.userPhone = data.user_info.mobile_phone;
            })
        //个人信息面板发货状态
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/usercount',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status) {
                    $scope.userShData = data;
                    $scope.unpay = data.data.unpay;
                    $scope.send = data.data.send;
                    $scope.uncollect = data.data.collect;
                }
            })
        //个人信息数量
        $http({
            method: "POST",
            url: $rootScope.ip + '/User/getTidings',
            data: {},
            headers: {
                'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
            },
        })
            .success(function (data) {
                //console.log(data)
                $scope.msgNumber = data.count;
            })
        //首页头部地区切换接口
        $scope.areaListChange = function (id) {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Index/EditArea',
                data: {
                    id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    layer.close(cool);
                    if (data.status) {
                        // layer.msg('玩命加载中', {
                        //     icon: 16,
                        //     shade: 0.3,
                        //     time:1000
                        // },function() {
                        layer.msg('切换地区成功', { time: 1000, icon: 1 }, function () {
                            $rootScope.$broadcast('uploadAddress');
                            $http({
                                method: "POST",
                                url: '' + $rootScope.ip + '/Index/indexs',
                                params: '',
                                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                            })
                                .success(function (data) {
                                    $scope.IndexData = data;
                                });
                        });

                        // })
                    } else {
                        layer.msg(data.info, { icon: 2 });
                    }
                })
        };
        //获取商品分类id
        $scope.goShopList = function (filter, filterId, zeiss, zeissId, brand, brandId, category, categoryId) {

            if (category == "category" && !brand && !zeiss) {
                //console.log(1)
                var url = $state.href('shop-list', {
                    cat_id: categoryId,
                    filter: filterId,
                    brand_id: '',
                    keywords: '',
                    random: '',
                });
                window.open(url, '_blank');
            }
            else if (brand == "brand" && !category && !zeiss) {
                //console.log(2)
                var url = $state.href('shop-list', {
                    brand_id: brandId,
                    cat_id: '',
                    filter: '',
                    keywords: ''
                })
                window.open(url, '_blank');
            }
            else if (brand == "brand" && category == "category" && !zeiss) {
                //console.log(3)
                var url = $state.href('shop-list', {
                    brand_id: brandId,
                    cat_id: categoryId,
                    filter: '',
                    keywords: ''
                })
                window.open(url, '_blank');
            }


            if (filter == "filter" && category == "category") {
                //console.log(4)
                var url = $state.href('shop-list', {
                    brand_id: '',
                    cat_id: categoryId,
                    filter: filterId,
                    keywords: ''
                })
                window.open(url, '_blank');
            }


            if (zeiss == "zeiss" && category == "category") {
                var url = $state.href('shop-list-ano', {
                    cat_id: zeissId,
                    keywords: ''
                })
                window.open(url, '_blank');
            }

        };
        $scope.loginOut = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/logout',
                data: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    if (data.status) {
                        layer.msg(data.info);
                        ipCookie.remove("token");
                        ipCookie.remove("has_login");
                        location.href = "/default.html";
                    } else {
                        layer.msg(data.info);
                    }
                })
        };
        //地区更新同步
        $rootScope.$on('uploadCity', function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Index/indexs',
                params: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    $scope.IndexData = data;
                });
        });
        //购物车接口同步
        $scope.carFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/get_flow_goods',
                data: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') },
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.shopCarHomeData = data;
                    if (data.suppliers_goods_list.length == 0) {
                        $scope.carRight = false;
                    } else {
                        $scope.carRight = true;
                    }
                    $scope.totalNum = data.total.zong_goods_count;
                    $scope.totalPrice = data.total.goods_price;
                })
                .error(function (data, staus) {
                    // layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
                        location.href = "/default.html";
                    }
                })
        };
        $scope.carFn();
        //购物车更新同步
        $rootScope.$on('upCarList', function () {
            $scope.carFn();
        });

        //删除购物车里全选的商品
        $scope.delAll = function () {
            // layer.confirm('您确定要删除么？', {
            //     btn: ['确定','取消'] //按钮
            // }, function(){
            //商品ID数组
            $scope.carIdArr = {
                goods_ids: []
            };
            for (var i = 0; i < $scope.shopCarHomeData.suppliers_goods_list.length; i++) {
                for (var j = 0; j < $scope.shopCarHomeData.suppliers_goods_list[i].goods_list.length; j++) {
                    $scope.carIdArr.goods_ids.push($scope.shopCarHomeData.suppliers_goods_list[i].goods_list[j].goods_id);
                }
            }
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/drop_cart_goods_select',
                data: $scope.carIdArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg('删除成功', { icon: 1 });
                        $scope.carFn();
                        $rootScope.$broadcast('upCarList');
                    } else {
                        layer.msg('删除失败', { icon: 2 });
                    }
                })
            // },function(){
            //     layer.msg('点完这个可就全没了，在考虑考虑吧~', {
            //         time: 2000, //2s后自动关闭
            //     });
            // });
        };

        //删除购物车单独一行商品
        $scope.delSingle = function (index, pIndex, ppIndex) {
            // layer.confirm('您确定要删除么？', {
            //     btn: ['确定','取消'] //按钮
            // }, function(){
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/drop_cart_goods_select',
                data: {
                    rec_id: $scope.shopCarHomeData.suppliers_goods_list[ppIndex].goods_list[pIndex].attrs[index].rec_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg('删除成功', { icon: 1 });
                        $scope.carFn();
                    } else {
                        layer.msg('删除失败', { icon: 2 });
                    }
                })
            //}, function(){
            // layer.msg('在考虑考虑吧~', {
            //     time: 2000, //2s后自动关闭
            // });
            //});
        };
        //获得全部分类索引
        $scope.Index = function (index) {
            $scope.num = index;
        };

        //搜索
        $scope.searchKey = function () {
            var newOpens = window.open();
            //console.log($scope.keywords);
            var url = $state.href('shop-list', {
                keywords: $scope.keywords,
            })

            setTimeout(function () {
                newOpens.location = url;
            }, 200)
            /* $state.go('shop-list', {
                keywords: $scope.keywords,
            }) */
        };

        $scope.keywords = $stateParams.keywords;

        //控制分类菜单显隐
        //$scope.allFenLei = true;
        //金融页面提示
        $scope.jqqd = function () {
            layer.msg('敬请期待~');
        };

        //去帮助中心
        $scope.goHelpCenter = function () {
            $state.go('help_company', {
                id: 7
            })
        };

        $scope.goVip = function () {
            $state.go('control-mb');
        };


        //右侧优惠券
        $scope.getCuponList = function (bonus_type) {
            $scope.status = bonus_type;
            $data.getYhqData({
                bonus_type: bonus_type
            }).success(function (data) {
                //console.log(data);
                if (data.data.length == 0) {
                    $scope.yhq_show = true;
                } else {
                    $scope.personYhq = data;
                    $scope.yhq_show = false;
                }
            })
        }
        $scope.getCuponList();

        $scope.yhqList = {
            page: 1,
            size: 500
        };
        $scope.yhqFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Index/coupon',
                data: $scope.yhqList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                $scope.yhqData = data;
                $scope.isGet = false;
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].is_get == 0) {
                        $scope.isGet = true;
                    }
                }
            })
        };
        $scope.yhqFn();


        $rootScope.$on('uploadCoupon', function () {
            $scope.getCuponList();
            $scope.yhqFn();
        });


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
                //console.log(data);
                if (data.status) {
                    layer.msg(data.info);
                    $scope.yhqFn();
                    $scope.getCuponList();
                } else {
                    layer.msg(data.info);
                }
            })
        };

        //使用优惠券
        $scope.goDpDetail = function (suppliers_id) {
            var url = $state.href('shopHomeNew', { shopId: suppliers_id });
            window.open(url, '_blank');
        }

        //去列表
        $scope.quList = function (suppliers_name) {
            var url = $state.href('shop-list', {
                cat_id: '',
                brand_id: '',
                keywords: suppliers_name
            });
            window.open(url, '_blank');
        };


        //console.log(get_html);
    }])
    //首页尾部
    .controller('index_footer_parentControl', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', function ($scope, $rootScope, $state, $http, ipCookie) {
        //帮助中心
        //获取每个标题
        $scope.getTit = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/help',
                data: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.helpData = data;
                })
        };
        $scope.getTit();
        //获取每个标题下的内容
        $scope.goHelp = function (id) {
            $("body,html").animate({
                "scrollTop": 0
            }, 500)
            $state.go('help_company', {
                id: id
            })
        };
    }])
    //首页
    .controller('index_parentControl', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', function ($scope, $rootScope, $state, $http, ipCookie, $window) {

        // $scope.$on('$destroy',function(){
        //     $(window).scroll(function(){
        //         //console.log('$destroy');
        //         return null;
        //     });
        //     //console.log($(window))
        // })

        //控制首页会员中心显隐
        $rootScope.isShow = true;
        //控制header和footer显隐
        $rootScope.change = true;
        $scope.goShopList = function () {
            $state.go('shop-list');
        };
        //首页接口
        // $rootScope.res = ipCookie('token');
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Index/ad_tan',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (res) {
            if (res.status) {
                if ((ipCookie("pc_index_tan_second") != res.pc_index_tan_second) || (ipCookie('show_ads') != res.pc_index_tan_time)) {
                    ipCookie("show_ads_time", 0)//已经显示多少次
                    ipCookie("pc_index_tan_second", res.pc_index_tan_second);//需要显示次数

                    if (res.pc_index_tan_time == 1) {//每天
                        ipCookie("show_ads", 1, { expires: 1 });
                    } else if (res.pc_index_tan_time == 2) {//每周
                        ipCookie("show_ads", 2, { expires: 7 });
                    } else if (res.pc_index_tan_time == 3) {//每月
                        ipCookie("show_ads", 3, { expires: 30 });
                    } else if (res.pc_index_tan_time == 0) {//每次
                        ipCookie.remove('show_ads');
                    }
                }
                $scope.link_type = res.ads[0].link_type;
                if (res.pc_index_tan_time == 0) {
                    var img = new Image();
                    img.src = res.ads[0].ad_img;
                    img.onload = function () {
                        $scope.ad_img = (img.src);
                    }
                } else {
                    var num = ipCookie("show_ads_time") || 0;
                    if (ipCookie("show_ads_time") < res.pc_index_tan_second) {
                        var img = new Image();
                        img.src = res.ads[0].ad_img;
                        img.onload = function () {
                            $scope.ad_img = (img.src);
                        }
                        ipCookie("show_ads_time", ++num);
                    } else {
                        ipCookie("show_ads_time", num);
                    }
                    num = null;
                }
            }
        })
        $scope.ad_show = true;
        $scope.closeAd = function () {
            $scope.ad_show = false;
        }

        var cool = layer.load(0, { shade: [0.3, '#fff'] });
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Index/indexs',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                layer.close(cool);

                $scope.IndexData = data;
                // for(var i = 0;i<data.list.getAreaList.length;i++){
                //     if(data.list.getAreaList[i].selected){
                //         $('.header-top .header-top-content .header-top-content-left .trans-city .item a').eq(i).addClass('selected');
                //     }else{
                //         //$('.header-top .header-top-content .header-top-content-left .trans-city .item a').removeClass('selected');
                //     }
                // }
                $scope.areaListAdd = function (e, index) {
                    for (var i = 0; i < data.list.getAreaList.length; i++) {
                        $scope.IndexData.list.getAreaList[i].selected = 0;
                    }
                    $scope.IndexData.list.getAreaList[index].selected = 1;
                };
            })
            .error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        //获得全部分类索引
        $scope.Index = function (index) {
            $scope.num = index;
        };
        //预售轮播和闪购轮播切换
        $scope.ysShow = 1;
        $('.topics-tit-p p').click(function () {
            var inde = $(this).index();
            $('.selected-topics-tit p').removeClass('show');
            $('.selected-topics-tit p:eq(' + inde + ')').addClass('show');
            //        $('.selected-topics-goods').removeClass('show');
            //        $('.selected-topics-goods:eq('+inde+')').addClass('show');
        });
        //首页预售和闪购接口
        //预售
        $http({
            method: "GET",
            url: '' + $rootScope.ip + '/Index/presell',
            params: {
                type: ''
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.yushouData = data;
            });
        //闪购
        $http({
            method: "GET",
            url: '' + $rootScope.ip + '/Index/presell',
            params: {
                type: 'is_promote'
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.flashData = data;
            });

        /*轮播图*/
        $scope.slider = function () {
            setTimeout(function () {
                $('.slider').unslider({
                    autoplay: true,
                    delay: 6000,
                    speed: 750,
                    infinite: false,
                    index: 0,
                    arrows: {
                        prev: '<a class="unslider-arrow prev"></a>',
                        next: '<a class="unslider-arrow next"></a>',
                    },
                    animation: 'fade'
                });
            }, 200)
        };
        // /*nav全部分类*/
        // $scope.glassLiBox = function(){
        //     $('.all-fenlei-item').mouseenter(function(){
        //         var index = $(this).index();
        //         $('.glass-li-box:eq('+index+')').show();
        //     }).mouseleave(function(){
        //         $('.glass-li-box').hide();
        //     });
        // }
        /*首页预售*/
        $scope.yushou = function () {
            setTimeout(function () {
                $(".selected-topics-goods").slide({ mainCell: "ul", vis: 5, prevCell: ".sPrev", nextCell: ".sNext", effect: "leftLoop" });
            }, 100)
        };
        /*品牌街区广告*/
        $scope.brand = function () {
            setTimeout(function () {
                $(".brand-block-ad").slide({ mainCell: "ul", vis: 3, prevCell: ".sPrev", nextCell: ".sNext", effect: "leftLoop" });
            }, 100)
        };

        //轮播广告跳转
        $scope.bannerLi = function (type, id) {
            if (type == "category") {
                var url = $state.href('shop-list', {
                    cat_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            } else if (type == "goods") {
                var url = $state.href('shop-detail', {
                    goods_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            } else if (type == "brand") {
                var url = $state.href('shop-list', {
                    brand_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            }
        };
        //品牌广告跳转
        $scope.adLi = function (type, id) {
            if (type == "category") {
                var url = $state.href('shop-list', {
                    cat_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            } else if (type == "goods") {
                var url = $state.href('shop-detail', {
                    goods_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            } else if (type == "brand") {
                var url = $state.href('shop-list', {
                    brand_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            }
        };
        //菜单广告跳转
        $scope.adDiv = function (type, id) {
            if (type == "category") {
                var url = $state.href('shop-list', {
                    cat_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            } else if (type == "goods") {
                var url = $state.href('shop-detail', {
                    goods_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            } else if (type == "brand") {
                var url = $state.href('shop-list', {
                    brand_id: id,
                    keywords: ''
                });
                window.open(url, '_blank');
            }
        };
        /*品牌街区logo*/
        $scope.logoList = {
            page: 1,
            size: 10
        };
        $scope.logoFashion = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Index/get_brands',
                data: $scope.logoList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.logoFashionData = data;
                })
        };
        $scope.logoFashion();
        //下一页品牌logo
        $scope.sNext = function () {
            if ($scope.logoList.page < $scope.logoFashionData.pages) {
                $scope.logoList.page++;
                $scope.logoFashion();
            } else {
                $scope.logoList.page = 1;
                $scope.logoFashion();
            }
        };
        $scope.sPrev = function () {
            $scope.logoList.page--;
            $scope.logoFashion();
            if ($scope.logoList.page == 0) {
                $scope.logoList.page = 1;
                $scope.logoFashion();
            }
        };
        // $scope.fashionLogo = function(){
        //     linum = $('.mainlist li').length;//图片数量
        //     w = linum/2 * 232;//ul宽度
        //     $('.ulWrap').css('width', w + 'px');//ul宽度
        //     //$('.swaplist').html($('.mainlist').html());//复制内容
        //
        //     $('.line-box .sNext').click(function(){
        //
        //         if($('.swaplist,.mainlist').is(':animated')){
        //             $('.swaplist,.mainlist').stop(true,true);
        //         }
        //
        //         if($('.mainlist li').length>5){//多于4张图片
        //             ml = parseInt($('.mainlist').css('left'));//默认图片ul位置
        //             sl = parseInt($('.swaplist').css('left'));//交换图片ul位置
        //             if(ml<=0 && ml>w*-1){//默认图片显示时
        //                 $('.swaplist').css({left: '1160px'});//交换图片放在显示区域右侧
        //                 $('.mainlist').animate({left: ml - 1160 + 'px'},'slow');//默认图片滚动
        //                 if(ml==(w-1160)*-1){//默认图片最后一屏时
        //                     $('.swaplist').animate({left: '0px'},'slow');//交换图片滚动
        //                 }
        //             }else{//交换图片显示时
        //                 $('.mainlist').css({left: '1160px'})//默认图片放在显示区域右
        //                 $('.swaplist').animate({left: sl - 1160 + 'px'},'slow');//交换图片滚动
        //                 if(sl==(w-1160)*-1){//交换图片最后一屏时
        //                     $('.mainlist').animate({left: '0px'},'slow');//默认图片滚动
        //                 }
        //             }
        //         }
        //     })
        //     $('.line-box .sPrev').click(function(){
        //
        //         if($('.swaplist,.mainlist').is(':animated')){
        //             $('.swaplist,.mainlist').stop(true,true);
        //         }
        //
        //         if($('.mainlist li').length>5){
        //             ml = parseInt($('.mainlist').css('left'));
        //             sl = parseInt($('.swaplist').css('left'));
        //             if(ml<=0 && ml>w*-1){
        //                 $('.swaplist').css({left: w * -1 + 'px'});
        //                 $('.mainlist').animate({left: ml + 1160 + 'px'},'slow');
        //                 if(ml==0){
        //                     $('.swaplist').animate({left: (w - 1160) * -1 + 'px'},'slow');
        //                 }
        //             }else{
        //                 $('.mainlist').css({left: (w - 1160) * -1 + 'px'});
        //                 $('.swaplist').animate({left: sl + 1160 + 'px'},'slow');
        //                 if(sl==0){
        //                     $('.mainlist').animate({left: '0px'},'slow');
        //                 }
        //             }
        //         }
        //     });
        // }
        //品牌跳列表
        $scope.goBrandList = function (id) {
            $state.go('shop-list', {
                cat_id: '',
                brand_id: id,
                keywords: ''
            })
        };

        //清新世界广告
        $scope.qxsjFn = function () {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Index/get_index_recommend_goods',
                params: {
                    type: 'qxsj',
                    is_return: 1
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.qxsjAd = data;
                });
        };
        $scope.qxsjFn();
        //换一批
        $scope.qxsjTrans = function () {
            $scope.qxsjFn();
        };
        //镜尚镜美广告
        $scope.jsjmFn = function () {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Index/get_index_recommend_goods',
                params: {
                    type: 'jsjm',
                    is_return: 1
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.jsjmAd = data;
                });
        };
        $scope.jsjmFn();
        //换一批
        $scope.jsjmTrans = function () {
            $scope.jsjmFn();
        };
        //极简主义广告
        $scope.jjzyFn = function () {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Index/get_index_recommend_goods',
                params: {
                    type: 'jjzy',
                    is_return: 1
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.jjzyAd = data;
                });
        };
        $scope.jjzyFn();
        //换一批
        $scope.jjzyTrans = function () {
            $scope.jjzyFn();
        };

    }])
    //品牌
    .controller('fashion-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', function ($scope, $rootScope, $state, $http, ipCookie) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;

        var cool = layer.load(0, { shade: [0.3, '#fff'] });
        //品牌馆除了全部的数据
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Category/get_categorys',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            //console.log(data);
            layer.close(cool);
            $scope.fashionData = data;


            $scope.index = -1;
            $scope.next = function () {
                $scope.index++;

                if ($scope.index >= data.data.length) {
                    $scope.index = -1;
                    $scope.all = true;
                    $scope.anoAll = false;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Brand/brand_index',
                        data: '',
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        layer.close(cool);
                        $scope.fashionHomeData = data;
                    })
                } else if ($scope.index > 4) {
                    $(".zaki").parent().addClass("goot");
                    $scope.all = false;
                    $scope.anoAll = true;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Brand/brand_list',
                        data: {
                            cat_id: data.data[$scope.index].cat_id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.fashionListData = data;
                    })
                } else {
                    $scope.all = false;
                    $scope.anoAll = true;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Brand/brand_list',
                        data: {
                            cat_id: data.data[$scope.index].cat_id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.fashionListData = data;
                    })
                }
                $('.xd-hd li').removeClass('on');
                $('.xd-hd li').eq($scope.index + 1).addClass('on');
            };
            //控制全部和商品的显隐
            $scope.all = true;
            $scope.anoAll = false;


            // $scope.getAll = function(i){
            //     $scope.all = true;
            //     $scope.anoAll = false;
            //     $scope.index = i;
            //     //console.log(i);
            //     $('.xd-hd li').removeClass('on');
            //     $('.xd-hd li').eq(i+1).addClass('on');
            // };


            //调取每个品牌的数据
            $scope.getFashion = function (id, i) {

                $scope.index = i;

                if (id == 0) {
                    $scope.all = true;
                    $scope.anoAll = false;
                } else {
                    $scope.all = false;
                    $scope.anoAll = true;
                }

                $('.xd-hd li').removeClass('on');
                $('.xd-hd li').eq(i + 1).addClass('on');

                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Brand/brand_list',
                    data: {
                        cat_id: id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.fashionListData = data;
                })
            }
        })
            .error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        //品牌全部的数据
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Brand/brand_index',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            //console.log(data);
            $scope.fashionHomeData = data;
            $scope.brandAd = data.big_banner[0].ad_img;
        })
            .error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        //广告插件
        $scope.brandFn = function () {
            setTimeout(function () {
                $(".brand-block-ad").slide({ mainCell: "ul", vis: 3, prevCell: ".sPrev", nextCell: ".sNext", effect: "leftLoop" });
            }, 300)
        };
        //广告跳转
        $scope.adLi = function (type, id) {
            if (type == "category") {
                var url = $state.href('shop-list', {
                    cat_id: id
                });
                window.open(url, '_blank');
            } else if (type == "goods") {
                var url = $state.href('shop-detail', {
                    goods_id: id
                });
                window.open(url, '_blank');
            } else if (type == "brand") {
                var url = $state.href('shop-list', {
                    brand_id: id
                });
                window.open(url, '_blank');
            }
            // else{
            //     //console.log('error');
            // }
        };
        //logo去列表
        $scope.goList = function (id) {
            $state.go('shop-list', {
                cat_id: '',
                brand_id: id
            })
        };

        //所有logo
        $scope.logoList = {
            page: 1,
            size: 11
        };
        $scope.logoFashion = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Index/get_brands',
                data: $scope.logoList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.logoFashionData = data;
                })
        };
        $scope.logoFashion();

        $(".gdoo").click(function () {
            $(this).parent().toggleClass("open");
            if ($(this).parent().hasClass("open")) {
                $scope.logoList.size = 300;
                $scope.logoFashion();
                $(this).html("收起<em></em>");
            } else {
                $scope.logoFashion();
                $(this).html("展开更多<em></em>");
            }
        })
    }])
    //预售
    .controller('waitingSale-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', function ($scope, $rootScope, $state, $http, ipCookie) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;
        var cool = layer.load(0, { shade: [0.3, '#fff'] });
        //预售除了全部的数据
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Category/get_categorys',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            //console.log(data);
            if (data.status) {
                layer.close(cool);
            }
            $scope.waitingData = data;


            $scope.index = -1;
            $scope.next = function () {
                $scope.index++;
                if ($scope.index >= data.data.length) {
                    $scope.index = -1;
                    $scope.isAll = true;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Index/presell',
                        data: {
                            cat_id: 0,
                            type: 'is_pre'
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.waitingAllListData = data;
                    })
                } else if ($scope.index > 4) {
                    $(".zaki").parent().addClass("goot");
                    $scope.isAll = false;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Index/presell',
                        data: {
                            cat_id: data.data[$scope.index].cat_id,
                            type: 'is_pre'
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.waitingListData = data;
                    })
                } else {
                    $scope.isAll = false;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Index/presell',
                        data: {
                            cat_id: data.data[$scope.index].cat_id,
                            type: 'is_pre'
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.waitingListData = data;
                    })
                }
                $('.xd-hd li').removeClass('on');
                $('.xd-hd li').eq($scope.index + 1).addClass('on');
            };
            //获取全部预售的数据
            $scope.getAllPresell = function () {
                $scope.isAll = true;
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Index/presell',
                    data: {
                        cat_id: 0,
                        type: 'is_pre'
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.waitingAllListData = data;
                })
            };
            $scope.getAllPresell();

            //获取每个预售商品的数据
            $scope.getPresell = function (id, i) {

                $scope.index = i;

                $('.xd-hd li').removeClass('on');
                $('.xd-hd li').eq(i + 1).addClass('on');


                if (id == 0) {
                    $scope.isAll = true;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Index/presell',
                        data: {
                            cat_id: 0,
                            type: 'is_pre'
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.waitingAllListData = data;
                    })
                } else {
                    $scope.isAll = false;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Index/presell',
                        data: {
                            cat_id: id,
                            type: 'is_pre'
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.waitingListData = data;
                    })
                }
            }
        })
            .error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
    }])
    //闪购
    .controller('flashSale-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', function ($scope, $rootScope, $state, $http, ipCookie) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;
        var cool = layer.load(0, { shade: [0.3, '#fff'] });
        //闪购除了全部的数据
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Index/getCategoryPromote',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            //console.log(data);
            if (data.status) {
                layer.close(cool);
            }
            $scope.flashData = data;


            $scope.index = -1;
            $scope.next = function () {
                $scope.index++;
                if ($scope.index >= data.data.length) {
                    $scope.index = -1;
                    $scope.isAll = true;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Index/presell',
                        params: {
                            type: 'is_promote',
                            cat_id: 0
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.flashAllListData = data;
                    })
                } else if ($scope.index > 4) {
                    $(".zaki").parent().addClass("goot");
                    $scope.isAll = false;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Index/presell',
                        params: {
                            type: 'is_promote',
                            cat_id: data.data[$scope.index].cat_id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.flashListData = data;
                    })
                } else {
                    $scope.isAll = false;
                    var cool = layer.load(0, { shade: [0.3, '#fff'] });
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Index/presell',
                        params: {
                            type: 'is_promote',
                            cat_id: data.data[$scope.index].cat_id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.flashListData = data;
                    })
                }
                $('.xd-hd li').removeClass('on');
                $('.xd-hd li').eq($scope.index + 1).addClass('on');
            };
            //获取全部闪购的数据
            $scope.getAllPromote = function () {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.isAll = true;
                $http({
                    method: "GET",
                    url: '' + $rootScope.ip + '/Index/presell',
                    params: {
                        type: 'is_promote',
                        cat_id: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.flashAllListData = data;
                })
            };
            $scope.getAllPromote();


            //获取每个闪购商品的数据
            $scope.getPromote = function (id, i) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });

                $scope.index = i

                $('.xd-hd li').removeClass('on');
                $('.xd-hd li').eq(i + 1).addClass('on');

                if (id == 0) {
                    $scope.isAll = true;
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Index/presell',
                        params: {
                            type: 'is_promote',
                            cat_id: 0
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.flashAllListData = data;
                    })
                } else {
                    $scope.isAll = false;
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Index/presell',
                        params: {
                            type: 'is_promote',
                            cat_id: id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        $scope.flashListData = data;
                    })
                }
            }
        })
            .error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
    }])
    //新品专区
    .controller('newgoods-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', function ($scope, $rootScope, $state, $http, ipCookie, $data) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Index/newArea',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            $scope.data = data;
        })
        $scope.clickAds = function (link_type) {
            console.log(link_type)
            if (link_type.type_name == 'category') {
                window.open($state.href('shop-list', {
                    cat_id: link_type.type_value,
                    keywords: ''
                }), '_blank');
            } else if (link_type.type_name == 'goods') {
                window.open($state.href('shop-detail', {
                    goods_id: link_type.type_value,
                    keywords: ''
                }), '_blank');
            } else if (link_type.type_name == "brand") {
                var url = $state.href('shop-list', {
                    brand_id: link_type.type_value,
                    keywords: ''
                });
                window.open($state.href('shop-list', {
                    brand_id: link_type.type_value,
                    keywords: ''
                }), '_blank');
            } else if (link_type.type_name == "search") {

            }
        }
        $scope.goShopDetails = function(goods_id){
            $state.go('shop-detail',{goods_id: goods_id,keywords: ''});
        }
    }])
    //积分商城
    .controller('pointsMall-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', function ($scope, $rootScope, $state, $http, ipCookie) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;
        $scope.ponitsList = {
            page: 1,
            size: 8,
            order: '',
            sort: '',
            min_exchange: '',
            max_exchange: '',
            is_buy: 0
        };
        $scope.pointsFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Index/exchange',
                data: $scope.ponitsList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
                $scope.pointsData = data;
                $scope.is_buy = data.is_buy;
                if (data.order == "stotr" && data.sort == "DESC") {
                    $('.pointsMall-sort-item .dayuhao').addClass('selected');
                    $('.pointsMall-sort-item .xiaoyuhao').removeClass('selected');
                }
                else if (data.order == "stotr" && data.sort == "ASC") {
                    $('.pointsMall-sort-item .xiaoyuhao').removeClass('selected');
                    $('.pointsMall-sort-item .dayuhao').addClass('selected');
                } else if (data.order == "sales_num" && data.sort == "DESC") {
                    $('.pointsMall-sort-item:eq(1) .dayuhao').addClass('selected');
                    $('.pointsMall-sort-item:eq(1) .xiaoyuhao').removeClass('selected');
                } else if (data.order == "sales_num" && data.sort == "ASC") {
                    $('.pointsMall-sort-item:eq(1) .dayuhao').removeClass('selected');
                    $('.pointsMall-sort-item:eq(1) .xiaoyuhao').addClass('selected');
                } else if (data.order == "exchange_integral" && data.sort == "DESC") {
                    $('.pointsMall-sort-item:eq(2) .dayuhao').addClass('selected');
                    $('.pointsMall-sort-item:eq(2) .xiaoyuhao').removeClass('selected');
                } else if (data.order == "exchange_integral" && data.sort == "ASC") {
                    $('.pointsMall-sort-item:eq(2) .dayuhao').removeClass('selected');
                    $('.pointsMall-sort-item:eq(2) .xiaoyuhao').addClass('selected');
                }
            })
                .error(function (data, staus) {
                    layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
                        location.href = "/default.html";
                    }
                })
        };
        $scope.pointsFn();

        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.ponitsList.page = index + 1;
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Index/exchange',
                    data: $scope.ponitsList,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.pointsData = data;
                })
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options)
        };

        //默认排序
        $scope.morenOrder = function () {
            $scope.ponitsList.order = 'stotr';
            $scope.ponitsList.sort = 'DESC';
            $scope.pointsFn();
        };
        //积分兑换量排序
        $scope.duihuanOrder = function () {
            $scope.ponitsList.order = 'sales_num';
            $scope.pointsFn();
        };
        //兑换量升序
        $scope.duihuanliangAsOrder = function () {
            $scope.ponitsList.sort = 'ASC';
            $scope.ponitsList.order = 'sales_num';
            $scope.pointsFn();
        };
        //兑换量降序
        $scope.duihuanliangDsOrder = function () {
            $scope.ponitsList.sort = 'DESC';
            $scope.ponitsList.order = 'sales_num';
            $scope.pointsFn();
        };
        //积分排序
        $scope.pointsOrder = function () {
            $scope.ponitsList.order = 'exchange_integral';
            $scope.pointsFn();
        };
        //积分升序
        $scope.pointsAsOrder = function () {
            $scope.ponitsList.sort = 'ASC';
            $scope.ponitsList.order = 'exchange_integral';
            $scope.pointsFn();
        };
        //积分降序
        $scope.pointsDsOrder = function () {
            $scope.ponitsList.sort = 'DESC';
            $scope.ponitsList.order = 'exchange_integral';
            $scope.pointsFn();
        };
        //搜索积分范围
        $scope.minAndmax = function () {
            $scope.ponitsList.min_exchange = $scope.minPoint;
            $scope.ponitsList.max_exchange = $scope.maxPoint;
            $scope.pointsFn();
        };
        //只看我能兑换
        $scope.isBuy = function () {
            if ($scope.pointsData.is_buy) {
                $scope.ponitsList.is_buy = 0;
                $scope.pointsFn();
            } else {
                $scope.ponitsList.is_buy = 1;
                $scope.pointsFn();
            }
        };
    }])
    //优惠券
    .controller('yhq-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', function ($scope, $rootScope, $state, $http, ipCookie) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;
        $scope.yhqList = {
            page: 1,
            size: 6,
            order: ''
        };
        $scope.yhqFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Index/coupon',
                data: $scope.yhqList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.yhqData = data;
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.yhqFn();
        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.yhqList.page = index + 1;
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Index/coupon',
                    data: $scope.yhqList,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.yhqData = data;
                })
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options);
        };
        //缓冲进度环
        $scope.circleFn = function () {
            setTimeout(function () {
                $('.myStat2').circliful();
            }, 200)
        };
        //默认排序
        $scope.moren = function () {
            $scope.yhqList.order = 'type_id';
            $scope.yhqFn();
        };
        //即将过期
        $scope.guoqi = function () {
            $scope.yhqList.order = 'use_end_date';
            $scope.yhqFn();
        };
        //面值最大
        $scope.moneyMax = function () {
            $scope.yhqList.order = 'type_money';
            $scope.yhqFn();
        };
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
                //console.log(data);
                if (data.status) {
                    $rootScope.$broadcast('uploadCoupon')
                    layer.msg(data.info, { time: 1000, icon: 1 }, function () {
                        $scope.yhqFn();
                    });
                } else {
                    layer.msg(data.info, { time: 1000, icon: 2 });
                }
            })
        };
        //去列表
        $scope.quList = function (suppliers_name) {
            var url = $state.href('shop-list', {
                keywords: suppliers_name,
                cat_id: '',
                brand_id: ''
            });
            window.open(url, '_blank');
        };
    }])
    //设计
    .controller('sheji-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', function ($scope, $rootScope, $state, $http, ipCookie) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;

        $scope.hotList = {
            page: 1,
            size: 8,
            is_return: 1
        };
        $scope.qxsjFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Public/jingku',
                data: $scope.hotList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.shejiData = data;
                //商品是否收藏
                if (data.hot_goods.is_collect) {
                    //商品关注两个状态的控制
                    $scope.success = false;
                    $scope.successed = true;
                } else {
                    $scope.success = true;
                    $scope.successed = false;
                }
                $scope.sheji_pic = data.big_top[0].ad_img;
                $scope.artOneName = data.article_list[13].article[0].title;
                $scope.artOneDesc = data.article_list[13].article[0].desc;
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.qxsjFn();

        $scope.hotSpFn = function () {
            setTimeout(function () {
                $(".hot-sp").slide({ titCell: ".hd ul", mainCell: ".bd .ulWrap", autoPage: true, effect: "leftLoop", vis: 3 });
            }, 200)
        };


        //商品关注
        //防止用户多次点击，多次请求
        var timeoutflag = 0;
        $scope.guanZhu = function (goods, id) {
            if (timeoutflag) {
                layer.msg('操作太频繁啦！');
                return;
            }
            timeoutflag = 1;
            timeoutflagfn = setTimeout(function () {
                timeoutflag = 0;
            }, 3000);
            if (!goods.is_collect) {
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
                            layer.msg('关注失败');
                            //location.href=$rootScope.ip + "/default.html";
                        } else {
                            layer.msg('关注成功');
                            $scope.shejiData.hot_goods.is_collect = 1;
                            $scope.qxsjFn();
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
                            layer.msg('取消关注失败');
                            //location.href="http://jingkoo.net2017/11/28/default.html";
                        } else {
                            layer.msg('已取消关注');
                            $scope.shejiData.hot_goods.is_collect = 0;
                            $scope.qxsjFn();
                        }
                    })
            }
        };



        // $scope.qxsjFn = function(){
        //     $http({
        //         method:"GET",
        //         url:''+$rootScope.ip+'/Index/get_category_recommend_goods',
        //         params:$scope.hotList,
        //         headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //     })
        //         .success(function(data) {
        //             //console.log(data);
        //             $scope.qxsjAd = data;
        //         });
        // };
        // $scope.qxsjFn();

        $scope.prev = function () {
            if ($scope.hotList.size > $scope.shejiData.hot_goods.length) {
                return
            } else {
                $scope.hotList.page++;
            }
            $scope.qxsjFn();
            // if($scope.qxsjAd.page<$scope.qxsjAd.pages){
            //     $scope.hotList.page++;
            //     $scope.qxsjFn();
            // }else{
            //     $scope.hotList.page = 1;
            //     $scope.qxsjFn();
            // }
        };
        $scope.next = function () {
            if ($scope.hotList.page == 1) {
                return
            } else {
                $scope.hotList.page--;
            }
            $scope.qxsjFn();
            // if($scope.qxsjAd.page==1){
            //     $scope.hotList.page = 1;
            // }else{
            //     $scope.hotList.page--;
            //     $scope.qxsjFn();
            // }
        };

    }])
    //登录
    .controller('login-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$interval', function ($scope, $rootScope, $state, $http, ipCookie, $interval) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        if (ipCookie('login_by_phone') == false) {
            $scope.isPhone = false;
        } else {
            $scope.isPhone = true;
        }
        $scope.phoneLogin = function () {
            $scope.isPhone = true;
        };
        $scope.userLogin = function () {
            $scope.isPhone = false;
        };

        $scope.geeteInitFn1 = function () {
            $http({
                url: '' + $rootScope.ip + '/Login/geeTestinit',
                method: 'GET',
                params: '',
            }).success(function (data) {
                //console.log(data);
                initGeetest({
                    // 以下配置参数来自服务端 SDK
                    gt: data.gt,
                    challenge: data.challenge,
                    offline: !data.success,
                    new_captcha: data.new_captcha
                }, function (captchaObj) {
                    // $(".getGeetestCaptcha").live("tap",function (e) {
                    //     e.preventDefault();
                    //     getMobileGeetestCaptcha($(this) , captchaObj);
                    // });
                    $scope.geeteTrue1 = captchaObj;

                    // 这里可以调用验证实例 captchaObj 的实例方法
                    captchaObj.appendTo(".GeetestCaptchaView1");
                })
            })
        };
        $scope.geeteInitFn1();

        $scope.geeteInitFn2 = function () {
            $http({
                url: '' + $rootScope.ip + '/Login/geeTestinit',
                method: 'GET',
                params: '',
            }).success(function (data) {
                //console.log(data);
                initGeetest({
                    // 以下配置参数来自服务端 SDK
                    gt: data.gt,
                    challenge: data.challenge,
                    offline: !data.success,
                    new_captcha: data.new_captcha
                }, function (captchaObj) {
                    // $(".getGeetestCaptcha").live("tap",function (e) {
                    //     e.preventDefault();
                    //     getMobileGeetestCaptcha($(this) , captchaObj);
                    // });
                    $scope.geeteTrue2 = captchaObj;

                    // 这里可以调用验证实例 captchaObj 的实例方法
                    captchaObj.appendTo(".GeetestCaptchaView2");
                })
            })
        };
        $scope.geeteInitFn2();
        //手动登录
        $scope.user = {
            type: 'user',
            username: '',
            // password:$scope.password,
            // str_verify:$scope.vcode,
            mobile_phone: '',
            is_verify: 1,
            geetest_challenge: '',
            geetest_validate: '',
            geetest_seccode: '',
            trece: 1,
            remember: true
        };
        if (ipCookie('remeber_user_name')) {
            $scope.user.remember = true;
            $scope.user.username = ipCookie('username');
        }


        $scope.loginClick = function () {
            //console.log($scope.geeteTrue1);
            //var validate1 = $scope.geeteTrue1.getValidate();
            //console.log(validate1);
            //validate1 != undefined
            if (true) {
                //$scope.user.geetest_challenge = validate1.geetest_challenge;
                //$scope.user.geetest_validate = validate1.geetest_validate;
                //$scope.user.geetest_seccode = validate1.geetest_seccode;
                $http({
                    url: '' + $rootScope.ip + '/Login/index',
                    method: 'POST',
                    data: $scope.user,
                    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    // transformRequest: function(obj) {
                    //     var str = [];
                    //     for(var p in obj){
                    //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    //     }
                    //     return str.join("&");
                    // }   request-payload转为form-data格式的传输方式
                }).success(function (data) {
                    //console.log(data);
                    $scope.userData = data;
                    if (data.status) {
                        layer.msg(data.info, { time: 2000 }, function () {
                            $state.go('home');
                        });
                    } else {
                        $scope.geeteTrue1.reset();
                        layer.msg(data.info, { time: 2000 });
                        $scope.codeFn();
                        //console.log($scope.user);
                    }
                    // $rootScope.res = data.data.token;
                    ipCookie("token", data.data.token, { expires: 21 });
                    ipCookie("username", data.data.user_name, { expires: 21 });
                    ipCookie("phone_number", data.data.mobile_phone, { expires: 21 });
                    ipCookie("login_by_phone", false, { expires: 21 });
                    ipCookie("has_login", true, { expires: 21 });
                });
            } else {
                layer.msg('请先完成验证', { icon: 2, time: 800 });
            }


        };
        //键盘登录获取token验证 获取首页全局数据
        $scope.login = function (e) {
            var validate1 = $scope.geeteTrue1.getValidate();
            //console.log(validate1);
            if (e.keyCode != 13) {
                return;
            } else {
                if (validate1 != undefined) {
                    $scope.user.geetest_challenge = validate1.geetest_challenge;
                    $scope.user.geetest_validate = validate1.geetest_validate;
                    $scope.user.geetest_seccode = validate1.geetest_seccode;
                    $http({
                        url: '' + $rootScope.ip + '/Login/index',
                        method: 'POST',
                        data: $scope.user,
                        // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                        // transformRequest: function(obj) {
                        //     var str = [];
                        //     for(var p in obj){
                        //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        //     }
                        //     return str.join("&");
                        // }   request-payload转为form-data格式的传输方式
                    }).success(function (data) {
                        //console.log(data);
                        $scope.userData = data;
                        if (data.status) {
                            layer.msg(data.info, { time: 1000 }, function () {
                                $state.go('home');
                            });
                        } else {
                            $scope.geeteTrue1.reset();
                            layer.msg(data.info, { time: 1000 });
                            $scope.codeFn();
                        }
                        // $rootScope.res = data.data.token;
                        ipCookie("token", data.data.token, { expires: 21 });
                        ipCookie("username", data.data.user_name, { expires: 21 });
                        ipCookie("phone_number", data.data.mobile_phone, { expires: 21 });
                        ipCookie("login_by_phone", false, { expires: 21 });
                    });
                } else {
                    layer.msg('请先完成验证', { icon: 2, time: 500 });
                }
            }
        };
        //手机验证码键盘登录
        $scope.userPhone = {
            type: 'phone',
            // username:$scope.usernamePhone,
            // str_verify:$scope.phoneVcode,
            // mobile_code:$scope.mobile_verify,
            is_verify: 1,
            remember: true
        };

        if (ipCookie('remeber_user_phone')) {
            $scope.userPhone.remember = true;
            $scope.userPhone.userphone = ipCookie('phone_number');
        }

        $scope.anoLogin = function (e) {

            if (e.keyCode != 13) {
                return;
            } else {

                $http({
                    url: '' + $rootScope.ip + '/Login/index',
                    method: 'POST',
                    data: $scope.userPhone,
                    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    // transformRequest: function(obj) {
                    //     var str = [];
                    //     for(var p in obj){
                    //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    //     }
                    //     return str.join("&");
                    // }   request-payload转为form-data格式的传输方式
                }).success(function (data) {
                    //console.log(data);
                    $scope.userData = data;
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 }, function () {
                            $state.go('home');
                        });
                    } else {
                        layer.msg(data.info, { time: 1000 });
                        $scope.codeFn();
                    }
                    // $rootScope.res = data.data.token;
                    ipCookie("token", data.data.token, { expires: 21 });
                    ipCookie("username", data.data.user_name, { expires: 21 });
                    ipCookie("phone_number", data.data.mobile_phone, { expires: 21 });
                    ipCookie("login_by_phone", true, { expires: 21 });
                });
            }

        };
        //手机验证码手动登录
        $scope.anoLoginClick = function () {
            $http({
                url: '' + $rootScope.ip + '/Login/index',
                method: 'POST',
                data: $scope.userPhone,
                // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                // transformRequest: function(obj) {
                //     var str = [];
                //     for(var p in obj){
                //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                //     }
                //     return str.join("&");
                // }   request-payload转为form-data格式的传输方式
            }).success(function (data) {
                //console.log(data);
                $scope.userData = data;
                if (data.status) {
                    layer.msg(data.info, { time: 1000 }, function () {
                        $state.go('home');
                    });
                } else {
                    layer.msg(data.info, { time: 1000 });
                    $scope.codeFn();
                }
                // $rootScope.res = data.data.token;
                ipCookie("token", data.data.token, { expires: 21 });
                ipCookie("username", data.data.user_name, { expires: 21 });
                ipCookie("phone_number", data.data.mobile_phone, { expires: 21 });
                ipCookie("login_by_phone", true, { expires: 21 });
            });
        };
        //获取验证码接口
        $scope.codeFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/verify',
                data: {
                    fontSize: 32,
                    length: 4,
                    codeSet: 0,
                    useNoise: true
                }
            }).success(function (data) {
                //console.log(data);
                $scope.code = data.data.skey;
                $scope.getKey();
            })
        };
        $scope.codeFn();
        //回调一次验证码接口获取图片
        $scope.getKey = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/verify',
                data: {
                    fontSize: 32,
                    length: 4,
                    useNoise: true,
                    codeSet: 0,
                    skey: $scope.code
                }
            }).success(function (data) {
                //console.log(data);
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.codeMa = data.data.captcha + '?' + Math.random();  //增加随机参数时间可强制刷新
                    });
                }, 200)
            })
        };
        //点击验证码图片切换验证码
        $scope.codeAgain = function () {
            $scope.codeFn();
        };
        //获取短信验证码
        $scope.vm = {
            data: '获取验证码',
            kedian: false,
            time: 59
        };
        $scope.info = function () {
            var validate2 = $scope.geeteTrue2.getValidate();
            //console.log(validate2);

            if (validate2 != undefined) {
                $scope.infogeetest_challenge = validate2.geetest_challenge;
                $scope.infogeetest_validate = validate2.geetest_validate;
                $scope.infogeetest_seccode = validate2.geetest_seccode;

                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Login/getMobileCode',
                    data: {
                        type: 'mind',
                        mobile: $scope.userPhone.userphone,
                        verify: $scope.userPhone.str_verify,
                        skey: $scope.code,
                        is_verify: 1,
                        geetest_challenge: $scope.infogeetest_challenge,
                        geetest_validate: $scope.infogeetest_validate,
                        geetest_seccode: $scope.infogeetest_seccode
                    }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        $scope.geeteTrue2.reset();
                        layer.msg(data.info);
                        $scope.vm.kedian = true;
                        $scope.vm.data = $scope.vm.time + 's';
                        $interval(function () {
                            $scope.vm.data = ($scope.vm.time - 1) + 's';
                            $scope.vm.time--;
                            if ($scope.vm.time == 0) {
                                $scope.vm.kedian = false;
                                $scope.vm.data = '重新获取';
                                $scope.vm.time = 59;
                            }
                        }, 1000, $scope.vm.time)
                    } else {
                        $scope.geeteTrue2.reset();
                        layer.msg(data.info);
                        $scope.codeAgain();
                    }
                })
            } else {
                layer.msg('请先完成验证', { icon: 2, time: 500 });
            }


        };
        $scope.anoinfo = function () {
            var validate2 = $scope.geeteTrue2.getValidate();
            //console.log(validate2);

            if (validate2 != undefined) {
                $scope.anoInfogeetest_challenge = validate2.geetest_challenge;
                $scope.anoInfogeetest_validate = validate2.geetest_validate;
                $scope.anoInfogeetest_seccode = validate2.geetest_seccode;

                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Login/getMobileCode',
                    data: {
                        type: 'mind',
                        mobile: $scope.userPhone.userphone,
                        verify: $scope.userPhone.str_verify,
                        skey: $scope.code,
                        is_verify: 1,
                        geetest_challenge: $scope.anoInfogeetest_challenge,
                        geetest_validate: $scope.anoInfogeetest_validate,
                        geetest_seccode: $scope.anoInfogeetest_seccode
                    }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info);
                        $scope.vm.kedian = true;
                        $scope.vm.data = $scope.vm.time + 's';
                        $interval(function () {
                            $scope.vm.data = ($scope.vm.time - 1) + 's';
                            $scope.vm.time--;
                            if ($scope.vm.time == 0) {
                                $scope.vm.kedian = false;
                                $scope.vm.data = '重新获取';
                                $scope.vm.time = 59;
                            }
                        }, 1000, $scope.vm.time)
                    } else {
                        $scope.geeteTrue2.reset();
                        layer.msg(data.info);
                        $scope.codeAgain();
                    }
                })

            } else {
                layer.msg('请先完成验证', { icon: 2, time: 500 });
            }

        };

        //记住用户名
        $scope.remeberUser = function (user) {
            if (user) {
                ipCookie("remeber_user_name", true, { expires: 21 });
            } else {
                ipCookie("remeber_user_name", false, { expires: 21 });
            }
        };
        ipCookie("remeber_user_name", true, { expires: 21 });
        //记住用户名
        $scope.remeberUserPhone = function (user) {
            if (user) {
                ipCookie("remeber_user_phone", true, { expires: 21 });
            } else {
                ipCookie("remeber_user_phone", false, { expires: 21 });
            }
        };
        ipCookie("remeber_user_phone", true, { expires: 21 });
    }])
    //注册
    .controller('register-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$interval', '$sce', function ($scope, $rootScope, $state, $http, ipCookie, $interval, $sce) {
        $rootScope.isShow = false;
        $rootScope.change = false;


        $scope.registerList = {

        };


        $scope.geeteInitFn1 = function () {
            $http({
                url: '' + $rootScope.ip + '/Login/geeTestinit',
                method: 'GET',
                params: '',
            }).success(function (data) {
                //console.log(data);
                initGeetest({
                    // 以下配置参数来自服务端 SDK
                    gt: data.gt,
                    challenge: data.challenge,
                    offline: !data.success,
                    new_captcha: data.new_captcha
                }, function (captchaObj) {
                    // $(".getGeetestCaptcha").live("tap",function (e) {
                    //     e.preventDefault();
                    //     getMobileGeetestCaptcha($(this) , captchaObj);
                    // });
                    $scope.geeteTrue = captchaObj;

                    // 这里可以调用验证实例 captchaObj 的实例方法
                    captchaObj.appendTo(".GeetestCaptchaView1");
                })
            })
        };
        $scope.geeteInitFn1();

        $http({
            method: "GET",
            url: '' + $rootScope.ip + '/Login/region_list',
            params: ''
        })
            .success(function (data) {
                //console.log(data);
                $scope.rgProvinceData = data;
            })




        $('.userInput').focus(function () {
            $scope.$apply(function () {
                $scope.userShow = true;
            })
        }).blur(function () {
            $scope.$apply(function () {
                $scope.userShow = false;
            })
        });


        $scope.isUserChange = function (user) {
            var res = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{0,20}$/;
            //console.log(user.length)
            if (res.test(user) && user.length != 0) {
                $scope.isUser = true;
                $scope.userRight = true;

                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Login/validate_user',
                    data: {
                        user_name: user
                    }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status == 0) {
                            $scope.validate_user = data;
                            $scope.isLife = false;
                            $scope.userRight = false;
                        } else {
                            $scope.isLife = true;
                        }
                    })
            } else {
                $scope.isUser = false;
                //console.log(111);
                $scope.isLife = true;
                $scope.userRight = false;
                $scope.userShow = false;
            }

            if (user == '') {
                $scope.isUser = true;
                $scope.userShow = false;
            }

        };




        $('.userPwd').focus(function () {
            $scope.$apply(function () {
                $scope.pwdShow = true;
            })
        }).blur(function () {
            $scope.$apply(function () {
                $scope.pwdShow = false;
            })
        });
        $scope.isPassWordChange = function (password) {

            var ruo = /^\d+$/;
            var zhong = /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z\d]+$/;
            var qiang = /^(?!\d+$)(?![a-zA-Z]+$)(?![@#$%^&]+$)[\da-zA-Z@#$%^&]+$/;
            if (password.length <= 6) {
                $scope.isZhong = false;
                $scope.isRuo = false;
                $scope.isQiang = false;
            } else {
                if (ruo.test(password)) {
                    $scope.isRuo = true;
                    $scope.isZhong = false;
                    $scope.isQiang = false;
                }
                else if (zhong.test(password)) {
                    $scope.isZhong = true;
                    $scope.isRuo = false;
                    $scope.isQiang = false;
                }
                else if (qiang.test(password)) {
                    $scope.isQiang = true;
                    $scope.isRuo = false;
                    $scope.isZhong = false;
                }
            }

        };
        $scope.isPassWord = function (password) {
            $scope.isPassWordChange(password)
        };


        $('.userCpwd').focus(function () {
            $scope.$apply(function () {
                $scope.cpwdShow = true;
            })
        }).blur(function () {
            $scope.$apply(function () {
                $scope.cpwdShow = false;
            })
        });
        //验证再次确认密码
        $scope.isCpassWordChange = function (cpwd) {
            if (cpwd != $scope.registerList.password || cpwd.length == 0) {
                $scope.isCpwd = false;
                $scope.cpwdRight = false;
                $scope.cpwdShow = false;
            }
            else {
                $scope.isCpwd = true;
                $scope.cpwdRight = true;
            }

            if ($scope.registerList.cpassword == '') {
                //console.log(2);
                $scope.isCpwd = true;
                $scope.cpwdRight = false;
                $scope.cpwdShow = false;
            }
        };
        $scope.isCpassWord = function (cpwd) {
            if (cpwd != $scope.registerList.password || cpwd.length == 0) {
                $scope.isCpwd = false;
                $scope.cpwdRight = false;
                $scope.cpwdShow = false;
            }
            else {
                $scope.isCpwd = true;
                $scope.cpwdRight = true;
            }

            if ($scope.registerList.cpassword == '') {
                //console.log(2);
                $scope.isCpwd = true;
                $scope.cpwdRight = false;
                $scope.cpwdShow = false;
            }
        };


        $('.userPhone').focus(function () {
            $scope.$apply(function () {
                $scope.phoneShow = true;
            })
        }).blur(function () {
            $scope.$apply(function () {
                $scope.phoneShow = false;
            })
        });
        //验证手机号
        $scope.isPhone = function (phone) {
            //console.log(phone.length);
            var res = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!res.test(phone)) {
                $scope.isTel = false;
                $scope.phoneRight = false;
                $scope.phoneShow = false;
            } else {
                $scope.isTel = true;
                $scope.phoneRight = true;
            }

            if ($scope.registerList.mobile_phone == '') {
                //console.log(2);
                $scope.isTel = true;
                $scope.phoneRight = false;
                $scope.phoneShow = false;
            }
        };
        //注册里省切换
        $scope.selectProvince = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Login/change_region',
                params: {
                    type: 2,
                    parent_id: pid
                }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.cityData = data;
                    $scope.disData = [];
                    $scope.selectCity(pid);
                    $scope.registerList.city = $scope.registerList.district = '';
                })
        };
        //注册里市切换
        $scope.selectCity = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Login/change_region',
                params: {
                    type: 3,
                    parent_id: pid
                }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.disData = data;
                })
        };


        $('.userCode').focus(function () {
            $scope.$apply(function () {
                $scope.codeShow = true;
            })
        }).blur(function () {
            $scope.$apply(function () {
                $scope.codeShow = false;
            })
        });
        //获取验证码接口
        $scope.codeFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/verify',
                data: {
                    fontSize: 32,
                    length: 4,
                    codeSet: 0,
                    useNoise: true
                }
            }).success(function (data) {
                //console.log(data);
                $scope.code = data.data.skey;
                $scope.getKey();
            })
        };
        $scope.codeFn();
        //回调一次验证码接口获取图片
        $scope.getKey = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/verify',
                data: {
                    fontSize: 32,
                    length: 4,
                    useNoise: true,
                    codeSet: 0,
                    skey: $scope.code
                }
            }).success(function (data) {
                //console.log(data);
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.codeMa = data.data.captcha + '?' + Math.random();  //增加随机参数时间可强制刷新
                    });
                }, 200)
            })
        };
        //点击验证码图片切换验证码
        $scope.codeAgain = function () {
            $scope.codeFn();
        };
        //获取短信验证码
        $scope.vm = {
            data: '获取验证码',
            kedian: false,
            time: 59
        };

        $scope.info = function () {
            var validate = $scope.geeteTrue.getValidate();
            //console.log(validate);

            if (validate != undefined) {
                $scope.reggeetest_challenge = validate.geetest_challenge;
                $scope.reggeetest_validate = validate.geetest_validate;
                $scope.reggeetest_seccode = validate.geetest_seccode;

                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Login/getMobileCode',
                    data: {
                        type: 'reg',
                        mobile: $scope.registerList.mobile_phone,
                        verify: $scope.registerList.str_verify,
                        skey: $scope.code,
                        is_verify: 1,
                        geetest_challenge: $scope.reggeetest_challenge,
                        geetest_validate: $scope.reggeetest_validate,
                        geetest_seccode: $scope.reggeetest_seccode
                    }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info);
                        $scope.vm.kedian = true;
                        $scope.vm.data = $scope.vm.time + 's';
                        $interval(function () {
                            $scope.vm.data = ($scope.vm.time - 1) + 's';
                            $scope.vm.time--;
                            if ($scope.vm.time == 0) {
                                $scope.vm.kedian = false;
                                $scope.vm.data = '重新获取';
                                $scope.vm.time = 59;
                            }
                        }, 1000, $scope.vm.time)
                    } else {
                        $scope.geeteTrue.reset();
                        layer.msg(data.info);
                        $scope.codeAgain();
                    }
                })

            } else {
                layer.msg('请先完成验证', { icon: 2, time: 500 });
            }

        };
        //获取img base64编码
        $scope.imgPreview = function (event) {
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            //获取文件
            //var file = angular.element(e.target).files[0];
            var file = document.getElementById("file").files[0];
            var imageType = /^image\//;
            //是否是图片
            if (!imageType.test(file.type)) {
                alert("请选择图片！");
                return;
            }
            //转码
            //读取完成
            reader.onload = function (e) {
                //获取图片dom
                var img = document.getElementById("preview");
                //图片路径设置为读取的图片
                $scope.img_ava = e.target.result;
                img.src = $scope.img_ava;
                $scope.registerList.zhizhao = $scope.img_ava;
            };
            reader.readAsDataURL(file);
        }


        //调用户协议
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Login/user_agreement',
            data: ''
        }).success(function (data) {
            //console.log(data);
            $scope.xieyi = $sce.trustAsHtml(data.data.content);
        })

        //判断协议是否同意
        $scope.continue = function () {
            $scope.isCheck = true;
        };

        //注册提交
        $scope.register = function () {
            if ($scope.isCheck) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Login/register',
                    data: $scope.registerList
                }).success(function (data) {
                    if (data.status) {
                        layer.confirm('您已提交申请，请耐心等待客服审核，如有疑问，请联系客服电话：400-080-5118', {
                            btn: ['确定'], //按钮
                            title: '提示',
                            closeBtn: 0
                        }, function (index) {
                            layer.close(index);
                            $state.go('login');
                        });
                    } else {
                        layer.msg(data.info);
                    }
                })
                //console.log($scope.registerList);
            } else {
                layer.msg('请先阅读并同意用户协议');
            }
        };
    }])
    //忘记密码
    .controller('forgotPassword-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$interval', function ($scope, $rootScope, $state, $http, ipCookie, $interval) {
        $rootScope.isShow = false;
        $rootScope.change = false;



        $scope.one = true;
        $scope.two = false;
        $scope.three = false;
        $scope.four = false;
        //第一步
        $scope.forgotOneOption = {
            step: 'one'
        };
        $scope.stepOne = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/forgotPwd',
                data: $scope.forgotOneOption
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    $scope.isPhone = data.phone;
                    $scope.forgotTwoOption.phone = data.phone;
                    $scope.one = false;
                    $scope.two = true;

                    $scope.geeteInitFn1 = function () {
                        $http({
                            url: '' + $rootScope.ip + '/Login/geeTestinit',
                            method: 'GET',
                            params: '',
                        }).success(function (data) {
                            //console.log(data);
                            initGeetest({
                                // 以下配置参数来自服务端 SDK
                                gt: data.gt,
                                challenge: data.challenge,
                                offline: !data.success,
                                new_captcha: data.new_captcha
                            }, function (captchaObj) {
                                // $(".getGeetestCaptcha").live("tap",function (e) {
                                //     e.preventDefault();
                                //     getMobileGeetestCaptcha($(this) , captchaObj);
                                // });
                                $scope.geeteTrue = captchaObj;

                                // 这里可以调用验证实例 captchaObj 的实例方法
                                captchaObj.appendTo(".GeetestCaptchaView1");
                            })
                        })
                    };
                    $scope.geeteInitFn1();
                } else {
                    layer.msg(data.info);
                }
            })
        };

        //第二步

        $scope.forgotTwoOption = {
            step: 'two',
            phone: ''
        };

        //获取验证码接口
        $scope.codeFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/verify',
                data: {
                    fontSize: 32,
                    length: 4,
                    useNoise: true
                }
            }).success(function (data) {
                //console.log(data);
                $scope.code = data.data.skey;
                $scope.getKey();
            })
        };
        $scope.codeFn();
        //回调一次验证码接口获取图片
        $scope.getKey = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/verify',
                data: {
                    fontSize: 32,
                    length: 4,
                    useNoise: true,
                    codeSet: $scope.code
                }
            }).success(function (data) {
                //console.log(data);
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.codeMa = data.data.captcha + '?' + Math.random();  //增加随机参数时间可强制刷新
                    });
                }, 200)
                //$scope.codeMa = data.data.captcha;
            })
        };
        //点击验证码图片切换验证码
        $scope.codeAgain = function () {
            $scope.codeFn();
        };

        //获取短信验证码
        $scope.vm = {
            data: '获取验证码',
            kedian: false,
            time: 59
        };

        $scope.info = function () {
            var validate = $scope.geeteTrue.getValidate();
            //console.log(validate);

            if (validate != undefined) {
                $scope.Twogeetest_challenge = validate.geetest_challenge;
                $scope.Twogeetest_validate = validate.geetest_validate;
                $scope.Twogeetest_seccode = validate.geetest_seccode;

                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Login/getMobileCode',
                    data: {
                        type: 'mind',
                        mobile: $scope.isPhone,
                        verify: $scope.forgotTwoOption.verify,
                        skey: $scope.code,
                        is_verify: 1,
                        geetest_challenge: $scope.Twogeetest_challenge,
                        geetest_validate: $scope.Twogeetest_validate,
                        geetest_seccode: $scope.Twogeetest_seccode
                    }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info);
                        $scope.vm.kedian = true;
                        $scope.vm.data = $scope.vm.time + 's';
                        $interval(function () {
                            $scope.vm.data = ($scope.vm.time - 1) + 's';
                            $scope.vm.time--;
                            if ($scope.vm.time == 0) {
                                $scope.vm.kedian = false;
                                $scope.vm.data = '重新获取';
                                $scope.vm.time = 59;
                            }
                        }, 1000, $scope.vm.time)
                    } else {
                        $scope.geeteTrue.reset();
                        layer.msg(data.info);
                        $scope.codeAgain();
                    }
                })
            } else {
                layer.msg('请先完成验证', { icon: 2, time: 500 });
            }


        };


        $scope.stepTwo = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/forgotPwd',
                data: $scope.forgotTwoOption
            }).success(function (data) {
                //console.log(data);
                //console.log($scope.forgotTwoOption);
                if (data.status) {
                    $scope.forgotThreeOption.phone = data.phone;
                    $scope.forgotThreeOption.verify = data.verify;
                    $scope.one = false;
                    $scope.two = false;
                    $scope.three = true;
                } else {
                    layer.msg(data.info);
                }
            })
        };

        //第三步
        $scope.forgotThreeOption = {
            step: 'three',
            phone: '',
            verify: ''
        };
        $scope.stepThree = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Login/forgotPwd',
                data: $scope.forgotThreeOption
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    $scope.one = false;
                    $scope.two = false;
                    $scope.three = false;
                    $scope.four = true;
                } else {
                    layer.msg(data.info);
                }
            })
        };

        $scope.goLogin = function () {
            $state.go('login');
        };
    }])
    //充值
    .controller('recharge-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$interval', function ($scope, $rootScope, $state, $http, ipCookie, $interval) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.accountList = {
            amount: '',
            payment_id: 6
        }
        $('.jifanniu .km').click(function (e) {
            $('.jifanniu .km').removeClass('on');
            $(e.target).addClass('on');
        });
        if ($('.ikm1').hasClass('on')) {
            $scope.accountList.amount = 5000;
        }
        $scope.wuqian = function () {
            $scope.accountList.amount = 5000;
        };
        $scope.yiwan = function () {
            $scope.accountList.amount = 10000;
        };
        $scope.liangwan = function () {
            $scope.accountList.amount = 20000;
        };
        $scope.sanwan = function () {
            $scope.accountList.amount = 30000;
        };
        $scope.siwan = function () {
            $scope.accountList.amount = 40000;
        };
        $scope.wuwan = function () {
            $scope.accountList.amount = 50000;
        };
        $scope.aliPayFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/addAccount',
                data: $scope.accountList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Flow/pay',
                            data: {
                                log_id: data.log_id,
                                type: 'log'
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                if (data.status) {
                                    $http({
                                        method: "POST",
                                        url: '' + $rootScope.ip + '/Flow/pay_code',
                                        data: {
                                            code: data.alipay
                                        },
                                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                                    })
                                        .success(function (data) {
                                            //console.log(data);
                                            if (data.status) {
                                                layer.msg('玩命加载中', {
                                                    icon: 16
                                                    , shade: 0.3
                                                }, function () {

                                                })
                                                pingpp.createPayment(data.pingxx, function (result, err) {
                                                    //console.log(result, err);
                                                    if (result == "success") {
                                                        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                                                    } else if (result == "fail") {
                                                        // charge 不正确或者微信公众账号支付失败时会在此处返回
                                                    } else if (result == "cancel") {
                                                        // 微信公众账号支付取消支付
                                                    }
                                                });
                                            }
                                        })
                                } else {
                                    layer.msg(data.info, { icon: 2 });
                                }

                            })
                    } else {
                        layer.msg(data.info, { icon: 2 });
                    }
                })
        };
        $scope.wexinFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/addAccount',
                data: $scope.accountList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Flow/pay',
                            data: {
                                log_id: data.log_id,
                                type: 'log'
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                if (data.status) {
                                    $http({
                                        method: "POST",
                                        url: '' + $rootScope.ip + '/Flow/pay_code',
                                        data: {
                                            code: data.weixin
                                        },
                                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                                    })
                                        .success(function (data) {
                                            //console.log(data);
                                            if (data.status) {
                                                layer.msg('玩命加载中', {
                                                    icon: 16
                                                    , shade: 0.3
                                                }, function () {
                                                    $state.go('erweima', {
                                                        url: data.wx_url
                                                    });
                                                })
                                            } else {
                                                layer.msg(data.info);
                                            }
                                            // if(data.status) {
                                            //     layer.msg('玩命加载中', {
                                            //         icon: 16
                                            //         , shade: 0.3
                                            //     },function(){
                                            //
                                            //     })
                                            //     pingpp.createPayment(data.pingxx, function(result, err) {
                                            //         //console.log(result, err);
                                            //         if (result == "success") {
                                            //             // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                                            //         } else if (result == "fail") {
                                            //             // charge 不正确或者微信公众账号支付失败时会在此处返回
                                            //         } else if (result == "cancel") {
                                            //             // 微信公众账号支付取消支付
                                            //         }
                                            //     });
                                            // }
                                        })
                                } else {
                                    layer.msg(data.info, { icon: 2 });
                                }

                            })
                    } else {
                        layer.msg(data.info, { icon: 2 });
                    }
                })
        };
        $scope.ylFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/addAccount',
                data: $scope.accountList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Flow/pay',
                            data: {
                                log_id: data.log_id,
                                type: 'log'
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                if (data.status) {
                                    $http({
                                        method: "POST",
                                        url: '' + $rootScope.ip + '/Flow/pay_code',
                                        data: {
                                            code: data.upacp
                                        },
                                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                                    })
                                        .success(function (data) {
                                            //console.log(data);
                                            if (data.status) {
                                                layer.msg('玩命加载中', {
                                                    icon: 16
                                                    , shade: 0.3
                                                }, function () {

                                                })
                                                pingpp.createPayment(data.pingxx, function (result, err) {
                                                    //console.log(result, err);
                                                    if (result == "success") {
                                                        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                                                    } else if (result == "fail") {
                                                        // charge 不正确或者微信公众账号支付失败时会在此处返回
                                                    } else if (result == "cancel") {
                                                        // 微信公众账号支付取消支付
                                                    }
                                                });
                                            }
                                        })
                                } else {
                                    layer.msg(data.info, { icon: 2 });
                                }

                            })
                    } else {
                        layer.msg(data.info, { icon: 2 });
                    }
                })
        };

    }])
    //商品列表
    .controller('shopList-control', ['$scope', '$rootScope', '$stateParams', '$http', 'ipCookie', '$window', '$location', '$data', '$anchorScroll', '$state', '$timeout', function ($scope, $rootScope, $stateParams, $http, ipCookie, $window, $location, $data, $anchorScroll, $state, $timeout) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.goto = function () {
            $location.hash('');
            $anchorScroll.yOffset = 0;
            $anchorScroll();
        };
        $scope.goto();

        $scope.keyFn = function (id) {
            $state.go('shop-list', {
                cat_id: id,
                keywords: null,
                brand_id: null,
                filter: null,
                random: null,
            })
        };

        $scope.brand_id = $stateParams.brand_id;
        $scope.cat_id = $stateParams.cat_id;
        $scope.filter = $stateParams.filter;
        $scope.keywords = $stateParams.keywords;
        $scope.random = $stateParams.random;
        $scope.page = $stateParams.page || 1;

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

        //console.log($scope.filter);
        $scope.ListPage = {
            brand_id: $scope.brand_id,
            cat_id: $scope.cat_id,
            filter: $scope.filter,
            order: '',
            stort: '',
            max_price: '',
            min_price: '',
            keywords: $scope.keywords,
            page: $scope.page,
            size: 20
        };
        $('.nav-bar ul a:eq(0)').addClass('active');
        // $rootScope.res = ipCookie('token');

        //分页操作
        $scope.pageIndex = 0;  //初始页索引
        $scope.pageSize = 10; //每页数据条数
        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: $scope.page - 1,
            callback: pageIndex
        };
        function pageIndex(index) {
            // $state.go('shop-list',{page:index + 1});
            $scope.ListPage.page = index + 1;
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Category/category_goods',
                data: $scope.ListPage,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                layer.close(cool);
                if (data.status) {
                    $scope.shopListData = data;
                }
                $scope.listControl();
                $("body,html").animate({
                    "scrollTop": $('.shopList-main-tit').offset().top
                }, 100)
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })

        };
        //价格筛选
        $scope.enterPrice = function () {
            $scope.InitList();
        };
        //价格清空
        $scope.clearPrice = function () {
            $scope.ListPage.min_price = '';
            $scope.ListPage.max_price = '';
            $scope.InitList();
        };

        //不使用插件分页
        $scope.prevList = function () {
            $scope.pagination[0].prevPage();
        };
        $scope.nextList = function () {
            $scope.pagination[0].nextPage();
        };


        $scope.InitList = function () {
            $scope.ListPage.page = 1;

            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Category/category_goods',
                data: $scope.ListPage,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
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
        $scope.InitList();
        $scope.qxsjFn = function () {
            $scope.qxsjAd = null;
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Index/get_category_recommend_goods',
                params: {
                    type: 'hot',
                    is_return: 1,
                    cats: $scope.shopListData.ding_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.qxsjAd = data;
                });
        };
        $scope.itemFn = function () {
            $(".likeTui").slide({ mainCell: "ul", vis: 4, prevCell: ".sPrev", nextCell: ".sNext", effect: "leftLoop", autoPlay: true });
        };
        $scope.getGoods = function (data) {
            $scope.pagination = $('#Pagination').pagination(data.pages, $scope.options);
        };
        /*        //goto
                $(".page-btn").one("click",function() {
                    var allPage = $(".allPage").text();
                    //console.log(allPage);
                    var goPage = $(".page-go input").val() - 1; //跳转页数
                    //console.log(goPage)
        
                    if (goPage > -1 && goPage < allPage) {
                        $scope.options.current_page = 2;
                        $scope.InitList();
                    } else {
                        $scope.InitList();
                    }
                    //清空用户跳转页数
                    $(".page-go input").val("");
                })*/
        // $scope.searchPage = function(){
        //
        // };
        //清空所有已选条件
        $scope.deleteSelect = function () {
            // layer.msg('请稍后', {
            //     icon: 16,
            //     shade: 0.3,
            //     time:500
            // },function(){
            //  $window.location.href = 'http://localhost:63342/newjingkoo/index.html?_ijt=t3lil9amqvpqbs8669ga0g8taf#/shop-list/'+''+'/'+''+'/'+''+'';
            // });
            $scope.ListPage.brand_id = '';
            // $scope.ListPage.cat_id = '';
            $scope.brand_id = '';
            $scope.ListPage.min_price = '';
            $scope.ListPage.max_price = '';
            $scope.ListPage.filter = '';

            $scope.ListPage.cat_id = '';
            $scope.cat_id = '';
            $scope.ListPage.keywords = '';
            $scope.keywords = '';
            $scope.keywords = '';


            $scope.price = false;
            $scope.InitList();

        };
        //取消商品品牌筛选的内容
        $scope.closeFashion = function (e) {
            $scope.fashion = false;
            $scope.ListPage.brand_id = '';
            $scope.brand_id = '';
            $scope.ListPage.keywords = '';
            $scope.keywords = '';
            $scope.keywords = '';
            //$window.location.href = 'http://localhost:63342/newjingkoo/index.html?_ijt=t3lil9amqvpqbs8669ga0g8taf#/shop-list/'+$scope.ListPage.brand_id+'/'+$scope.ListPage.cat_id+'/'+$scope.ListPage.keywords+'';
            $scope.InitList();
        };
        //获取商品品牌筛选的内容
        $scope.fashion = false;
        $scope.getAllValue = function (value, id) {
            $scope.brand_name = value;
            $scope.ListPage.brand_id = id;
            $scope.brand_id = id;
            $scope.ListPage.keywords = '';
            $scope.keywords = '';
            //$window.location.href = 'http://localhost:63342/newjingkoo/index.html?_ijt=t3lil9amqvpqbs8669ga0g8taf#/shop-list/'+id+'/'+$scope.ListPage.cat_id+'/'+$scope.ListPage.keywords+'';
            // //console.log($location.search('fashion='+value+''));
            // //console.log($location.$$search.fashion);
            $scope.InitList();
            $scope.fashion = true;
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
        //取消商品价格区间筛选的内容
        $scope.closePrice = function (e) {
            $scope.price = false;
            $scope.ListPage.min_price = '';
            $scope.ListPage.max_price = '';
            $scope.InitList();
        };
        $scope.priceAll = function () {
            $scope.price = false;
            $scope.ListPage.min_price = '';
            $scope.ListPage.max_price = '';
            $scope.InitList();
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
        $scope.price = false;
        $scope.getPriceValue = function (value1, value2) {
            $scope.min_price = value1;
            // $window.location.href = 'http://localhost:63342/newjingkoo/index.html?_ijt=t3lil9amqvpqbs8669ga0g8taf#/shop-list/'+$scope.ListPage.brand_id+'';
            $scope.max_price = value2;
            $scope.ListPage.min_price = value1;
            $scope.ListPage.max_price = value2;
            $scope.ListPage.keywords = '';
            $scope.keywords = '';
            $scope.InitList();
            $scope.price = true;
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
            $scope.fenlei = false;
            $scope.ListPage.cat_id = '';
            $scope.cat_id = '';
            $scope.ListPage.keywords = '';
            $scope.keywords = '';
            $scope.keywords = '';
            //$window.location.href = 'http://localhost:63342/newjingkoo/index.html?_ijt=t3lil9amqvpqbs8669ga0g8taf#/shop-list/'+$scope.ListPage.brand_id+'/'+$scope.ListPage.cat_id+'/'+$scope.ListPage.keywords+'';
            $scope.InitList();
        };
        $scope.cateAll = function () {
            $scope.ListPage.cat_id = 0;
            $scope.InitList();
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
        $scope.fenlei = false;
        $scope.getMonthValue = function (value, id) {
            $scope.cat_name = value;
            //$window.location.href = 'http://localhost:63342/newjingkoo/index.html?_ijt=t3lil9amqvpqbs8669ga0g8taf#/shop-list/'+$scope.ListPage.brand_id+'/'+id+'/'+$scope.ListPage.keywords+'';
            $scope.fenlei = true;
            $scope.ListPage.cat_id = id;
            $scope.cat_id = id;
            $scope.ListPage.keywords = '';
            $scope.keywords = '';
            $scope.InitList();
            /*  $('.shopList-select-conditions .more-fashion:first').prev().css({
                 height: '62'
             })
             $('.shopList-select-conditions .more-fashion:not(:first)').prev().css({
                 height: '30'
             })
             $("body,html").animate({
                 "scrollTop": $('.shopList-main-tit').offset().top
             }, 100) */

            $('.shopList-select-conditions .more-fashion:first').find('i').html('+');
            $('.shopList-select-conditions .more-fashion:not(:first)').find('i').html('+');
        };
        //取消商品属性筛选的内容
        $scope.closeShuxing = function (filter) {
            $scope.ListPage.filter = filter;
            $scope.InitList();
        };
        //获取商品属性筛选的内容
        $scope.getAttrValue = function (value, id) {
            //$scope.cat_name = value;
            $scope.ListPage.filter = id;
            $scope.ListPage.keywords = '';
            $scope.keywords = '';
            $scope.InitList();
            /* $('.shopList-select-conditions .more-fashion:first').prev().css({
                height: '62'
            })
            $('.shopList-select-conditions .more-fashion:not(:first)').prev().css({
                height: '30'
            })
            $("body,html").animate({
                "scrollTop": $('.shopList-main-tit').offset().top
            }, 100) */

            $('.shopList-select-conditions .more-fashion:first').find('i').html('+');
            $('.shopList-select-conditions .more-fashion:not(:first)').find('i').html('+');
            $scope.shouQi = false;
            $scope.moreXx = true;
        };

        //商品综合排序
        $scope.allOrder = function () {
            $scope.ListPage.order = '';
            $scope.ListPage.stort = 'DESC';
            $scope.ListPage.page = 1;
            $scope.InitList();
        };
        //商品推荐排序
        $scope.tuijianOrder = function () {
            $scope.ListPage.order = 'sales_num';
            $scope.ListPage.stort = 'DESC';
            $scope.ListPage.page = 1;
            $scope.InitList();
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
            //          $scope.ListPage.order = 'shop_price';
            //          $scope.ListPage.page = 1;
            //          $scope.InitList();
        };
        //价格升序
        $scope.PriceAsOrder = function () {
            $scope.ListPage.stort = 'ASC';
            $scope.ListPage.order = 'shop_price';
            $scope.ListPage.page = 1;
            $scope.InitList();
        };
        //价格降序
        $scope.PriceDsOrder = function () {
            $scope.ListPage.stort = 'DESC';
            $scope.ListPage.order = 'shop_price';
            $scope.ListPage.page = 1;
            $scope.InitList();
        };
        //商品时间排序
        $scope.timeOrder = function () {
            $scope.ListPage.order = 'add_time';
            $scope.ListPage.page = 1;
            $scope.InitList();
        };
        //时间升序
        $scope.timeAsOrder = function () {
            $scope.ListPage.stort = 'ASC';
            $scope.ListPage.order = 'add_time';
            $scope.ListPage.page = 1;
            $scope.InitList();
        };
        //时间降序
        $scope.timeDsOrder = function () {
            $scope.ListPage.stort = 'DESC';
            $scope.ListPage.order = 'add_time';
            $scope.ListPage.page = 1;
            $scope.InitList();
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
            console.log($('.shopList-select-conditions .more-fashion:not(:first)'))

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



        //列表页切换大图小图
        //  $scope.picFoucusFn = function(){
        //      setTimeout(function(){
        //          $(".picFocus").slide({ mainCell:".bd ul",vis:4,effect:"left",autoPlay:false});
        //      },100)
        //  };





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
            }, 1000);

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
                            $scope.InitList();
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
                            $scope.InitList();
                        }
                    })
            }
        };
    }])
    //商品品牌专题页
    .controller('shopListAno-control', ['$scope', '$rootScope', '$stateParams', '$http', 'ipCookie', '$window', '$location', '$data', '$anchorScroll', '$state', function ($scope, $rootScope, $stateParams, $http, ipCookie, $window, $location, $data, $anchorScroll, $state) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        //分类切换函数
        $scope.anoSlideFn = function () {
            setTimeout(function () {
                $(".cuntab").slide({ mainCell: ".bd", trigger: "click" });
            }, 100)
        };

        var cool = layer.load(0, { shade: [0.3, '#fff'] });

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Category/zeiss',
            data: {
                cat_id: $stateParams.cat_id
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            //console.log(data);
            layer.close(cool);
            if (data.status) {
                $scope.anoListData = data;
                $scope.anoName = data.infos.cat_name;
                $scope.anImg = data.infos.thumb;
                $scope.cat_desc = data.infos.cat_desc;
                $scope.keywords = data.infos.keywords;
            }
        }).error(function (data, staus) {
            layer.close(cool);
            if (staus == 401) {
                ////layer.msg('用户失效，请重新登录');
                ipCookie.remove('has_login');
                ipCookie.remove('token');
                location.href = "/default.html";
            }
        })


        $scope.catFn = function () {
            setTimeout(function () {
                $(".ls1h3").on("click", function () {
                    $(".ls1h3").removeClass("attr");
                    $(this).addClass("attr");

                    if ($(this).next().is(':hidden')) {
                        $(this).addClass("bjtous");
                        //$(".box-tcd").hide();
                        $(this).nextAll().show();
                    } else {
                        $(".ls1h3").removeClass("bjtous");
                        $(this).nextAll().hide();
                    }
                    //            $(".box-tcd").not($(this).next()).hide();
                    //            $(this).parent().find(".box-tcd").slideToggle();

                })
            }, 200)
        };

        $scope.getZeissGoods = function (box, i1, ii, iii) {
            $scope.zeissList = [];
            //console.log(box)
            if (box.cat_id == []) {
                return;
            }
            for (var i = 0; i < box.cat_id.length; i++) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Index/get_category_recommend_goods',
                    data: {
                        cats: box.cat_id[i].id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    //console.log($scope.anoListData.category.cat_id[ii].cat_id[i1])
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.anoListData.category.cat_id[iii].cat_id[ii].cat_id[i1]['zeissList'] = data.data;
                        })
                    }, 20)
                })
            }

        };

    }])
    //商品详情
    .controller('shopDetail-control', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ipCookie', '$window', '$location', '$anchorScroll', '$sce', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $window, $location, $anchorScroll, $sce) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.goto = function () {
            $location.hash('');
            $anchorScroll.yOffset = 0;
            $anchorScroll();
        };
        $scope.goto();

        // $rootScope.res = ipCookie('token');
        $scope.detailOption = {
            goods_id: $stateParams.goods_id,
            attr: ''
        };

        $scope.mouseenter = function (e) {
            console.log(e)
        }

        //点击展开
        $scope.isZk = true;
        $scope.zhankai = function () {
            if ($scope.isZk) {
                $scope.isZk = false;
                $('.tableZk').css({
                    height: 'auto'
                })
            } else {
                $('.tableZk').css({
                    height: '269px'
                })
                $("body,html").animate({
                    "scrollTop": 0
                }, 500)
                $scope.isZk = true;
            }
        };
        //商品详情获取商品初始类型接口
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Goods/get_goods_attribute',
            data: $scope.detailOption,
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status == 0 && data.info == "商品信息不存在") {
                    layer.msg(data.info);
                    $window.history.back();
                }
                $scope.spectaclesData = data;
                $scope.attrNumber = 1;
                //如果主属性存在，获取主属性的每次需要加减的数量
                if ($scope.spectaclesData.data) {
                    for (var i = 0; i < $scope.spectaclesData.data.length; i++) {
                        if ($scope.spectaclesData.data[i].is_main == 1) {
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $scope.hasMainAttr = true;
                                })
                            }, 0)
                            $scope.attrNumber = $scope.spectaclesData.data[i].values[0].number || 1;
                            $scope.attrId = $scope.spectaclesData.data[i].values[0].id;
                        }
                    }
                }



                //根据商品初始类型选择情况
                if (data.goods_type == "goods") {
                    //$scope.isGlass = false;
                    $scope.pickTable = true;
                    $scope.isList = true;
                    //控制积分商城商品和普通商品和镜片的区别
                    $scope.isPointsMall = true;
                    $scope.pointsMall = false;
                    //商品属性为goods时调用这个接口

                    $scope.getAttrList = function (attrId, attrNumber) {
                        $scope.attrNumber = attrNumber;
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Goods/get_attr_list',
                            data: {
                                goods_id: $stateParams.goods_id,
                                attr: attrId
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                $scope.goodsData = data;
                                if (data.data.length > 3) {
                                    setTimeout(function () {
                                        $scope.$apply(function () {
                                            $scope.zk = true;
                                        })
                                    }, 0)
                                    $('.tableZk').css({
                                        height: '269px'
                                    })
                                } else {
                                    setTimeout(function () {
                                        $scope.$apply(function () {
                                            $scope.zk = false;
                                        })
                                    }, 0)
                                    $('.tableZk').css({
                                        height: 'auto'
                                    })
                                }
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
                                        $scope.goodsCarParams.goods.member.push($scope.goodsData.data[t].num);
                                        var arr1 = [];
                                        var attrs = $scope.goodsData.data[t].goods_attr_id;
                                        var sAttr = $scope.goodsData.data[t].str_goods_attr;
                                        //arr1.push(attrs);
                                        $scope.goodsCarParams.goods.spec.push(attrs);
                                        $scope.goodsCarParams.goods.attr.push(sAttr);
                                    }
                                    //console.log($scope.goodsCarParams);
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
                                            //console.log(data);
                                            if (data.status) {
                                                $scope.listTotalNumber = data.number;
                                                $scope.listTotalPrice = data.goods_total;
                                            } else {
                                                layer.msg(data.info, { time: 1000 });
                                            }
                                        })
                                };
                                // $scope.numberChange();
                                $scope.isCarParams = false;
                                $scope.isReduce = true;
                                //增加
                                //$scope.numArr = [{}];
                                $scope.add = function (e, index) {
                                    var product_number = $scope.goodsData.data[index].product_number;
                                    $scope.goodsData.data[index].num += Number($scope.attrNumber);
                                    $scope.isZk = false;
                                    $scope.zk = false;
                                    $('.tableZk').css({
                                        height: 'auto'
                                    })
                                    $scope.numberChange();
                                    if ($scope.goodsData.data[index].num > 0) {
                                        $scope.isCarParams = true;
                                        //$scope.isReduce = false;
                                    } else {
                                        //$scope.isCarParams = false;
                                    }
                                };
                                //减少
                                $scope.reduce = function (e, index) {
                                    $scope.goodsData.data[index].num -= Number($scope.attrNumber);

                                    $scope.numberChange();
                                };
                            })
                    };
                    $scope.getAttrList($scope.attrId, $scope.attrNumber);

                }
                else if (data.goods_type == "goods_spectacles") {
                    var arr = [];
                    //获取球镜度数的最大值和最小值
                    for (var i in data.spectacles_properties.list) {
                        arr.push(data.spectacles_properties.list[i]);
                    }
                    $scope.high = Math.max.apply(null, arr).toFixed(2);
                    $scope.low = Math.min.apply(null, arr).toFixed(2);

                    //$scope.isGlass = true;
                    $scope.pickTa = true;
                    $scope.isList = false;
                    //控制积分商城商品和普通商品和镜片的区别
                    $scope.isPointsMall = true;
                    $scope.pointsMall = false;
                }
                else {
                    //控制初始类型筛选显示哪个类型的表格
                    $scope.pickTable = false;
                    $scope.pickTa = false;
                }
            })


        $scope.NumSelect = function (e) {

            angular.element(e.target).focus().select();
        };
        $scope.change = function (e, pIndex, index, num) {
            console.log(e)
            //console.log($scope.goodsData.data[index].num);
            if ($scope.goodsData.data[index].num > 0) {
                $scope.isCarParams = true;
                //$scope.isReduce = false;
                angular.element(e.target).prev().removeClass('no');
            } else if ($scope.goodsData.data[index].num == 0) {
                //$scope.isCarParams = false;
                //$scope.isReduce = true;
                //$scope.isAdd = false;
                angular.element(e.target).prev().addClass('no');
                angular.element(e.target).next().removeClass('no');
            }


            if (Number($scope.goodsData.data[index].num) > Number($scope.goodsData.data[index].product_number)) {
                $scope.goodsData.data[index].num = Number($scope.goodsData.data[index].product_number);
                angular.element(e.target).next().addClass('no');
            }
            else if (Number($scope.goodsData.data[index].num) < 0 || Number($scope.goodsData.data[index].num) == '') {
                $scope.goodsData.data[index].num = 0;
            }
            else {
                angular.element(e.target).next().removeClass('no');
            }

            $scope.numberChange();
            // if(angular.element(e.target).value >=1){
            //     //console.log($scope.num);
            // }else{
            //     angular.element(e.target).value = 1;
            // }
        };

        //商品详情接口
        $scope.shopDetailFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/goods_infos',
                data: $scope.detailOption,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.data = data;
                    document.title = data.data.goods_name;
                    $scope.detailTitle = data.data.goods_name;
                    //积分详情页
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
                                //console.log(data);
                                $scope.payPoints = data.user_info.pay_points;
                            })
                    } else {
                        $scope.isPointsMall = true;
                        $scope.pointsMall = false;
                    }
                    //正品 退换货 货到付款
                    $scope.zhengpin = data.data.additional.is_true;
                    $scope.huodao = data.data.additional.is_hdfk;
                    $scope.tui = data.data.additional.is_inv;
                    //商品是否收藏
                    if (data.data.is_collect) {
                        //商品关注两个状态的控制
                        $scope.success = false;
                        $scope.successed = true;
                    } else {
                        $scope.success = true;
                        $scope.successed = false;
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
                    //进入店铺
                    // $scope.goStore = function(){
                    //     var url = $state.href('shopHome',{
                    //         shopId:$scope.shopId
                    //     });
                    //     window.open(url,'_blank');
                    // };
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
                                    //console.log(data);
                                    if (data.status) {
                                        layer.msg(data.info, { time: 1000 }, function () {
                                            $scope.shopDetailFn();
                                        });
                                    } else {
                                        layer.msg(data.info, { time: 1000 });
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
                                    //console.log(data);
                                    if (data.status) {
                                        layer.msg(data.info, { time: 1000 }, function () {
                                            $scope.shopDetailFn();
                                        });
                                    } else {
                                        layer.msg(data.info, { time: 1000 });
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
                    $scope.marketPriceFormated = data.data.market_price_formated;
                    $scope.oldShopPrice = data.data.old_shop_price;
                    $scope.cxPrcie = data.data.shop_price_formated;
                    $scope.unit = data.data.unit;
                    $scope.goodsSn = data.data.goods_sn;
                    $scope.listID = data.data.cat_id;
                    $scope.is_fee = data.goods_fee.free_money;


                    $scope.goBack = function (category, categoryId) {
                        $state.go('shop-list', {
                            cat_id: categoryId,
                            keywords: ''
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
                    $scope.needJf = data.data.exchange_info.exchange_integral;
                    $scope.isExchange = data.data.exchange_info.is_exchange;
                    //立即兑换积分商品
                    $scope.buyNow = function () {
                        layer.confirm('确定要兑换么？', {
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
                                    //console.log(data);
                                    if (data.status) {
                                        $state.go('shop-jiesuan');
                                        layer.msg(data.info, { icon: 1, time: 1000 });
                                        $rootScope.$broadcast('upCarList');
                                    } else {
                                        layer.msg(data.info, { icon: 2, time: 1000 });
                                    }
                                })
                        }, function () {
                            layer.msg('这个不满意么？再换一个看看吧~', {
                                icon: 3,
                                time: 2000, //2s后自动关闭
                            });
                        })
                    };
                }).error(function (data, staus) {
                    layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
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
                //console.log(data);
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
            }, 1000);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/get_goods_collect',
                data: $scope.detailOption,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status == '0') {
                        layer.msg('关注失败', { time: 1000 });
                        //$state.go('login');
                    } else {
                        layer.msg('关注成功', { time: 1000 });
                        $scope.shopDetailData.data.is_collect = 1;
                        $scope.successed = true;
                        $scope.success = false;
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
            }, 1000);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/collect_del',
                data: $scope.detailOption,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status == '0') {
                        layer.msg('取消关注失败', { time: 1000 });
                        //$state.go('login');
                    } else {
                        layer.msg('已取消关注', { time: 1000 });
                        $scope.shopDetailData.data.is_collect = 0;
                        $scope.successed = false;
                        $scope.success = true;
                    }
                })
        };


        $scope.regionArr = {
            goods_id: $scope.detailOption.goods_id,
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
                    //console.log(data);
                    if (data.status) {
                        $scope.regionArr.region_id = region;
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Goods/set_area',
                            data: $scope.regionArr,
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
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
                    //console.log(data);
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
        $scope.getDs = function (e, dsItem, index) {
            //console.log(index);

            $scope.arr[index].qiujing = dsItem;

            /*  $http({
                 method: "POST",
                 url: '' + $rootScope.ip + '/Goods/changeprice',
                 data: {
                     goods_id: $scope.detailOption.goods_id,
                       attr:[],
                         qiujing:dsItem,
                           zhujing:$scope.arr[index].zhujing,
 
                 },
                 headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
             }).success(function(data){
                 $scope.arr[index].price = data.data.price;
             }) */
            //console.log(dsItem);
            //console.log(angular.element(e.target).parent().parent().parent().parent().prev());
            angular.element(e.target).parent().parent().parent().parent().prev()[0].value = dsItem;
            //获取柱镜的数据
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/get_zhujing',
                data: {
                    goods_id: $scope.detailOption.goods_id,
                    item: angular.element(e.target).parent().parent().parent().parent().prev()[0].value
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.zhujingData = data;
                    var arrs = [];
                    for (var i in data.data) {
                        arrs.push(data.data[i]);
                    }
                    $scope.highs = Math.max.apply(null, arrs).toFixed(2);
                    $scope.lows = Math.min.apply(null, arrs).toFixed(2);
                })
            //$scope.pickTaList = dsItem;
            $('#masks').hide();
            $('.dushu-box').hide();
        };
        //点击柱镜数据来给当前的柱镜给度数值
        $scope.getDsZj = function (e, dsItems, index) {

            //console.log(dsItems);
            $scope.arr[index].zhujing = dsItems;

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/changeprice',
                data: {
                    goods_id: $scope.detailOption.goods_id,
                    attr: [],
                    qiujing: $scope.arr[index].qiujing,
                    zhujing: dsItems,

                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                $scope.arr[index].price = data.data.price.toFixed(2);
                $scope.arr[index].subprice = ($scope.arr[index].member * $scope.arr[index].price).toFixed(2);

            })


            angular.element(e.target).parent().parent().parent().parent().prev().prev()[0].value = dsItems;
            $('#masks').hide();
            $('.dushuQiuJing-box').hide();
        };
        //设置一个空数组用来新增一行
        //用来存放镜片属性的数组
        $scope.arr = [{ member: 1, subprice: '0.00', price: '0.00' }];
        //新增一行
        $scope.addTr = function () {
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
                var arr2 = [];
                for (var s = 0; s < $scope.spectaclesData.specification.length; s++) {
                    var attr = $scope.arr[i][$scope.spectaclesData.specification[s].name];
                    arr2.push(attr);
                }
                $scope.goodsSpectaclesCarParams.goods.spc.push(arr2);
                //console.log($scope.arr);
            }
            //console.log($scope.goodsSpectaclesCarParams);
            if (!$scope.goodsSpectaclesCarParams.goods.zhujing[$scope.arr.length - 1] && !$scope.goodsSpectaclesCarParams.goods.qiujing[$scope.arr.length - 1]) {
                layer.msg('商品球镜柱镜属性不能为空', { time: 1000 });
            } else {
                $scope.arr.push({ member: 1, subprice: '0.00', price: '0.00' });
            }
        };
        //删除一行
        $scope.delTr = function (index) {
            if ($scope.arr.length == 1) {
                layer.msg('客官给留一件吧');
            }
            else if (index >= 0) {
                $scope.arr.splice(index, 1);
            } else {
                $scope.arr.pop();
            }

        };
        /* 镜片价格小计 */
        $scope.numChange = function (item) {
            item.subprice = (item.member * item.price).toFixed(2);
        }
        //获取商品的各种属性值
        //传到购物车 镜片的数据
        $scope.goodsSpectaclesCarParams = {
            goods_id: $stateParams.goods_id,
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
        //镜片购买
        $scope.add_to_cart_spec_jp = function (success) {
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
                var arr2 = [];
                for (var s = 0; s < $scope.spectaclesData.specification.length; s++) {
                    var attr = $scope.arr[i][$scope.spectaclesData.specification[s].name];
                    arr2.push(attr);
                }
                $scope.goodsSpectaclesCarParams.goods.spc.push(arr2);
            }
            //console.log($scope.arr, arr2);
            //console.log($scope.goodsSpectaclesCarParams);
            if (!$scope.goodsSpectaclesCarParams.goods.zhujing[$scope.arr.length - 1] && !$scope.goodsSpectaclesCarParams.goods.qiujing[$scope.arr.length - 1]) {
                //layer.msg('商品球镜柱镜属性不能为空',{time:1000});
            }
            //镜片加入购物车接口
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/add_to_cart_spec_jp',
                data: $scope.goodsSpectaclesCarParams,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    success ? success(data) : null;
                })
        }
        //普通商品购买
        $scope.add_to_cart_spec = function (success) {

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/add_to_cart_spec',
                data: $scope.goodsCarParams,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    success ? success(data) : null;

                })
        }
        //加入购物车
        $scope.joinCar = function () {
            //镜片加入购物车
            if ($scope.spectaclesData.goods_type == "goods_spectacles") {
                $scope.add_to_cart_spec_jp(function (data) {
                    if (data.status == -1) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data.status == 1) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.arr = [{}];
                        layer.confirm('商品已添加至购物车', {
                            btn: ['去结算', '继续选购'], //按钮
                            title: '提示', btnAlign: 'c',
                            yes: function (index) {
                                $state.go('shop-car');
                                layer.close(index);
                            },
                            btn2: function (index) {
                                layer.close(index);
                                $scope.getAttrList();
                            }
                            // closeBtn: 0
                        });
                        $rootScope.$broadcast('upCarList');
                    } else if (data.status == 0) {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
            }
            //普通商品加入购物车
            else if ($scope.spectaclesData.goods_type == "goods") {
                // $scope.goodsCarParams.goods.member = [];
                // $scope.goodsCarParams.goods.spec = [];
                // for(var t = 0;t<$scope.goodsData.data.length;t++) {
                //     $scope.goodsCarParams.goods.member.push($scope.goodsData.data[t].num);
                //     var arr1 = [];
                //     for (var y = 0; y < $scope.goodsData.data[0].goods_attr.length; y++) {
                //         var attrs = $scope.goodsData.data[0].goods_attr[y].attr_val;
                //         arr1.push(attrs);
                //     }
                //     $scope.goodsCarParams.goods.spec.push(arr1);
                // }
                // //console.log($scope.goodsCarParams);
                //普通商品加入购物车接口
                $scope.add_to_cart_spec(function (data) {
                    if (data.status == -1) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data.status == 1) {
                        layer.msg(data.info, { time: 1000 });
                        // for(var i = 0;i<$scope.goodsData.data.length;i++){
                        //     $scope.goodsData.data[i].num = 0;
                        // }
                        /* for (var s = 0; s < $scope.goodsData.data.length; s++) {
                            $scope.goodsData.data[s].num=0;
                        } */
                        layer.confirm('商品已添加至购物车', {
                            btn: ['去结算', '继续选购'], //按钮
                            title: '提示', btnAlign: 'c',
                            yes: function (index) {
                                $state.go('shop-car');
                                layer.close(index);
                            },
                            btn2: function (index) {
                                layer.close(index);
                                $scope.getAttrList();
                            }
                            // closeBtn: 0
                        });
                        $rootScope.$broadcast('upCarList');

                    } else if (data.status == 0) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data == 'null') {
                        layer.msg('商品数量不能为零', { time: 1000 });
                    }
                })
            }
        };
        //立即购买
        $scope.buyNow = function () {
            //镜片购买
            if ($scope.spectaclesData.goods_type == "goods_spectacles") {
                $scope.add_to_cart_spec_jp(function (data) {
                    if (data.status == -1) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data.status == 1) {
                        layer.msg(data.info, { time: 1000 });
                        $rootScope.$broadcast('upCarList');
                        $state.go('shop-car');
                    } else if (data.status == 0) {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
            }
            //普通商品购买
            else if ($scope.spectaclesData.goods_type == "goods") {
                // $scope.goodsCarParams.goods.member = [];
                // $scope.goodsCarParams.goods.spec = [];
                // for(var t = 0;t<$scope.goodsData.data.length;t++) {
                //     $scope.goodsCarParams.goods.member.push($scope.goodsData.data[t].num);
                //     var arr1 = [];
                //     for (var y = 0; y < $scope.goodsData.data[0].goods_attr.length; y++) {
                //         var attrs = $scope.goodsData.data[0].goods_attr[y].attr_val;
                //         arr1.push(attrs);
                //     }
                //     $scope.goodsCarParams.goods.spec.push(arr1);
                // }
                // //console.log($scope.goodsCarParams);
                //普通商品加入购物车接口
                $scope.add_to_cart_spec(function (data) {
                    if (data.status == -1) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data.status == 1) {
                        layer.msg(data.info, { time: 1000 });
                        $rootScope.$broadcast('upCarList');
                        $state.go('shop-car');
                    } else if (data.status == 0) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data == 'null') {
                        layer.msg('商品数量不能为零', { time: 1000 });
                    }
                })
            }
        };

        //清除浏览记录
        $scope.historyItem = {
            goods_ids: []
        };
        $scope.deleteHistory = function () {
            for (var h = 0; h < $scope.shopDetailData.history.length; h++) {
                $scope.historyItem.goods_ids.push($scope.shopDetailData.history[h].goods_id);
            }
            //console.log($scope.historyItem);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/user/del_watch',
                data: $scope.historyItem,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 }, function () {
                            $scope.shopDetailFn();
                        });
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        }
        //$scope.joinCar();


        $scope.goBulkOrder = function () {
            window.open($state.href('bulk-order', {
                goods_id: $stateParams.goods_id,
                shop_price: $scope.shopDetailData.data.shop_price,
                is_promote: $scope.shopDetailData.data.is_promote,
                zhouwei: $scope.shopDetailData.data.zhouwei
            }));
        };
    }])
    //商品批量下单页
    .controller('bulkOrder-control', ['$scope', '$rootScope', '$http', '$stateParams', 'ipCookie', '$sce', '$state', function ($scope, $rootScope, $http, $stateParams, ipCookie, $sce, $state) {
        $rootScope.change = true;

        $scope.getdata = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/goods_batch',
                data: {
                    goods_id: $stateParams.goods_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    layer.close(cool);
                    $scope.table = $sce.trustAsHtml(data.content);
                    //$scope.table = data.content
                    $scope.specification = data.specification;
                    $scope.zhouwei = data.goods.zhouwei;
                    $scope.goodsId = $stateParams.goods_id;

                    $scope.goodsName = data.goods.goods_name;
                    $scope.goods_id = data.goods.goods_id;
                    $scope.goodsImg = data.goods.goods_img;
                    $scope.shop_price = data.goods.shop_price;
                    $scope.market_price = data.goods.market_price;
                    if (data.is_cache_goods == 1 && data.result.length > 0) {
                        for (var data_i = 0; data_i < data.result.length; data_i++) {
                            var pic_count;
                            var price = data.result[data_i].price;
                            var pro_price = data.result[data_i].pro_price;
                            var nums = data.result[data_i].nums;
                            //$("input[name=shop_price]").val();

                            var data_id = data.result[data_i].data_id;
                            if (data.result[data_i].qiu == '' || data.result[data_i].zhu == '' || typeof data.result[data_i].zhu == 'undefined' || typeof data.result[data_i].qiu == 'undefined') {
                                continue;
                            }
                            //obj.attr("data-id");
                            if ($("#tr" + data_id).length == 0) {
                                var html = '';
                                if (nums != '' && nums > 0) {
                                    html = '<tr id="tr' + data_id + '" class="attr_lists" shop_price="' + price + '" pro_price="' + pro_price + '"><td align="center" id="' + data_id + '" class="nums">' + nums + '</td>';
                                    html += '<td align="center" class="qiujing">' + data.result[data_i].qiu + '</td>';
                                    //obj.parent().find("td").eq(0).text()

                                    html += '<td align="center" class="zhujing">' + data.result[data_i].zhu + '</td>';
                                    //obj.attr("data-zhu")
                                    if ($stateParams.zhouwei == 1) {
                                        html += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;" value="' + data.result[data_i].zhouwei + '"></td>';
                                    }
                                    var spc = data.result[data_i].spc;
                                    for (var spc_i = 0; spc_i < spc.length; spc_i++) {

                                        tr_val = spc[spc_i].value;
                                        //$(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                                        tr_val_id = spc[spc_i].id;
                                        //$(".spec_" + $(this).attr("data-ids")).find("option:selected").val();

                                        html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
                                    }
									/*
									$(".attr_val").each(function () {
										tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
										tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
										html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
									});
									*/
                                    pic_count = nums * price;
                                    html += '<td align="center" class="">' + (price * 1).toFixed(2) + '</td>';
                                    html += '<td align="center" class="">' + pic_count.toFixed(2) + '</td>';
                                    html += '<td align="center"><a href="javascript:;" class="del_td" data-val="' + data_id + '">删除</a></td></tr>';
                                }
                                $("#order").append(html);
                            } else if ($("#tr" + data_id).length > 0) {
                                if (nums > 0) {
                                    var html = '';
                                    if (nums != '') {
                                        html = '<td align="center" id="' + data_id + '" class="nums">' + nums + '</td>';
                                        html += '<td align="center" class="qiujing">' + data.result[data_i].qiu + '</td>';
                                        //obj.parent().find("td").eq(0).text()

                                        html += '<td align="center" class="zhujing">' + data.result[data_i].zhu + '</td>';
                                        //obj.attr("data-zhu")
                                        if ($stateParams.zhouwei == 1) {
                                            html += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;" value="' + data.result[data_i].zhouwei + '"></td>';
                                        }
                                        var spc = data.result[data_i].spc;
                                        for (var spc_i = 0; spc_i < spc.length; spc_i++) {

                                            tr_val = spc[spc_i].value;
                                            //$(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                                            tr_val_id = spc[spc_i].id;
                                            //$(".spec_" + $(this).attr("data-ids")).find("option:selected").val();

                                            html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
                                        }
										/*
										$(".attr_val").each(function () {
											tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
											tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
											
											html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
										});
										*/
                                        pic_count = nums * price;
                                        html += '<td align="center" class="">' + (price * 1).toFixed(2) + '</td>';
                                        html += '<td align="center" class="">' + pic_count.toFixed(2) + '</td>';
                                        html += '<td align="center"><a href="javascript:;" class="del_td" data-val="' + data_id + '">删除</a></td>';
                                    }
                                    //console.log(data.result[data_i].qiu+"|||"+data.result[data_i].zhu+"|||"+data_id+"|||"+nums);
                                    $("#tr" + data_id).html(html);
                                } else {
                                    $("#tr" + data_id).remove();
                                }
                            }
                            var tr_id = data_id;
                            //obj.attr("data-id");
                            if (nums > 0) {
                                $("#" + tr_id).text(nums);//toFixed(2)
                            }
                            pic_count = parseFloat(shop_price) * parseInt(nums);
                            $("#" + tr_id).parent().find(".picc").text(pic_count.toFixed(2));

                            if (nums == '' || ~~nums <= 0) {
                                $("#" + tr_id).parent(".attr_lists").remove();
                            }
                            update_cart_num();


                            //获取加入购物车参数
                            if (count == 0 || $(".attr_lists").length == 0) {
                                layer.msg("请选择下单商品");
                                return;
                            }
                            $("input[name=shop_price]").val(data.result[data_i].price);
                        }
                        var is_true = false;
                        var i = 0;
                        var munber = new Array();//数量
                        var zhujing = new Array();//柱镜
                        var qiujing = new Array();//球镜
                        var arr_spec = new Array();//属性
                        var arr_attr = new Array();//属性
                        var zhouwei = new Array();//属性
                        var dataid = new Array();//属性
                        $(".attr_lists").each(function () {
                            munber[i] = parseInt($(this).find(".nums").text());
                            if (munber[i] == 0 || isNaN(parseInt(munber[i]))) {
                                is_true = true;
                                return false;
                            }
                            dataid[i] = $(this).find(".nums").attr("id");
                            zhujing[i] = $(this).find(".zhujing").text();
                            qiujing[i] = $(this).find(".qiujing").text();
                            zhouwei[i] = $(this).find(".zhouwei").val();
                            var spec = new Array();//属性
                            var attr = new Array();//属性
                            //var spec = '';
                            //var attr = '';
                            $(this).find(".str_attr").each(function () {
                                //spec += spec ? ','+$(this).find("input").val() : $(this).find("input").val();
                                //attr += attr ? ','+$(this).find("span").html() : $(this).find("span").html();
                                spec.push($(this).find("input").val());
                                attr.push($(this).find("span").html());
                            })
                            arr_attr[i] = attr;
                            arr_spec[i] = spec;
                            i++;
                        });
                        if (is_true) {
                            layer.msg('数量参数错误！');
                            return false;
                        }
                        //属性构建完成
                        var goods = new Object();
                        goods.quick = 1;
                        goods.goods_id = $stateParams.goods_id;//obj.attr("data-id");

                        goods.member = munber;//数量
                        goods.spc = arr_spec;//属性
                        goods.qiujing = qiujing;//球镜
                        goods.zhujing = zhujing;//柱镜
                        goods.zhouwei = zhouwei;//轴位
                        goods.parent = 0;
                        goods.dataid = dataid;
                        goods.carttype = 0;
                        //goods.attr      = arr_attr;

                        $scope.goods = goods;
                    }

                }).error(function (data, staus) {
                    layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
                        location.href = "/default.html";
                    }
                })
        }
        Array.prototype.max = function () {
            return Math.max.apply({}, this)
        }
        Array.prototype.min = function () {
            return Math.min.apply({}, this)
        }
        $scope.getdata();

        var num_s = 1;
        var count = 0;
        var old_num = 0;
        var shop_price = $stateParams.shop_price;
        var count_price = 0;

        var is_zhouwei = $stateParams.zhouwei;

        if ($stateParams.is_promote) {
            var shop_price = $stateParams.shop_price;
        } else {
            //var shop_price={$goods.rank_price};
        }
        var is_prompt = true;
        var top_ = 0;
        var left_ = 0;
        var selDiv = '';
        //判断:当前元素是否是被筛选元素的子元素
        jQuery.fn.isChildOf = function (b) {
            return (this.parents(b).length > 0);
        };
        //判断:当前元素是否是被筛选元素的子元素或者本身
        jQuery.fn.isChildAndSelfOf = function (b) {
            return (this.closest(b).length > 0);
        };

        (function () {
            function myBrowser() {
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                //console.log(navigator);
                console.log(userAgent);
                var isOpera = userAgent.indexOf("Opera") > -1;
                //console.log(isOpera);
                if (isOpera) {
                    return "Opera"
                };//判断是否Opera浏览器
                if (userAgent.indexOf("Firefox") > -1) {
                    return "FF";
                }//判断是否Firefox浏览器
                if (userAgent.indexOf("Chrome") > -1) {
                    return "Chrome";
                }
                if (userAgent.indexOf("Safari") > -1) {
                    return "Safari";
                }//判断是否Safari浏览器
                if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                    return "IE";
                };//判断是否IE浏览器
                if (userAgent.indexOf("Mozilla") > -1) {
                    return "IE";
                };//判断是否IE浏览器
            }
            var mb = myBrowser();
            //去掉浏览器右击默认事件
            //事件会在鼠标按键被按下时发生
            document.getElementsByClassName('bulk-order-table')[0].onmousedown = function (event) {
                var is_batch_table = $(event.target).isChildAndSelfOf(".batch_table");
                var is_zhouwei = $(event.target).isChildAndSelfOf("input[name=zhouwei]");
                // || $("input:focus").hasClass("text_inp")
                if (is_batch_table || is_zhouwei) {
                    return;
                }
                var isSelect = true;
                if (is_prompt == false) {
                    return false;
                }
                var selList = [];
                var fileNodes = document.getElementsByTagName("td");
                for (var i = 0; i < fileNodes.length; i++) {
                    if (fileNodes[i].className.indexOf("bs_bg") != -1) {
                        fileNodes[i].className = "bs_bg";
                        selList.push(fileNodes[i]);
                    }
                }
                //Event 对象代表事件的状态，比如事件在其中发生的元素、键盘按键的状态、鼠标的位置、鼠标按钮的状态。事件通常与函数结合使用，函数不会在事件发生前被执行！
                //无需明确指出参数名 第一个参数是 message。用 arguments[0] 也可以访问这个值，即第一个参数的值（第一个参数位于位置 0，第二个参数位于位置 1，依此类推）。
                var evt = window.event || arguments[0];

                //clientX 返回当事件被触发时，鼠标指针的水平坐标。
                //clientY 返回当事件被触发时，鼠标指针的垂直坐标。
                //IE 属性  x,y 事件发生的位置的 x 坐标和 y 坐标，它们相对于用CSS动态定位的最内层包容元素。
                //var startX = (evt.x || evt.clientX);
                var startX = mb == 'IE' ? evt.clientX : evt.x;
                //var startY = (evt.y || evt.clientY);
                var startY = mb == 'IE' ? evt.clientY : evt.y;
                top_ = document.body.scrollTop || document.documentElement.scrollTop;
                left_ = document.body.scrollLeft || document.documentElement.scrollLeft;
                //var selDiv = document.createElement("div");
                if (selDiv) {
                    document.body.removeChild(selDiv);
                    showSelDiv(selList);
                    selDiv = document.createElement("div");
                } else {
                    selDiv = document.createElement("div");
                }
                selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
                selDiv.id = "selectDiv";
                document.body.appendChild(selDiv);
                selDiv.style.left = startX + left_ + "px";
                selDiv.style.top = startY + top_ + "px";
                var _x = null;
                var _y = null;
                clearEventBubble(evt);
                var table_obj = document.getElementById("table_111");
                ///var table_l = table_obj.offsetLeft, table_t = table_obj.offsetTop;
                var table_l = $("#table_111").offset().left, table_t = $("#table_111").offset().top;
                var table_w = table_obj.offsetWidth, table_h = table_obj.offsetHeight;
                //事件会在鼠标指针移动时发生
                console.log(mb);
                document.onmousemove = function () {
                    evt = window.event || arguments[0];
                    if (isSelect) {
                        var mousemove_top = document.body.scrollTop || document.documentElement.scrollTop;
                        var mousemove_left = document.body.scrollLeft || document.documentElement.scrollLeft;
                        var div_width = 0;
                        var div_height = 0;
                        //_x = (evt.x || evt.clientX);
                        //_y = (evt.y || evt.clientY);
                        _x = mb == 'IE' ? evt.clientX : evt.x;
                        _y = mb == 'IE' ? evt.clientY : evt.y;
                        //console.log(evt,_x,_y);

                        if (mousemove_left > left_) {
                            div_width = Math.abs(_x - (mousemove_left - startX - left_));
                            //selDiv.style.width = Math.abs(_x - (mousemove_left - startX - left_)) + "px";
                        } else {
                            div_width = Math.abs(_x - startX);
                            //selDiv.style.width = Math.abs(_x - startX) + "px";
                        }
                        if (mousemove_top > top_) {
                            div_height = Math.abs(_y + (mousemove_top - startY - top_));
                            //selDiv.style.height = Math.abs(_y + (mousemove_top - startY - top_)) + "px";
                        } else {
                            div_height = Math.abs(_y - startY);
                            //selDiv.style.height = Math.abs(_y - startY) + "px";
                        }
                        if (div_width > 0 || div_height > 0) {
                            selDiv.style.height = div_height + "px";
                            selDiv.style.width = div_width + "px";
                        } else {
                            return false;
                        }
                        if (selDiv.style.display == "none") {
                            selDiv.style.display = "";
                        }
                        //selDiv.style.left = Math.min(_x, startX) + "px";
                        selDiv.style.left = Math.min(Math.abs(_x + left_), Math.abs(startX + left_)) + "px";
                        //selDiv.style.top = Math.abs(startY + top_) + "px";
                        selDiv.style.top = Math.min(Math.abs(_y + top_), Math.abs(startY + top_)) + "px";
                        //selDiv.style.width = Math.abs(_x - startX) + "px";


                        // ---------------- 关键算法 ---------------------
                        var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
                        var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;

                        //offsetTop     此属性可以获取元素的上外缘距离最近采用定位父元素内壁的距离，如果父元素中没有采用定位的，则是获取上外边缘距离文档内壁的距离。所谓的定位就是position属性值为relative、absolute或者fixed。
                        //offsetLeft
                        //offsetHeight   此属性可以获取元素的高度，宽度值包括:元素内容+内边距+边框。不包括外边距和滚动条部分。
                        //offsetWidth   此属性可以返回一个元素的宽度值，值是:元素的内容+内边距。不包括边框、外边距和滚动条部分。

                        for (var i = 0; i < selList.length; i++) {
                            var sl = selList[i].offsetWidth + selList[i].offsetLeft + table_l; // table_w +
                            var st = selList[i].offsetHeight + selList[i].offsetTop + table_t; // table_h +
                            // div 的 left
                            if (sl > _l && st > _t && selList[i].offsetLeft + table_l < _l + _w && selList[i].offsetTop + table_t < _t + _h) {
                                if (selList[i].className.indexOf("seled") == -1 && $(selList[i]).attr("name") != 'desa') {
                                    //selList[i].attr("name")
                                    //改变柱镜显示颜色
                                    //console.log($(selList[i]).index());
                                    $(selList[i]).parents("#table_111").find("tr").eq(0).find("th").eq($(selList[i]).index()).css('background', '#dee9fa');
                                    $(selList[i]).parents("#table_111").find("tr").eq(0).find("th").eq($(selList[i]).index()).css('color', '#dee9fa');
                                    //改变柱镜显示颜色
                                    $(".fist").find("th").eq($(selList[i]).index()).css('background', '#dee9fa');
                                    $(".fist").find("th").eq($(selList[i]).index()).css('color', '#3f69a5');
                                    //改变球镜显示颜色
                                    $(selList[i]).parent().find("td").eq(0).css('background', '#dee9fa');
                                    $(selList[i]).parent().find("td").eq(0).css('color', '#3f69a5');
                                    selList[i].className = selList[i].className + " seled";
                                } else if (selList[i].className.indexOf("seled") > -1) {
                                    //改变柱镜显示颜色
                                    //console.log($(selList[i]).index());
                                    $(selList[i]).parents("#table_111").find("tr").eq(0).find("th").eq($(selList[i]).index()).css('background', '#dee9fa');
                                    $(selList[i]).parents("#table_111").find("tr").eq(0).find("th").eq($(selList[i]).index()).css('color', '#3f69a5');

                                    //改变柱镜显示颜色
                                    $(".fist").find("th").eq($(selList[i]).index()).css('background', '#dee9fa');
                                    $(".fist").find("th").eq($(selList[i]).index()).css('color', '#3f69a5');
                                    //改变球镜显示颜色
                                    $(selList[i]).parent().find("td").eq(0).css('background', '#dee9fa');
                                    $(selList[i]).parent().find("td").eq(0).css('color', '#3f69a5');
                                }
                            } else {
                                if (selList[i].className.indexOf("seled") != -1) {
                                    selList[i].className = "bs_bg";
                                    //
                                    //改变柱镜显示颜色
                                    //console.log($(selList[i]).index());
                                    $(selList[i]).parents("#table_111").find("tr").eq(0).find("th").eq($(selList[i]).index()).css('background', '#f5f5f5');
                                    //改变柱镜显示颜色
                                    $(".fist").find("th").eq($(selList[i]).index()).css('background', '#f5f5f5');
                                    //改变球镜显示颜色
                                    $(selList[i]).parent().find("td").eq(0).css('background', '#f5f5f5');
                                }

								/*
								else if(selList[i].className.indexOf("seled") > -1){
									//改变柱镜显示颜色
									//console.log($(selList[i]).index());
									$(selList[i]).parents("#table_111").find("tr").eq(0).find("th").eq($(selList[i]).index()).css('background', 'red');
									//改变柱镜显示颜色
									$(".fist").find("th").eq($(selList[i]).index()).css('background', 'red');
									//改变球镜显示颜色
									$(selList[i]).parent().find("td").eq(0).css('background', 'red');
								}
								*/
                            }
                        }
                        var arr_td = new Array();
                        var arr_tr = new Array();
                        $(".seled").each(function () {
                            if ($.inArray($(this).index(), arr_td) == -1) {
                                arr_td.push($(this).index());
                            }
                            if ($.inArray($(this).parent("tr").index(), arr_tr) == -1) {
                                arr_tr.push($(this).parent("tr").index());
                            }
                        });
                        //清除样式
                        $("#table_111").find("td").css({ "border-bottom": "", "border-right": "" });
                        $("#table_111").find("th").css({ "border-bottom": "", "border-right": "" });
                        for (var seled_i = 0; seled_i < arr_tr.length; seled_i++) {
                            //第一个tr top
                            if (arr_tr[seled_i] == arr_tr.min()) {
                                //top
                                for (var seled_td_i = 0; seled_td_i < arr_td.length; seled_td_i++) {
                                    if ((arr_tr[seled_i] - 1) == 0) {
                                        $("#table_111").find("tr").eq(arr_tr[seled_i] - 1).find("th").eq(arr_td[seled_td_i]).css("border-bottom", "2px solid #3f69a5");
                                    } else {
                                        $("#table_111").find("tr").eq(arr_tr[seled_i] - 1).find("td").eq(arr_td[seled_td_i]).css("border-bottom", "2px solid #3f69a5");
                                    }
                                }
                            }
                            //最后一个 bottom
                            if (arr_tr[seled_i] == arr_tr.max()) {
                                for (var seled_td_i = 0; seled_td_i < arr_td.length; seled_td_i++) {
                                    $("#table_111").find("tr").eq(arr_tr[seled_i]).find("td").eq(arr_td[seled_td_i]).css("border-bottom", "2px solid #3f69a5");
                                }
                            }

                            //left
                            $("#table_111").find("tr").eq(arr_tr[seled_i]).find("td").eq(arr_td.min() - 1).css("border-right", "2px solid #3f69a5");
                            //right
                            $("#table_111").find("tr").eq(arr_tr[seled_i]).find("td").eq(arr_td.max()).css("border-right", "2px solid #3f69a5");
                        }
                    }
                    clearEventBubble(evt);
                }

                //事件会在鼠标按键被松开时发生。
                document.onmouseup = function () {
                    isSelect = false;
                    if (selDiv) {
                        //selDiv.style.display = "none";
                        if (~~$(selDiv).height() > 0) {
                            document.body.removeChild(selDiv);
                            showSelDiv(selList);
                        }
                    }
                    selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
                }
            }

            $('#table_111 tr td').live("mouseover", function () {
                //console.log('hh');
                //$(this).siblings().eq(0).css('background','#fedede');
                $(this).parent().find("td").eq(0).css('background', '#dee9fa');
                $(this).parent().find("td").eq(0).css('color', '#3f69a5');
                //$(this).parent().siblings().eq(0).children().eq($(this).index()).css('background','#fedede');
                if ($(this).index() > 0) {
                    //$(this).parent().parent().find("tr").eq(0).children().eq($(this).index()).css('background', '#ebebeb');
                    $(this).parents("#table_111").find("tr").eq(0).find("th").eq($(this).index()).css('background', '#dee9fa');
                    $(this).parents("#table_111").find("tr").eq(0).find("th").eq($(this).index()).css('color', '#3f69a5');
                    //$(".fist_td").eq($(this).index()).css('background', '#ebebeb');
                    $(".fist").find("th").eq($(this).index()).css('background', '#dee9fa');
                    $(".fist").find("th").eq($(this).index()).css('color', '#3f69a5');
                }

            });
            $('#table_111 tr td').live("mouseout", function () {
                /*
                //console.log($(this).siblings().eq(0).css('background'));
                $(this).siblings().eq(0).css('background','#f5f5f5');
                $(this).parent().siblings().eq(0).children().eq($(this).index()).css('background','#f5f5f5');
                */
                $(this).parent().find("td").eq(0).css('background', '#f5f5f5');
                $(this).parent().find("td").eq(0).css('color', 'rgb(102, 102, 102)');
                if ($(this).index() > 0) {
                    $(this).parent().parent().children().eq(0).children().eq($(this).index()).css('background', '#f5f5f5');
                    $(this).parent().parent().children().eq(0).children().eq($(this).index()).css('color', 'rgb(102, 102, 102)');
                    $(".fist").find("th").eq($(this).index()).css('background', '#f5f5f5');
                    $(".fist").find("th").eq($(this).index()).css('color', 'rgb(102, 102, 102)');
                }
            });

            function clearEventBubble(evt) {
                if (evt.stopPropagation)
                    evt.stopPropagation();
                else
                    evt.cancelBubble = true;
                if (evt.preventDefault)
                    evt.preventDefault();
                else
                    evt.returnValue = false;
            }

            function showSelDiv(arr) {
                var count = 0;
                var selInfo = "";
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].className.indexOf("seled") != -1) {
                        count++;
                        selInfo += arr[i].innerHTML + "\n";
                    }
                }
                if (count > 300) {
                    $(".seled").removeClass("seled");
                    is_prompt = true;
                    layer.msg("最多选择300种");
                    return false;
                }
                if (count > 0) {
                    is_prompt = false;
                    // //console.log(is_prompt);
                    var layer_index = layer.prompt({
                        title: '共选择' + count + "种,请填写数量", zIndex: 1260, formType: 0, cancel: function (index, layero) {
                            //if(confirm('确定要关闭么')){
                            //只有当点击confirm框的确定时，该层才会关闭
                            $(".seled").removeClass("seled");
                            //清除样式
                            $("#table_111").find("td").css({ "border-bottom": "", "border-right": "" });
                            $("#table_111").find("th").css({ "border-bottom": "", "border-right": "" });
                            $(".f5").css('background', 'rgb(245, 245, 245)');
                            $(".f5").css('color', 'rgb(102, 102, 102)');
                            layer.close(index);
                            is_prompt = true;
                            //}
                            return false;
                        }, btn2: function () {//这里就是你要的
                            $(".seled").removeClass("seled");
                            //清除样式
                            $("#table_111").find("td").css({ "border-bottom": "", "border-right": "" });
                            $("#table_111").find("th").css({ "border-bottom": "", "border-right": "" });
                            $(".f5").css('background', 'rgb(245, 245, 245)');
                            $(".f5").css('color', 'rgb(102, 102, 102)');
                            is_prompt = true;
                        },
                    }, function (text, index) {
                        //if (text > 0) {
                        //$(".seled").html();
                        //layer.closeAll();
                        layer.close(index);
                        layer.close(layer_index);
                        var prompt_cool = layer.load(0, { shade: [0.3, '#fff'], zIndex: 198910121260 });

                        var qiu = new Array();
                        var zhu = new Array();
                        var data_id = new Array();
                        var goodsId = $('.add_to_cart').attr("data-id");
                        var arr_spec = new Array();//属性

                        var arr, reg = new RegExp("(^| )token=([^;]*)(;|$)");
                        arr = document.cookie.match(reg);
                        var token = arr[2];
                        var nums = text;

                        var spec = new Array();//属性
                        $(".attr_val").each(function () {
                            tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                            spec.push(tr_val_id);
                            $scope.trid = tr_val_id;
                        });

                        $(".seled").each(function () {
                            qiu.push($(this).parent().find("td").eq(0).text());
                            zhu.push($(this).data("zhu"));
                            data_id.push($(this).data("id"));
                            //seled_sel($(this), text);

                            if (nums > 0) {
                                $(this).text(nums);
                                $(this).css('background', nums == '' ? "" : '#ebf3fe');
                            } else {
                                $(this).text(' ');
                                $(this).css('background', "");
                            }
                            $(this).removeClass("seled");
                        });
                        $.ajax({
                            url: '' + $rootScope.ip + '/Goods/batch_changeprices',
                            type: "POST",
                            dataType: "json",
                            async: true,
                            data: { 'id': $stateParams.goods_id, 'qiu': qiu, 'zhu': zhu, spc: spec, token: token, data_id: data_id },
                            success: function (data) {
                                for (var data_i = 0; data_i < data.data.length; data_i++) {
                                    var pic_count;
                                    var price = data.data[data_i].price;
                                    var pro_price = data.data[data_i].pro_price;
                                    //$("input[name=shop_price]").val();

                                    var data_id = data.data[data_i].data_id;
                                    if (data.data[data_i].qiu == '' || data.data[data_i].zhu == '' || typeof data.data[data_i].zhu == 'undefined' || typeof data.data[data_i].qiu == 'undefined') {
                                        continue;
                                    }
                                    //obj.attr("data-id");
                                    if ($("#tr" + data_id).length == 0) {
                                        var html = '';
                                        if (nums != '' && nums > 0) {
                                            html = '<tr id="tr' + data_id + '" class="attr_lists" shop_price="' + price + '" pro_price="' + pro_price + '"><td align="center" id="' + data_id + '" class="nums">' + nums + '</td>';
                                            html += '<td align="center" class="qiujing">' + data.data[data_i].qiu + '</td>';
                                            //obj.parent().find("td").eq(0).text()

                                            html += '<td align="center" class="zhujing">' + data.data[data_i].zhu + '</td>';
                                            //obj.attr("data-zhu")
                                            if (is_zhouwei == 1) {
                                                html += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;"></td>';
                                            }
                                            $(".attr_val").each(function () {
                                                tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                                                tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                                                html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
                                            });
                                            pic_count = nums * price;
                                            html += '<td align="center" class="">' + (price * 1).toFixed(2) + '</td>';
                                            html += '<td align="center" class="">' + pic_count.toFixed(2) + '</td>';
                                            html += '<td align="center"><a href="javascript:;" class="del_td" data-val="' + data_id + '">删除</a></td></tr>';
                                        }
                                        $("#order").append(html);
                                    } else if ($("#tr" + data_id).length > 0) {
                                        if (nums > 0) {
                                            var html = '';
                                            if (nums != '') {
                                                html = '<td align="center" id="' + data_id + '" class="nums">' + nums + '</td>';
                                                html += '<td align="center" class="qiujing">' + data.data[data_i].qiu + '</td>';
                                                //obj.parent().find("td").eq(0).text()

                                                html += '<td align="center" class="zhujing">' + data.data[data_i].zhu + '</td>';
                                                //obj.attr("data-zhu")
                                                if (is_zhouwei == 1) {
                                                    html += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;"></td>';
                                                }
                                                $(".attr_val").each(function () {
                                                    tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                                                    tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                                                    html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
                                                });
                                                pic_count = nums * price;
                                                html += '<td align="center" class="">' + (price * 1).toFixed(2) + '</td>';
                                                html += '<td align="center" class="">' + pic_count.toFixed(2) + '</td>';
                                                html += '<td align="center"><a href="javascript:;" class="del_td" data-val="' + data_id + '">删除</a></td>';
                                            }
                                            console.log(data.data[data_i].qiu + "|||" + data.data[data_i].zhu + "|||" + data_id + "|||" + nums);
                                            $("#tr" + data_id).html(html);
                                        } else {
                                            $("#tr" + data_id).remove();
                                        }
                                    }
                                    var tr_id = data_id;
                                    //obj.attr("data-id");
                                    if (nums > 0) {
                                        $("#" + tr_id).text(nums);//toFixed(2)
                                    }
                                    pic_count = parseFloat(shop_price) * parseInt(nums);
                                    $("#" + tr_id).parent().find(".picc").text(pic_count.toFixed(2));

                                    if (nums == '' || ~~nums <= 0) {
                                        $("#" + tr_id).parent(".attr_lists").remove();
                                    }
                                    update_cart_num();


                                    //获取加入购物车参数
                                    if (count == 0 || $(".attr_lists").length == 0) {
                                        layer.msg("请选择下单商品");
                                        return;
                                    }
                                    $("input[name=shop_price]").val(data.data[data_i].price);
                                }
                                var is_true = false;
                                var i = 0;
                                var munber = new Array();//数量
                                var zhujing = new Array();//柱镜
                                var qiujing = new Array();//球镜
                                var arr_spec = new Array();//属性
                                var arr_attr = new Array();//属性
                                var zhouwei = new Array();//属性
                                var dataid = new Array();//属性
                                $(".attr_lists").each(function () {
                                    munber[i] = parseInt($(this).find(".nums").text());
                                    if (munber[i] == 0 || isNaN(parseInt(munber[i]))) {
                                        is_true = true;
                                        return false;
                                    }
                                    dataid[i] = $(this).find(".nums").attr("id");
                                    zhujing[i] = $(this).find(".zhujing").text();
                                    qiujing[i] = $(this).find(".qiujing").text();
                                    zhouwei[i] = $(this).find(".zhouwei").val();
                                    var spec = new Array();//属性
                                    var attr = new Array();//属性
                                    //var spec = '';
                                    //var attr = '';
                                    $(this).find(".str_attr").each(function () {
                                        //spec += spec ? ','+$(this).find("input").val() : $(this).find("input").val();
                                        //attr += attr ? ','+$(this).find("span").html() : $(this).find("span").html();
                                        spec.push($(this).find("input").val());
                                        attr.push($(this).find("span").html());
                                    })
                                    arr_attr[i] = attr;
                                    arr_spec[i] = spec;
                                    i++;
                                });
                                if (is_true && nums > 0) {
                                    layer.msg('数量参数错误！');
                                    layer.close(prompt_cool);
                                    //清除样式
                                    $("#table_111").find("td").css({ "border-bottom": "", "border-right": "" });
                                    $("#table_111").find("th").css({ "border-bottom": "", "border-right": "" });
                                    $(".f5").css('color', 'rgb(102, 102, 102)');
                                    $(".f5").css('background', 'rgb(245, 245, 245)');
                                    return false;
                                }
                                //属性构建完成
                                var goods = new Object();
                                goods.quick = 1;
                                goods.goods_id = $stateParams.goods_id;//obj.attr("data-id");

                                goods.member = munber;//数量
                                goods.spc = arr_spec;//属性
                                goods.qiujing = qiujing;//球镜
                                goods.zhujing = zhujing;//柱镜
                                goods.zhouwei = zhouwei;//轴位
                                goods.parent = 0;
                                goods.dataid = dataid;
                                goods.carttype = 0;
                                //goods.attr      = arr_attr;

                                $scope.goods = goods;

                                //清除样式
                                $("#table_111").find("td").css({ "border-bottom": "", "border-right": "" });
                                $("#table_111").find("th").css({ "border-bottom": "", "border-right": "" });
                                $(".f5").css('color', 'rgb(102, 102, 102)');
                                $(".f5").css('background', 'rgb(245, 245, 245)');

                                layer.close(prompt_cool);
                            }, error: function () {
                                //清除样式
                                $("#table_111").find("td").css({ "border-bottom": "", "border-right": "" });
                                $("#table_111").find("th").css({ "border-bottom": "", "border-right": "" });
                                $(".f5").css('background', 'rgb(245, 245, 245)');
                                $(".f5").css('color', 'rgb(102, 102, 102)');
                                layer.msg("参数错误");
                                layer.close(prompt_cool);
                            }
                        });

                        //push

                        //layer.close(prompt_cool);
                        //}
                        is_prompt = true;
                    });
                }
                $("#selectDiv").remove();
            }


            var domSel = $('.sel'),
                domNum = $('.num'),
                cell = $('#table_111 td'),
                row = $('#table_111 tr'),
                _tmp = {},
                order = $('#order'),
                params = null;
            tpl = '<tr id="tr$ids" class="attr_lists">' +
                '<td align="center" id="$ids" class="nums">$num$</td>' +
                '<td align="center" class="qiujing">$ball$</td>' +
                '<td align="center" class="zhujing">$pillars$</td>';
            if (is_zhouwei == 1) {
                tpl += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;"></td>';
            }
            row.each(function (i) {
                this.setAttribute('index', i);
                $(this).find('td').each(function (i) {
                    this.setAttribute('index', i);
                });
            });

            var selTd = function (start, end, tdis) {
                var minX = start.x, minY = start.y, maxX = end.x, maxY = end.y;
                if (start.x < end.x) {
                    minX = start.x;
                    maxX = end.x;
                } else if (start.x > end.x) {
                    minX = end.x;
                    maxX = start.x;
                }
                if (start.y < end.y) {
                    minY = start.y;
                    maxY = end.y;
                } else if (start.y > end.y) {
                    minY = end.y;
                    maxY = start.y;
                }
                if (parseInt(num_s) == 0 || isNaN(parseInt(num_s))) {
                    return;
                }
                var tr_html = '';
                var tr_val = '';
                $(".attr_val").each(function () {
                    tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                    tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                    tr_html += '<td align="center" class="str_attr"> <input type="hidden" value="' + tr_val_id + '">' + tr_val + '</td>';
                });
                tr_html += '<td align="center" class="picc">$pic$</td>';
                delTd();
                var firstCell = row.first().find('td'), html = [];
                for (var j = minY; j <= maxY; j++) {

                    var tr = row.eq(j), ball = tr.find('td').first().attr('data-val') || '0.00';
                    for (var i = minX; i <= maxX; i++) {
                        var pillars = firstCell.eq(i).attr('data-val') || '0.00';
                        _tmp[j + '-' + i] = $('td', tr).eq(i);
                        var id_dea = $('td', tr).eq(i).attr('name');
                        if (id_dea == 'desa') {
                            return;
                        }
                        //$('td', tr).eq(i).css('background-color', '#aaa').html(domNum.val());
                        $('td', tr).eq(i).css('background-color', '#ffecb6').html(num_s);
                        tdis = $('td', tr).eq(i).attr('data-id');
                        var list_picc = shop_price * num_s;
                        html.push(
                            tpl.replace('$ball$', ball)
                                .replace('$ids', tdis)
                                .replace('$ids', tdis)
                                .replace('$pillars$', pillars)
                                .replace('$num$', num_s) + tr_html.replace('$pic$', list_picc.toFixed(2)) + "<td align='center'><a href='javascript:;' class='del_td' data-val='" + tdis + "'>删除</a></td></tr>"
                        );
                    }
                }
                //alert(html.length);
                //alert(count);
                //html.push(order.html());
                order.html(html.join(''));
                $(".sel").attr("checked", false);
                $('#table_111').off('mousedown', downEvent);
                $(".top_r_p").remove();
                $(".num").val(0);
                //count=html.length*num_s;
                ///count_price+=shop_price * count;
                //$(".count_num").text( html.length*num_s);
                //$(".count_pic").text(count_price);
                update_cart_num();
            }
            var delTd = function () {
                for (var key in _tmp) {
                    var id_dea = _tmp[key].attr('name');
                    if (id_dea == 'desa') {
                        _tmp[key].css('background-color', '#ccc').html('');
                    } else {
                        _tmp[key].css('background-color', '').html('');
                    }
                }
                _tmp = {};
                order.html('');
            }
            var downEvent = function (e) {
                var _this = this;
                delTd();
                if (e.target.className == 'bs_bg') {
                    params = {
                        x: e.target.getAttribute('index') * 1,
                        y: e.target.parentNode.getAttribute('index') * 1
                    }

                    cell.on('mouseenter', enterEvent);
                    $(document).on('mousemove', moveEvent);
                    $(document).on('mouseup', endEvent);
                }
            },
                moveEvent = function (e) {
                    e.preventDefault();
                },
                enterEvent = function (e) {
                    e.preventDefault();
                    if (this.className != 'bs_bg') {
                        return;
                    }

                    var index = {
                        x: e.target.getAttribute('index') * 1,
                        y: e.target.parentNode.getAttribute('index') * 1
                    }
                    var tdis = $(this).attr("data-id");
                    selTd(params, index, tdis);
                    //document.write(tdis);
                },
                endEvent = function (e) {
                    $(cell).off('mouseenter', enterEvent);
                    $(document).off('mousemove', moveEvent);
                    $(document).off('mouseup', endEvent);
                    ajax_change_num_pic();
                    update_cart_num();
                }
            domSel.on('change', function () {
                if (this.checked) {
                    $('#table_111').on('mousedown', downEvent);
                } else {
                    $('#table_111').off('mousedown', downEvent);
                }
            })
        })();
        function ajax_change_num_pic() {
            //alert(123);
        }
        function addToCartResponse(result) {
            if (result.error > 0) {
                // 如果需要缺货登记，跳转
                if (result.error == 2) {
                    layer.alert('对不起，该商品库存不足');
                }
                //没选规格，弹出属性选择框
                else if (result.error == 6) {
                    openSpeDiv(result.message, result.goods_id, result.parent);
                }
                else {
                    layer.alert(result.message);
                }
            }
            else {
                var cartInfo = document.getElementById('ECS_CARTINFO');
                var cart_url = 'flow.php?step=cart';
                if (cartInfo) {
                    cartInfo.innerHTML = result.content;
                }

                if (result.carttype == '1') {
                    location.href = 'flow.php?step=checkout';
                    return;
                }

                if (result.one_step_buy == '1') {
                    location.href = cart_url;
                }
                else {
                    switch (result.confirm_type) {
                        case '1':
                            if (confirm(result.message)) location.href = cart_url;
                            break;
                        case '2':
                            if (!confirm(result.message)) location.href = cart_url;
                            break;
                        case '3':
                            layer.alert('商品信息成功加入购物车！');
                            setTimeout('location.href="batch.php?id=' + result.idx + '"', 2000);
                            //location.href = 'goods.php?id='+result.idx;
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        function update_cart_num() {
            var int_counts = 0;
            var members = 0;
            var picc = 0;
            var pro_picc = 0;
            $(".attr_lists").each(function () {
                members = $(this).find(".nums").text();
                if (isNaN(members) || isNaN(parseInt(members))) {
                    members = 0;
                }
                var shop_price = $(this).attr("shop_price");
                var pro_price = $(this).attr("pro_price");
                picc += parseFloat(shop_price) * parseInt(members);
                pro_picc += parseFloat(pro_price) * parseInt(members);


                //console.log(picc);
                int_counts = parseInt(int_counts) + parseInt(members);
            });
            count = int_counts;
            $(".count_num").text(int_counts);
            $(".count_pic").text(picc.toFixed(2));
            $(".count_pro_pic").text(pro_picc.toFixed(2));
        }

        function seled_sel(obj, nums) {
            //var  nums = $(this).val();
            if (isNaN(parseInt(nums))) {
                nums = '';
            }
            var qiu = obj.parent().find("td").eq(0).text();
            var zhu = obj.attr("data-zhu");
            var goodsId = $('.add_to_cart').attr("data-id");
            var arr_spec = new Array();//属性


            /*$.post("batch.php",{step:"changeprice",id:goodsId,qiu:qiu,zhu:zhu}, function(data){
                $("input[name=shop_price]").val(data.data.price);
            }, 'json');*/

            var spec = new Array();//属性
            $(".attr_val").each(function () {
                tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                spec.push(tr_val_id);
                //console.log(tr_val_id);
                $scope.trid = tr_val_id;
            });

            var arr, reg = new RegExp("(^| )token=([^;]*)(;|$)");
            arr = document.cookie.match(reg);
            var token = arr[2];

            var cool = layer.load(0, { shade: [0.3, '#fff'], zIndex: 198910121260 });


            $.ajax({
                url: '' + $rootScope.ip + '/Goods/batch_changeprice',
                type: "POST",
                dataType: "json",
                async: false,
                data: { 'id': $stateParams.goods_id, 'qiu': qiu, 'zhu': zhu, spc: spec, token: token },
                success: function (data) {
                    layer.close(cool);
                    $("input[name=shop_price]").val(data.data.price);
                    $("input[name=shop_price]").attr("data-pro_price", data.data.pro_price);
                }
            });

            var pic_count;
            var price = $("input[name=shop_price]").val();
            var pro_price = $("input[name=shop_price]").attr("data-pro_price");

            var data_id = obj.attr("data-id");
            if ($("#tr" + data_id).length == 0) {
                var html = '';
                if (nums != '' && nums > 0) {
                    html = '<tr id="tr' + data_id + '" class="attr_lists" shop_price="' + price + '" pro_price="' + pro_price + '"><td align="center" id="' + data_id + '" class="nums">' + nums + '</td>';
                    html += '<td align="center" class="qiujing">' + obj.parent().find("td").eq(0).text() + '</td>';

                    html += '<td align="center" class="zhujing">' + obj.attr("data-zhu") + '</td>';
                    if (is_zhouwei == 1) {
                        html += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;"></td>';
                    }
                    $(".attr_val").each(function () {
                        tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                        tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                        html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
                    });
                    pic_count = nums * price;
                    html += '<td align="center" class="">' + (price * 1).toFixed(2) + '</td>';
                    html += '<td align="center" class="">' + pic_count.toFixed(2) + '</td>';
                    html += '<td align="center"><a href="javascript:;" class="del_td" data-val="' + data_id + '">删除</a></td></tr>';
                }
                $("#order").append(html);
            } else if ($("#tr" + data_id).length > 0) {
                if (nums > 0) {
                    var html = '';
                    if (nums != '') {
                        html = '<td align="center" id="' + data_id + '" class="nums">' + nums + '</td>';
                        html += '<td align="center" class="qiujing">' + obj.parent().find("td").eq(0).text() + '</td>';

                        html += '<td align="center" class="zhujing">' + obj.attr("data-zhu") + '</td>';
                        if (is_zhouwei == 1) {
                            html += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;"></td>';
                        }
                        $(".attr_val").each(function () {
                            tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                            tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                            html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
                        });
                        pic_count = nums * price;
                        html += '<td align="center" class="">' + (price * 1).toFixed(2) + '</td>';
                        html += '<td align="center" class="">' + pic_count.toFixed(2) + '</td>';
                        html += '<td align="center"><a href="javascript:;" class="del_td" data-val="' + data_id + '">删除</a></td>';
                    }
                    $("#tr" + data_id).html(html);
                } else {
                    $("#tr" + data_id).remove();
                }
            }
            var tr_id = obj.attr("data-id");
            if (nums > 0) {
                $("#" + tr_id).text(nums);//toFixed(2)
            }
            pic_count = parseFloat(shop_price) * parseInt(nums);
            $("#" + tr_id).parent().find(".picc").text(pic_count.toFixed(2));

            if (nums > 0) {
                obj.text(nums);
                obj.css('background', nums == '' ? "" : '#ebf3fe');
            } else {
                obj.text(' ');
                obj.css('background', "");
            }
            if (nums == '' || ~~nums <= 0) {
                $("#" + tr_id).parent(".attr_lists").remove();
            }
            update_cart_num();


            //获取加入购物车参数
            if (count == 0 || $(".attr_lists").length == 0) {
                layer.msg("请选择下单商品");
                return;
            }
            var is_true = false;
            var i = 0;
            var munber = new Array();//数量
            var zhujing = new Array();//柱镜
            var qiujing = new Array();//球镜
            var arr_spec = new Array();//属性
            var arr_attr = new Array();//属性
            var zhouwei = new Array();//属性
            var dataid = new Array();//属性
            $(".attr_lists").each(function () {
                munber[i] = parseInt($(this).find(".nums").text());
                if (munber[i] == 0 || isNaN(parseInt(munber[i]))) {
                    is_true = true;
                    return false;
                }
                dataid[i] = $(this).find(".nums").attr("id");
                zhujing[i] = $(this).find(".zhujing").text();
                qiujing[i] = $(this).find(".qiujing").text();
                zhouwei[i] = $(this).find(".zhouwei").val();
                var spec = new Array();//属性
                var attr = new Array();//属性
                //var spec = '';
                //var attr = '';
                $(this).find(".str_attr").each(function () {
                    //spec += spec ? ','+$(this).find("input").val() : $(this).find("input").val();
                    //attr += attr ? ','+$(this).find("span").html() : $(this).find("span").html();
                    spec.push($(this).find("input").val());
                    attr.push($(this).find("span").html());
                })
                arr_attr[i] = attr;
                arr_spec[i] = spec;
                i++;
            });
            if (is_true && nums > 0) {
                layer.msg('数量参数错误！');
                return false;
            }
            //属性构建完成
            var goods = new Object();
            goods.quick = 1;
            goods.goods_id = obj.attr("data-id");

            goods.member = munber;//数量
            goods.spc = arr_spec;//属性
            goods.qiujing = qiujing;//球镜
            goods.zhujing = zhujing;//柱镜
            goods.zhouwei = zhouwei;//轴位
            goods.parent = 0;
            goods.carttype = 0;
            //goods.attr      = arr_attr;

            $scope.goods = goods;

            if ($scope.trid) {
                // $('.bulk-order-ano-table').show();
                //console.log($scope.trid);
            } else {
                // $('.bulk-order-ano-table').hide();
                //console.log($scope.trid);
            }
        }
        $(function () {
            setInterval(function () {
                var is_true = false;
                var i = 0;
                var munber = new Array();//数量
                var zhujing = new Array();//柱镜
                var qiujing = new Array();//球镜
                var arr_spec = new Array();//属性
                var arr_attr = new Array();//属性
                var zhouwei = new Array();//属性
                var dataid = new Array();//属性
                $(".attr_lists").each(function () {
                    munber[i] = parseInt($(this).find(".nums").text());
                    if (munber[i] == 0 || isNaN(parseInt(munber[i]))) {
                        is_true = true;
                        return false;
                    }
                    dataid[i] = $(this).find(".nums").attr("id");
                    zhujing[i] = $(this).find(".zhujing").text();
                    qiujing[i] = $(this).find(".qiujing").text();
                    zhouwei[i] = $(this).find(".zhouwei").val();
                    var spec = new Array();//属性
                    var attr = new Array();//属性
                    //var spec = '';
                    //var attr = '';
                    $(this).find(".str_attr").each(function () {
                        //spec += spec ? ','+$(this).find("input").val() : $(this).find("input").val();
                        //attr += attr ? ','+$(this).find("span").html() : $(this).find("span").html();
                        spec.push($(this).find("input").val());
                        attr.push($(this).find("span").html());
                    })
                    arr_attr[i] = attr;
                    arr_spec[i] = spec;
                    i++;
                });
                //属性构建完成
                var goods = new Object();
                goods.quick = 1;
                goods.goods_id = $(".add_to_cart").attr("data-id");

                goods.member = munber;//数量
                goods.spc = arr_spec;//属性
                goods.qiujing = qiujing;//球镜
                goods.zhujing = zhujing;//柱镜
                goods.zhouwei = zhouwei;//轴位
                goods.dataid = dataid;
                goods.parent = 0;
                goods.carttype = 0;
                //goods.attr      = arr_attr;

                $scope.goods = goods;

                if ($scope.goods) {
                    console.log("setInterval");
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Goods/cache_goods_batch',
                        data: {
                            goods: $scope.goods,
                            goods_id: $stateParams.goods_id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            console.log("cache_goods_batch_success");
                        }).error(function (data) {
                            console.log("cache_goods_batch_error");
                        })
                }
            }, 10000);
            $("#nums").change(function () {
                $("input[name=box]").val($(this).val());
            });
            $(".num").change(function () {
                var index = $(this).val();
                if (parseInt(index) == 0 || isNaN(parseInt(index))) {
                    return;
                }
                num_s = index;
            });
            $(".td_inp td").live("click", function () {
                if ($(this).attr("name") == 'desa' || !$(this).hasClass("bs_bg")) {
                    return;
                }

                var wd = $(this).width();
                var hr = $(this).height();
                $(this).css("width", wd);
                $(this).css("height", hr);
                //var numss = "<input type='text' class='text_inp' style='width:" + (wd - 4) + "px;height:" + (hr - 3) + "px' value=" + $(this).text() + ">";
                var numss = "<input type='text' class='text_inp' style='width:100%;text-align:center;border:none;outline:1px solid #3f69a5;height:" + (hr - 3) + "px' value=" + $(this).text() + ">";
                $(this).html(numss);
                $(this).find("input").focus();
            });

            $(".text_inp").live("blur", function () {
                var nums = $(this).val();
                if (isNaN(parseInt(nums))) {
                    nums = '';
                }
                var qiu = $(this).parent().parent().find("td").eq(0).text();
                var zhu = $(this).parent().attr("data-zhu");
                var goodsId = $('.add_to_cart').attr("data-id");
                var arr_spec = new Array();//属性
                if (qiu == '' || zhu == '' || typeof zhu == 'undefined' || typeof qiu == 'undefined') {
                    return;
                }


                /*$.post("batch.php",{step:"changeprice",id:goodsId,qiu:qiu,zhu:zhu}, function(data){
                    $("input[name=shop_price]").val(data.data.price);
                }, 'json');*/

                var spec = new Array();//属性
                $(".attr_val").each(function () {
                    tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                    spec.push(tr_val_id);
                    //console.log(tr_val_id);
                    $scope.trid = tr_val_id;
                });

                var arr, reg = new RegExp("(^| )token=([^;]*)(;|$)");
                arr = document.cookie.match(reg);
                var token = arr[2];
                $.ajax({
                    url: '' + $rootScope.ip + '/Goods/batch_changeprice',
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: { 'id': $stateParams.goods_id, 'qiu': qiu, 'zhu': zhu, spc: spec, token: token },
                    success: function (data) {
                        //console.log(data);
                        $("input[name=shop_price]").val(data.data.price);
                        $("input[name=shop_price]").attr("pro_price", data.data.pro_price);
                    }
                });

                var pic_count;
                var price = $("input[name=shop_price]").val();
                var pro_price = $("input[name=shop_price]").attr("pro_price");

                var data_id = $(this).parent().attr("data-id");
                if ($("#tr" + data_id).length == 0) {
                    var html = '';
                    if (nums != '' && nums > 0) {
                        html = '<tr id="tr' + data_id + '" class="attr_lists" shop_price="' + price + '" pro_price="' + pro_price + '"><td align="center" id="' + data_id + '" class="nums">' + nums + '</td>';
                        html += '<td align="center" class="qiujing">' + $(this).parent().parent().find("td").eq(0).text() + '</td>';

                        html += '<td align="center" class="zhujing">' + $(this).parent().attr("data-zhu") + '</td>';
                        if (is_zhouwei == 1) {
                            html += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;"></td>';
                        }
                        $(".attr_val").each(function () {
                            tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                            tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                            html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
                        });
                        pic_count = nums * price;
                        html += '<td align="center" class="">' + (price * 1).toFixed(2) + '</td>';
                        html += '<td align="center" class="">' + pic_count.toFixed(2) + '</td>';
                        html += '<td align="center"><a href="javascript:;" class="del_td" data-val="' + data_id + '">删除</a></td></tr>';
                    }
                    $("#order").append(html);
                } else if ($("#tr" + data_id).length > 0) {
                    if (nums > 0) {
                        var html = '';
                        if (nums != '') {
                            html = '<td align="center" id="' + data_id + '" class="nums">' + nums + '</td>';
                            html += '<td align="center" class="qiujing">' + $(this).parent().parent().find("td").eq(0).text() + '</td>';

                            html += '<td align="center" class="zhujing">' + $(this).parent().attr("data-zhu") + '</td>';
                            if (is_zhouwei == 1) {
                                html += '<td align="center"><input type="text" class="zhouwei" style="    width: 31px;"></td>';
                            }
                            $(".attr_val").each(function () {
                                tr_val = $(".spec_" + $(this).attr("data-ids")).find("option:selected").text();
                                tr_val_id = $(".spec_" + $(this).attr("data-ids")).find("option:selected").val();
                                html += '<td align="center" class="str_attr"><input type="hidden" value="' + tr_val_id + '"><span>' + tr_val + '</span></td>';
                            });
                            pic_count = nums * price;
                            html += '<td align="center" class="">' + (price * 1).toFixed(2) + '</td>';
                            html += '<td align="center" class="">' + pic_count.toFixed(2) + '</td>';
                            html += '<td align="center"><a href="javascript:;" class="del_td" data-val="' + data_id + '">删除</a></td>';
                        }
                        $("#tr" + data_id).html(html);
                    } else {
                        $("#tr" + data_id).remove();
                    }
                }
                var tr_id = $(this).parent().attr("data-id");
                if (nums > 0) {
                    $("#" + tr_id).text(nums);//toFixed(2)
                }
                pic_count = parseFloat(shop_price) * parseInt(nums);
                $("#" + tr_id).parent().find(".picc").text(pic_count.toFixed(2));
                if (nums > 0) {
                    $(this).parent().css('background', nums == '' ? "" : '#ebf3fe');
                    $(this).parent().text(nums);
                } else {
                    $(this).parent().css('background', "");
                    $(this).parent().text(" ");
                }

                if (nums == '' || ~~nums <= 0) {
                    $("#" + tr_id).parent(".attr_lists").remove();
                }
                update_cart_num();


                //获取加入购物车参数
                if (count == 0 || $(".attr_lists").length == 0) {
                    //layer.msg("请选择下单商品");
                    //return;
                }
                var is_true = false;
                var i = 0;
                var munber = new Array();//数量
                var zhujing = new Array();//柱镜
                var qiujing = new Array();//球镜
                var arr_spec = new Array();//属性
                var arr_attr = new Array();//属性
                var zhouwei = new Array();//属性
                var dataid = new Array();//属性
                $(".attr_lists").each(function () {
                    munber[i] = parseInt($(this).find(".nums").text());
                    if (munber[i] == 0 || isNaN(parseInt(munber[i]))) {
                        is_true = true;
                        return false;
                    }
                    dataid[i] = $(this).find(".nums").attr("id");
                    zhujing[i] = $(this).find(".zhujing").text();
                    qiujing[i] = $(this).find(".qiujing").text();
                    zhouwei[i] = $(this).find(".zhouwei").val();
                    var spec = new Array();//属性
                    var attr = new Array();//属性
                    //var spec = '';
                    //var attr = '';
                    $(this).find(".str_attr").each(function () {
                        //spec += spec ? ','+$(this).find("input").val() : $(this).find("input").val();
                        //attr += attr ? ','+$(this).find("span").html() : $(this).find("span").html();
                        spec.push($(this).find("input").val());
                        attr.push($(this).find("span").html());
                    })
                    arr_attr[i] = attr;
                    arr_spec[i] = spec;
                    i++;
                });
                if (is_true) {
                    //layer.msg('数量参数错误！');
                    //return false;
                }
                //属性构建完成
                var goods = new Object();
                goods.quick = 1;
                goods.goods_id = $(this).attr("data-id");

                goods.member = munber;//数量
                goods.spc = arr_spec;//属性
                goods.qiujing = qiujing;//球镜
                goods.zhujing = zhujing;//柱镜
                goods.zhouwei = zhouwei;//轴位
                goods.parent = 0;
                goods.carttype = 0;
                //goods.attr      = arr_attr;

                $scope.goods = goods;

                if ($scope.trid) {
                    // $('.bulk-order-ano-table').show();
                    //console.log($scope.trid);
                } else {
                    // $('.bulk-order-ano-table').hide();
                    //console.log($scope.trid);
                }
            });

            if ($scope.trid) {
                // $('.bulk-order-ano-table').show();
                //console.log($scope.trid);
            } else {
                // $('.bulk-order-ano-table').hide();
                //console.log($scope.trid);
            }
            //加入购物车
            //$(".add_to_cart").live("click",function (){
            // //console.log(document.cookie);
            // var arr,reg=new RegExp("(^| )token=([^;]*)(;|$)");
            // arr = document.cookie.match(reg);
            // var token = arr[2];
            // var layer_index=layer.msg('加载中', {icon: 16});
            //
            // $.post("{:U('add_to_cart_spec_jp')}",{goods_id:goods.goods_id , goods:JSON.stringify(goods), t:Math.random(), token : token}, function(data){
            //     layer.close(layer_index);
            //     addToCartResponse(data);
            // }, 'json');
            //});
            $(".text_inp").live("keydown", function () {
                var k_code = event.keyCode;
                console.log(k_code);
                if (k_code == 38 || k_code == 40 || k_code == 39 || k_code == 37) {
                    var w_index = $(this).parent().index();//横向
                    var h_index = $(this).parent().parent().index();//纵向
                    switch (k_code) {
                        case 38:
                            //上
                            h_index -= 1;
                            break;
                        case 40:
                            //下
                            h_index += 1;
                            break;
                        case 39:
                            //右
                            //h_index += 1;
                            w_index += 1;
                            break;
                        case 37:
                            //左
                            //h_index += 1;
                            w_index -= 1;
                            break;
                    }
                    if (w_index == 0) {
                        w_index -= 1;
                    }
                    $("#table_111").find("tr").eq(h_index).find("td").eq(w_index).trigger("click");
                    return false;
                }
            });
            $(".del_td").live("click", function () {
                var ids = $(this).attr("data-val");
                $("td:[name=" + ids + ']').text('').css('background', '');
                $(this).parent().parent().remove();

                var is_true = false;
                var i = 0;
                var munber = new Array();//数量
                var zhujing = new Array();//柱镜
                var qiujing = new Array();//球镜
                var arr_spec = new Array();//属性
                var arr_attr = new Array();//属性
                var zhouwei = new Array();//属性
                var dataid = new Array();//属性
                $(".attr_lists").each(function () {
                    munber[i] = parseInt($(this).find(".nums").text());
                    if (munber[i] == 0 || isNaN(parseInt(munber[i]))) {
                        is_true = true;
                        return false;
                    }
                    dataid[i] = $(this).find(".nums").attr("id");
                    zhujing[i] = $(this).find(".zhujing").text();
                    qiujing[i] = $(this).find(".qiujing").text();
                    zhouwei[i] = $(this).find(".zhouwei").val();
                    var spec = new Array();//属性
                    var attr = new Array();//属性
                    //var spec = '';
                    //var attr = '';
                    $(this).find(".str_attr").each(function () {
                        //spec += spec ? ','+$(this).find("input").val() : $(this).find("input").val();
                        //attr += attr ? ','+$(this).find("span").html() : $(this).find("span").html();
                        spec.push($(this).find("input").val());
                        attr.push($(this).find("span").html());
                    })
                    arr_attr[i] = attr;
                    arr_spec[i] = spec;
                    i++;
                });
                if (is_true) {
                    //layer.msg('数量参数错误！');
                    //return false;
                }
                //属性构建完成
                var goods = new Object();
                goods.quick = 1;
                goods.goods_id = $stateParams.goods_id;

                goods.member = munber;//数量
                goods.spc = arr_spec;//属性
                goods.qiujing = qiujing;//球镜
                goods.zhujing = zhujing;//柱镜
                goods.zhouwei = zhouwei;//轴位
                goods.parent = 0;
                goods.carttype = 0;
                //goods.attr      = arr_attr;

                $scope.goods = goods;

                update_cart_num();
            });
            var wwinH = $(window).height() - 250;
            console.log(wwinH);
            $(window).scroll(function () {
                var tbtop = $('.bulk-order-total').offset().top;
                var index = $(document).scrollTop();
                var height = $("#table_111").height();
                var shep = $('.shep_line').offset().top - 700;
                if (index > 264 && index < (200 + height)) {
                    $(".fist").show();
                } else {
                    $(".fist").hide();
                }

                if (index > shep) {
                    console.log('sha?')
                    $('.bulk-order-total').removeClass('tbfix');
                } else {
                    //console.log(index)
                    //console.log(shep)
                    $('.bulk-order-total').addClass('tbfix');
                }
                //$(".gwc_sum").text(index);
            });
        });
        //加入购物车
        $scope.join = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });

            var is_true = false;
            var i = 0;
            var munber = new Array();//数量
            var zhujing = new Array();//柱镜
            var qiujing = new Array();//球镜
            var arr_spec = new Array();//属性
            var arr_attr = new Array();//属性
            var zhouwei = new Array();//属性
            var dataid = new Array();//属性
            $(".attr_lists").each(function () {
                munber[i] = parseInt($(this).find(".nums").text());
                if (munber[i] == 0 || isNaN(parseInt(munber[i]))) {
                    is_true = true;
                    return false;
                }
                dataid[i] = $(this).find(".nums").attr("id");
                zhujing[i] = $(this).find(".zhujing").text();
                qiujing[i] = $(this).find(".qiujing").text();
                zhouwei[i] = $(this).find(".zhouwei").val();
                var spec = new Array();//属性
                var attr = new Array();//属性
                //var spec = '';
                //var attr = '';
                $(this).find(".str_attr").each(function () {
                    //spec += spec ? ','+$(this).find("input").val() : $(this).find("input").val();
                    //attr += attr ? ','+$(this).find("span").html() : $(this).find("span").html();
                    spec.push($(this).find("input").val());
                    attr.push($(this).find("span").html());
                })
                arr_attr[i] = attr;
                arr_spec[i] = spec;
                i++;
            });
            if (is_true) {
                layer.msg('数量参数错误！');
                return false;
            }
            //属性构建完成
            var goods = new Object();
            goods.quick = 1;
            goods.goods_id = $stateParams.goods_id;

            goods.member = munber;//数量
            goods.spc = arr_spec;//属性
            goods.qiujing = qiujing;//球镜
            goods.zhujing = zhujing;//柱镜
            goods.zhouwei = zhouwei;//轴位
            goods.parent = 0;
            goods.carttype = 0;
            //goods.attr      = arr_attr;

            $scope.goods = goods;

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/add_to_cart_spec_jp',
                data: {
                    goods: $scope.goods,
                    goods_id: $stateParams.goods_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status == -1) {
                        layer.close(cool);
                        layer.msg(data.info);
                    } else if (data.status == 1) {
                        layer.msg(data.info);
                        // $rootScope.$broadcast('upCarList');
                        // $scope.getdata();
                        // $("#order").html('');

                        setTimeout(function () {
                            $http({
                                method: "POST",
                                url: '' + $rootScope.ip + '/Goods/cache_goods_batch',
                                data: {
                                    goods_id: $stateParams.goods_id,
                                    type: 1
                                },
                                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                            })
                                .success(function (data) {
                                    console.log("cache_goods_batch_success");
                                }).error(function (data) {
                                    console.log("cache_goods_batch_error");
                                });
                            layer.close(cool);
                            location.reload()
                        }, 1000);
                    } else if (data.status == 0) {
                        layer.close(cool);
                        layer.msg(data.info);
                    }
                }).error(function (data) {
                    layer.msg('商品球镜柱镜属性不能为空');
                })
        };
        /* 打印单预览按钮 */
        $scope.printPreview = function () {
            if ($scope.goods) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Goods/qz_batch_preview',
                    data: {
                        goods: $scope.goods,
                        goods_id: $stateParams.goods_id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    layer.close(cool);
                    if (data.status) {
                        $scope.printPreviewData = data;
                        $scope.printPreviewHtml = ($sce.trustAsHtml(data.content));

                    }
                })
                /*  window.open($state.href('person-process-print-preview', {
                     params: JSON.stringify({
                         goods: $scope.goods,
                         goods_id: $stateParams.goods_id
                     })
                 }), '_blank'); */
            } else {
                layer.msg("请选择球柱镜");
            }
        }
        /* 预览按钮 */
        $scope.orderPreview = function () {
            if ($scope.goods) {
                $scope.printPreview();
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Goods/batch_preview',
                    data: {
                        goods: $scope.goods,
                        goods_id: $stateParams.goods_id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    layer.close(cool);
                    if (data.status) {
                        $scope.orderPreviewData = data;
                        $scope.orderPreviewHtml = ($sce.trustAsHtml(data.content));
                        /* var js = document.createElement('script');
                        js.src = './plugins/js.js';
                        document.body.append(js) */
                    }
                })
                /* window.open($state.href('person-process-preview', {
                    params: JSON.stringify({
                        goods: $scope.goods,
                        goods_id: $stateParams.goods_id
                    })
                }), '_blank'); */
            } else {
                layer.msg("请选择球柱镜");
            }
        }
    }])
    /* 打印单预览按钮 */
    .controller('person-process-print-preview-control', ['$rootScope', '$http', '$stateParams', 'ipCookie', '$sce', '$scope', function ($rootScope, $http, $stateParams, ipCookie, $sce, $scope) {
        $rootScope.isShow = false;
        $rootScope.change = false;
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Goods/qz_batch_preview',
            data: JSON.parse($stateParams.params),
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            if (data.status) {
                $scope.data = data;
                $scope.html = ($sce.trustAsHtml(data.content));
                var js = document.createElement('script');
                js.src = './plugins/js.js';
                document.body.append(js)
            }
        })
    }])
    /* 预览按钮 */
    .controller('person-process-preview-control', ['$rootScope', '$http', '$stateParams', 'ipCookie', '$sce', '$scope', function ($rootScope, $http, $stateParams, ipCookie, $sce, $scope) {
        $rootScope.isShow = false;
        $rootScope.change = false;
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Goods/batch_preview',
            data: JSON.parse($stateParams.params),
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            if (data.status) {
                $scope.data = data;
                $scope.html = ($sce.trustAsHtml(data.content));
                var js = document.createElement('script');
                js.src = './plugins/js.js';
                document.body.append(js)
            }
        })
    }])
    //购物车
    .controller('shopCar-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$document', '$qimoChat', function ($scope, $rootScope, $http, $state, ipCookie, $document, $qimoChat) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        $scope.$qimoChat = $qimoChat;
        //购物车接口
        $scope.carFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/get_flow_goods',
                data: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    if (data.status) {
                        layer.close(cool);
                        if (data.status) {
                            $scope.data = data;
                            $scope.shopCarData = data;
                            $scope.isSelect = data.total.is_select;
                            $scope.totalPrice = data.total.goods_price;
                            $scope.count = data.total.goods_count;
                            $scope.typeCount = data.total.goods_type_count;
                            $scope.supp = data.total.select_supp_count;
                            $scope.supll = data.total.suppliers_count;
                        }
                    }
                }).error(function (data, staus) {
                    layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
                        location.href = "/default.html";
                    }
                })
        };

        $scope.carFn();

        var flag = true;
        $scope.gowuquanFn = function (event) {
            event.stopPropagation();
            if (flag) {
                angular.element(event.target).next().show();
                flag = false;
            } else {
                angular.element(event.target).next().hide();
                flag = true;
            }
        };

        $('body').click(function () {
            // $scope.$apply(function(){
            //     $scope.gouwuquan = false;
            // })
            flag = true;
            $('.more-youhui-box').hide();
        });


        //领取优惠券
        $scope.lqYhq = function (id) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/send_by_user',
                data: {
                    type_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000, icon: 1 }, function () {
                            $scope.carFn();
                        });
                    } else {
                        layer.msg(data.info, { time: 1000, icon: 2 });
                    }
                })
        };

        //改变购物车商品数量接口
        $scope.cgCarNumber = {
            rec_id: '',
            number: ''
        };
        $scope.changeCarNumber = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/change_num_cart',
                data: $scope.cgCarNumber,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                })
        };
        //监控购物车商品数量
        $scope.change = function (e, goods_properties, carArr) {
            $scope.cgCarNumber.rec_id = carArr.rec_id;
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/change_num_cart',
                data: {
                    rec_id: $scope.cgCarNumber.rec_id,
                    number: carArr.goods_number
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    if (data.status) {
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Flow/get_flow_goods',
                            data: '',
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                if (data.suppliers_goods_list.length == 0) {
                                    $scope.Goods = false;
                                } else {
                                    $scope.Goods = true;
                                }
                                // $rootScope.$broadcast('upCarList');
                                $scope.shopCarData = data;
                                $scope.isSelect = data.total.is_select;
                                $scope.totalPrice = data.total.goods_price;
                            })
                    } else {
                        layer.msg(data.info, { time: 1000, icon: 2 });
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Flow/change_num_cart',
                            data: {
                                rec_id: $scope.cgCarNumber.rec_id,
                                number: data.number
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                if (data.status) {
                                    $http({
                                        method: "POST",
                                        url: '' + $rootScope.ip + '/Flow/get_flow_goods',
                                        data: '',
                                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                                    })
                                        .success(function (data) {
                                            //console.log(data);
                                            if (data.suppliers_goods_list.length == 0) {
                                                $scope.Goods = false;
                                            } else {
                                                $scope.Goods = true;
                                            }
                                            // $rootScope.$broadcast('upCarList');
                                            $scope.shopCarData = data;
                                            $scope.isSelect = data.total.is_select;
                                            $scope.totalPrice = data.total.goods_price;
                                        })
                                }
                            })
                    }
                })
        };

        //购物车商品增加
        $scope.addCarArr = function (e, goods_properties, carArr) {
            $scope.cgCarNumber.rec_id = carArr.rec_id;
            $scope.number = Number(carArr.goods_number);
            if (goods_properties) {
                if (goods_properties.is_main == 1) {
                    $scope.number += Number(goods_properties.number);
                }
            } else {
                $scope.number += 1;
            }

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/change_num_cart',
                data: {
                    rec_id: $scope.cgCarNumber.rec_id,
                    number: $scope.number
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    carArr.goods_number = carArr.goods_number;
                    //console.log(data);
                    if (data.status) {
                        $scope.carFn();
                        // $rootScope.$broadcast('upCarList');
                    } else {
                        layer.msg(data.info, { icon: 2 });
                    }
                })
        };
        //购物车商品减少
        $scope.reduceCarArr = function (e, goods_properties, carArr) {
            $scope.number = Number(carArr.goods_number);

            if (goods_properties) {
                if (goods_properties.is_main == 1) {
                    if ($scope.number > goods_properties.number) {
                        $scope.number -= Number(goods_properties.number);
                    } else {
                        return
                    }
                }
            } else {
                $scope.number -= 1;
            }

            if (carArr.goods_number > 1) {
                $scope.cgCarNumber.rec_id = carArr.rec_id;
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/change_num_cart',
                    data: {
                        rec_id: $scope.cgCarNumber.rec_id,
                        number: $scope.number
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                        // $rootScope.$broadcast('upCarList');
                    })
            } else {
                carArr.goods_number = 1;
            }
        };
        //取消和选中供应商
        $scope.selectStore = function (index) {
            if ($scope.shopCarData.suppliers_goods_list[index].is_select) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/select_change_price',
                    data: {
                        id: $scope.shopCarData.suppliers_goods_list[index].suppliers_id,
                        type: 1,
                        is_select: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                    })
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/select_change_price',
                    data: {
                        id: $scope.shopCarData.suppliers_goods_list[index].suppliers_id,
                        type: 1,
                        is_select: 1
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                    })
            }
        };
        //取消和选中商品
        $scope.selectGoods = function (goods, index) {
            if (goods.is_select) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/select_change_price',
                    data: {
                        id: goods.goods_id,
                        type: 0,
                        is_select: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                    })
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/select_change_price',
                    data: {
                        id: goods.goods_id,
                        type: 0,
                        is_select: 1
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                    })
            }
        };
        //取消和选中商品属性
        $scope.changeAttrCheck = function (goods, rid) {
            if (goods.is_select) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/change_product_num',
                    data: {
                        rec_id: rid,
                        type: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                    })
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/change_product_num',
                    data: {
                        rec_id: rid,
                        type: 1
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                    })
            }
        };
        //全选商品
        $scope.changeAllCheck = function () {
            if ($scope.shopCarData.total.is_select) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/select_change_price',
                    data: {
                        type: 2,
                        is_select: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                    })
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/select_change_price',
                    data: {
                        type: 2,
                        is_select: 1
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.carFn();
                    })
            }
        };
        //删除购物车里全选的商品
        $scope.delAll = function () {
            // layer.confirm('您确定要删除么？', {
            //     btn: ['确定','取消'] //按钮
            // }, function(){

            //商品ID数组
            var shopIds = [];
            var goodsIds = [];
            var attrIds = [];
            for (var i = 0, item1 = $scope.shopCarData.suppliers_goods_list; i < item1.length; i++) {//店铺列表
                if (item1[i].is_select) {
                    shopIds.push(item1[i].suppliers_id);
                }
                for (var n = 0, item2 = item1[i].goods_list; n < item2.length; n++) {//商品列表
                    if (item2[n].is_select) {
                        goodsIds.push(item2[n].goods_id);
                    }
                    for (var g = 0, item3 = item2[n].attrs; g < item3.length; g++) {//商品属性列表
                        if (item3[g].is_select) {
                            attrIds.push(item3[g].rec_id);
                        }
                    }
                }
            }
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/drop_cart_goods_select',
                data: {
                    goods_ids: goodsIds,
                    rec_id: attrIds
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg('删除成功', { time: 1000, icon: 1 }, function () {
                            $scope.carFn();
                        });
                        $rootScope.$broadcast('upCarList');
                    } else {
                        layer.msg('删除失败', { time: 1000, icon: 2 });
                    }
                })

            // },function(){
            //     layer.msg('点完这个可就全没了，在考虑考虑吧~', {
            //         time: 2000, //2s后自动关闭
            //     });
            // });
        };
        //删除购物车单独一行商品
        $scope.delSingle = function (index, pIndex) {
            // layer.confirm('您确定要删除么？', {
            //     btn: ['确定','取消'] //按钮
            // }, function(){

            $scope.carIdArr = {
                goods_ids: []
            };
            $scope.carIdArr.goods_ids.push($scope.shopCarData.suppliers_goods_list[pIndex].goods_list[index].goods_id);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/drop_cart_goods_select',
                data: $scope.carIdArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg('删除成功', { time: 1000, icon: 1 }, function () {
                            $scope.carFn();
                        });
                        $rootScope.$broadcast('upCarList');
                    } else {
                        layer.msg('删除失败', { time: 1000, icon: 2 });
                    }
                })

            // }, function(){
            //     layer.msg('在考虑考虑吧~', {
            //         time: 2000, //2s后自动关闭
            //     });
            // });
        };
        //关注购物车单独一行商品
        $scope.scSingle = function (index, pIndex) {
            // layer.confirm('您确定要收藏么？', {
            //     btn: ['确定','取消'] //按钮
            // }, function(){

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/get_goods_collect',
                data: {
                    goods_id: $scope.shopCarData.suppliers_goods_list[pIndex].goods_list[index].goods_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000, icon: 1 });
                        //$scope.carFn();
                    } else {
                        layer.msg(data.info, { time: 1000, icon: 2 });
                    }
                })

            // }, function(){
            //     layer.msg('在考虑考虑吧~', {
            //         time: 2000, //2s后自动关闭
            //     });
            // });
        };
        //删除购物车单独属性的一行商品
        $scope.delAttrGoods = function (index, pIndex, ppIndex) {
            // layer.confirm('您确定要删除么？', {
            //     btn: ['确定','取消'] //按钮
            // }, function(){

            $scope.attrId = $scope.shopCarData.suppliers_goods_list[ppIndex].goods_list[pIndex].attrs[index].rec_id;
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/drop_cart_goods_select',
                data: {
                    rec_id: $scope.attrId
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg('删除成功', { time: 1000, icon: 1 }, function () {
                            $scope.carFn();
                        });
                        $rootScope.$broadcast('upCarList');
                    } else {
                        layer.msg('删除失败', { time: 1000, icon: 2 });
                    }
                })

            // },function(){
            //     layer.msg('在考虑考虑吧~', {
            //         time: 2000, //2s后自动关闭
            //     });
            // });
        };
        //去结算页时删除未选中的商品
        //商品ID数组
        $scope.carIdArr = {
            goods_ids: []
        };
        $scope.goJiesuan = function () {

            for (var i = 0; i < $scope.shopCarData.suppliers_goods_list.length; i++) {
                for (var j = 0; j < $scope.shopCarData.suppliers_goods_list[i].goods_list.length; j++) {
                    if ($scope.shopCarData.suppliers_goods_list[i].goods_list[j].is_select == 0) {
                        $scope.carIdArr.goods_ids.push($scope.shopCarData.suppliers_goods_list[i].goods_list[j].goods_id);
                    }
                }
            }
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/del_no_shop',
                data: $scope.carIdArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        $state.go('shop-jiesuan');
                        $rootScope.$broadcast('upCarList');
                    } else {
                        layer.msg(data.info);
                    }
                })
        };
        //控制更多促销盒子的显隐
        var moreCx = true;
        $scope.moreCuXiao = function (e) {
            if (moreCx) {
                angular.element(e.target).next().show()
                moreCx = false;
            } else {
                angular.element(e.target).next().hide();
                moreCx = true;
            }
        };
        $scope.closeMoreCuxiao = function (e) {
            moreCx = true;
            angular.element(e.target).parent().parent().hide();
        };
        //jq控制促销盒子里的空心select按钮的样式
        $('.kongxin').click(function (e) {
            $('.kongxin').removeClass('dian');
            $(e.target).addClass('dian');
        });
        //控制购物车里item的修改按钮的样式改动
        var xgs = true;
        $scope.xiugaiFn = function (e) {
            if (xgs) {
                xgs = false;
                angular.element(e.target).parent().addClass('bor').css({
                    background: '#fafafa'
                });
                angular.element(e.target).css({
                    backgroundImage: 'url(img/tuichu.png)',
                    border: '1px solid #ff3333',
                    color: '#ff3333'
                }).html('退出');
                angular.element(e.target).parent().find('.wenb').hide();
                angular.element(e.target).parent().find('.text-value').show();
                angular.element(e.target).parent().find('.check-li-del').show();
            } else {
                xgs = true;
                angular.element(e.target).parent().removeClass('bor').css({
                    background: '#fff'
                });
                angular.element(e.target).css({
                    backgroundImage: 'url(img/qianbi.png)',
                    border: '1px solid #e6e6e6',
                    color: '#808080'
                }).html('修改');
                angular.element(e.target).parent().find('.wenb').show();
                angular.element(e.target).parent().find('.text-value').hide();
                angular.element(e.target).parent().find('.check-li-del').hide();
            }
        };
        //控制更多优惠券的显隐
        $scope.gouwuquan = false;


        //搜索
        $scope.searchKey = function () {

            var newOpens = window.open();
            //console.log($scope.carkeywords);
            var url = $state.href('shop-list', {
                keywords: $scope.carkeywords,
                random: Math.random()
            })

            setTimeout(function () {
                newOpens.location = url;
            }, 200)

        };
    }])
    //购物车结算页
    .controller('shopJiesuan-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', function ($scope, $rootScope, $http, $state, ipCookie) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        // $scope.returnCar = function(){
        //   $state.go('shop-car');
        // };
        /* —————————————— 保存用户备注信息 —————————————— */
        $scope.getNotes = function () {
            var commentArr = [];
            var suppliers = [];
            var label = [];

            for (var i in $scope.jiesuanData.suppliers_notes) {
                commentArr.push($scope.jiesuanData.suppliers_notes[i])
            }
            for (var i = 0; i < $scope.jiesuanData.cart_goods_list.length; i++) {
                var sArr = []
                suppliers.push($scope.jiesuanData.cart_goods_list[i].suppliers_id);
                for (var j = 0; j < $scope.jiesuanData.cart_goods_list[i].order_label.length; j++) {
                    if ($scope.jiesuanData.cart_goods_list[i].order_label[j].selected) {
                        sArr.push(j)
                    }
                }
                label.push(sArr)
            }
            return {
                note: commentArr,
                suppliers: suppliers,
                label: label
            }
        }
        $scope.saveNotes = function () {

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/write_notes',
                data: {
                    notes: $scope.getNotes()
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
        }
        //结算页所有信息接口数据
        $scope.jiesuanFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/checkout',
                data: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    layer.close(cool);
                    if (data.status) {
                        $scope.jiesuanData = data;
                        $scope.totalPrice = $scope.jiesuanData.total.formated_goods_price;
                        $scope.total = $scope.jiesuanData.total.amount_formated;
                        $scope.totalShip = $scope.jiesuanData.total.suppliers_shipping_fee_formated;
                        $scope.shipIf = $scope.jiesuanData.total.shipping_fee;
                        $scope.jifen = $scope.jiesuanData.total.will_get_give_rank_integral;
                        $scope.subsidyPrice = data.total.formated_subsidy_price;
                        $scope.sub = Number(data.total.formated_subsidy_price);
                        $scope.yhqTotal = data.total.bonus_formated;
                        $scope.yhqIf = data.total.bonus;
                        $scope.yhqNum = data.total.bonus_nums;
                        $scope.yeTotal = data.total.surplus_formated;
                        $scope.yeIf = data.total.surplus;
                        $scope.exchange_integral = data.total.exchange_integral;
                        //判断商品是否为积分商品
                        $scope.isExchange = data.is_exchange;

                        /* 选中的收货方式 */
                        if (data.consignee_list.length == 0) {
                            $scope.defaultShipping = null;
                        } else {
                            for (var i = 0; i < data.consignee_list.length; i++) {
                                if (data.consignee_list[i].is_show == 1 && data.consignee_list[i].selected == 1) {
                                    $scope.defaultShipping = data.consignee_list[i]
                                }
                            }
                        }
                        //个人信息面板信息
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/User/user_info',
                            data: '',
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                $scope.payPoints = data.user_info.pay_points;
                            })
                    } else {
                        layer.msg('购物车没有商品');
                        $state.go('shop-car');
                    }
                }).error(function (data, staus) {
                    layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
                        location.href = "/default.html";
                    }
                })
        };
        $scope.jiesuanFn();
        //切换收货信息样式
        $scope.setMor = function (e) {
            angular.element(e.target).parent().parent().addClass('pur_close_don').siblings().removeClass('pur_close_don');
        };
        //选择收货人信息
        $scope.selectAddress = function (id) {
            $scope.flag = !$scope.flag;
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/change_consignee',
                data: {
                    address_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //收货人信息同步
        $rootScope.$on('uploadAddress', function () {
            $scope.jiesuanFn();
        });
        //设置默认地址
        $scope.setMor = function (id) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/default_address',
                params: {
                    address_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        $scope.setMoren = function (mor) {
            if (mor == true) {
                $scope.editData.default = 1;
            } else {
                $scope.editData.default = 0;
            }
        };
        //编辑收货地址
        $scope.bianji = function (id, index, address) {
            $('.masks').show();
            $('.pur_bianji').show();
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/edit_address',
                params: {
                    address_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    $scope.bianjiData = data;

                    //编辑收货地址参数
                    $scope.editData = {
                        address_id: address.address_id,
                        consignee: address.consignee,
                        province: address.province,
                        city: address.city,
                        district: address.district,
                        address: address.address,
                        mobile: address.mobile,
                        default: address.is_default,
                        tel: address.tel
                    };
                })
        };
        //编辑提交收货地址
        $scope.enterAddress = function (e, province_id, city_id, dis_id, index) {
            //console.log($scope.editData);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/edit_address',
                data: $scope.editData,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 }, function () {
                            $scope.jiesuanFn();
                            $('.masks').hide();
                            $('.pur_bianji').hide();
                        });
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //编辑取消按钮
        $scope.quxiao = function () {
            $('.masks').hide();
            $('.pur_bianji').hide();
            $('.pur_zengjia').hide();
        };
        //编辑里省切换
        $scope.changeProvince = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 2,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.bianjiData.city_list = data.data;
                    $scope.disDatas = [];
                    $scope.changeCity(pid);
                    $scope.editData.city = $scope.editData.district = '';
                })
        };
        //编辑市切换
        $scope.changeCity = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 3,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.disDatas = data;
                    $scope.bianjiData.district_list = data.data;
                })
        };
        $scope.addSetMoren = function (mor) {
            if (mor == true) {
                $scope.eeditData.default = 1;
                //console.log($scope.eeditData);
            } else {
                $scope.eeditData.default = 0;
                //console.log($scope.eeditData);
            }
        };
        //添加收货地址
        $scope.tianjia = function () {
            $('.masks').show();
            $('.pur_zengjia').show();
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/add_address',
                params: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.tianjiaData = data;

                    //添加收货地址参数
                    $scope.eeditData = {
                        default: ''
                    };
                    $scope.isMor = 1;
                })
        };
        //提交添加收货地址
        $scope.tianjiaAddress = function () {
            $scope.eeditData.default = $scope.isMor ? 1 : 0;
            //console.log($scope.eeditData);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/add_address',
                data: $scope.eeditData,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 }, function () {
                            $('.masks').hide();
                            $('.pur_zengjia').hide();
                            $scope.jiesuanFn();
                            $scope.selectAddress(data.address_id);
                        });
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //添加里省切换
        $scope.selectProvince = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 2,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.cityData = data;
                    $scope.disData = [];
                    $scope.selectCity(pid);
                    $scope.eeditData.city = $scope.eeditData.district = '';
                })
        };
        //添加市切换
        $scope.selectCity = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 3,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.disData = data;
                })
        };
        //删除一个收货地址
        $scope.deleteAddress = function (id) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/del_address',
                params: {
                    address_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //选择支付方式
        $scope.selectPay = function (id) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/select_payment',
                data: {
                    pay_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //选择配送方式
        $scope.selectShip = function (storeId, id) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/select_shippin_suppliers',
                data: {
                    suppliers_id: storeId,
                    shipping: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //使用优惠券
        $scope.useYhq = function (sid, bid) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Flow/suppliers_bouns',
                data: {
                    suppliers_id: sid,
                    bonus_id: bid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //兑换优惠卷
        $scope.getYhqByCode = function (code, event) {

            event.target.style.pointerEvents = 'none';
            event.target.style.opacity = '.7';

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Frezz/validate_bonus',
                data: {
                    bonus_sn: code
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    event.target.style.pointerEvents = 'auto';
                    event.target.style.opacity = '1';
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        }
        //个人信息面板信息
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/user_info',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.userMoney = data.user_info.user_money;
            })

        //是否使用余额支付
        $scope.isMoney = function () {
            if (!$scope.is_money) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/change_surplus',
                    data: {
                        surplus: 1
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            $scope.jiesuanFn();
                        }
                    })
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/change_surplus',
                    data: {
                        surplus: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            $scope.jiesuanFn();
                        }
                    })
            }
        };

        $scope.submitList = function (e, index) {

            // console.log(commentArr,suppliers,label);
            // return false;

            if ($scope.yeIf) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/check_pay_pass',
                    data: {
                        password: $scope.pass
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            $http({
                                method: "POST",
                                url: '' + $rootScope.ip + '/Flow/done',
                                data: {
                                    notes: $scope.getNotes()
                                },
                                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                            })
                                .success(function (data) {
                                    //console.log(data);
                                    // if(data.status&&$scope.jiesuanData.is_exchange==0){
                                    //     layer.msg(data.info);
                                    //     $rootScope.$broadcast('upCarList');
                                    //     $state.go('paymentNew',{
                                    //         order_id:data.order_id,
                                    //         type:'order'
                                    //     });
                                    // }
                                    // else if(data.status&&$scope.jiesuanData.is_exchange==1){
                                    //     layer.msg(data.info, {
                                    //         icon: 1,
                                    //         shade: 0.3,
                                    //         time:2000
                                    //     },function() {
                                    //         $state.go('order-all');
                                    //     })
                                    // }
                                    if (data.status) {
                                        layer.msg(data.info, { time: 1000 });
                                        $rootScope.$broadcast('upCarList');
                                        $state.go('paymentNew', {
                                            order_id: data.order_id,
                                            type: 'order'
                                        });
                                    } else {
                                        layer.msg(data.info, { time: 1000 });
                                    }
                                })
                        } else {
                            layer.msg(data.info, { icon: 2, time: 500 });
                        }
                    })
            } else {

                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/done',
                    data: {
                        notes: $scope.getNotes()
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        // if(data.status&&$scope.jiesuanData.is_exchange==0){
                        //     layer.msg(data.info);
                        //     $rootScope.$broadcast('upCarList');
                        //     $state.go('paymentNew',{
                        //         order_id:data.order_id,
                        //         type:'order'
                        //     });
                        // }
                        // else if(data.status&&$scope.jiesuanData.is_exchange==1){
                        //     layer.msg(data.info, {
                        //         icon: 1,
                        //         shade: 0.3,
                        //         time:2000
                        //     },function() {
                        //         $state.go('order-all');
                        //     })
                        // }
                        if (data.status) {
                            layer.msg(data.info, { time: 1000 });
                            //$rootScope.$broadcast('upCarList');
                            $state.go('paymentNew', {
                                order_id: data.order_id,
                                type: 'order'
                            });
                        } else {
                            layer.msg(data.info, { time: 1000 });
                        }
                    })
            }
        };


        $(".i-text").focus(function () {
            $(".sixDigitPassword").find("i").eq(0).addClass("active");
            $(".guangbiao").css({ left: 0, opacity: 1 });
        })
        $(".i-text").blur(function () {
            $(".sixDigitPassword").find("i").removeClass("active");
            $(".guangbiao").css({ opacity: 0 });
        })

        $(".i-text").keyup(function () {
            var inp_v = $(this).val();
            var inp_l = inp_v.length;
            //$("p").html( "input的值为：" + inp_v +"; " + "值的长度为:" + inp_l);//测试用

            for (var x = 0; x <= 6; x++) {
                // $("p").html( inp_l );//测试

                $(".sixDigitPassword").find("i").eq(inp_l).addClass("active").siblings("i").removeClass("active");
                $(".sixDigitPassword").find("i").eq(inp_l).prevAll("i").find("b").css({ "display": "block" });
                $(".sixDigitPassword").find("i").eq(inp_l - 1).nextAll("i").find("b").css({ "display": "none" });

                $(".guangbiao").css({ "left": inp_l * 41 });//光标位置

                if (inp_l == 0) {
                    $(".sixDigitPassword").find("i").eq(0).addClass("active").siblings("i").removeClass("active");
                    $(".sixDigitPassword").find("b").css({ "display": "none" });
                    $(".guangbiao").css({ "left": 0 });
                }
                else if (inp_l == 6) {
                    $(".sixDigitPassword").find("b").css({ "display": "block" });
                    $(".sixDigitPassword").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
                    $(".guangbiao").css({ "left": 5 * 41 });
                }


            }
        });

    }])
    /* 定制片结算页 */
    .controller('shopJiesuanCopy-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        // $scope.returnCar = function(){
        //   $state.go('shop-car');
        // };
        $scope.sn = $stateParams.sn;

        /* —————————————— 保存商家备注信息 —————————————— */

        $scope.saveNotes = function () {
            var label = [];
            for (var j = 0, item = $scope.jiesuanData.order_label; j < item.length; j++) {
                if (item[j].is_select) {
                    label.push(j);
                }
            }
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Frezz/write_notes',
                data: {
                    postscript: $scope.jiesuanData.postscript || null,
                    label: label,
                    order_id: $scope.jiesuanData.order.order_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
        }
        /* —————————————— 结算页所有信息接口数据 —————————————— */
        $scope.jiesuanFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "get",
                url: $rootScope.ip + '/Frezz/checkout',
                params: { sn: $scope.sn },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    layer.close(cool);
                    if (data.status) {
                        $scope.jiesuanData = data;
                        $scope.totalPrice = data.total.formated_goods_price;
                        $scope.total = data.total.amount_formated;
                        $scope.totalShip = data.total.suppliers_shipping_fee_formated;
                        $scope.shipIf = data.total.shipping_fee;
                        $scope.jifen = data.total.will_get_give_rank_integral;
                        $scope.subsidyPrice = data.total.formated_subsidy_price;
                        $scope.sub = Number(data.total.formated_subsidy_price);
                        $scope.yhqTotal = data.total.bonus_formated;
                        $scope.yhqIf = data.total.bonus;
                        $scope.yhqNum = data.total.bonus_nums;
                        $scope.yeTotal = data.total.surplus_formated;
                        $scope.yeIf = data.total.surplus;
                        $scope.exchange_integral = data.total.exchange_integral;
                        //判断商品是否为积分商品
                        $scope.isExchange = data.is_exchange;
                        /* 选中的收货方式 */
                        if (data.consignee_list.length == 0) {
                            $scope.defaultShipping = null;
                        } else {
                            for (var i = 0; i < data.consignee_list.length; i++) {
                                if (data.consignee_list[i].is_show == 1 && data.consignee_list[i].selected == 1) {
                                    $scope.defaultShipping = data.consignee_list[i]
                                }
                            }
                        }
                        console.log($scope.defaultShipping)
                        //个人信息面板信息
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/User/user_info',
                            data: '',
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                $scope.payPoints = data.user_info.pay_points;
                            })
                    } else {
                        $state.go('shop-car');
                    }
                }).error(function (data, staus) {
                    layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
                        location.href = "/default.html";
                    }
                })
        };
        $scope.jiesuanFn();
        //切换收货信息样式
        $scope.setMor = function (e) {
            angular.element(e.target).parent().parent().addClass('pur_close_don').siblings().removeClass('pur_close_don');
        };
        //选择收货人信息
        $scope.selectAddress = function (id) {
            $scope.flag = !$scope.flag;
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Frezz/post_change_consignee',
                data: {
                    address_id: id,
                    order_id: $scope.jiesuanData.order.order_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //收货人信息同步
        $rootScope.$on('uploadAddress', function () {
            $scope.jiesuanFn();
        });
        //设置默认地址
        $scope.setMor = function (id) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/default_address',
                params: {
                    address_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 }, function () {
                            $scope.jiesuanFn();
                        });
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        $scope.setMoren = function (mor) {
            if (mor == true) {
                $scope.editData.default = 1;
            } else {
                $scope.editData.default = 0;
            }
        };
        //编辑收货地址
        $scope.bianji = function (id, index, address) {
            $('.masks').show();
            $('.pur_bianji').show();
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/edit_address',
                params: {
                    address_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    $scope.bianjiData = data;

                    //编辑收货地址参数
                    $scope.editData = {
                        address_id: address.address_id,
                        consignee: address.consignee,
                        province: address.province,
                        city: address.city,
                        district: address.district,
                        address: address.address,
                        mobile: address.mobile,
                        default: address.is_default,
                        tel: address.tel
                    };
                })
        };
        //编辑提交收货地址
        $scope.enterAddress = function (e, province_id, city_id, dis_id, index) {
            //console.log($scope.editData);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/edit_address',
                data: $scope.editData,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 }, function () {
                            $scope.jiesuanFn();
                            $('.masks').hide();
                            $('.pur_bianji').hide();
                        });
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //编辑取消按钮
        $scope.quxiao = function () {
            $('.masks').hide();
            $('.pur_bianji').hide();
            $('.pur_zengjia').hide();
        };
        //编辑里省切换
        $scope.changeProvince = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 2,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.bianjiData.city_list = data.data;
                    $scope.disDatas = [];
                    $scope.changeCity(pid);
                    $scope.editData.city = $scope.editData.district = '';
                })
        };
        //编辑市切换
        $scope.changeCity = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 3,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.disDatas = data;
                    $scope.bianjiData.district_list = data.data;
                })
        };
        $scope.addSetMoren = function (mor) {
            if (mor == true) {
                $scope.eeditData.default = 1;
                //console.log($scope.eeditData);
            } else {
                $scope.eeditData.default = 0;
                //console.log($scope.eeditData);
            }
        };
        //添加收货地址
        $scope.tianjia = function () {
            $('.masks').show();
            $('.pur_zengjia').show();
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/add_address',
                params: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.tianjiaData = data;

                    //添加收货地址参数
                    $scope.eeditData = {
                        default: ''
                    };
                    $scope.isMor = 1;
                })
        };
        //提交添加收货地址
        $scope.tianjiaAddress = function () {
            $scope.eeditData.default = $scope.isMor ? 1 : 0;
            //console.log($scope.eeditData);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/add_address',
                data: $scope.eeditData,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 }, function () {
                            $('.masks').hide();
                            $('.pur_zengjia').hide();
                            $scope.jiesuanFn();
                            $scope.selectAddress(data.address_id);
                        });
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //添加里省切换
        $scope.selectProvince = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 2,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.cityData = data;
                    $scope.disData = [];
                    $scope.selectCity(pid);
                    $scope.eeditData.city = $scope.eeditData.district = '';
                })
        };
        //添加市切换
        $scope.selectCity = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 3,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.disData = data;
                })
        };
        //删除一个收货地址
        $scope.deleteAddress = function (id) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/del_address',
                params: {
                    address_id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };
        //选择支付方式
        $scope.selectPay = function (id) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Frezz/select_payment',
                data: {
                    payment: id,
                    order_id: $scope.jiesuanData.order.order_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        };

        //使用优惠券
        $scope.useYhq = function (item, event) {
            function suppliers_bouns(type) {
                event.target.style.pointerEvents = 'none';
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Frezz/select_bonus',
                    data: {
                        order_id: $scope.jiesuanData.order.order_id,
                        bonus_id: item.bonus_id,
                        type: type
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        event.target.style.pointerEvents = 'auto';
                        if (data.status) {
                            layer.msg(data.info, { time: 1000 });
                            $scope.jiesuanFn();
                        } else {
                            layer.msg(data.info, { time: 1000 });
                        }
                    })
            }
            if (item.selected) {
                suppliers_bouns(1)
            } else {
                suppliers_bouns(0)
            }
        };
        //兑换优惠卷
        $scope.getYhqByCode = function (code, event) {

            event.target.style.pointerEvents = 'none';
            event.target.style.opacity = '.7';

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Frezz/validate_bonus',
                data: {
                    order_id: $scope.jiesuanData.order.order_id,
                    bonus_sn: code
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    event.target.style.pointerEvents = 'auto';
                    event.target.style.opacity = '1';
                    if (data.status) {
                        layer.msg(data.info, { time: 1000 });
                        $scope.jiesuanFn();
                    } else {
                        layer.msg(data.info, { time: 1000 });
                    }
                })
        }
        //个人信息面板信息
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/user_info',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.userMoney = data.user_info.user_money;
            })

        //是否使用余额支付
        $scope.isMoney = function () {
            if (!$scope.is_money) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/change_surplus',
                    data: {
                        surplus: 1
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            $scope.jiesuanFn();
                        }
                    })
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/change_surplus',
                    data: {
                        surplus: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            $scope.jiesuanFn();
                        }
                    })
            }
        };
        $scope.submitList = function (e, index) {
            var label = [];
            for (var j = 0, item = $scope.jiesuanData.order_label; j < item.length; j++) {
                if (item[j].is_select) {
                    label.push(j);
                }
            }
            if ($scope.yeIf) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/check_pay_pass',
                    data: {
                        password: $scope.pass
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            $http({
                                method: "POST",
                                url: '' + $rootScope.ip + '/Frezz/done',
                                data: {
                                    postscript: $scope.jiesuanData.postscript || null,
                                    label: label,
                                    order_id: $scope.jiesuanData.order.order_id
                                },
                                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                            })
                                .success(function (data) {
                                    //console.log(data);
                                    // if(data.status&&$scope.jiesuanData.is_exchange==0){
                                    //     layer.msg(data.info);
                                    //     $rootScope.$broadcast('upCarList');
                                    //     $state.go('paymentNew',{
                                    //         order_id:data.order_id,
                                    //         type:'order'
                                    //     });
                                    // }
                                    // else if(data.status&&$scope.jiesuanData.is_exchange==1){
                                    //     layer.msg(data.info, {
                                    //         icon: 1,
                                    //         shade: 0.3,
                                    //         time:2000
                                    //     },function() {
                                    //         $state.go('order-all');
                                    //     })
                                    // }
                                    if (data.status) {
                                        layer.msg(data.info, { time: 1000 });
                                        $rootScope.$broadcast('upCarList');
                                        $state.go('paymentNew', {
                                            order_id: data.order_id,
                                            type: 'order'
                                        });
                                    } else {
                                        layer.msg(data.info, { time: 1000 });
                                    }
                                })
                        } else {
                            layer.msg(data.info, { icon: 2, time: 500 });
                        }
                    })
            } else {

                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Frezz/done',
                    data: {
                        postscript: $scope.jiesuanData.postscript || null,
                        label: label,
                        order_id: $scope.jiesuanData.order.order_id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        // if(data.status&&$scope.jiesuanData.is_exchange==0){
                        //     layer.msg(data.info);
                        //     $rootScope.$broadcast('upCarList');
                        //     $state.go('paymentNew',{
                        //         order_id:data.order_id,
                        //         type:'order'
                        //     });
                        // }
                        // else if(data.status&&$scope.jiesuanData.is_exchange==1){
                        //     layer.msg(data.info, {
                        //         icon: 1,
                        //         shade: 0.3,
                        //         time:2000
                        //     },function() {
                        //         $state.go('order-all');
                        //     })
                        // }
                        if (data.status) {
                            layer.msg(data.info, { time: 1000 });
                            //$rootScope.$broadcast('upCarList');
                            $state.go('paymentNew', {
                                order_id: data.order_id,
                                type: 'order'
                            });
                        } else {
                            layer.msg(data.info, { time: 1000 });
                        }
                    })
            }
        };


        $(".i-text").focus(function () {
            $(".sixDigitPassword").find("i").eq(0).addClass("active");
            $(".guangbiao").css({ left: 0, opacity: 1 });
        })
        $(".i-text").blur(function () {
            $(".sixDigitPassword").find("i").removeClass("active");
            $(".guangbiao").css({ opacity: 0 });
        })

        $(".i-text").keyup(function () {
            var inp_v = $(this).val();
            var inp_l = inp_v.length;
            //$("p").html( "input的值为：" + inp_v +"; " + "值的长度为:" + inp_l);//测试用

            for (var x = 0; x <= 6; x++) {
                // $("p").html( inp_l );//测试

                $(".sixDigitPassword").find("i").eq(inp_l).addClass("active").siblings("i").removeClass("active");
                $(".sixDigitPassword").find("i").eq(inp_l).prevAll("i").find("b").css({ "display": "block" });
                $(".sixDigitPassword").find("i").eq(inp_l - 1).nextAll("i").find("b").css({ "display": "none" });

                $(".guangbiao").css({ "left": inp_l * 41 });//光标位置

                if (inp_l == 0) {
                    $(".sixDigitPassword").find("i").eq(0).addClass("active").siblings("i").removeClass("active");
                    $(".sixDigitPassword").find("b").css({ "display": "none" });
                    $(".guangbiao").css({ "left": 0 });
                }
                else if (inp_l == 6) {
                    $(".sixDigitPassword").find("b").css({ "display": "block" });
                    $(".sixDigitPassword").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
                    $(".guangbiao").css({ "left": 5 * 41 });
                }


            }
        });

    }])
    //购物车支付页
    .controller('payment-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        //获取支付code
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/pay',
            data: {
                order_id: $stateParams.order_id,
                log_id: $stateParams.log_id,
                type: $stateParams.type
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.codeData = data;
                $scope.isPay = data.is_pay;
                $scope.type = data.type;
                if (data.is_pay == 1) {
                    $('#masks').show();
                    $('.payToLj').show();
                    //监控订单
                    $scope.checkList = function () {
                        // $http({
                        //     method:"POST",
                        //     url:''+$rootScope.ip+'/Flow/pay_code',
                        //     data:{
                        //         code:$scope.codeData.alipay
                        //     },
                        //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                        // })
                        //     .success(function(data) {
                        //         //console.log(data);
                        //         if(data.status){
                        //             $http({
                        //                 method:"GET",
                        //                 url:''+$rootScope.ip+'/Flow/check_order_pay',
                        //                 params:{
                        //                     id:data.order_no
                        //                 },
                        //                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                        //             })
                        //                 .success(function(data) {
                        //                     //console.log(data);
                        //                     if(data.status){
                        //                         layer.msg(data.info, {
                        //                             icon: 1,
                        //                             shade: 0.3,
                        //                             time:2000
                        //                         },function() {
                        //                             $state.go('home');
                        //                         })
                        //                     }else{
                        //                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
                        //                     }
                        //                 })
                        //         }else{
                        //             layer.msg(data.info);
                        //         }
                        //     })
                        $http({
                            method: "GET",
                            url: '' + $rootScope.ip + '/Flow/check_order_pay',
                            params: {
                                id: $scope.codeData.id
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                if (data.status) {
                                    layer.msg(data.info, {
                                        icon: 1,
                                        shade: 0.3,
                                        time: 2000
                                    }, function () {
                                        $state.go('home');
                                    })
                                } else {
                                    layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                                }
                            })
                    };

                    //去来镜加工页面
                    $scope.goMachining = function () {
                        // $http({
                        //     method:"POST",
                        //     url:''+$rootScope.ip+'/Flow/pay_code',
                        //     data:{
                        //         code:$scope.codeData.alipay
                        //     },
                        //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                        // })
                        //     .success(function(data) {
                        //         //console.log(data);
                        //         if(data.status){
                        //             $http({
                        //                 method:"GET",
                        //                 url:''+$rootScope.ip+'/Flow/check_order_pay',
                        //                 params:{
                        //                     id:data.order_no
                        //                 },
                        //                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                        //             })
                        //                 .success(function(data) {
                        //                     //console.log(data);
                        //                     if(data.status){
                        //                         layer.msg(data.info,{icon:1});
                        //                         var url = $state.href('glassMachining',{
                        //                             order_id:$stateParams.order_id
                        //                         });
                        //                         window.open(url,'_blank');
                        //                     }else{
                        //                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
                        //                     }
                        //                 })
                        //         }else{
                        //             layer.msg(data.info);
                        //         }
                        //     })
                        var newGlass = window.open();
                        $http({
                            method: "GET",
                            url: '' + $rootScope.ip + '/Flow/check_order_pay',
                            params: {
                                id: $scope.codeData.id
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                if (data.status) {
                                    layer.msg(data.info, { icon: 1 });
                                    var url = $state.href('glassMachining', {
                                        order_id: $stateParams.order_id
                                    });
                                    newGlass.location.href = url;
                                } else {
                                    layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                                }
                            })
                    };
                }
                $scope.payPrice = data.amout;
                $scope.aliPayCode = data.alipay;
                if (data.status) {
                    //layer.msg(data.info);
                } else {
                    layer.msg(data.info);
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

        //去支付
        $scope.pay = function () {
            $('#masks').show();
            $('.payToLj').show();
            if ($('.zfs-pic').eq(0).hasClass('on')) {
                var url = $state.href('alipay', {
                    url: $scope.codeData.alipay
                });
                window.open(url, '_blank');

                //监控订单
                $scope.checkList = function () {
                    // $http({
                    //     method:"POST",
                    //     url:''+$rootScope.ip+'/Flow/pay_code',
                    //     data:{
                    //         code:$scope.codeData.alipay
                    //     },
                    //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                    // })
                    //     .success(function(data) {
                    //         //console.log(data);
                    //         if(data.status){
                    //             $http({
                    //                 method:"GET",
                    //                 url:''+$rootScope.ip+'/Flow/check_order_pay',
                    //                 params:{
                    //                     id:data.order_no
                    //                 },
                    //                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                    //             })
                    //                 .success(function(data) {
                    //                     //console.log(data);
                    //                     if(data.status){
                    //                         layer.msg(data.info, {
                    //                             icon: 1,
                    //                             shade: 0.3,
                    //                             time:2000
                    //                         },function() {
                    //                             $state.go('home');
                    //                         })
                    //                     }else{
                    //                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
                    //                     }
                    //                 })
                    //         }else{
                    //             layer.msg(data.info);
                    //         }
                    //     })
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Flow/check_order_pay',
                        params: {
                            id: $scope.codeData.id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                layer.msg(data.info, {
                                    icon: 1,
                                    shade: 0.3,
                                    time: 2000
                                }, function () {
                                    $state.go('home');
                                })
                            } else {
                                layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                            }
                        })
                };

                //去来镜加工页面
                $scope.goMachining = function () {
                    // $http({
                    //     method:"POST",
                    //     url:''+$rootScope.ip+'/Flow/pay_code',
                    //     data:{
                    //         code:$scope.codeData.alipay
                    //     },
                    //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                    // })
                    //     .success(function(data) {
                    //         //console.log(data);
                    //         if(data.status){
                    //             $http({
                    //                 method:"GET",
                    //                 url:''+$rootScope.ip+'/Flow/check_order_pay',
                    //                 params:{
                    //                     id:data.order_no
                    //                 },
                    //                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                    //             })
                    //                 .success(function(data) {
                    //                     //console.log(data);
                    //                     if(data.status){
                    //                         layer.msg(data.info,{icon:1});
                    //                         var url = $state.href('glassMachining',{
                    //                             order_id:$stateParams.order_id
                    //                         });
                    //                         window.open(url,'_blank');
                    //                     }else{
                    //                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
                    //                     }
                    //                 })
                    //         }else{
                    //             layer.msg(data.info);
                    //         }
                    //     })
                    var newGlass = window.open();
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Flow/check_order_pay',
                        params: {
                            id: $scope.codeData.id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                layer.msg(data.info, { icon: 1 });
                                var url = $state.href('glassMachining', {
                                    order_id: $stateParams.order_id
                                });
                                newGlass.location.href = url;
                            } else {
                                layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                            }
                        })
                };

            } else if ($('.zfs-pic').eq(1).hasClass('on')) {
                //console.log(1);
                var newTab = window.open();
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/pay_code',
                    data: {
                        code: $scope.codeData.weixin
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg('玩命加载中', {
                                icon: 16,
                                shade: 0.3,
                                time: 200
                            }, function () {
                                var url = $state.href('erweima', {
                                    url: data.wx_url,
                                    id: data.order_no
                                });
                                newTab.location.href = url;
                                //window.open(url,'_blank');
                            })
                        } else {
                            layer.msg(data.info);
                        }
                        // if(data.status){
                        //     layer.msg('玩命加载中', {
                        //         icon: 16
                        //         ,shade: 0.3
                        //     },function(){
                        //         pingpp.createPayment(data.pingxx, function(result, err) {
                        //             //console.log(result, err);
                        //             if (result == "success") {
                        //                 // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                        //             } else if (result == "fail") {
                        //                 // charge 不正确或者微信公众账号支付失败时会在此处返回
                        //             } else if (result == "cancel") {
                        //                 // 微信公众账号支付取消支付
                        //             }
                        //         });
                        //     });
                        // }
                    })

                //监控订单
                $scope.checkList = function () {
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Flow/check_order_pay',
                        params: {
                            id: $scope.codeData.id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                layer.msg(data.info, {
                                    icon: 1,
                                    shade: 0.3,
                                    time: 2000
                                }, function () {
                                    $state.go('home');
                                })
                            } else {
                                layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                            }
                        })
                };

                //去来镜加工页面
                $scope.goMachining = function () {

                    var newGlass = window.open();
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Flow/check_order_pay',
                        params: {
                            id: $scope.codeData.id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                layer.msg(data.info, { icon: 1 });
                                var url = $state.href('glassMachining', {
                                    order_id: $stateParams.order_id
                                });
                                newGlass.location.href = url;
                            } else {
                                layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                            }
                        })
                };

            } else if ($('.zfs-pic').eq(2).hasClass('on')) {
                var url = $state.href('unionPay', {
                    url: $scope.codeData.upacp
                });
                window.open(url, '_blank');

                //监控订单
                $scope.checkList = function () {
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Flow/check_order_pay',
                        params: {
                            id: $scope.codeData.id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                layer.msg(data.info, {
                                    icon: 1,
                                    shade: 0.3,
                                    time: 2000
                                }, function () {
                                    $state.go('home');
                                })
                            } else {
                                layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                            }
                        })
                };


                //去来镜加工页面
                $scope.goMachining = function () {
                    var newGlass = window.open();
                    $http({
                        method: "GET",
                        url: '' + $rootScope.ip + '/Flow/check_order_pay',
                        params: {
                            id: $scope.codeData.id
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                layer.msg(data.info, { icon: 1 });
                                var url = $state.href('glassMachining', {
                                    order_id: $stateParams.order_id
                                });
                            } else {
                                layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                            }
                        })
                };
                // $http({
                //     method:"POST",
                //     url:''+$rootScope.ip+'/Flow/pay_code',
                //     data:{
                //         code:$scope.codeData.upacp
                //     },
                //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                // })
                // .success(function(data) {
                //     //console.log(data);
                //     if(data.status){
                //         layer.msg('玩命加载中', {
                //             icon: 16
                //             ,shade: 0.3
                //         },function(){
                //             pingpp.createPayment(data.pingxx, function(result, err) {
                //                 //console.log(result, err);
                //                 if (result == "success") {
                //                     // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                //                 } else if (result == "fail") {
                //                     // charge 不正确或者微信公众账号支付失败时会在此处返回
                //                 } else if (result == "cancel") {
                //                     // 微信公众账号支付取消支付
                //                 }
                //             });
                //         });
                //     }
                // })
            }
        };


        //判断是否能来镜加工
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/is_machining_goods',
            data: {
                order_id: $stateParams.order_id
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.is_glass = data.order_id;
            })
    }])
    //购物车支付页-new
    .controller('paymentNew-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', '$window', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams, $window) {
        $rootScope.isShow = false;
        $rootScope.change = true;


        //个人信息面板信息
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/user_info',
            data: '',
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.userMoney = data.user_info.user_money;
                $scope.payPass = data.user_info.is_pay_pass;
            })
        //获取支付code
        var cool = layer.load(0, { shade: [0.3, '#fff'] });
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/pay',
            data: {
                order_id: $stateParams.order_id,
                log_id: $stateParams.log_id,
                type: $stateParams.type
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $rootScope.$broadcast('upCarList');
                $scope.codeData = data;
                $scope.isPay = data.is_pay;
                $scope.type = data.type;
                $scope.balance = data.balance;
                $scope.password = data.password;

                if (data.status == 0) {
                    $state.go('home');
                }
                if (data.is_pay == 1) {
                    $('#masks').show();
                    $('.payToLj').show();
                    //监控订单
                    $scope.checkList = function () {
                        $http({
                            method: "GET",
                            url: '' + $rootScope.ip + '/Flow/check_order_pay',
                            params: {
                                id: $scope.codeData.id
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                if (data.status) {
                                    layer.msg(data.info, {
                                        icon: 1,
                                        shade: 0.3,
                                        time: 2000
                                    }, function () {
                                        $state.go('order-all');
                                    })
                                } else {
                                    layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                                }
                            })
                    };

                    //去来镜加工页面
                    $scope.goMachining = function () {
                        var newGlass = window.open();
                        $http({
                            method: "GET",
                            url: '' + $rootScope.ip + '/Flow/check_order_pay',
                            params: {
                                id: $scope.codeData.id
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                //console.log(data);
                                if (data.status) {
                                    layer.msg(data.info, { icon: 1 });
                                    var url = $state.href('glassMachining', {
                                        order_id: $stateParams.order_id
                                    });
                                    newGlass.location.href = url;
                                } else {
                                    layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                                }
                            })
                    };
                }
                $scope.payPrice = data.amout;
                $scope.aliPayCode = data.alipay;
                if (data.status) {
                    //layer.msg(data.info);
                    layer.close(cool);
                } else {
                    layer.msg(data.info);
                }
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        $(".i-text").focus(function () {
            $(".sixDigitPassword").find("i").eq(0).addClass("active");
            $(".guangbiao").css({ left: 0, opacity: 1 });
        })
        $(".i-text").blur(function () {
            $(".sixDigitPassword").find("i").removeClass("active");
            $(".guangbiao").css({ opacity: 0 });
        })

        $(".i-text").keyup(function () {
            var inp_v = $(this).val();
            var inp_l = inp_v.length;
            //$("p").html( "input的值为：" + inp_v +"; " + "值的长度为:" + inp_l);//测试用

            for (var x = 0; x <= 6; x++) {
                // $("p").html( inp_l );//测试

                $(".sixDigitPassword").find("i").eq(inp_l).addClass("active").siblings("i").removeClass("active");
                $(".sixDigitPassword").find("i").eq(inp_l).prevAll("i").find("b").css({ "display": "block" });
                $(".sixDigitPassword").find("i").eq(inp_l - 1).nextAll("i").find("b").css({ "display": "none" });

                $(".guangbiao").css({ "left": inp_l * 41 });//光标位置

                if (inp_l == 0) {
                    $(".sixDigitPassword").find("i").eq(0).addClass("active").siblings("i").removeClass("active");
                    $(".sixDigitPassword").find("b").css({ "display": "none" });
                    $(".guangbiao").css({ "left": 0 });
                }
                else if (inp_l == 6) {
                    $(".sixDigitPassword").find("b").css({ "display": "block" });
                    $(".sixDigitPassword").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
                    $(".guangbiao").css({ "left": 5 * 41 });
                }


            }
        });


        $scope.showShadow = function () {
            $('#masks').show();
            $('.payToLj').show();
            //判断是否能来镜加工
            var is_machining_goods_timer = setInterval(function () {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/is_machining_goods',
                    data: {
                        order_id: $stateParams.order_id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        $scope.is_glass = data.order_id;
                        if (data.order_id < 0 || data.status < 0) {
                            clearInterval(is_machining_goods_timer)
                        }
                    })
            }, 1500)
            //监控订单
            $scope.checkList = function () {
                $http({
                    method: "GET",
                    url: '' + $rootScope.ip + '/Flow/check_order_pay',
                    params: {
                        id: $scope.codeData.id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg(data.info, {
                                icon: 1,
                                shade: 0.3,
                                time: 2000
                            }, function () {
                                $state.go('order-all');
                            })
                        } else {
                            layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                        }
                    })
            };

            $scope.machCheckList = function () {
                $http({
                    method: "GET",
                    url: '' + $rootScope.ip + '/Flow/check_order_pay',
                    params: {
                        id: $scope.codeData.id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg(data.info, {
                                icon: 1,
                                shade: 0.3,
                                time: 2000
                            }, function () {
                                $state.go('person-process');
                            })
                        } else {
                            layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                        }
                    })
            };

            //去来镜加工页面
            $scope.goMachining = function () {
                var newGlass = window.open();
                $http({
                    method: "GET",
                    url: '' + $rootScope.ip + '/Flow/check_order_pay',
                    params: {
                        id: $scope.codeData.id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg(data.info, { icon: 1 });
                            var url = $state.href('glassMachining', {
                                order_id: $stateParams.order_id
                            });
                            newGlass.location.href = url;
                        } else {
                            layer.msg('支付还未完成，请勿关闭窗口', { icon: 2 });
                        }
                    })
            };
        };



        //去支付
        $scope.pass = '';
        $scope.passyes = '';
        $scope.yzPass = function (pass) {
            //console.log($scope.password);
            if ($scope.codeData.pay_salt != '' && $scope.codeData.pay_salt != null) {
                //console.log($.md5($.md5(pass) + $scope.codeData.pay_salt));
                if ($.md5($.md5(pass) + $scope.codeData.pay_salt) == $scope.password) {
                    $scope.passyes = true;
                } else {
                    $scope.passyes = false;
                }
            } else {
                //console.log($.md5(pass));
                if ($.md5(pass) == $scope.password) {
                    $scope.passyes = true;
                } else {
                    $scope.passyes = false;
                }
            }
        };

        // function windowopen(url) {
        //     var ele = document.createElement('a');
        //     ele.setAttribute('href', url);
        //     ele.setAttribute('style', 'display:none');
        //     ele.setAttribute('target', '_blank');
        //     document.body.appendChild(ele);
        //     ele.click();
        //     ele.parentNode.removeChild(ele);
        // }


        $scope.pay = function () {
            //console.log($scope.balance);

            if ((!$scope.yuE) && !$scope.paymentType) {
                layer.msg('请至少选择一种支付方式');
                return
            }

            // $scope.$on('passNo',function(){
            //     $scope.passyes=false;
            // })
            // $scope.$on('passYes',function(){
            //     $scope.passyes=true;
            // })


            // var url = $state.href('yue',{
            //     url:$scope.codeData.yuepay
            // });
            // setTimeout(function(){
            //     if($scope.sss){
            //         //windowopen(url)
            //         window.open(url,'_blank');
            //     }
            // },3000)

            if ($scope.yuE) {

                if ($scope.pass == '') {
                    //console.log(1)
                } else if ($scope.pass != '' && $scope.passyes == true) {
                    //console.log(2)
                    var newOpens = window.open();
                } else {
                    //console.log(3);
                    //var newOpens = window.open();
                }

                //先验证支付密码
                //new Promise(function(relove,reject){
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/check_pay_pass',
                    async: false,
                    data: {
                        password: $scope.pass
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            //$scope.$broadcast('passYes');
                            //$scope.passyes=true;
                            if ($scope.balance == 1) {
                                //使用余额
                                //$scope.sss = true;
                                var url = $state.href('yue', {
                                    url: $scope.codeData.yuepay,
                                    type: $scope.codeData.type,
                                    laijingId: $stateParams.order_id
                                });
                                //relove(url)
                                setTimeout(function () {
                                    newOpens.location = url;
                                }, 200)
                                $scope.showShadow();

                            } else {
                                //console.log('组合');
                                //使用组合支付

                                //z直接调插件传pingXX
                                if ($('.lostPay .close_check').attr("checked")) {

                                    var url = $state.href('yue', {
                                        url: $scope.codeData.yuepay,
                                        type: $scope.codeData.type
                                    });
                                    setTimeout(function () {
                                        newOpens.location = url;
                                    }, 200)
                                    $scope.showShadow();
                                }
                                if ($('.onlinePay .close_check').eq(0).attr("checked")) {

                                    var url = $state.href('alipayNew', {
                                        url: $scope.codeData.alipay,
                                        type: $scope.codeData.type
                                    });
                                    setTimeout(function () {
                                        newOpens.location = url;
                                    }, 200)
                                    $scope.showShadow();


                                } else if ($('.onlinePay .close_check').eq(1).attr("checked")) {
                                    //console.log('wx');


                                    var url = $state.href('erweimaNew', {
                                        url: $scope.codeData.weixin,
                                        type: $scope.codeData.type,
                                        id: $scope.codeData.id
                                    });
                                    setTimeout(function () {
                                        newOpens.location = url;
                                    }, 200)
                                    $scope.showShadow();


                                } else if ($('.onlinePay .close_check').eq(2).attr("checked")) {
                                    var url = $state.href('unionPayNew', {
                                        url: $scope.codeData.upacp,
                                        type: $scope.codeData.type
                                    });
                                    setTimeout(function () {
                                        newOpens.location = url;
                                    }, 200)
                                    $scope.showShadow();
                                }
                            }

                        } else {
                            //$scope.passyes=false;
                            //$scope.$broadcast('passNo');
                            layer.msg(data.info);
                            return false;
                        }
                    })
                // }).then(function(url){
                //     //console.log(url)
                //     window.open(url)
                // })




            } else {
                var newOpen = window.open();

                //z直接调插件传pingXX
                if ($('.onlinePay .close_check').eq(0).attr("checked")) {

                    var url = $state.href('alipay', {
                        url: $scope.codeData.alipay,
                        type: $scope.codeData.type
                    });
                    setTimeout(function () {
                        newOpen.location = url;
                    }, 200)
                    $scope.showShadow();


                } else if ($('.onlinePay .close_check').eq(1).attr("checked")) {
                    //console.log('wx');
                    //console.log($stateParams.log_id);

                    var url = $state.href('erweima', {
                        url: $scope.codeData.weixin,
                        id: $scope.codeData.id,
                        type: $scope.codeData.type
                    });
                    setTimeout(function () {
                        newOpen.location = url;
                    }, 200)
                    $scope.showShadow();


                } else if ($('.onlinePay .close_check').eq(2).attr("checked")) {
                    var url = $state.href('unionPay', {
                        url: $scope.codeData.upacp,
                        type: $scope.codeData.type
                    });
                    setTimeout(function () {
                        newOpen.location = url;
                    }, 200)
                    $scope.showShadow();
                }
            }



        };


        // if($scope.pass!=''&&($('.lostPay .close_check').attr("checked")||$('.onlinePay .close_check').eq(0).attr("checked")||$('.onlinePay .close_check').eq(1).attr("checked")||$('.onlinePay .close_check').eq(2).attr("checked"))){
        //
        //     var newOpen = window.open();
        //
        //     $http({
        //         method:"POST",
        //         url:''+$rootScope.ip+'/Flow/check_pay_pass',
        //         data:{
        //             password:$scope.pass
        //         },
        //         headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //     })
        //         .success(function(data) {
        //             //console.log(data);
        //
        //
        //             if(data.status){
        //
        //                 //var newOpen = window.open();
        //
        //                 if($('.lostPay .close_check').attr("checked")&&$scope.balance==1){
        //
        //                     var url = $state.href('yue',{
        //                         url:$scope.codeData.yuepay
        //                     });
        //                     newOpen.location.href=url;
        //
        //
        //                     //console.log('余额选中');
        //                     $('#masks').show();
        //                     $('.payToLj').show();
        //
        //                     //监控订单
        //                     $scope.checkList = function(){
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info, {
        //                                         icon: 1,
        //                                         shade: 0.3,
        //                                         time:2000
        //                                     },function() {
        //                                         $state.go('order-all');
        //                                     })
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //
        //                     //去来镜加工页面
        //                     $scope.goMachining = function(){
        //                         var newGlass=window.open();
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info,{icon:1});
        //                                     var url = $state.href('glassMachining',{
        //                                         order_id:$stateParams.order_id
        //                                     });
        //                                     newGlass.location.href=url;
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //                 }else if($('.lostPay .close_check').attr("checked")&&$scope.balance==0){
        //
        //                     var url = $state.href('yue',{
        //                         url:$scope.codeData.yuepay
        //                     });
        //                     newOpen.location.href=url;
        //
        //
        //                     //console.log('余额选中');
        //                     $('#masks').show();
        //                     $('.payToLj').show();
        //
        //                     //监控订单
        //                     $scope.checkList = function(){
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info, {
        //                                         icon: 1,
        //                                         shade: 0.3,
        //                                         time:2000
        //                                     },function() {
        //                                         $state.go('order-all');
        //                                     })
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //
        //                     //去来镜加工页面
        //                     $scope.goMachining = function(){
        //                         var newGlass=window.open();
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info,{icon:1});
        //                                     var url = $state.href('glassMachining',{
        //                                         order_id:$stateParams.order_id
        //                                     });
        //                                     newGlass.location.href=url;
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //                 }else if($('.lostPay .close_check').attr("checked")&&$scope.balance==2){
        //
        //                     var url = $state.href('yue',{
        //                         url:$scope.codeData.yuepay
        //                     });
        //                     newOpen.location.href=url;
        //
        //
        //                     //console.log('余额选中');
        //                     $('#masks').show();
        //                     $('.payToLj').show();
        //
        //                     //监控订单
        //                     $scope.checkList = function(){
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info, {
        //                                         icon: 1,
        //                                         shade: 0.3,
        //                                         time:2000
        //                                     },function() {
        //                                         $state.go('order-all');
        //                                     })
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //
        //                     //去来镜加工页面
        //                     $scope.goMachining = function(){
        //                         var newGlass=window.open();
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info,{icon:1});
        //                                     var url = $state.href('glassMachining',{
        //                                         order_id:$stateParams.order_id
        //                                     });
        //                                     newGlass.location.href=url;
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //                 }else if($('.onlinePay .close_check').eq(0).attr("checked")&&$scope.balance==0){
        //
        //                     var url = $state.href('alipayNew',{
        //                         url:$scope.codeData.alipay
        //                     });
        //                     newOpen.location.href=url;
        //
        //                     //监控订单
        //                     $scope.checkList = function(){
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info, {
        //                                         icon: 1,
        //                                         shade: 0.3,
        //                                         time:2000
        //                                     },function() {
        //                                         $state.go('order-all');
        //                                     })
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //
        //                     //去来镜加工页面
        //                     $scope.goMachining = function(){
        //                         var newGlass=window.open();
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info,{icon:1});
        //                                     var url = $state.href('glassMachining',{
        //                                         order_id:$stateParams.order_id
        //                                     });
        //                                     newGlass.location.href=url;
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //
        //                 }else if($('.onlinePay .close_check').eq(1).attr("checked")&&$scope.balance==0){
        //                     //console.log('wx');
        //
        //
        //                     var url = $state.href('erweimaNew',{
        //                         url:$scope.codeData.weixin,
        //                     });
        //                     newOpen.location.href=url;
        //
        //                     /*$http({
        //                         method:"POST",
        //                         url:''+$rootScope.ip+'/Flow/double_payment',
        //                         data:{
        //                             code:$scope.codeData.weixin
        //                         },
        //                         headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                     })
        //                         .success(function(data) {
        //                             //console.log(data);
        //                             if(data.status){
        //                                 layer.msg('玩命加载中', {
        //                                     icon: 16,
        //                                     shade: 0.3,
        //                                     time:200
        //                                 },function() {
        //                                     // if(data.type=="balance"){
        //                                     //     layer.msg(data.info);
        //                                     //     $state.go('order-all');
        //                                     // }else if(data.type=="pay"){
        //                                     //     var url = $state.href('erweimaNew',{
        //                                     //         url:data.wx_url,
        //                                     //         id:data.order_no
        //                                     //     });
        //                                     //     newOpen.location.href=url;
        //                                     // }
        //                                     var url = $state.href('erweimaNew',{
        //                                         url:data.wx_url,
        //                                         id:data.order_no
        //                                     });
        //                                     newOpen.location.href=url;
        //                                 })
        //                             }else{
        //                                 layer.msg(data.info);
        //                             }
        //                         })*/
        //
        //                     //监控订单
        //                     $scope.checkList = function(){
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info, {
        //                                         icon: 1,
        //                                         shade: 0.3,
        //                                         time:2000
        //                                     },function() {
        //                                         $state.go('order-all');
        //                                     })
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //
        //                     //去来镜加工页面
        //                     $scope.goMachining = function(){
        //
        //                         var newGlass=window.open();
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info,{icon:1});
        //                                     var url = $state.href('glassMachining',{
        //                                         order_id:$stateParams.order_id
        //                                     });
        //                                     newGlass.location.href=url;
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //
        //                 }else if($('.onlinePay .close_check').eq(2).attr("checked")&&$scope.balance==0){
        //                     var url = $state.href('unionPayNew',{
        //                         url:$scope.codeData.upacp
        //                     });
        //                     newOpen.location.href=url;
        //
        //                     //监控订单
        //                     $scope.checkList = function(){
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info, {
        //                                         icon: 1,
        //                                         shade: 0.3,
        //                                         time:2000
        //                                     },function() {
        //                                         $state.go('order-all');
        //                                     })
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //
        //
        //                     //去来镜加工页面
        //                     $scope.goMachining = function(){
        //                         var newGlass=window.open();
        //                         $http({
        //                             method:"GET",
        //                             url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                             params:{
        //                                 id:$scope.codeData.id
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg(data.info,{icon:1});
        //                                     var url = $state.href('glassMachining',{
        //                                         order_id:$stateParams.order_id
        //                                     });
        //                                     newGlass.location.href=url;
        //                                 }else{
        //                                     layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                 }
        //                             })
        //                     };
        //                 }else{
        //                     //console.log('没有选中');
        //
        //
        //                     $('#masks').show();
        //                     $('.payToLj').show();
        //                     if($('.onlinePay .close_check').eq(0).attr("checked")){
        //                         var url = $state.href('alipay',{
        //                             url:$scope.codeData.alipay
        //                         });
        //                         newOpen.location.href=url;
        //
        //                         //监控订单
        //                         $scope.checkList = function(){
        //                             $http({
        //                                 method:"GET",
        //                                 url:''+$rootScope.ip+'/Flow/double_payment',
        //                                 params:{
        //                                     id:$scope.codeData.id
        //                                 },
        //                                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                             })
        //                                 .success(function(data) {
        //                                     //console.log(data);
        //                                     if(data.status){
        //                                         layer.msg(data.info, {
        //                                             icon: 1,
        //                                             shade: 0.3,
        //                                             time:2000
        //                                         },function() {
        //                                             $state.go('order-all');
        //                                         })
        //                                     }else{
        //                                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                     }
        //                                 })
        //                         };
        //
        //                         //去来镜加工页面
        //                         $scope.goMachining = function(){
        //                             var newGlass=window.open();
        //                             $http({
        //                                 method:"GET",
        //                                 url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                                 params:{
        //                                     id:$scope.codeData.id
        //                                 },
        //                                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                             })
        //                                 .success(function(data) {
        //                                     //console.log(data);
        //                                     if(data.status){
        //                                         layer.msg(data.info,{icon:1});
        //                                         var url = $state.href('glassMachining',{
        //                                             order_id:$stateParams.order_id
        //                                         });
        //                                         newGlass.location.href=url;
        //                                     }else{
        //                                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                     }
        //                                 })
        //                         };
        //
        //                     }else if($('.onlinePay .close_check').eq(1).attr("checked")){
        //                         //console.log(1);
        //                         //var newTab=window.open();
        //
        //                         var url = $state.href('erweimaNew',{
        //                             url:$scope.codeData.weixin,
        //                         });
        //                         newOpen.location.href=url;
        //
        //                         /*$http({
        //                             method:"POST",
        //                             url:''+$rootScope.ip+'/Flow/pay_code',
        //                             data:{
        //                                 code:$scope.codeData.weixin
        //                             },
        //                             headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                         })
        //                             .success(function(data) {
        //                                 //console.log(data);
        //                                 if(data.status){
        //                                     layer.msg('玩命加载中', {
        //                                         icon: 16,
        //                                         shade: 0.3,
        //                                         time:200
        //                                     },function() {
        //                                         var url = $state.href('erweima',{
        //                                             url:data.wx_url,
        //                                             id:data.order_no
        //                                         });
        //                                         newOpen.location.href=url;
        //                                         //window.open(url,'_blank');
        //                                     })
        //                                 }else{
        //                                     layer.msg(data.info);
        //                                 }
        //                             })*/
        //
        //                         //监控订单
        //                         $scope.checkList = function(){
        //                             $http({
        //                                 method:"GET",
        //                                 url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                                 params:{
        //                                     id:$scope.codeData.id
        //                                 },
        //                                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                             })
        //                                 .success(function(data) {
        //                                     //console.log(data);
        //                                     if(data.status){
        //                                         layer.msg(data.info, {
        //                                             icon: 1,
        //                                             shade: 0.3,
        //                                             time:2000
        //                                         },function() {
        //                                             $state.go('order-all');
        //                                         })
        //                                     }else{
        //                                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                     }
        //                                 })
        //                         };
        //
        //                         //去来镜加工页面
        //                         $scope.goMachining = function(){
        //
        //                             var newGlass=window.open();
        //                             $http({
        //                                 method:"GET",
        //                                 url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                                 params:{
        //                                     id:$scope.codeData.id
        //                                 },
        //                                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                             })
        //                                 .success(function(data) {
        //                                     //console.log(data);
        //                                     if(data.status){
        //                                         layer.msg(data.info,{icon:1});
        //                                         var url = $state.href('glassMachining',{
        //                                             order_id:$stateParams.order_id
        //                                         });
        //                                         newGlass.location.href=url;
        //                                     }else{
        //                                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                     }
        //                                 })
        //                         };
        //
        //                     }else if($('.onlinePay .close_check').eq(2).attr("checked")){
        //                         //console.log(2)
        //                         var url = $state.href('unionPay',{
        //                             url:$scope.codeData.upacp
        //                         });
        //                         newOpen.location.href=url;
        //
        //                         //监控订单
        //                         $scope.checkList = function(){
        //                             $http({
        //                                 method:"GET",
        //                                 url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                                 params:{
        //                                     id:$scope.codeData.id
        //                                 },
        //                                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                             })
        //                                 .success(function(data) {
        //                                     //console.log(data);
        //                                     if(data.status){
        //                                         layer.msg(data.info, {
        //                                             icon: 1,
        //                                             shade: 0.3,
        //                                             time:2000
        //                                         },function() {
        //                                             $state.go('order-all');
        //                                         })
        //                                     }else{
        //                                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                     }
        //                                 })
        //                         };
        //
        //
        //                         //去来镜加工页面
        //                         $scope.goMachining = function(){
        //                             var newGlass=window.open();
        //                             $http({
        //                                 method:"GET",
        //                                 url:''+$rootScope.ip+'/Flow/check_order_pay',
        //                                 params:{
        //                                     id:$scope.codeData.id
        //                                 },
        //                                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //                             })
        //                                 .success(function(data) {
        //                                     //console.log(data);
        //                                     if(data.status){
        //                                         layer.msg(data.info,{icon:1});
        //                                         var url = $state.href('glassMachining',{
        //                                             order_id:$stateParams.order_id
        //                                         });
        //                                         newGlass.location.href=url;
        //                                     }else{
        //                                         layer.msg('支付还未完成，请勿关闭窗口',{icon:2});
        //                                     }
        //                                 })
        //                         };
        //                     }
        //                 }
        //             }else{
        //                 layer.msg(data.info);
        //                 $scope.pass='';
        //                 $(".sixDigitPassword").find("b").css({"display":"none"});
        //             }
        //         })
        // }else if($scope.pass==''){
        //     layer.msg('支付密码不能为空')
        // }else{
        //     layer.msg('请选择至少一种支付方式')
        // }




        // $scope.pass='';
        // $scope.tijiao = function(){
        //     //console.log($scope.pass);
        // };

        $scope.forgot = function () {
            var url = $state.href('save-payPass');
            window.open(url, '_blank');
        };

    }])
    //余额支付页面
    .controller('yue-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/double_payment',
            data: {
                code: $stateParams.url
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                //console.log($stateParams.type)
                if (data.status) {
                    //判断是否能来镜加工
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/User/is_machining_goods',
                        data: {
                            order_id: $stateParams.laijingId
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.order_id) {
                                layer.confirm('订单已支付成功', {
                                    shade: 0.3,
                                    title: '镜库科技',
                                    btn: ['确定', '来镜加工'],
                                    btn2: function () {
                                        $state.go('glassMachining', { order_id: $stateParams.laijingId });
                                    },
                                    cancel: function (index, layero) {
                                        layer.close(index)
                                        return false;
                                    }
                                }, function (index) {
                                    layer.close(index)
                                    $state.go('person-process');
                                })
                            } else {
                                layer.confirm('订单已支付成功', {
                                    shade: 0.3,
                                    title: '镜库科技',
                                    btn: ['确定'],
                                    cancel: function (index, layero) {
                                        layer.close(index)
                                        return false;
                                    }
                                }, function (index) {
                                    layer.close(index)
                                    $state.go('order-all');
                                })
                            }
                        })
                } else {
                    layer.msg(data.info, {
                        icon: 2,
                        time: 1000
                    }, function () {
                        window.close();
                    })
                }
            })
    }])
    //二维码页面
    .controller('erweima-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;


        layer.msg('玩命加载中', {
            icon: 16,
            shade: 0.3,
            time: 1000
        }, function () {

        })

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/pay_code',
            data: {
                code: $stateParams.url
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status == 0) {
                    layer.msg(data.info)
                }
                $scope.ermData = data;
                $scope.wxurl = data.wx_url;
                $scope.res = ipCookie('token');
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/get_weixin_img',
                    data: {
                        url: data.wx_url
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            //$scope.wxurl = data;
                            //$scope.wxurl = $stateParams.url;
                            $scope.res = ipCookie('token');
                        }
                    })
            })



        var timer = setInterval(function () {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Flow/check_order_pay',
                params: {
                    id: $scope.ermData.order_no
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { icon: 1 });
                        if ($stateParams.type == 'mach') {
                            $state.go('person-process');
                        } else {
                            $state.go('order-all')
                        }
                        clearInterval(timer);
                    } else {

                    }
                })
        }, 3000);

    }])
    //支付宝页面
    .controller('alipay-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/pay_code',
            data: {
                code: $stateParams.url
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status) {
                    if (data.type == 'jump') {
                        $state.go('control-mb');
                        return;
                    }
                    layer.msg('玩命加载中', {
                        icon: 16
                        , shade: 0.3
                    })
                    pingpp.createPayment(data.pingxx, function (result, err) {
                        //console.log(result, err);
                        if (result == "success") {
                            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                        } else if (result == "fail") {
                            // charge 不正确或者微信公众账号支付失败时会在此处返回
                        } else if (result == "cancel") {
                            // 微信公众账号支付取消支付
                        }
                    });
                }
            })
    }])
    //银联页面
    .controller('unionPay-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/pay_code',
            data: {
                code: $stateParams.url
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg('玩命加载中', {
                        icon: 16
                        , shade: 0.3
                    }, function () {

                    })
                    pingpp.createPayment(data.pingxx, function (result, err) {
                        //console.log(result, err);
                        if (result == "success") {
                            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                        } else if (result == "fail") {
                            // charge 不正确或者微信公众账号支付失败时会在此处返回
                        } else if (result == "cancel") {
                            // 微信公众账号支付取消支付
                        }
                    });
                }
            })
    }])
    //二维码-加余额支付页面
    .controller('erweimaNew-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;
        layer.msg('玩命加载中', {
            icon: 16,
            shade: 0.3,
            time: 1000
        }, function () {

        })

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/double_payment',
            data: {
                code: $stateParams.url
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.ermData = data;
                $scope.wxurl = data.wx_url;
                $scope.res = ipCookie('token');
                if (data.status) {
                    // var url = $state.href('erweimaNew',{
                    //     url:data.wx_url,
                    //     id:data.order_no
                    // });
                    // newOpen.location.href=url;
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Flow/get_weixin_img',
                        data: {
                            url: data.wx_url
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                $scope.url = data;
                                //$scope.wxurl = $stateParams.url;
                                $scope.res = ipCookie('token');
                            }
                        })
                } else {
                    layer.msg(data.info);
                }
            })


        var timer = setInterval(function () {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Flow/check_order_pay',
                params: {
                    id: $scope.ermData.order_no
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { icon: 1 });
                        if ($stateParams.type == 'mach') {
                            $state.go('person-process');
                        } else {
                            $state.go('order-all')
                        }
                        clearInterval(timer);
                    }
                })
        }, 3000);
    }])
    //支付宝-加余额支付页面
    .controller('alipayNew-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/double_payment',
            data: {
                code: $stateParams.url
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg('玩命加载中', {
                        icon: 16
                        , shade: 0.3
                    }, function () {

                    })
                    if (data.type == "balance") {
                        layer.msg(data.info);
                        $state.go('order-all');
                    } else if (data.type == "pay") {
                        pingpp.createPayment(data.pingxx, function (result, err) {
                            //console.log(result, err);
                            if (result == "success") {
                                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                            } else if (result == "fail") {
                                // charge 不正确或者微信公众账号支付失败时会在此处返回
                            } else if (result == "cancel") {
                                // 微信公众账号支付取消支付
                            }
                        });
                    }

                } else {
                    layer.msg(data.info);
                    $state.go('home');
                }
            })
    }])
    //银联-加余额支付页面
    .controller('unionPayNew-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Flow/double_payment',
            data: {
                code: $stateParams.url
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg('玩命加载中', {
                        icon: 16
                        , shade: 0.3
                    }, function () {

                    })
                    if (data.type == "balance") {
                        layer.msg(data.info);
                        $state.go('order-all');
                    } else if (data.type == "pay") {
                        pingpp.createPayment(data.pingxx, function (result, err) {
                            //console.log(result, err);
                            if (result == "success") {
                                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                            } else if (result == "fail") {
                                // charge 不正确或者微信公众账号支付失败时会在此处返回
                            } else if (result == "cancel") {
                                // 微信公众账号支付取消支付
                            }
                        });
                    }
                }
            })
    }])
    //二维码-充值
    .controller('erweimaRecharge-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        layer.msg('玩命加载中', {
            icon: 16,
            shade: 0.3,
            time: 1000
        }, function () {

        })


        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/recharge_money',
            data: {
                log_id: $stateParams.log_id,
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.wxData = data;
                $scope.wxurl = data.wx_url;
                $scope.res = ipCookie('token');
                if (data.status) {
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/Flow/get_weixin_img',
                        data: {
                            url: data.wx_url
                        },
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    })
                        .success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                $scope.url = data;
                                $scope.wxurl = $scope.wxData.wx_url;
                                $scope.res = ipCookie('token');
                            }
                        })
                } else {
                    layer.msg(data.info);
                }

            })


        var timer = setInterval(function () {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/Flow/check_order_pay',
                params: {
                    id: $scope.wxData.log_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info, { icon: 1 });
                        if ($stateParams.type == 'mach') {
                            $state.go('person-process');
                        } else {
                            $state.go('zijin-mana')
                        }
                        clearInterval(timer);
                    }
                })
        }, 2000);
    }])
    //支付宝-充值
    .controller('alipayRecharge-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/recharge_money',
            data: {
                log_id: $stateParams.log_id,
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg('玩命加载中', {
                        icon: 16
                        , shade: 0.3,
                        time: 1000
                    }, function () {

                        pingpp.createPayment(data.pingxx, function (result, err) {
                            //console.log(result, err);
                            if (result == "success") {
                                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                            } else if (result == "fail") {
                                // charge 不正确或者微信公众账号支付失败时会在此处返回
                            } else if (result == "cancel") {
                                // 微信公众账号支付取消支付
                            }
                        });

                    })
                }
            })



    }])
    //银联-充值
    .controller('unionPayRecharge-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = false;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/recharge_money',
            data: {
                log_id: $stateParams.log_id,
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg('玩命加载中', {
                        icon: 16
                        , shade: 0.3
                    }, function () {

                    })
                    pingpp.createPayment(data.pingxx, function (result, err) {
                        //console.log(result, err);
                        if (result == "success") {
                            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                        } else if (result == "fail") {
                            // charge 不正确或者微信公众账号支付失败时会在此处返回
                        } else if (result == "cancel") {
                            // 微信公众账号支付取消支付
                        }
                    });
                }
            })
    }])
    //帮助中心公司简介页面
    .controller('helpCompany-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', '$sce', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams, $sce) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        var cool = layer.load(0, { shade: [0.3, '#fff'] });
        //获取每个标题
        $scope.helpInit = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/help',
                data: {
                    id: $stateParams.id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    layer.close(cool);
                    //console.log(data);
                    $scope.helpData = data;

                    for (var i = 0; i < data.data.length; i++) {
                        for (var j = 0; j < data.data[i].article.length; j++) {
                            if (data.data[i].article[j].selected) {
                                data.data[i].selected = 1;
                            }
                        }
                    }
                }).error(function (data, staus) {
                    layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
                        location.href = "/default.html";
                    }
                })
        };
        $scope.helpInit();

        //标题的内容
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/helpInfo',
            data: {
                id: $stateParams.id
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.tit = data.data.title;
                $scope.content = $sce.trustAsHtml(data.data.content);
            })
        //获取每一个标题的内容
        $scope.getContent = function (id) {
            $state.go('help_company', {
                id: id
            })
        };


        $scope.helpFn = function () {
            $('.help-dl .help-name').click(function () {
                //var that = this;
                $(this).next().toggleClass('show');

                if ($(this).next().hasClass('show')) {
                    $(this).find('span').css({
                        background: 'url(img/down_arrow.png) center 100% no-repeat'
                    })
                } else {
                    $(this).find('span').css({
                        background: 'url(img/up_arrow.png) center 100% no-repeat'
                    })
                }

                // $(this).find('span').toggle(
                //     function(){
                //         $(that).find('span').css({
                //             background:'url(img/up_arrow.png) center 100% no-repeat'
                //         })
                //     },
                //     function(){
                //         $(that).find('span').css({
                //             background:'url(img/bottomSanjiao.png) center 100% no-repeat'
                //         })
                //     }
                // );
            });
        };

    }])
    //来镜加工页面
    .controller('glassMachining-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', '$sce', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams, $sce) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        var cool = layer.load(0, { shade: [0.3, '#fff'] });

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Machining/glass_machining',
            data: {
                id: $stateParams.order_id
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                layer.close(cool);
                //console.log(data);
                $scope.data = $sce.trustAsHtml(data.data);
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })

        $scope.enterMessage = function () {
            $state.go('glassMachiningTwo', {
                order_id: $stateParams.order_id
            })
        };

        $scope.lengths = 1;
        //点击显示左右眼显示框
        $scope.showLeft = function (e) {
            // angular.element(e.target).attr('data-id');
            // //console.log(angular.element(e.target).html());
            // //console.log(angular.element(e.target).attr("data-id"));
            $('.leftBox').show();
            //默认框里所有的数据
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/machining_goods',
                data: {
                    order_id: $stateParams.order_id,
                    goods_type: 'pian',
                    rec_id: $scope.leftArr.goods_rec,
                    rec_ids: $scope.goods_rec_arr
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.pianList = data;
                    $scope.lengths = $scope.liArr.length;

                })
        };
        $scope.showRight = function () {
            $('.rightBox').show();
            //默认框里所有的数据
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/machining_goods',
                data: {
                    order_id: $stateParams.order_id,
                    goods_type: 'pian',
                    rec_id: $scope.rightArr.goods_rec,
                    rec_ids: $scope.goods_rec_arr
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.pianList = data;

                    $scope.lengths = $scope.liArr.length;
                })
        };
        $scope.showJia = function () {
            $('.jiaBox').show();
            //默认框里所有的数据
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/machining_goods',
                data: {
                    order_id: $stateParams.order_id,
                    goods_type: 'jia',
                    rec_id: $scope.jiaArr.goods_rec,
                    rec_ids: $scope.goods_rec_arr
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.pianList = data;

                    $scope.lengths = $scope.liArr.length;

                    $("input[type='radio']").removeAttr('checked');
                })
        };
        $scope.hideCover = function () {
            $('.leftBox').hide();
            $('.rightBox').hide();
            $('.jiaBox').hide();
        };
        //镜架box切换函数
        $scope.tableJia = function () {
            $('.box_c_u1 li').click(function () {
                var ind = $(this).index();
                $(this).addClass('con').siblings().removeClass('con');
                $('.need_showdiv>div').eq(ind).addClass('show').siblings().removeClass('show');
            })
        };
        $scope.show = true;
        $scope.shows = false;
        $scope.dingdan = function () {
            $scope.show = true;
            $scope.shows = false;
        };
        $scope.kehu = function () {
            $scope.show = false;
            $scope.shows = true;
        };




        //左眼id参数
        $scope.leftArr = {
            type: 1,
            goods_rec: ''
        };

        //镜片来源小数组
        $scope.left_goods_rec = null;
        $scope.goods_rec_arr = [];
        $scope.eyeglassArr = [];
        //确认选择左眼获取左眼数据

        $scope.leftSelect = function (id) {
            //console.log(id);
            $scope.leftArr.goods_rec = id;
        };

        $scope.getLeftEyeData = function (index, pIndex) {
            //$scope.leftArr.Goods.left = '';
            // for(var i in $scope.pianList.pian_goods_list) {
            //     if ($scope.pianList.pian_goods_list[i].selected) {
            //         $scope.leftArr.goods_rec = $scope.pianList.pian_goods_list[i].rec_id;
            //     } else {
            //         //layer.msg('请先勾选一个你想要的属性');
            //     }
            // }
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/select_goods_type',
                data: $scope.leftArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        //$scope.leftEyeData = data;
                        $scope.liArr[index].left = data;
                        $scope.left_goods_rec = data.spec_info.rec_id;
                        if ($scope.goods_rec_arr.indexOf(data.spec_info.rec_id) == -1) {
                            $scope.goods_rec_arr.push(data.spec_info.rec_id);
                        }
                        // // $scope.liArrParams.lqiujing = [];
                        // // $scope.liArrParams.lzhujing = [];
                        // // $scope.liArrParams.lzhouxiang = [];
                        // for (var i = 0;i < $scope.liArr.length;i++){
                        //     var leftLiArr = [];
                        //     var arr = new Array();
                        //     $.each($scope.liArr[i].left.spec_info.goods_attr,function(k,v){
                        //         arr.push(v);
                        //     });
                        //     //console.log(arr);
                        //     //console.log(typeof $scope.liArr[i].left.spec_info.goods_attr); object
                        //
                        //     for(var j = 0;j<arr.length;j++){
                        //         //$scope.liArrParams.ladd.push($scope.liArr[i][arr[j].attr_name]);
                        //          var attr = $scope.liArr[i][arr[j].attr_name];
                        //          leftLiArr.push(attr);
                        //          $scope.liArrParams.ladd.push(arr[j].goods_attr_id);
                        //     }
                        //     //console.log($scope.liArrParams);
                        //     //console.log(leftLiArr);
                        //     //console.log($scope.liArr);
                        // }
                        if ($scope.liArrParams.lqiujing.indexOf($scope.liArr[index].left.spec_info.qiujing) == -1) {
                            $scope.liArrParams.lqiujing.push($scope.liArr[index].left.spec_info.qiujing);
                        }
                        if ($scope.liArrParams.lzhujing.indexOf($scope.liArr[index].left.spec_info.zhujing) == -1) {
                            $scope.liArrParams.lzhujing.push($scope.liArr[index].left.spec_info.zhujing);
                        }
                        if ($scope.liArrParams.lzhouxiang.indexOf($scope.liArr[index].left.spec_info.zhouwei) == -1) {
                            $scope.liArrParams.lzhouxiang.push($scope.liArr[index].left.spec_info.zhouwei);
                        }
                        if ($scope.liArrParams.ladd.indexOf($scope.liArr[index].left.spec_info.ADD) == -1) {
                            $scope.liArrParams.ladd.push($scope.liArr[index].left.spec_info.ADD);
                        }
                        if ($scope.eyeglassArr.indexOf($scope.liArr[index].left.spec_info.rec_id) == -1) {
                            $scope.eyeglassArr.push($scope.liArr[index].left.spec_info.rec_id);
                        }
                        //console.log($scope.liArrParams);
                        $('.leftBox').hide();
                    } else {
                        layer.msg(data.info);
                    }
                })
            //console.log($scope.leftArr);
        };



        //左眼客户输入
        $scope.addChange = function (index, add) {
            $scope.liArrParams.ladd[index] = add;
        };
        $scope.tjChange = function (index, tj) {
            $scope.liArrParams.ltongju[index] = tj;
        };
        $scope.tgChange = function (index, tg) {
            $scope.liArrParams.ltonggao[index] = tg;
        };
        $scope.jytjChange = function (index, jytj) {
            $scope.liArrParams.ljytj[index] = jytj;
        };

        //右眼id参数
        $scope.rightArr = {
            type: 1,
            goods_rec: ''
        };


        $scope.right_goods_rec = null;

        $scope.rightSelect = function (id) {
            //console.log(id);
            $scope.rightArr.goods_rec = id;
        };
        //确认选择右眼获取右眼数据
        $scope.getRightEyeData = function (index, pIndex) {
            //$scope.leftArr.Goods.left = '';
            // for(var j in $scope.pianList.pian_goods_list) {
            //     if ($scope.pianList.pian_goods_list[j].selected) {
            //         $scope.rightArr.goods_rec = $scope.pianList.pian_goods_list[j].rec_id;
            //     }else{
            //         //layer.msg('请先勾选一个你想要的属性');
            //     }
            // }
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/select_goods_type',
                data: $scope.rightArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        //$scope.rightEyeData = data;
                        $scope.liArr[index].right = data;
                        $scope.right_goods_rec = data.spec_info.rec_id;
                        if ($scope.goods_rec_arr.indexOf(data.spec_info.rec_id) == -1) {
                            $scope.goods_rec_arr.push(data.spec_info.rec_id);
                        }

                        if ($scope.liArrParams.rqiujing.indexOf($scope.liArr[index].right.spec_info.qiujing) == -1) {
                            $scope.liArrParams.rqiujing.push($scope.liArr[index].right.spec_info.qiujing);
                        }
                        if ($scope.liArrParams.rzhujing.indexOf($scope.liArr[index].right.spec_info.zhujing) == -1) {
                            $scope.liArrParams.rzhujing.push($scope.liArr[index].right.spec_info.zhujing);
                        }
                        if ($scope.liArrParams.rzhouxiang.indexOf($scope.liArr[index].right.spec_info.zhouwei) == -1) {
                            $scope.liArrParams.rzhouxiang.push($scope.liArr[index].right.spec_info.zhouwei);
                        }
                        if ($scope.liArrParams.radd.indexOf($scope.liArr[index].right.spec_info.ADD) == -1) {
                            $scope.liArrParams.radd.push($scope.liArr[index].right.spec_info.ADD);
                        }
                        if ($scope.eyeglassArr.indexOf($scope.liArr[index].right.spec_info.rec_id) == -1) {
                            $scope.eyeglassArr.push($scope.liArr[index].right.spec_info.rec_id);
                        }
                        //console.log($scope.liArrParams);
                        $('.rightBox').hide();
                    } else {
                        layer.msg(data.info);
                    }
                })
            //console.log($scope.liArr);
        };



        //右眼客户输入
        $scope.raddChange = function (index, add) {
            $scope.liArrParams.radd[index] = add;
        };
        $scope.rtjChange = function (index, tj) {
            $scope.liArrParams.rtongju[index] = tj;
        };
        $scope.rtgChange = function (index, tg) {
            $scope.liArrParams.rtonggao[index] = tg;
        };
        $scope.rjytjChange = function (index, jytj) {
            $scope.liArrParams.rjytj[index] = jytj;
        };

        //镜架参数
        $scope.jiaArr = {
            type: 1,
            goods_rec: ''
        };


        $scope.jia_goods_rec = null;

        $scope.jiaSelect = function (id) {
            //console.log(id);
            $scope.jiaArr.goods_rec = id;
        };
        //确认镜架数据
        $scope.getJiaData = function (index, pIndex) {
            //$scope.leftArr.Goods.left = '';
            // for(var i in $scope.pianList.jia_goods_list) {
            //     if ($scope.pianList.jia_goods_list[i].selected) {
            //         $scope.jiaArr.goods_rec = $scope.pianList.jia_goods_list[i].rec_id;
            //     } else {
            //         //layer.msg('请先勾选一个你想要的属性');
            //     }
            // }
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/select_goods_type',
                data: $scope.jiaArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if ($scope.goods_rec_arr.indexOf(data.spec_info.rec_id) == -1) {
                        $scope.goods_rec_arr.push(data.spec_info.rec_id);
                    }
                    if (data.status) {
                        //$scope.rightEyeData = data;
                        $scope.liArr[index].jia = data;
                        $scope.jia_goods_rec = data.spec_info.rec_id;
                        if ($scope.liArr[index].jia.spec_info.rec_id == undefined) {
                            $scope.liArrParams.frame_from.push('0');
                        } else {
                            $scope.liArrParams.frame_from.push($scope.liArr[index].jia.spec_info.rec_id);
                        }
                        //console.log($scope.liArr);
                        $('.jiaBox').hide();
                    } else {
                        layer.msg(data.info);
                    }
                })
            //console.log($scope.liArr);


            if ($scope.liArrParams.mach_type == 1) {
                $scope.matchType = '全框';
            } else if ($scope.liArrParams.mach_type == 2) {
                $scope.matchType = '半框';
            } else if ($scope.liArrParams.mach_type == 3) {
                $scope.matchType = '无框切边';
            } else if ($scope.liArrParams.mach_type == 4) {
                $scope.matchType = '无框打孔';
            }
        };



        //加工处方单切换函数
        // $scope.tableLi = function(){
        //     $('.process_cont li').eq(0).addClass('con');
        //     $('.process_cont_c').eq(0).addClass('con');
        //     $('.process_cont li').click(function () {
        //         var ind = $(this).index();
        //         $(this).addClass('con').siblings().removeClass('con');
        //         $('.process_cont_c').eq(ind).addClass('con').siblings().removeClass('con');
        //     })
        // };
        // $scope.tableLi();

        $scope.tableScroll = function () {
            setTimeout(function () {
                $(".picScroll-left").slide({ titCell: ".hd ul", mainCell: ".bd ul", autoPage: true, effect: "left", vis: 5, trigger: "click" });
                $('.process_cont_t li').eq(0).addClass('con');
                $('.process_cont_c').eq(0).addClass('con');
                $('.process_cont_t li').click(function () {
                    var ind = $(this).index();
                    $(this).addClass('con').siblings().removeClass('con');
                    $('.process_cont_c').eq(ind).addClass('con').siblings().removeClass('con');
                })
            }, 200)


            $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                //you also get the actual event object
                //do stuff, execute functions -- whatever...
            });
        };
        //加工处方单li数组
        $scope.liArr = [{}];

        $scope.machArr = [];
        //增加一张加工单
        $scope.addList = function (e) {
            if ($scope.liArr[$scope.liArr.length - 1].left == undefined || $scope.liArr[$scope.liArr.length - 1].right == undefined || $scope.liArr[$scope.liArr.length - 1].jia == undefined) {
                layer.msg('请先完善加工单');
            } else {
                //$scope.eyeglassArr = [];
                $scope.liArr.push({});
                //console.log($scope.liArr);
                //console.log($scope.goods_rec_arr);
                $scope.show = true;
                $scope.shows = false;

                $scope.machArr[$scope.lengths - 1] = $scope.liArrParams.mach_type;

                $scope.liArrParams.eyeglass_from.push($scope.eyeglassArr);
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/is_machining_goods',
                    data: {
                        order_id: $stateParams.order_id,
                        rec_ids: $scope.goods_rec_arr,
                        listArr: {
                            eyeglass_from: $scope.liArrParams.eyeglass_from,
                            frame_from: $scope.liArrParams.frame_from,
                            mach_type: $scope.machArr
                        }
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);

                        $scope.leftArr.goods_rec = '';
                        $scope.rightArr.goods_rec = '';
                        $scope.jiaArr.goods_rec = '';
                        //console.log($scope.leftArr);
                        $scope.goods_rec_arr = [];

                        if (data.status) {

                        }
                    })
                // //console.log(angular.element(e.target).parent().prev().find('.bd li'));
                // for(var i=0;i<$scope.liArr.length;i++){
                //     $(this).index = i;
                //    $('.picScroll-left li').eq(i).addClass('con');
                // }
                $scope.lengths++;
            }
        };
        //删除一张加工单
        $scope.delList = function () {
            if ($scope.liArr.length > 1) {
                $scope.liArr.pop();
                $scope.lengths--;
            } else {
                layer.msg('亲，给留一单吧');
            }
        };
        $scope.liArrParams = {
            order_id: $stateParams.order_id,
            lqiujing: [],
            lzhujing: [],
            lzhouxiang: [],
            ladd: [],
            ltongju: [],
            ltonggao: [],
            ljytj: [],
            rqiujing: [],
            rzhujing: [],
            rzhouxiang: [],
            radd: [],
            rtongju: [],
            rtonggao: [],
            rjytj: [],
            eyeglass_from: [],
            frame_from: []
        };
        //确认信息
        $scope.submit = function () {
            //console.log($scope.liArr);
            //console.log($scope.liArrParams);
            $scope.liArrParams.eyeglass_from.push($scope.eyeglassArr);
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/insert_machining',
                data: $scope.liArrParams,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg(data.info);
                        $state.go('person-process');
                    } else {
                        layer.msg(data.info);
                    }
                })
        };
    }])
    //来镜加工第二步页面
    .controller('glassMachiningTwo-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', '$sce', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams, $sce) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Machining/machining_cache_info',
            data: {
                id: $stateParams.order_id
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.content = $sce.trustAsHtml(data.data);
            })


        $scope.submitMachining = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Machining/insert_machining',
                data: {
                    order_id: $stateParams.order_id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        if (data.paid) {
                            $state.go('person-process'); return;
                        }
                        $state.go('paymentNew', {
                            log_id: data.log_id,
                            type: 'mach'
                        })
                    } else {
                        layer.msg(data.info);
                    }
                })
        };


        $scope.returnLast = function () {
            $state.go('glassMachining', {
                order_id: $stateParams.order_id
            })
        };
    }])
    //店铺首页
    .controller('shopHome-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        //店铺信息
        $scope.shopMessage = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Category/get_supplier_info',
                data: {
                    suppliers_id: $stateParams.shopId
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.shopHomeData = data;
                    $scope.shopLogo = data.data.logo;
                    $scope.name = data.data.name;
                })
        };
        $scope.shopMessage();

        //店铺首页
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Category/suppliers_index',
            data: {
                suppliers_id: $stateParams.shopId
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        })
            .success(function (data) {
                //console.log(data);
                $scope.shopHotGoods = data;
                $scope.getHotGoods($scope.shopHotGoods.suppliers_cat_list[0].cat_id);
            })
        $scope.catLiFn = function () {
            $('.hot_sell_box1 .hot_sell_u2 li').eq(0).addClass('on');
            $('.hot_sell_box1 .hot_sell_u2 li').click(function () {
                var iid = $(this).index();
                $(this).addClass('on').siblings().removeClass('on');
                $('.hot_sell_hide>.sell_hide').eq(iid).addClass('show').siblings().removeClass('show');
            });
        };

        $scope.adFn = function () {
            setTimeout(function () {
                $("#slideBox").slide({
                    mainCell: ".bd ul",
                    effect: "leftLoop",
                    prevCell: ".prev",
                    nextCell: ".next",
                    autoPlay: true
                });
            }, 500)
        };

        //店铺关注
        $scope.shopGz = function () {
            if ($scope.shopHomeData.data.is_select) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Goods/CollectShop',
                    data: {
                        id: $stateParams.shopId,
                        type: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg(data.info);
                            $scope.shopMessage();
                        } else {
                            layer.msg(data.info);
                        }
                    })
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Goods/CollectShop',
                    data: {
                        id: $stateParams.shopId,
                        type: 1
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg(data.info);
                            $scope.shopMessage();
                        } else {
                            layer.msg(data.info);
                        }
                    })
            }
        };




        $scope.hotGoodList = {
            page: 1,
            size: 8
        };
        //热销爆款
        $scope.getHotGoods = function (id) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Category/suppliers_category_goods',
                data: {
                    supp_cat_id: id,
                    suppliers_id: $stateParams.shopId,
                    page: $scope.hotGoodList.page,
                    size: $scope.hotGoodList.size
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.hotGoodsData = data;
                })
        };

        $scope.next = function () {
            if ($scope.hotGoodsData.page < $scope.hotGoodsData.pages) {
                $scope.hotGoodList.page++;
                $scope.getHotGoods($scope.hotGoodsData.supp_cat_id);
            } else {
                $scope.hotGoodList.page = 1;
                $scope.getHotGoods($scope.hotGoodsData.supp_cat_id);
            }
        };
        $scope.prev = function () {
            $scope.hotGoodList.page--;
            $scope.getHotGoods($scope.hotGoodsData.supp_cat_id);
            if ($scope.hotGoodsData.page == 1) {
                $scope.hotGoodList.page = 1;
                $scope.getHotGoods($scope.hotGoodsData.supp_cat_id);
            }
        };


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
                //console.log(data);
                if (data.status) {
                    layer.msg(data.info);
                    $scope.yhqFn();
                } else {
                    layer.msg(data.info);
                }
            })
        };

    }])
    //新店铺首页
    .controller('shopHomeNew-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', '$timeout', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams, $timeout) {
        $rootScope.isShow = false;
        $rootScope.change = true;


        //店铺信息
        $scope.shopMessage = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Category/get_supplier_info',
                data: {
                    suppliers_id: $stateParams.shopId
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.shopHomeData = data;
                    $scope.shopLogo = data.data.logo;
                    $scope.name = data.data.name;
                    document.title = data.data.name;
                })
        };
        $scope.shopMessage();

        //店铺关注
        $scope.shopGz = function () {
            if ($scope.shopHomeData.data.is_select) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Goods/CollectShop',
                    data: {
                        id: $stateParams.shopId,
                        type: 0
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg(data.info);
                            $scope.shopMessage();
                        } else {
                            layer.msg(data.info);
                        }
                    })
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Goods/CollectShop',
                    data: {
                        id: $stateParams.shopId,
                        type: 1
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg(data.info);
                            $scope.shopMessage();
                        } else {
                            layer.msg(data.info);
                        }
                    })
            }
        };



        //分页操作
        $scope.pageIndex = 0;  //初始页索引
        $scope.pageSize = 16; //每页数据条数
        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: pageIndex
        };
        function pageIndex(index) {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $scope.hotGoodList.page = index + 1;
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Category/suppliers_category_goods',
                data: $scope.hotGoodList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                if (data.status) {
                    layer.close(cool);
                }
                $scope.hotGoodsData = data;
                $scope.totalSize = data.pages;
                $scope.ye = data.page;
                $scope.count = data.count;
                $("body,html").animate({
                    "scrollTop": 0
                }, 500)
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };

        $scope.getGoods = function (data) {
            $scope.pagination = $('#Pagination').pagination(data.pages, $scope.options);
        };

        $scope.hotGoodList = {
            page: 1,
            size: 16,
            order: '',
            stort: '',
            suppliers_id: $stateParams.shopId,
            supp_cat_id: ''
        };
        //热销爆款
        $scope.getHotGoods = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Category/suppliers_category_goods',
                data: $scope.hotGoodList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.hotGoodsData = data;
                    $scope.totalSize = data.pages;
                    $scope.ye = data.page;
                    $scope.count = data.count;
                    $scope.getGoods(data);



                    //商品排序
                    if (data.order == "g.goods_id" && data.stort == "DESC") {
                        $('.shopList-sort-titnew .shopList-sort-itemnew .dayuhaonew').addClass('selected');
                        $('.shopList-sort-titnew .shopList-sort-itemnew .xiaoyuhaonew').removeClass('selected');
                    }
                    else if (data.order == "g.goods_id" && data.stort == "ASC") {
                        $('.shopList-sort-titnew .shopList-sort-itemnew .xiaoyuhaonew').addClass('selected');
                        $('.shopList-sort-titnew .shopList-sort-itemnew .dayuhaonew').removeClass('selected');
                    } else if (data.order == "g.shop_price" && data.stort == "DESC") {
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(3) .dayuhaonew').addClass('selected');
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(3) .xiaoyuhaonew').removeClass('selected');
                    } else if (data.order == "g.shop_price" && data.stort == "ASC") {
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(3) .xiaoyuhaonew').addClass('selected');
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(3) .dayuhaonew').removeClass('selected');
                    } else if (data.order == "g.add_time" && data.stort == "DESC") {
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(2) .dayuhaonew').addClass('selected');
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(2) .xiaoyuhaonew').removeClass('selected');
                    } else if (data.order == "g.add_time" && data.stort == "ASC") {
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(2) .xiaoyuhaonew').addClass('selected');
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(2) .dayuhaonew').removeClass('selected');
                    } else if (data.order == "g.sales_num" && data.stort == "ASC") {
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(1) .xiaoyuhaonew').addClass('selected');
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(1) .dayuhaonew').removeClass('selected');
                    } else if (data.order == "g.sales_num" && data.stort == "DESC") {
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(1) .dayuhaonew').addClass('selected');
                        $('.shopList-sort-titnew .shopList-sort-itemnew:eq(1) .xiaoyuhaonew').removeClass('selected');
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
        $scope.getHotGoods();


        //不使用插件分页
        $scope.prevList = function () {
            $scope.pagination[0].prevPage();
        };
        $scope.nextList = function () {
            $scope.pagination[0].nextPage();
        };

        //图片处理函数
        $scope.listControl = function (num) {
            $timeout(function () {
                $(".picFocus").slide({
                    mainCell: ".goods-items-imgnew ul",
                    effect: "left",
                    autoPlay: false,
                    // prevCell: ".sPrev",
                    // nextCell: ".sNext",
                    //vis:num
                });
            }, 2500)
        };

        //分类导航栏切换
        $scope.shop_cat = function (catId) {
            $('.new_shop_l li').eq(0).removeClass('on');
            $scope.hotGoodList.supp_cat_id = catId;
            $scope.getHotGoods()
        };

        // $scope.shopCatFn = function(){
        //     $('.new_shop_l li').eq(0).addClass('on');
        //     $('.new_shop_l li').click(function(e){
        //         $('.new_shop_l li').removeClass('on');
        //         $(e.target).addClass('on');
        //     })
        // };

        //分类导航首页
        $scope.shop_homeCat = function () {
            $('.new_shop_l li').eq(0).addClass('on');
            $scope.hotGoodList.supp_cat_id = '';
            $scope.hotGoodList.suppliers_id = $stateParams.shopId;
            $scope.getHotGoods();
        };



        //商品综合排序
        $scope.allOrder = function () {
            $scope.hotGoodList.order = 'goods_id';
            $scope.hotGoodList.stort = 'DESC';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //商品推荐排序
        $scope.tuijianOrder = function () {
            $scope.hotGoodList.order = 'sales_num';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //推荐升序
        $scope.tuijianAsOrder = function () {
            $scope.hotGoodList.stort = 'ASC';
            $scope.hotGoodList.order = 'sales_num';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //推荐降序
        $scope.tuijianDsOrder = function () {
            $scope.hotGoodList.stort = 'DESC';
            $scope.hotGoodList.order = 'sales_num';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //商品价格排序
        $scope.priceOrder = function () {
            $scope.hotGoodList.order = 'shop_price';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //价格升序
        $scope.PriceAsOrder = function () {
            $scope.hotGoodList.stort = 'ASC';
            $scope.hotGoodList.order = 'shop_price';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //价格降序
        $scope.PriceDsOrder = function () {
            $scope.hotGoodList.stort = 'DESC';
            $scope.hotGoodList.order = 'shop_price';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //商品时间排序
        $scope.timeOrder = function () {
            $scope.hotGoodList.order = 'add_time';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //时间升序
        $scope.timeAsOrder = function () {
            $scope.hotGoodList.stort = 'ASC';
            $scope.hotGoodList.order = 'add_time';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
        };
        //时间降序
        $scope.timeDsOrder = function () {
            $scope.hotGoodList.stort = 'DESC';
            $scope.hotGoodList.order = 'add_time';
            $scope.hotGoodList.page = 1;
            $scope.getHotGoods();
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
            }, 1000);

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
                            $scope.hotGoodsData.goods[index].is_collect = 1;
                            $scope.getHotGoods();
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
                            $scope.hotGoodsData.goods[index].is_collect = 0;
                            $scope.getHotGoods();
                        }
                    })
            }
        };

    }])
    //个人中心-发票管理-发票列表页面
    .controller('invoices-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', '$location', '$anchorScroll', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams, $location, $anchorScroll) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        $scope.goto = function () {
            $location.hash('');
            $anchorScroll.yOffset = 1;
            $anchorScroll();
        };
        $scope.goto();
        $scope.invoicesList = {
            page: 1,
            size: 10,
            //time:''
        };
        $scope.goSelect = function () {
            $state.go('person-inv-select');
        };
        //时间检索
        $scope.searchInvoices = function () {
            //$scope.invoicesList.time = $scope.startTime;
            $scope.invoicesFn();
        };
        $scope.invoicesFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/inv_list',
                data: $scope.invoicesList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
                $scope.invoicesData = data;

            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.invoicesFn();

        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                $scope.invoicesList.page = index + 1;
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/inv_list',
                    data: $scope.invoicesList,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    layer.close(cool);
                    $scope.invoicesData = data;
                }).error(function (data, staus) {
                    layer.close(cool);
                    if (staus == 401) {
                        ////layer.msg('用户失效，请重新登录');
                        ipCookie.remove('has_login');
                        ipCookie.remove('token');
                        location.href = "/default.html";
                    }
                })
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options)
        };
    }])
    //个人中心-发票管理-发票索取页面
    .controller('invSelect-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        $scope.invSelectList = {
            page: 1,
            size: 10,
            min: '',
            max: ''
        };
        $scope.invSelectFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/invoice',
                data: $scope.invSelectList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
                $scope.invSelectData = data;

            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.invSelectFn();

        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                $scope.invSelectList.page = index + 1;
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/invoice',
                    data: $scope.invSelectList,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    $scope.invSelectData = data;
                })
            }
        };
        $scope.getGoods = function (data) {
            setTimeout(function () {
                $('#Pagination').pagination(data.pages, $scope.options);
            }, 200)
        };


        //搜索
        $scope.searchSelect = function () {
            $scope.invSelectFn();
        };

        var sum = 0;
        //全选
        $scope.isCheck = function (index, check, id, e) {
            //console.log($scope.invSelectData);
            if (!$scope.invSelectData.data[index].allCheck) {
                //console.log(1);
                for (var j = 0; j < $scope.invSelectData.data[index].order.length; j++) {
                    $scope.invSelectData.data[index].order[j].check = true;
                    if ($scope.invSelectData.data[index].order[j].check == false) {
                        $scope.invSelectData.data[index].allCheck = false;
                    } else {
                        $scope.invSelectData.data[index].allCheck = true;
                    }
                    //$scope.orderIdArr.order_ids.push($scope.invSelectData.data[index].order[j].order_id);
                    //$scope.orderIdArr.order_ids.splice(index,0,$scope.invSelectData.data[index].order[j].order_id);


                    sum += parseFloat($scope.invSelectData.data[index].order[j].old_amount);
                    $scope.orderIdArr.order_ids.splice($.inArray(index, $scope.orderIdArr.order_ids), 0, $scope.invSelectData.data[index].order[j].order_id);
                    $scope.orderIdArr.suppliers_id = id;
                }
                // $http({
                //     method:"POST",
                //     url:''+$rootScope.ip+'/User/select_inv_list',
                //     data:$scope.orderIdArr,
                //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                // }).success(function(data) {
                //     //console.log(data);
                //     //$scope.price = data.float;
                //     angular.element(e).parent().find('.d1_div_sp2').html(data.float);
                // })

                angular.element(e).parent().find('.d1_div_sp2').html('¥' + sum.toFixed(2));
                angular.element(e).parent().parent().siblings().find('.tb_d2_lp span').html('¥' + sum.toFixed(2));
                //console.log($scope.orderIdArr);
            } else {
                for (var j = 0; j < $scope.invSelectData.data[index].order.length; j++) {
                    $scope.invSelectData.data[index].order[j].check = false;
                    sum = 0;
                    $scope.orderIdArr.order_ids = [];
                }
                // $http({
                //     method:"POST",
                //     url:''+$rootScope.ip+'/User/select_inv_list',
                //     data:$scope.orderIdArr,
                //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                // }).success(function(data) {
                //     //console.log(data);
                //     //$scope.price = data.float;
                //     angular.element(e).parent().find('.d1_div_sp2').html(data.float);
                // })


                angular.element(e).parent().find('.d1_div_sp2').html('¥' + sum.toFixed(2));
                angular.element(e).parent().parent().siblings().find('.tb_d2_lp span').html('¥' + sum.toFixed(2));
                //console.log($scope.orderIdArr);
            }
        };

        //发票索取订单id数组
        $scope.orderIdArr = {
            suppliers_id: "",
            order_ids: []
        };
        //选中改变价格
        $scope.selectInv = function (index, pIndex, ck, id, e) {
            if (!ck) {
                //console.log(index);
                $scope.orderIdArr.order_ids.splice($.inArray(index, $scope.orderIdArr.order_ids), 0, $scope.invSelectData.data[pIndex].order[index].order_id);
                sum += parseFloat($scope.invSelectData.data[pIndex].order[index].old_amount);
                $scope.orderIdArr.suppliers_id = id;
                //$scope.selectPrice();
                // $http({
                //     method:"POST",
                //     url:''+$rootScope.ip+'/User/select_inv_list',
                //     data:$scope.orderIdArr,
                //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                // }).success(function(data) {
                //     //console.log(data);
                //     //$scope.price = data.float;
                //     angular.element(e).parent().parent().parent().siblings().eq(1).find('.d1_div_sp2').html(data.float);
                // })


                angular.element(e).parent().parent().parent().siblings().find('.d1_div_sp2').html('¥' + sum.toFixed(2));
                angular.element(e).parent().parent().parent().siblings().find('.tb_d2_lp span').html('¥' + sum.toFixed(2));
            }
            else {
                //console.log(index);
                //$scope.orderIdArr.order_ids.splice(index,1);
                //angular删除数组
                $scope.orderIdArr.order_ids.splice($.inArray(index, $scope.orderIdArr.order_ids), 1);
                // $http({
                //     method:"POST",
                //     url:''+$rootScope.ip+'/User/select_inv_list',
                //     data:$scope.orderIdArr,
                //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
                // }).success(function(data) {
                //     //console.log(data);
                //     //$scope.price = data.float;
                //     angular.element(e).parent().parent().parent().siblings().eq(1).find('.d1_div_sp2').html(data.float);
                // })
                sum -= parseFloat($scope.invSelectData.data[pIndex].order[index].old_amount);
                angular.element(e).parent().parent().parent().siblings().eq(1).find('.d1_div_sp2').html('¥' + sum.toFixed(2));
                angular.element(e).parent().parent().parent().siblings().eq(1).find('..tb_d2_lp span').html('¥' + sum.toFixed(2));
            }
        };
        //选中获取价格
        // $scope.selectPrice = function(){
        //     $http({
        //         method:"POST",
        //         url:''+$rootScope.ip+'/User/select_inv_list',
        //         data:$scope.orderIdArr,
        //         headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
        //     }).success(function(data) {
        //         //console.log(data);
        //         $scope.price = data.float;
        //     })
        // };

        //是否索取
        $scope.hasKaiPiao = true;
        //确定发票参数
        $scope.piaoArr = {
            ivid: '',
            order_ids: '',
            address_id: '',
            suppliers_id: ''
        };
        $scope.getAddress = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/address_list',
                data: '',
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                $scope.addressData = data;
            })
        };
        //索取发票
        $scope.sq = function () {
            //console.log($scope.orderIdArr);
            if ($scope.orderIdArr.suppliers_id == "") {
                layer.msg('请选择正确的开票金额！');
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/selectzz',
                    data: $scope.orderIdArr,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        $scope.hasKaiPiao = false;
                        $scope.kaiPiaoData = data;
                        $scope.kaiPiaoCount = data.count_i;
                        $scope.kaiPiaoPrice = data.float;
                        $scope.piaoArr.order_ids = data.order_ids;
                        $scope.piaoArr.suppliers_id = data.suppliers_id;
                        $scope.getAddress();
                    } else {
                        layer.msg(data.info);
                    }
                })
            }

        };
        //确定发票
        $scope.sure = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/insert_inv',
                data: $scope.piaoArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg(data.info);
                    $state.go('person-invoices');
                } else {
                    layer.msg(data.info);
                }
            })
            //console.log($scope.piaoArr);
        };


        //删除一个收货地址
        $scope.deleteAddress = function (id) {
            layer.confirm('您确定要删除么？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                $http({
                    method: "GET",
                    url: '' + $rootScope.ip + '/User/del_address',
                    params: {
                        address_id: id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                })
                    .success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.msg(data.info);
                            $scope.getAddress();
                        } else {
                            layer.msg(data.info);
                        }
                    })
            }, function () {
                layer.msg('点完这个可就全没了，在考虑考虑吧~', {
                    time: 2000, //2s后自动关闭
                });
            });
        };

    }])
    //个人中心-发票管理-发票信息管理页面
    .controller('invMessage-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        $scope.invMessageList = {
            page: 1,
            size: 10
        };
        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.invMessageList.page = index + 1;
                $scope.invMessageFn = function () {
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/User/inv_role',
                        data: $scope.invMessageList,
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            layer.close(cool);
                        }
                        //$scope.getGoods(data);
                        $scope.totalSize = data.pages;
                        $scope.invMessageData = data;

                        $scope.zizhiArr = {
                            type: 1,
                            inv_type: 1
                        };

                        $scope.type = false;
                        $scope.zzType = false;
                        $scope.changeType = function () {
                            //console.log($scope.zizhiArr);
                            if ($scope.zizhiArr.type == 2) {
                                $scope.type = true;
                                $scope.zzType = true;
                            }

                            if ($scope.zizhiArr.type == 2 && $scope.zizhiArr.inv_type == 1) {
                                $scope.type = false;
                                $scope.zzType = true;
                                $scope.nashui = true;
                            }

                            if ($scope.zizhiArr.type == 1 && $scope.zizhiArr.inv_type == 1) {
                                $scope.type = false;
                                $scope.zzType = false;
                                $scope.nashui = false;
                            }
                            if ($scope.zizhiArr.type == 1 && $scope.zizhiArr.inv_type == 2) {
                                $scope.type = false;
                                $scope.zzType = false;
                                $scope.nashui = false;
                            }
                        };

                    }).error(function (data, staus) {
                        layer.close(cool);
                        if (staus == 401) {
                            ////layer.msg('用户失效，请重新登录');
                            ipCookie.remove('has_login');
                            ipCookie.remove('token');
                            location.href = "/default.html";
                        }
                    })
                };
                $scope.invMessageFn();
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options)
        };

        //添加新资质
        $scope.addNew = function () {
            $scope.zizhiArr = {};
            $scope.invMessageFn();
            $(".js_adbr").slideDown();
        };
        //发票信息管理数据
        $scope.invMessageFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/inv_role',
                data: $scope.invMessageList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
                $scope.invMessageData = data;

                $scope.zizhiArr = {
                    type: 1,
                    inv_type: 1
                };

                $scope.type = false;
                $scope.zzType = false;
                $scope.changeType = function () {
                    //console.log($scope.zizhiArr);
                    if ($scope.zizhiArr.type == 2) {
                        $scope.type = true;
                        $scope.zzType = true;
                    }

                    if ($scope.zizhiArr.type == 2 && $scope.zizhiArr.inv_type == 1) {
                        $scope.type = false;
                        $scope.zzType = true;
                        $scope.nashui = true;
                    }

                    if ($scope.zizhiArr.type == 1 && $scope.zizhiArr.inv_type == 1) {
                        $scope.type = false;
                        $scope.zzType = false;
                        $scope.nashui = false;
                    }
                    if ($scope.zizhiArr.type == 1 && $scope.zizhiArr.inv_type == 2) {
                        $scope.type = false;
                        $scope.zzType = false;
                        $scope.nashui = false;
                    }
                };

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
        $scope.invMessageFn();

        //发票信息管理编辑
        $scope.fpbianji = function (id, fp) {
            $(".js_adbr").slideDown();
            //编辑或提交参数
            $scope.zizhiArr = {
                ivid: fp.ivid,
                type: fp.type,
                payee: fp.payee,
                inv_type: fp.inv_type,
                company: fp.company,
                sw_sn: fp.sw_sn,
                bank_name: fp.bank_name,
                bank_sn: fp.bank_sn,
                address: fp.address,
                tel: fp.tel,
                yyzz: fp.yyzz,
                swdj: fp.swdj,
                zgez: fp.zgez,
                taxpayer_num: fp.taxpayer_num
            };
        };


        //获取执照复印件 base64编码
        $scope.imgPreview = function (event) {
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            //获取文件
            //var file = angular.element(e.target).files[0];
            var file = document.getElementById("file").files[0];
            var imageType = /^image\//;
            //是否是图片
            if (!imageType.test(file.type)) {
                alert("请选择图片！");
                return;
            }
            //转码
            //读取完成
            reader.onload = function (e) {
                //获取图片dom
                var img = document.getElementById("preview");
                //图片路径设置为读取的图片
                $scope.img_ava = e.target.result;
                img.src = $scope.img_ava;
                $scope.zizhiArr.yyzz = $scope.img_ava;
            };
            reader.readAsDataURL(file);
        };

        //获取税务登记复印件 base64编码
        $scope.swdjPreview = function (event) {
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            //获取文件
            //var file = angular.element(e.target).files[0];
            var file = document.getElementById("swdjfile").files[0];
            var imageType = /^image\//;
            //是否是图片
            if (!imageType.test(file.type)) {
                alert("请选择图片！");
                return;
            }
            //转码
            //读取完成
            reader.onload = function (e) {
                //获取图片dom
                var img = document.getElementById("swdjPreview");
                //图片路径设置为读取的图片
                $scope.img_ava = e.target.result;
                img.src = $scope.img_ava;
                $scope.zizhiArr.swdj = $scope.img_ava;
            };
            reader.readAsDataURL(file);
        };

        //获取资格认证复印件 base64编码
        $scope.zgezPreview = function (event) {
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            //获取文件
            //var file = angular.element(e.target).files[0];
            var file = document.getElementById("zgezfile").files[0];
            var imageType = /^image\//;
            //是否是图片
            if (!imageType.test(file.type)) {
                alert("请选择图片！");
                return;
            }
            //转码
            //读取完成
            reader.onload = function (e) {
                //获取图片dom
                var img = document.getElementById("zgezPreview");
                //图片路径设置为读取的图片
                $scope.img_ava = e.target.result;
                img.src = $scope.img_ava;
                $scope.zizhiArr.zgez = $scope.img_ava;
            };
            reader.readAsDataURL(file);
        };

        //添加发票资质提交
        $scope.submitZz = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/update_inv',
                data: $scope.zizhiArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg(data.info);
                    $scope.invMessageFn();
                } else {
                    layer.msg(data.info);
                }
            })
            //console.log($scope.zizhiArr);
        };
    }])
    //个人中心-返修退换货-返修/退换货
    .controller('returnRepair-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.goto();
        $scope.repairList = {
            page: 1,
            size: 10,
            order_sn: '',
            cat_id: '',
            min: '',
            max: '',
            suppliers_id: ''
        };
        $scope.listZk = function () {
            // setTimeout(function(){
            var arrow = 1;
            $('.div_r_ul_box .need_lk').click(function () {
                $('.div_r_ul_box .need_lk').siblings().removeClass('hei');
                $('.div_r_ul_box .need_lk').removeClass('oni');
                if (arrow == 1) {
                    $(this).text('收起');
                    $(this).siblings().addClass('hei');
                    $(this).addClass('oni');
                    arrow = 0;
                } else {
                    $(this).text('查看更多');
                    $('.div_r_ul_box .need_lk').siblings().removeClass('hei');
                    $('.div_r_ul_box .need_lk').removeClass('oni');
                    arrow = 1;
                }
            })
            // },200)
        };
        // $scope.goSelect = function(){
        //     $state.go('person-inv-select');
        // };
        // //时间检索
        // $scope.searchInvoices = function(){
        //     $scope.invoicesList.time = $scope.startTime;
        //     $scope.invoicesFn();
        // };
        $scope.repairFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/order_repair',
                data: $scope.repairList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
                $scope.repairData = data;

            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.repairFn();


        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.repairList.page = index + 1;
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/order_repair',
                    data: $scope.repairList,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.repairData = data;
                })
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options)
        };

        //单选
        //$scope.sqsArr = [];
        $scope.sqs = function (index, pIndex, ppIndex, select) {
            // for(var k = 0;k<$scope.repairData.list[ppIndex].goods[pIndex].goods_list[index].attrs.length;k++){
            //     var arr1 = [];
            //     if($scope.allGoods.orders.goods_ids.indexOf($scope.repairData.list[ppIndex].goods[pIndex].goods_list[index].attrs[k].goods_id)>-1){
            //         arr1.splice($scope.allGoods.orders.goods_ids.indexOf($scope.repairData.list[ppIndex].goods[pIndex].goods_list[index].attrs[k].rec_id),1);
            //     } else{
            //         arr1.push($scope.repairData.list[ppIndex].goods[pIndex].goods_list.rec_id);
            //     }
            //     $scope.allGoods.orders.goods_ids.push(arr1);
            //
            // }
            // //console.log($scope.allGoods);


            // $scope.allGoods.orders.rec_ids = [];
            // $scope.allGoods.orders.order_ids = [];
            //
            // $scope.allGoods.orders.order_ids.push($scope.repairData.list[index].goods_id);
            // $scope.allGoods.orders.rec_ids.push($scope.repairData.list[index].rec_id);
            // //console.log($scope.allGoods);

            //其中一个不选，取消全选
            for (var i = 0, item1 = $scope.repairData.list; i < item1.length; i++) {
                if ($scope.allGoods.orders.rec_ids.length < $scope.repairData.list.length) {
                    $scope.selectall = false;
                } else {
                    $scope.selectall = true;
                }
            }
        };
        //全选
        $scope.allGoods = {
            type: '',
            // orders:{
            //     order_ids:[],
            //     goods_ids:[]
            // }
            orders: {
                order_ids: [],
                rec_ids: []
            }
        };


        $scope.sqAlls = function (all) {

            if (all == true) {

                // for(var i = 0,item1= $scope.repairData.list;i<item1.length;i++){
                //     for(var j=0,item2 = item1[i].goods;j<item2.length;j++){
                //         $scope.repairData.list[i].goods[j].select = true;
                //     }
                // }

                for (var i = 0, item1 = $scope.repairData.list; i < item1.length; i++) {
                    $scope.repairData.list[i].select = true;
                }

            } else {
                // for(var i = 0,item1= $scope.repairData.list;i<item1.length;i++){
                //     for(var j=0,item2 = item1[i].goods;j<item2.length;j++){
                //         $scope.repairData.list[i].goods[j].select = false;
                //     }
                // }

                for (var i = 0, item1 = $scope.repairData.list; i < item1.length; i++) {
                    $scope.repairData.list[i].select = false;
                }
            }
        };

        //多个提交申请-退货
        $scope.tuihuo = function (type) {
            $scope.allGoods.orders.rec_ids = [];
            $scope.allGoods.orders.order_ids = [];
            $scope.allGoods.type = type;
            // for(var i = 0,item1= $scope.repairData.list;i<item1.length;i++){
            //     for(var j=0,item2 = item1[i].goods;j<item2.length;j++){
            //         var arr1 = [];
            //         if($scope.repairData.list[i].goods[j].select){
            //             for(var k = 0,item3 = item2[j].goods_list;k<item3.length;k++){
            //                 $scope.allGoods.orders.order_ids.push($scope.repairData.list[i].goods[j].goods_list[k].goods_id);
            //                 for(var l = 0,item4 = item3[k].attrs;l<item4.length;l++){
            //                     arr1.push($scope.repairData.list[i].goods[j].goods_list[k].attrs[l].rec_id);
            //                 }
            //                 $scope.allGoods.orders.goods_ids.push(arr1);
            //             }
            //         }
            //     }
            // }

            for (var i = 0, item1 = $scope.repairData.list; i < item1.length; i++) {
                if ($scope.repairData.list[i].select) {
                    $scope.allGoods.orders.order_ids.push($scope.repairData.list[i].order_id);
                    $scope.allGoods.orders.rec_ids.push($scope.repairData.list[i].rec_id);
                }
            }
            //console.log($scope.allGoods);

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/is_goods_repair',
                data: $scope.allGoods,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
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


            // $http({
            //     method:"POST",
            //     url:''+$rootScope.ip+'/User/one_goods_repair',
            //     data:$scope.allGoods,
            //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
            // }).success(function(data) {
            //     //console.log(data);
            //     if(data.status) {
            //         $scope.isSubmit = false;
            //         $scope.lotsSubmit = true;
            //     }else{
            //         $scope.isSubmit = true;
            //         $scope.lotsSubmit = false;
            //     }
            // })



            // $http({
            //     method:"POST",
            //     url:''+$rootScope.ip+'/User/more_goods_repair',
            //     data:$scope.allGoods,
            //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
            // }).success(function(data) {
            //     //console.log(data);
            //     if(data.status) {
            //         $scope.lotsSubmit = true;
            //         $scope.isSubmit = false;
            //         $scope.afterSaleData = data;
            //         $scope.shop = data.suppliers_name;
            //
            //
            //         for(var i = 0;i<$scope.afterSaleData.order_goods.length;i++){
            //             for(var j = 0;j<$scope.afterSaleData.order_goods[i].length;j++){
            //                 if($scope.afterSaleData.order_goods[i][j].goods_number == $scope.afterSaleData.order_goods[i][j].return_number){
            //                     $scope.isAdd = true;
            //                     $scope.isReduce = false;
            //                     $scope.subArr.order_ids.push($scope.afterSaleData.order_goods[i][j].order_id);
            //                     $scope.subArr.rec_ids.rec_id.push($scope.afterSaleData.order_goods[i][j].rec_id);
            //                     $scope.subArr.rec_ids.member.push($scope.afterSaleData.order_goods[i][j].goods_number);
            //                     //console.log($scope.subArr);
            //                 }
            //             }
            //         }
            //
            //
            //         for(var i = 0;i<$scope.afterSaleData.order_goods.length;i++){
            //             for(var j = 0;j<$scope.afterSaleData.order_goods[i].length;j++) {
            //                 if(data.type == 1 && data.order_goods[i][j].server_end == 0) {
            //                     $scope.tui = 1;
            //                 }
            //                 if(data.type == 2 && data.order_goods[i][j].server_end == 0) {
            //                     $scope.huan = 1;
            //                 }
            //                 if(data.type == 3 && data.order_goods[i][j].server_end == 0) {
            //                     $scope.xiu = 1;
            //                 }
            //             }
            //         }
            //
            //     }else{
            //         layer.msg(data.info);
            //         $scope.lotsSubmit = false;
            //         $scope.isSubmit = true;
            //     }
            // })
        };

        //是否提交申请
        $scope.isSubmit = true;
        $scope.isLotsSubmit = false;
        $scope.lotsSubmit = false;
        $scope.isSuccess = false;
        //单个提交申请
        $scope.singleSqsh = function (tid, id, index) {

            $scope.allGoods.orders.rec_ids = [];
            $scope.allGoods.orders.order_ids = [];

            $scope.allGoods.orders.order_ids.push($scope.repairData.list[index].order_id);
            $scope.allGoods.orders.rec_ids.push($scope.repairData.list[index].rec_id);


            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/goods_repair_one',
                data: {
                    rec_id: id,
                    type: $scope.allGoods.type
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    $state.go('return-repair-content', {
                        id: id
                    });
                } else {
                    layer.msg(data.info);
                }
            })


            // $http({
            //     method:"POST",
            //     url:''+$rootScope.ip+'/User/more_goods_repair',
            //     data:$scope.allGoods,
            //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
            // }).success(function(data) {
            //     //console.log(data);
            //     if(data.status){
            //         $scope.isSubmit = false;
            //         $scope.lotsSubmit = true;
            //         $scope.shop = data.suppliers_name;
            //
            //
            //         $scope.afterSaleData = data;
            //
            //
            //         for(var i = 0;i<$scope.afterSaleData.order_goods.length;i++){
            //             for(var j = 0;j<$scope.afterSaleData.order_goods[i].length;j++) {
            //                 if(data.type == '' && data.order_goods[i][j].tui_end == 0) {
            //                     $scope.tui = 1;
            //                 }
            //                 if(data.type == '' && data.order_goods[i][j].huan_end == 0) {
            //                     $scope.huan = 1;
            //                 }
            //                 if(data.type == '' && data.order_goods[i][j].xiu_end == 0) {
            //                     $scope.xiu = 1;
            //                 }
            //             }
            //         }
            //
            //
            //         for(var i = 0;i<$scope.afterSaleData.order_goods.length;i++){
            //             for(var j = 0;j<$scope.afterSaleData.order_goods[i].length;j++){
            //                 if($scope.afterSaleData.order_goods[i][j].goods_number == $scope.afterSaleData.order_goods[i][j].return_number){
            //                     $scope.isAdd = true;
            //                     $scope.isReduce = false;
            //                     $scope.subArr.order_ids.push($scope.afterSaleData.order_goods[i][j].order_id);
            //                     $scope.subArr.rec_ids.rec_id.push($scope.afterSaleData.order_goods[i][j].rec_id);
            //                     $scope.subArr.rec_ids.member.push($scope.afterSaleData.order_goods[i][j].goods_number);
            //                     //console.log($scope.subArr);
            //                 }
            //             }
            //         }
            //
            //         //批量申请售后
            //         //单选
            //         // $scope.sqsArr = [];
            //         $scope.singleSelect = function(index,pIndex){
            //             if($scope.shopGoods.indexOf($scope.sqshData.goodslist[index].rec_id)>-1){
            //                 $scope.shopGoods.splice($scope.shopGoods.indexOf($scope.sqshData.goodslist[index].rec_id),1);
            //             }else{
            //                 $scope.shopGoods.push($scope.sqshData.goodslist[index].rec_id);
            //             }
            //             //console.log($scope.shopGoods);
            //
            //             //其中一个不选，取消全选
            //             if($scope.shopGoods.length<$scope.sqshData.goodslist.length){
            //                 $scope.lotsSelect = false;
            //             }else{
            //                 $scope.lotsSelect = true;
            //             }
            //         };
            //         //全选
            //         $scope.shopGoods = [];
            //         $scope.allSelect = function(all){
            //             $scope.shopGoods = [];
            //             if(all == true){
            //                 for(var i = 0;i<$scope.sqshData.goodslist.length;i++){
            //                     $scope.sqshData.goodslist[i].selects = false;
            //                     $scope.shopGoods.splice($.inArray(i,$scope.shopGoods),1);
            //                     //console.log($scope.shopGoods);
            //                 }
            //
            //             }else{
            //                 for(var i = 0;i<$scope.sqshData.goodslist.length;i++){
            //                     $scope.sqshData.goodslist[i].selects = true;
            //                     $scope.shopGoods.splice($.inArray(i,$scope.shopGoods),0,$scope.sqshData.goodslist[i].rec_id);
            //                     //console.log($scope.shopGoods);
            //                 }
            //             }
            //         };
            //     }else{
            //         $scope.isSubmit = true;
            //         $scope.isLotsSubmit = false;
            //     }
            // })
        };



        //收货地址
        $http({
            method: "GET",
            url: '' + $rootScope.ip + '/Login/region_list',
            params: ''
        })
            .success(function (data) {
                //console.log(data);
                $scope.bianjiData = data;
            })
        $scope.editData = {

        };
        //编辑里省切换
        $scope.changeProvince = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 2,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.bianjiData.city_list = data.data;
                    $scope.changeCity(pid);
                    //console.log($scope.editData);
                })
        };
        //编辑市切换
        $scope.changeCity = function (pid) {
            $http({
                method: "GET",
                url: '' + $rootScope.ip + '/User/change_region',
                params: {
                    type: 3,
                    parent_id: pid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
                .success(function (data) {
                    //console.log(data);
                    $scope.bianjiData.district_list = data.data;
                    //console.log($scope.editData);
                })
        };



        $scope.qxsq = function () {
            $scope.isSubmit = true;
            $scope.isLotsSubmit = false;
        };

        $scope.tjsq = function () {
            $scope.tjsqArr = {
                order_id: $scope.sqshData.order_info.order_id,
                rec_ids: $scope.shopGoods
            };
            //console.log($scope.tjsqArr);
            if ($scope.tjsqArr.rec_ids.length == 0) {
                layer.msg('请先勾选一个商品');
            } else {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/repair_apply',
                    data: $scope.tjsqArr,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        $scope.lotsSubmit = true;
                        $scope.isLotsSubmit = false;
                        $scope.afterSaleData = data;
                        $scope.orderSn = data.order_info.order_sn;
                        $scope.orderTime = data.order_info.formated_add_time;
                        $scope.shop = data.order_info.suppliers_name;
                        $scope.serveNum = data.order_info.order_sn;
                        $scope.expressName = data.order_info.express_name;
                        $scope.address = data.order_info.address;
                        $scope.user = data.order_info.consignee;
                        $scope.mobile = data.order_info.mobile;
                        $scope.city = data.order_info.region;

                    } else {
                        $scope.lotsSubmit = false;
                        $scope.isLotsSubmit = true;
                    }
                })
            };

        };
        $scope.subArr = {
            order_ids: [],
            rec_ids: {
                rec_id: [],
                member: []
            },
            return_img: [],
            return_way: '',
            return_type: ''
        };
        $scope.returnWay = function (way) {
            $scope.subArr.return_way = way;
        };

        $scope.imgArr = [{ img: 'img/up.jpg' }, { img: 'img/up.jpg' }, { img: 'img/up.jpg' }, { img: 'img/up.jpg' }, { img: 'img/up.jpg' }];
        $scope.isReduce = true;


        // for(var i = 0;i<$scope.afterSaleData.order_goods.length;i++) {
        //     for (var j = 0; j < $scope.afterSaleData.order_goods[i].length; j++) {
        //         $scope.num = $scope.afterSaleData.order_goods[i][j].goods_number;
        //     }
        // }
        $scope.change = function (e, num, index, pIndex) {
            // $scope.subArr.order_ids = [];
            // $scope.subArr.rec_ids.rec_id = [];
            // $scope.subArr.rec_ids.member = [];
            // $scope.subArr.order_ids.push($scope.afterSaleData.goodslist[pIndex][index].order_id);
            // $scope.subArr.rec_ids.rec_id.push($scope.afterSaleData.goodslist[pIndex][index].rec_id);
            // $scope.subArr.rec_ids.member.push($scope.afterSaleData.order_goods[pIndex][index].goods_number);

            //console.log($scope.subArr);
            if (num > 0) {
                //$scope.isReduce = false;
                angular.element(e.target).prev().removeClass('reduce');
            } else if (num == 0) {
                //$scope.isReduce = true;
                //$scope.isAdd = false;
                angular.element(e.target).prev().addClass('reduce');
                angular.element(e.target).next().removeClass('add');
            }

            if (num == $scope.afterSaleData.order_goods[pIndex][index].return_number) {
                //$scope.isAdd = true;
                angular.element(e.target).next().addClass('add');
            } else {
                //$scope.isAdd = false;
                angular.element(e.target).next().removeClass('add');
            }


            //console.log(num);
            $scope.subArr.rec_ids.member[index] = num;
        };

        //增加
        //$scope.numArr = [{}];
        $scope.add = function (e, index, pIndex) {
            // //console.log(angular.element(e.target).parent().parent().prev().html());
            // $scope.subArr.order_ids.push($scope.afterSaleData.order_goods[pIndex][index].order_id);
            // $scope.subArr.rec_ids.rec_id.push($scope.afterSaleData.order_goods[pIndex][index].rec_id);
            //$scope.subArr.rec_ids.member.push($scope.afterSaleData.order_goods[pIndex][index].goods_number);
            //console.log($scope.subArr);
            $scope.afterSaleData.order_goods[pIndex][index].goods_number++;
            $scope.subArr.rec_ids.member[index]++;
            //$scope.numberChange();
            if ($scope.afterSaleData.order_goods[pIndex][index].goods_number > 0) {
                //$scope.isReduce = false;
                angular.element(e.target).prev().prev().removeClass('reduce');
            }
            else {

            }

            if ($scope.afterSaleData.order_goods[pIndex][index].goods_number == $scope.afterSaleData.order_goods[pIndex][index].return_number) {
                //$scope.isAdd = true;
                angular.element(e.target).addClass('add');
            }

            //console.log($scope.subArr);

        };
        //减少
        $scope.reduce = function (e, index, pIndex) {
            // if($scope.subArr.order_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].order_id)>-1){
            //     $scope.subArr.order_ids.splice($scope.subArr.order_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].order_id),1);
            // }
            // $scope.subArr.order_ids.splice($scope.subArr.order_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].order_id),1);
            // $scope.subArr.rec_ids.rec_id.splice($scope.subArr.rec_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].rec_id),1);
            // $scope.subArr.rec_ids.member.splice($scope.subArr.rec_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].goods_number),1);
            //console.log($scope.subArr);
            if ($scope.afterSaleData.order_goods[pIndex][index].goods_number > 1) {
                $scope.afterSaleData.order_goods[pIndex][index].goods_number--;
                $scope.subArr.rec_ids.member[index]--;
                //$scope.numberChange();
                $scope.isAdd = false;
            } else {
                $scope.afterSaleData.order_goods[pIndex][index].goods_number = 0;
                $scope.subArr.rec_ids.member[index] = 0;
                //$scope.isReduce = true;
                //$scope.isAdd = false;

                angular.element(e.target).addClass('reduce');
                angular.element(e.target).next().next().removeClass('add');
                //$scope.numberChange();
            }

            //console.log($scope.subArr);
        };

        //修改返修信息
        //修改确认信息
        $scope.xgArr = {
            is_fapiao: 0,
            return_pay_way: 0,
            return_way: 0
        };
        $('.retur_way input').click(function (e) {
            $('.retur_way input').removeClass('select');
            $(e.target).addClass('select');

            if ($('.retur_way input').eq(0).hasClass('select')) {
                $scope.xgArr.return_pay_way = 0;
            } else if ($('.retur_way input').eq(1).hasClass('select')) {
                $scope.xgArr.return_pay_way = 1;
            }
        })

        $('.kuaidi input').click(function (e) {
            $('.kuaidi input').removeClass('select');
            $(e.target).addClass('select');

            if ($('.kuaidi input').eq(0).hasClass('select')) {
                $scope.xgArr.return_way = 0;
            } else if ($('.kuaidi input').eq(1).hasClass('select')) {
                $scope.xgArr.return_way = 1;
            }
        })

        $scope.xg = function () {
            //console.log($scope.xgArr);

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/cache_repair',
                data: $scope.xgArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                $scope.return_pay_way = data.data.return_pay_way;
                $scope.is_fapiao = data.data.is_fapiao;
                $scope.return_way = data.data.return_way;
                $scope.address = data.data.address;
                $scope.user = data.data.consignee;
                $scope.mobile = data.data.mobile;
            })
        };



        //分类筛选
        $scope.returnCatId = function (id) {
            $scope.repairList.cat_id = id;
            $scope.repairFn();
        };

        //类型筛选
        $scope.changeType = function (type) {
            $scope.repairList.type = type;
            $scope.repairFn();
        };

        //时间筛选
        $scope.changeEndTime = function (endtime) {
            $scope.repairList.max = endtime;
            $scope.repairFn();
        };

        //时间筛选
        $scope.changeStartTime = function (starttime) {
            $scope.repairList.min = starttime;
            $scope.repairFn();
        };

        //供货商筛选
        $scope.changeSuppliers = function (id) {
            $scope.repairList.suppliers_id = id;
            $scope.repairFn();
        };



        $('.fx_th_btn input').click(function (e) {
            $('.fx_th_btn input').removeClass('bt1');
            $(e.target).addClass('bt1');

            if ($('.fx_th_btn input').eq(0).hasClass('bt1')) {
                $scope.subArr.return_type = 1;
            } else if ($('.fx_th_btn input').eq(1).hasClass('bt1')) {
                $scope.subArr.return_type = 2;
            } else if ($('.fx_th_btn input').eq(2).hasClass('bt1')) {
                $scope.subArr.return_type = 3;
            }
        })

        //获取img base64编码
        $scope.imgPreview = function (index, e) {
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            //获取文件
            //var file = angular.element(e.target).files[0];
            //console.log(e);
            var file = document.getElementsByClassName("file")[index].files[0];
            var img = document.getElementsByClassName("preview")[index];
            var imageType = /^image\//;
            //是否是图片
            if (!imageType.test(file.type)) {
                alert("请选择图片！");
                return;
            }
            //转码
            //读取完成
            reader.onload = function (e) {
                //获取图片dom
                //图片路径设置为读取的图片
                $scope.img_ava = e.target.result;
                $scope.subArr.return_img[index] = $scope.img_ava;
                //console.log($scope.subArr);
                img.src = $scope.img_ava;
            };
            reader.readAsDataURL(file);
        };


        $scope.sub = function () {
            for (var i = 0; i < $scope.afterSaleData.order_goods.length; i++) {
                for (var j = 0; j < $scope.afterSaleData.order_goods[i].length; j++) {
                    if ($scope.afterSaleData.order_goods[i][j].tui_end == 0 && $scope.afterSaleData.order_goods[i][j].huan_end == 0 && $scope.afterSaleData.order_goods[i][j].xiu_end == 0) {
                        layer.msg('该商品不可售后');
                    } else {
                        //$scope.subArr.return_type = $scope.afterSaleData.type;
                        //console.log($scope.subArr);
                        if ($scope.subArr.order_ids.indexOf($scope.afterSaleData.order_goods[i][j].order_id) == -1) {
                            $scope.subArr.order_ids.push($scope.afterSaleData.order_goods[i][j].order_id);
                            //console.log($scope.subArr);
                        }
                        if ($scope.subArr.rec_ids.rec_id.indexOf($scope.afterSaleData.order_goods[i][j].rec_id) == -1) {
                            $scope.subArr.rec_ids.rec_id.push($scope.afterSaleData.order_goods[i][j].rec_id);
                            //console.log($scope.subArr);
                        }
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/User/submit_repair',
                            data: $scope.subArr,
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        }).success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                layer.msg(data.info);
                                $scope.isSuccess = true;
                                $scope.lotsSubmit = false;
                            } else {
                                layer.msg(data.info);
                            }
                        })
                    }
                }
            }
        };

    }])
    //个人中心-返修退换货-返修/退换货-申请售后
    .controller('returnRepairContent-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.goto();

        $scope.isSuccess = false;
        $scope.lotsSubmit = true;

        if ($stateParams.id) {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/goods_repair_one',
                data: {
                    rec_id: $stateParams.id,
                    type: $stateParams.type
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    // $scope.lotsSubmit = true;
                    // $scope.isSubmit = false;
                    layer.close(cool);
                    $scope.afterSaleData = data;
                    $scope.shop = data.suppliers_name;


                    for (var i = 0; i < $scope.afterSaleData.order_goods.length; i++) {
                        for (var j = 0; j < $scope.afterSaleData.order_goods[i].length; j++) {
                            if ($scope.afterSaleData.order_goods[i][j].goods_number == $scope.afterSaleData.order_goods[i][j].return_number) {
                                $scope.isAdd = true;
                                $scope.isReduce = false;
                                $scope.subArr.order_ids.push($scope.afterSaleData.order_goods[i][j].order_id);
                                $scope.subArr.rec_ids.rec_id.push($scope.afterSaleData.order_goods[i][j].rec_id);
                                $scope.subArr.rec_ids.member.push($scope.afterSaleData.order_goods[i][j].goods_number);
                                //console.log($scope.subArr);
                            }
                        }
                    }


                    for (var i = 0; i < $scope.afterSaleData.order_goods.length; i++) {
                        for (var j = 0; j < $scope.afterSaleData.order_goods[i].length; j++) {
                            if (data.type == 1 && data.order_goods[i][j].server_end == 0) {
                                $scope.tui = 1;
                            }
                            if (data.type == 2 && data.order_goods[i][j].server_end == 0) {
                                $scope.huan = 1;
                            }
                            if (data.type == 3 && data.order_goods[i][j].server_end == 0) {
                                $scope.xiu = 1;
                            }
                        }
                    }

                    for (var i = 0; i < $scope.afterSaleData.order_goods.length; i++) {
                        for (var j = 0; j < $scope.afterSaleData.order_goods[i].length; j++) {
                            if (data.type == '' && data.order_goods[i][j].tui_end == 0) {
                                $scope.tui = 1;
                            }
                            if (data.type == '' && data.order_goods[i][j].huan_end == 0) {
                                $scope.huan = 1;
                            }
                            if (data.type == '' && data.order_goods[i][j].xiu_end == 0) {
                                $scope.xiu = 1;
                            }
                        }
                    }

                } else {
                    $state.go('person-return-repair');
                    layer.msg(data.info);
                }
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        } else {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/more_goods_repair',
                data: {
                    orders: {
                        rec_ids: $stateParams.rec_ids,
                        order_ids: $stateParams.order_ids,
                    },
                    type: $stateParams.type
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    // $scope.lotsSubmit = true;
                    // $scope.isSubmit = false;
                    layer.close(cool);
                    $scope.afterSaleData = data;
                    $scope.shop = data.suppliers_name;


                    for (var i = 0, item1 = $scope.afterSaleData.arr_order_goods; i < item1.length; i++) {//供应商
                        for (var j = 0, item2 = item1[i].goods_list; j < item2.length; j++) {//商品
                            if (item2[j].goods_number == item2[j].return_number && item2[j].server_end == 1) {
                                $scope.isAdd = true;
                                $scope.isReduce = false;
                                $scope.subArr.order_ids.push(item2[j].order_id);
                                $scope.subArr.rec_ids.rec_id.push(item2[j].rec_id);
                                $scope.subArr.rec_ids.member.push(item2[j].goods_number);
                                //console.log($scope.subArr);
                            }
                        }
                    }


                    // for (var i = 0; i < $scope.afterSaleData.order_goods.length; i++) {
                    //     for (var j = 0; j < $scope.afterSaleData.order_goods[i].length; j++) {
                    //         if (data.type == 1 && data.order_goods[i][j].server_end == 0) {
                    //             $scope.tui = 1;
                    //         }else{
                    //             $scope.tui = 0;
                    //         }
                    //         if (data.type == 2 && data.order_goods[i][j].server_end == 0) {
                    //             $scope.huan = 1;
                    //         }else{
                    //             $scope.huan = 0;
                    //         }
                    //         if (data.type == 3 && data.order_goods[i][j].server_end == 0) {
                    //             $scope.xiu = 1;
                    //         }else{
                    //             $scope.xiu = 0;
                    //         }
                    //     }
                    // }

                }
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        }



        $scope.subArr = {
            order_ids: [],
            rec_ids: {
                rec_id: [],
                member: []
            },
            return_img: [],
            return_way: '',
            return_type: ''
        };
        $scope.returnWay = function (way) {
            $scope.subArr.return_way = way;
        };

        $scope.imgArr = [{ img: 'img/up.jpg' }, { img: 'img/up.jpg' }, { img: 'img/up.jpg' }, { img: 'img/up.jpg' }, { img: 'img/up.jpg' }];
        $scope.isReduce = true;

        $scope.change = function (e, num, index, pIndex) {
            // $scope.subArr.order_ids = [];
            // $scope.subArr.rec_ids.rec_id = [];
            // $scope.subArr.rec_ids.member = [];
            // $scope.subArr.order_ids.push($scope.afterSaleData.goodslist[pIndex][index].order_id);
            // $scope.subArr.rec_ids.rec_id.push($scope.afterSaleData.goodslist[pIndex][index].rec_id);
            // $scope.subArr.rec_ids.member.push($scope.afterSaleData.order_goods[pIndex][index].goods_number);

            //console.log($scope.subArr);
            if (num > 0) {
                //$scope.isReduce = false;
                angular.element(e.target).prev().removeClass('reduce');
            } else if (num == 0) {
                //$scope.isReduce = true;
                //$scope.isAdd = false;
                angular.element(e.target).prev().addClass('reduce');
                angular.element(e.target).next().removeClass('add');
            }

            if (num > $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].return_number) {
                //$scope.isAdd = true;
                $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number = $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].return_number;
                angular.element(e.target).next().addClass('add');
            }
            else if (num < 0) {
                $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number = 0;
            }
            else {
                //$scope.isAdd = false;
                angular.element(e.target).next().removeClass('add');
            }

            $scope.subArr.rec_ids.member[index] = $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number;
            //console.log(num);
        };

        //增加
        //$scope.numArr = [{}];
        $scope.add = function (e, index, pIndex) {
            // //console.log(angular.element(e.target).parent().parent().prev().html());
            // $scope.subArr.order_ids.push($scope.afterSaleData.order_goods[pIndex][index].order_id);
            // $scope.subArr.rec_ids.rec_id.push($scope.afterSaleData.order_goods[pIndex][index].rec_id);
            //$scope.subArr.rec_ids.member.push($scope.afterSaleData.order_goods[pIndex][index].goods_number);
            //console.log($scope.subArr);
            $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number++;
            $scope.subArr.rec_ids.member[index]++;
            //$scope.numberChange();
            if ($scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number > 0) {
                //$scope.isReduce = false;
                angular.element(e.target).prev().prev().removeClass('reduce');
            }
            else {

            }

            if ($scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number == $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].return_number) {
                //$scope.isAdd = true;
                angular.element(e.target).addClass('add');
            }

            //console.log($scope.subArr);

        };
        //减少
        $scope.reduce = function (e, index, pIndex) {
            // if($scope.subArr.order_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].order_id)>-1){
            //     $scope.subArr.order_ids.splice($scope.subArr.order_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].order_id),1);
            // }
            // if($scope.subArr.rec_ids.rec_id.indexOf($scope.afterSaleData.order_goods[pIndex][index].rec_id)>-1){
            //     $scope.subArr.rec_ids.rec_id.splice($scope.subArr.rec_ids.rec_id.indexOf($scope.afterSaleData.order_goods[pIndex][index].rec_id),1);
            // }


            // $scope.subArr.order_ids.splice($scope.subArr.order_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].order_id),1);
            // $scope.subArr.rec_ids.rec_id.splice($scope.subArr.rec_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].rec_id),1);
            // $scope.subArr.rec_ids.member.splice($scope.subArr.rec_ids.indexOf($scope.afterSaleData.order_goods[pIndex][index].goods_number),1);
            //console.log($scope.subArr);
            if ($scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number > 1) {
                $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number--;
                $scope.subArr.rec_ids.member[index]--;
                //$scope.numberChange();
                $scope.isAdd = false;
            } else {
                $scope.afterSaleData.arr_order_goods[pIndex].goods_list[index].goods_number = 0;
                $scope.subArr.rec_ids.member[index] = 0;
                //$scope.isReduce = true;
                //$scope.isAdd = false;
                console.log(angular.element(e.target))
                angular.element(e.target).addClass('reduce');
                angular.element(e.target).next().next().removeClass('');
                //$scope.numberChange();
            }

            //console.log($scope.subArr);
        };

        $('.fx_th_btn input').click(function (e) {
            $('.fx_th_btn input').removeClass('bt1');
            $(e.target).addClass('bt1');

            // if($('.fx_th_btn input').eq(0).hasClass('bt1')){
            //     //console.log(1)
            //     $scope.subArr.return_type=1;
            // }else if($('.fx_th_btn input').eq(1).hasClass('bt1')){
            //     //console.log(2)
            //     $scope.subArr.return_type=2;
            // }else if($('.fx_th_btn input').eq(2).hasClass('bt1')){
            //     //console.log(3)
            //     $scope.subArr.return_type=3;
            // }
        })


        $scope.getReturnType = function (num) {
            $scope.subArr.return_type = num;
        };

        //获取img base64编码
        $scope.imgPreview = function (index, e) {
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            //获取文件
            //var file = angular.element(e.target).files[0];
            //console.log(e);
            var file = document.getElementsByClassName("file")[index].files[0];
            var img = document.getElementsByClassName("preview")[index];
            var imageType = /^image\//;
            //是否是图片
            if (!imageType.test(file.type)) {
                alert("请选择图片！");
                return;
            }
            //转码
            //读取完成
            reader.onload = function (e) {
                //获取图片dom
                //图片路径设置为读取的图片
                $scope.img_ava = e.target.result;
                $scope.subArr.return_img[index] = $scope.img_ava;
                //console.log($scope.subArr);
                img.src = $scope.img_ava;
            };
            reader.readAsDataURL(file);
        };


        $scope.sub = function () {
            for (var i = 0, item1 = $scope.afterSaleData.arr_order_goods; i < item1.length; i++) {//供应商
                for (var j = 0, item2 = item1[i].goods_list; j < item2.length; j++) {//商品
                    if (item2[j].tui_end == 0 && item2[j].huan_end == 0 && item2[j].xiu_end == 0) {
                        layer.msg('该商品不可售后');
                    } else {
                        if ($scope.afterSaleData.type == '') {

                        } else {
                            $scope.subArr.return_type = $scope.afterSaleData.type;
                        }

                        //console.log($scope.subArr);
                        if ($scope.subArr.order_ids.indexOf(item2[j].order_id) == -1 && item2[j].server_end == 1) {
                            $scope.subArr.order_ids.push(item2[j].order_id);
                            //console.log($scope.subArr);
                        }
                        if ($scope.subArr.rec_ids.rec_id.indexOf(item2[j].rec_id) == -1 && item2[j].server_end == 1) {
                            $scope.subArr.rec_ids.rec_id.push(item2[j].rec_id);
                            //console.log($scope.subArr);
                        }
                    }
                }
            }


            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/submit_repair',
                data: $scope.subArr,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg(data.info);
                    $scope.isSuccess = true;
                    $scope.lotsSubmit = false;
                } else {
                    layer.msg(data.info);
                }
            })
        };

    }])
    //个人中心-返修退换货-返修/退换货记录
    .controller('returnRepairHistory-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.goto();
        $scope.repairHistroyList = {
            page: 1,
            size: 10,
            order_sn: ''
        };

        // $scope.goSelect = function(){
        //     $state.go('person-inv-select');
        // };
        // //时间检索
        // $scope.searchInvoices = function(){
        //     $scope.invoicesList.time = $scope.startTime;
        //     $scope.invoicesFn();
        // };
        $scope.repairHistroyFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/repair_list',
                data: $scope.repairHistroyList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
                $scope.repairHistoryData = data;

            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.repairHistroyFn();

        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.repairHistroyList.page = index + 1;
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/repair_list',
                    data: $scope.repairHistroyList,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.repairHistoryData = data;
                })
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options)
        };

        //查看
        $scope.islook = true;
        $scope.isSubmit = true;
        $scope.look = function (id) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/repair_info',
                data: {
                    id: id
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    $scope.islook = false;
                    $scope.lookContentData = data;
                    $scope.return_way = data.repair_info.return_way;
                    $scope.user = data.repair_info.consignee;
                    $scope.mobile = data.repair_info.mobile;
                    $scope.return_desc = data.repair_info.return_desc;
                    $scope.return_img = data.repair_info.return_img;
                    $scope.time = data.repair_info.time;
                    $scope.kdsn = data.repair_info.kdsn;
                    $scope.company = data.repair_info.company;
                    $scope.address = data.repair_info.address;
                    $scope.status = data.repair_info.return_status;
                    $scope.returnType = data.repair_info.return_type;

                    //提交服务单
                    $scope.returnArr = {
                        id: data.repair_info.return_id
                    };
                    $scope.listSubmit = function () {
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/User/fuwudan',
                            data: $scope.returnArr,
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        }).success(function (data) {
                            //console.log(data);
                            if (data.status) {
                                $scope.isSubmit = false;
                            } else {
                                layer.msg(data.info);
                                $scope.isSubmit = true;
                            }
                        })
                    };
                } else {
                    $scope.islook = true;
                    layer.msg(data.info);
                }
            })
        };


        $scope.lookMoney = function (orderid) {
            $state.go('person-repair-refund-content', {
                order_id: orderid
            })
        };


        $scope.cancelOrder = function (id) {
            layer.confirm('您确定要取消么？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/cancel_repair',
                    data: {
                        id: id
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    //console.log(data);
                    if (data.status) {
                        layer.msg('取消成功', { time: 1000 }, function () {
                            $scope.repairHistroyFn();
                        });
                    } else {
                        layer.msg('取消失败', { time: 1000 });
                    }
                })
            });
        };
    }])
    //个人中心-返修退换货-返修/退款明细
    .controller('repairRefund-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.goto();
        $scope.repairRefundList = {
            page: 1,
            size: 10,
            order_sn: $stateParams.order_sn,
            status: 5,
            type: 1
        };

        $scope.repairRefundFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/repair_list',
                data: $scope.repairRefundList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.close(cool);
                }
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
                $scope.repairRefundData = data;

            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.repairRefundFn();

        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.repairRefundList.page = index + 1;
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/repair_list',
                    data: $scope.repairRefundList,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    if (data.status) {
                        layer.close(cool);
                    }
                    $scope.repairRefundData = data;
                })
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options)
        };


        //查看
        $scope.islook = true;
        $scope.isSubmit = true;

        $scope.look = function (id) {
            // $http({
            //     method:"POST",
            //     url:''+$rootScope.ip+'/User/repair_info',
            //     data:{
            //         id:id
            //     },
            //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
            // }).success(function(data) {
            //     //console.log(data);
            //     if(data.status){
            //         $scope.islook = false;
            //         $scope.lookContentData = data;
            //         $scope.return_way = data.repair_info.return_way;
            //         $scope.user = data.repair_info.consignee;
            //         $scope.mobile = data.repair_info.mobile;
            //         $scope.return_desc = data.repair_info.return_desc;
            //         $scope.return_img = data.repair_info.return_img;
            //         $scope.time = data.repair_info.time;
            //         $scope.kdsn = data.repair_info.kdsn;
            //         $scope.company = data.repair_info.company;
            //         $scope.address = data.repair_info.address;
            //         $scope.status = data.repair_info.return_status;
            //         $scope.returnType = data.repair_info.return_type;
            //
            //         //提交服务单
            //         $scope.returnArr = {
            //             return_id:data.repair_info.return_id
            //         };
            //         $scope.listSubmit = function(){
            //             $http({
            //                 method:"POST",
            //                 url:''+$rootScope.ip+'/User/repair_info',
            //                 data:$scope.returnArr,
            //                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
            //             }).success(function(data) {
            //                 //console.log(data);
            //                 if(data.status){
            //                     $scope.isSubmit = false;
            //                 }else{
            //                     layer.msg(data.info);
            //                     $scope.isSubmit = true;
            //                 }
            //             })
            //         };
            //     }else{
            //         $scope.islook = true;
            //         layer.msg(data.info);
            //     }
            // })
            $state.go('person-repair-refund-content', {
                order_id: id
            })
        };
    }])
    //个人中心-返修退换货-返修/退款明细详情页
    .controller('repairRefundContent-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.goto();
        //查看
        //$scope.islook = true;
        $scope.isSubmit = true;

        var cool = layer.load(0, { shade: [0.3, '#fff'] });
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/repair_info',
            data: {
                id: $stateParams.order_id
            },
            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
        }).success(function (data) {
            //console.log(data);
            if (data.status) {
                //$scope.islook = false;
                layer.close(cool);
                $scope.lookContentData = data;
                $scope.return_way = data.repair_info.return_way;
                $scope.user = data.repair_info.consignee;
                $scope.mobile = data.repair_info.mobile;
                $scope.return_desc = data.repair_info.return_desc;
                $scope.return_img = data.repair_info.return_img;
                $scope.time = data.repair_info.time;
                $scope.kdsn = data.repair_info.kdsn;
                $scope.company = data.repair_info.company;
                $scope.address = data.repair_info.address;
                $scope.status = data.repair_info.return_status;
                $scope.returnType = data.repair_info.return_type;

                //提交服务单
                $scope.returnArr = {
                    return_id: data.repair_info.return_id
                };
                $scope.listSubmit = function () {
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/User/fuwudan',
                        data: $scope.returnArr,
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                        //console.log(data);
                        if (data.status) {
                            $scope.isSubmit = false;
                        } else {
                            layer.msg(data.info);
                            $scope.isSubmit = true;
                        }
                    })
                };
            } else {
                $scope.islook = true;
                layer.msg(data.info);
            }
        }).error(function (data, staus) {
            layer.close(cool);
            if (staus == 401) {
                ////layer.msg('用户失效，请重新登录');
                ipCookie.remove('has_login');
                ipCookie.remove('token');
                location.href = "/default.html";
            }
        })


    }])
    //个人中心-返修退换货-返修/返修明细
    .controller('returnMoney-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        $scope.goto();
        $scope.repairRefundList = {
            page: 1,
            size: 10,
            order_sn: '',
            status: 5,
            type: 3
        };

        $scope.repairRefundFn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/repair_list',
                data: $scope.repairRefundList,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                $scope.getGoods(data);
                $scope.totalSize = data.pages;
                $scope.repairRefundData = data;

            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.repairRefundFn();

        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                $scope.repairRefundList.page = index + 1;
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/User/repair_list',
                    data: $scope.repairRefundList,
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    $scope.repairRefundData = data;
                })
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options)
        };


        //查看
        $scope.islook = true;
        $scope.isSubmit = true;
        $scope.look = function (id) {
            // $http({
            //     method:"POST",
            //     url:''+$rootScope.ip+'/User/repair_info',
            //     data:{
            //         id:id
            //     },
            //     headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
            // }).success(function(data) {
            //     //console.log(data);
            //     if(data.status){
            //         $scope.islook = false;
            //         $scope.lookContentData = data;
            //         $scope.return_way = data.repair_info.return_way;
            //         $scope.user = data.repair_info.consignee;
            //         $scope.mobile = data.repair_info.mobile;
            //         $scope.return_desc = data.repair_info.return_desc;
            //         $scope.return_img = data.repair_info.return_img;
            //         $scope.time = data.repair_info.time;
            //         $scope.kdsn = data.repair_info.kdsn;
            //         $scope.company = data.repair_info.company;
            //         $scope.address = data.repair_info.address;
            //         $scope.status = data.repair_info.return_status;
            //         $scope.returnType = data.repair_info.return_type;
            //
            //         //提交服务单
            //         $scope.returnArr = {
            //             return_id:data.repair_info.return_id
            //         };
            //         $scope.listSubmit = function(){
            //             $http({
            //                 method:"POST",
            //                 url:''+$rootScope.ip+'/User/repair_info',
            //                 data:$scope.returnArr,
            //                 headers:{'Authorization':'Basic ' + btoa(ipCookie('token') + ':')}
            //             }).success(function(data) {
            //                 //console.log(data);
            //                 if(data.status){
            //                     $scope.isSubmit = false;
            //                 }else{
            //                     layer.msg(data.info);
            //                     $scope.isSubmit = true;
            //                 }
            //             })
            //         };
            //     }else{
            //         $scope.islook = true;
            //         layer.msg(data.info);
            //     }
            // })
            $state.go('person-repair-refund-content', {
                order_id: id
            })
        };
    }])
    //收藏的店铺
    .controller('collectShop-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', function ($scope, $rootScope, $state, $http, ipCookie, $window, $data) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;
        $scope.goto();
        $scope.getData = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $data.collectionShop().success(function (data) {
                if (data.status == 0) {
                    layer.msg(data.info, { icon: 1, time: 1000 })
                } else {
                    layer.close(cool);
                    $scope.collectShop = data;
                }
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        }
        $scope.getData();
        //		取消收藏店铺
        $scope.qxCollectShop = function (ids) {
            $data.delCollectionShop({
                shop_ids: ids,
            }).success(function (data) {
                if (data.status == 0) {
                    layer.msg(data.info, { icon: 2, time: 1000 })
                } else {
                    layer.msg(data.info, { icon: 1, time: 1000 }, function () {
                        $scope.getData();
                    })
                }
            })
        }

        /* 批量取消收藏 */
        $scope.delSelectedCollectionShop = function () {
            $scope.ids = [];
            /* $scope.checkbox = function(item){
                var index = $scope.ids.indexOf(item.rec_id)
                if(index>-1){
                    $scope.ids.splice(index,1);
                }else{
                    $scope.ids.push(item.rec_id);
                }
                //console.log($scope.ids)
            } */
            for (var i = 0, item = $scope.collectGoods.data; i < item.length; i++) {
                if (item[i].selected) {
                    $scope.ids.push(item[i].rec_id);
                }
            }
            //console.log($scope.ids)
            $scope.delCollectionGoods($scope.ids)
        }
        /* 全选按钮 */
        $scope.checkAll = function (checked) {
            if (checked) {
                for (var i = 0, item = $scope.collectGoods.data; i < item.length; i++) {
                    item[i].selected = true
                }
            } else {
                for (var i = 0, item = $scope.collectGoods.data; i < item.length; i++) {
                    item[i].selected = false;
                }
            }
        }
        /* 批量加入购物车 */
        $scope.addAllToCart = function () {
            layer.msg('批量加入购物车暂未开放', { time: 1000 })
        }
        /* 遍历完成之后dom操作 */
        $scope.renderJs = function () {
            setTimeout(function () {

                /* 内层图片滚动切换 */
                $(".slideGroup .slideBox").slide({ mainCell: "ul", vis: 4, scroll: 1, prevCell: ".sPrev", nextCell: ".sNext", effect: "leftLoop", pageStateCell: ".pageSt" });
                /* 外层tab切换 */
                $(".slideGroup").slide({ titCell: ".parHd li", mainCell: ".parBd", autoPage: false, trigger: "click" });
            }, 20);
        }
        $scope.openService = function () {
            layer.msg('该功能暂未开放', { time: 1000 })
        }
    }])
    //收藏的商品
    .controller('collectGoods-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', function ($scope, $rootScope, $state, $http, ipCookie, $window, $data) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;

        $scope.collectList = {
            page: 1,
            size: 12
        };

        $scope.getData = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $data.collectionList($scope.collectList).success(function (data) {
                if (data.status == 0) {
                    layer.msg(data.info, { icon: 1, time: 1000 })
                } else {
                    layer.close(cool);
                    $scope.collectGoods = data;
                    $scope.getGoods(data);
                    $scope.totalSize = data.pages;
                }
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        }
        $scope.getData();

        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.collectList.page = index + 1;
                $scope.getDatas = function () {
                    $data.collectionList($scope.collectList).success(function (data) {
                        if (data.status == 0) {
                            layer.msg(data.info, { icon: 1, time: 1000 })
                        } else {
                            layer.close(cool);
                            $scope.collectGoods = data;
                            $scope.totalSize = data.pages;
                        }
                    })
                }
                $scope.getDatas();
            }
        };
        $scope.getGoods = function (data) {
            $('#Pagination').pagination(data.pages, $scope.options)
        };

        //取消收藏商品
        $scope.delCollectionGoods = function (ids) {
            $data.delCollectionGoods({
                rec_ids: ids,
            }).success(function (data) {
                if (data.status == 0) {
                    layer.msg(data.info, { icon: 2, time: 1000 })
                } else {
                    layer.msg(data.info, { icon: 1, time: 1000 }, function () {
                        $scope.getData();
                    })
                }
            })
        }
        /* 批量取消收藏 */
        $scope.delSelectedCollectionGoods = function () {
            $scope.ids = [];
            /* $scope.checkbox = function(item){
                var index = $scope.ids.indexOf(item.rec_id)
                if(index>-1){
                    $scope.ids.splice(index,1);
                }else{
                    $scope.ids.push(item.rec_id);
                }
                //console.log($scope.ids)
            } */
            for (var i = 0, item = $scope.collectGoods.data; i < item.length; i++) {
                if (item[i].selected) {
                    $scope.ids.push(item[i].rec_id);
                }
            }
            //console.log($scope.ids)
            $scope.delCollectionGoods($scope.ids)
        }
        /* 全选按钮 */
        $scope.checkAll = function (checked) {
            if (checked) {
                for (var i = 0, item = $scope.collectGoods.data; i < item.length; i++) {
                    item[i].selected = true
                }
            } else {
                for (var i = 0, item = $scope.collectGoods.data; i < item.length; i++) {
                    item[i].selected = false;
                }
            }
        }
        $scope.addAllToCart = function () {
            layer.msg('批量加入购物车暂未开放', { time: 1000 })
        }
        /* 遍历完成之后dom操作 */
        $scope.renderJs = function () {
            var Coupon = $(".Coupon .coupon-item");
            $(Coupon).hover(function () {
                $(this).parent().find(Coupon).removeClass("onsi");
                $(this).addClass("onsi");
            })
        }
        /* 领取优惠券 */
        $scope.sendByUser = function (id) {
            $data.sendByUser({ type_id: id }).success(function (res) {
                layer.msg(res.info, { time: 1000 }, function () {
                    if (res.status) {
                        $scope.getData();
                    }
                })
            })
        }

    }])
    //个人中心-来镜加工
    .controller('personProcess-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', function ($scope, $rootScope, $state, $http, ipCookie, $window, $data) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;


        $scope.goto();
        $scope.machiningList = {
            page: 1,
            size: 10
        };

        /* 12.1新增筛选 */
        $scope.changeStartTime = function (time) {
            $scope.machiningList.min = time;
            $scope.getData();
        }
        $scope.changeEndTime = function (time) {
            $scope.machiningList.max = time;
            $scope.getData();
        }
        $scope.repairFn = function (sn) {
            $scope.machiningList.sn = sn;
            $scope.getData();
        }


        $scope.options = {
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            items_per_page: 1, //每页显示1项
            // prev_text: "上一页",
            // next_text: "下一页",
            link_to: 'javascript:;',
            prev_show_always: false,
            next_show_always: false,
            current_page: 0,
            callback: function (index) {
                var cool = layer.load(0, { shade: [0.3, '#fff'] });
                $scope.machiningList.page = index + 1;
                $scope.getDatas = function () {
                    $data.machiningList($scope.machiningList).success(function (res) {
                        $scope.data = res;
                        //console.log(res);
                        if (res.status) {
                            layer.close(cool);
                            $("body,html").animate({
                                "scrollTop": 0
                            }, 100)
                        }
                    })
                }
                $scope.getDatas();
            }
        };
        $scope.getGoods = function (res) {
            $('#Pagination').pagination(res.pages, $scope.options)
        };

        $scope.getData = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $data.machiningList($scope.machiningList).success(function (res) {
                $scope.data = res;
                //console.log(res);
                if (res.status) {
                    layer.close(cool);
                }
                $scope.getGoods(res);
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        }
        $scope.getData();

        //		获取不同的订单信息
        //		未支付
        $data.getAllOrder({
            type: 'unpay'
        }).success(function (data) {
            $scope.orderpay = data.list.length;
        })
        $data.getAllOrder({
            type: 'collect'
        }).success(function (data) {
            $scope.orderDsh = data.list.length;
        })

        //去店铺
        $scope.goShop = function () {
            $state.go('shopHome');
        }

        //		查看更多
        $scope.lookMore = function (index, event) {
            //console.log('more');
            $(event.currentTarget).prev().css({
                'height': 'auto',
                'overflow': 'auto'
            })
        }

        //		得到订单详情信息
        $scope.goOrderDetail = function (id) {
            $state.go('person-process-content', {
                mid: id
            })
        }
        $scope.goOrderDetail1 = function (id) {
            $data.getOrderInfo({ order_id: id }).success(function (data) {
                if (data.status == 1) {
                    $state.go('order-cancel', {
                        orderId: id
                    });
                } else {
                    layer.msg(data.info, { icon: 2, time: 1000 });
                }
            })
        }

        //去商品详情页
        $scope.goGoodsDetail = function (goods_id) {
            $state.go('shop-detail', {
                goods_id: goods_id
            });
        }


        //付款
        $scope.buyAgain = function (goods_id) {
            //console.log(goods_id);
            $state.go('paymentNew', { log_id: goods_id, type: 'mach' })
        }
        //输入框查询
        $scope.serchGoods = function () {
            $data.getAllOrder({
                order_number: $scope.order_number
            }).success(function (data) {
                if (data.status == 0) {
                    layer.msg('请确定输入是否正确', { icon: 2, time: 1000 })
                    //console.log($scope.order_number)
                } else {
                    $scope.AllDetial = data.list;
                    $scope.AllDetialLength = data.list.length;
                    $scope.AllOrder = data;
                    $scope.getOrd(data);
                    //console.log($scope.order_number)
                }
            })
        }

        //确认收货
        $scope.QrGet = function (mid) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Machining/receipt_make',
                data: {
                    mid: mid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    $scope.getData();
                    layer.msg(data.info, { icon: 1 })
                } else {
                    layer.msg(data.info, { icon: 2 })
                }
            })
        }
        $scope.print = function (mid) {
            window.open($state.href('person-process-print', { mid: mid }));
        }
    }])
    //个人中心-来镜加工详情页面
    .controller('personProcessContent-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', '$stateParams', function ($scope, $rootScope, $state, $http, ipCookie, $window, $data, $stateParams) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = true;

        $scope.personProcessContentFn = function () {
            // var cool = layer.load(0, {shade: [0.3,'#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Machining/machining_info',
                data: {
                    mid: $stateParams.mid
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    // layer.close(cool);
                    $scope.machInfo = data;
                    $scope.machInfoData = data.mach_list;
                    $scope.consignee = data.mach_info.consignee;
                    $scope.sn = data.mach_info.sn;
                    $scope.mobile = data.mach_info.mobile;
                    $scope.status_info = data.mach_info.status_info;
                    $scope.amount_format = data.mach_info.amount_format;
                    $scope.add_time = data.mach_info.add_time;
                    $scope.user_name = data.mach_info.user_name;
                    $scope.jh_shipping = data.mach_info.jh_shipping;
                    $scope.jh_shipping_sn = data.mach_info.jh_shipping_sn;
                    $scope.is_pay = data.mach_info.is_pay;
                    $scope.lj_shipping = data.mach_info.lj_shipping;
                    $scope.lj_shipping_sn = data.mach_info.lj_shipping_sn;
                    $scope.status = data.mach_info.status;
                    $scope.is_zb = data.is_zb;
                    $scope.shipping_code_cfg = data.shipping_code_cfg;


                    $scope.wl = data.mach_info.lj_shipping;
                    $scope.wlsn = data.mach_info.lj_shipping_sn;

                    $data.getWlMsg({ shipping_name: data.mach_info.jh_shipping, invoice_no: data.mach_info.jh_shipping_sn }).success(function (data) {
                        $scope.wlData1 = data.data;
                    })
                    $data.getWlMsg({ shipping_name: data.mach_info.lj_shipping, invoice_no: data.mach_info.lj_shipping_sn }).success(function (data) {
                        $scope.wlData2 = data.data;
                    })
                } else {
                    layer.msg(data.info);
                }
            }).error(function (data, staus) {
                layer.close(cool);
                if (staus == 401) {
                    ////layer.msg('用户失效，请重新登录');
                    ipCookie.remove('has_login');
                    ipCookie.remove('token');
                    location.href = "/default.html";
                }
            })
        };
        $scope.personProcessContentFn();

        $scope.liChange = function () {

            $('.nwe_process_bott_u li').eq(0).addClass('on');
            $('.new_process_tbbox>div').eq(0).addClass('show');

            $('.nwe_process_bott_u li').click(function () {
                $(this).addClass('on').siblings().removeClass('on');
                var ind = $(this).index();
                $('.new_process_tbbox>div').eq(ind).addClass('show').siblings().removeClass('show');
            })
        };

        $scope.enterWuLiu = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Machining/update_make',
                data: {
                    mid: $stateParams.mid,
                    lj_shipping: $scope.wl
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg(data.info, { time: 1000, icon: 1 }, function () {
                        $scope.personProcessContentFn();
                    });
                } else {
                    layer.msg(data.info, { time: 1000, icon: 2 });
                }
            })
        };

        $scope.enterWuLiuSn = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Machining/update_make',
                data: {
                    mid: $stateParams.mid,
                    lj_shipping_sn: $scope.wlsn
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                //console.log(data);
                if (data.status) {
                    layer.msg(data.info, { time: 1000, icon: 1 }, function () {
                        $scope.personProcessContentFn();
                    });
                } else {
                    layer.msg(data.info, { time: 1000, icon: 2 });
                }
            })
        };

    }])
    .controller('person-process-print-control', ['$scope', '$stateParams', '$data', '$sce', '$rootScope', function ($scope, $stateParams, $data, $sce, $rootScope) {
        //控制首页会员中心显隐
        $rootScope.isShow = false;
        //控制header和footer显隐
        $rootScope.change = false;
        $scope.mid = $stateParams.mid;
        $data.machiningInfoPrint({ mid: $scope.mid }).success(function (data) {
            if (data.status) {
                $scope.html = ($sce.trustAsHtml(data.info));
            }
        })

    }])
