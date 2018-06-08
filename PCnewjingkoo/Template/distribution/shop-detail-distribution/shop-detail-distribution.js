myApp.controller('shopDetailDistributionControl', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ipCookie', '$window', '$location', '$anchorScroll', '$sce', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $window, $location, $anchorScroll, $sce) {
        $rootScope.isShow = false;
        $rootScope.change = true;

        $scope.dId = $stateParams.did;
        $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Distribution/info',
            data: { id: $scope.dId },
        }).success(function (res) {
            if (res.status == 1) {
                $scope.distributionInfo = res;
                $scope.goods_id = res.info.goods_id;
                $scope.shopDetailFn();
                $scope.get_goods_attribute();
            } else if (data.status == 0) {
                layer.msg(data.info);
                history.back();
            }
        })
        $scope.get_goods_attribute = function () {
            //商品详情获取商品初始类型接口
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Distribution/get_goods_attribute',
                data: { goods_id: $scope.goods_id, id: $scope.dId },
            }).success(function (data) {
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
                    //控制积分商城商品和普通商品和镜片的区别
                    $scope.isPointsMall = true;
                    $scope.pointsMall = false;
                    //商品属性为goods时调用这个接口

                    $scope.getAttrList = function (attrId, attrNumber) {
                        $scope.attrNumber = attrNumber || 1;
                        $scope.attrId = attrId;
                        $scope.isList = false;
                        $scope.goodsData = null;
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Distribution/get_attr_list',
                            data: {
                                goods_id: $scope.goods_id,
                                attr: attrId,
                                id: $scope.dId
                            },
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
                                        $scope.goodsCarParams.goods.member.push($scope.goodsData.data[t].num);
                                        var arr1 = [];
                                        var attrs = $scope.goodsData.data[t].goods_attr_id;
                                        var sAttr = $scope.goodsData.data[t].str_goods_attr;
                                        //arr1.push(attrs);
                                        $scope.goodsCarParams.goods.spec.push(attrs);
                                        $scope.goodsCarParams.goods.attr.push(sAttr);
                                    }
                                    //每次更新获取商品数量改变价格 接口
                                    //var cool = layer.load(0, { shade: [0.3, '#fff'] });
                                    $http({
                                        method: "POST",
                                        url: '' + $rootScope.ip + '/Goods/change_goods_number',
                                        data: $scope.goodsCarParams,
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
                                        $scope.isList = true;
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
        }

        $scope.scrollTopTop = function () {
            $('body,html').animate({
                'scrollTop': 0
            }, 500)
        }
        //商品详情接口
        $scope.shopDetailFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/goods_infos',
                data: { goods_id: $scope.goods_id },
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


        //领取优惠券
        $scope.lqYhq = function (tid) {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/send_by_user',
                data: {
                    type_id: tid
                },
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
            })
                .success(function (data) {
                    if (data.status) {
                        $scope.regionArr.region_id = region;
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Goods/set_area',
                            data: $scope.regionArr,
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
            item.zhujing = '';
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/get_zhujing',
                data: {
                    goods_id: $scope.goods_id,
                    item: item.qiujing
                },
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
                    goods_id: $scope.goods_id,
                    attr: spcArr,
                    qiujing: item.qiujing,
                    zhujing: item.zhujing
                },
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
            }
            if (!$scope.goodsSpectaclesCarParams.goods.zhujing[$scope.arr.length - 1] && !$scope.goodsSpectaclesCarParams.goods.qiujing[$scope.arr.length - 1]) {
                layer.msg('商品球镜柱镜属性不能为空', { time: 1000 });
            } else {
                $scope.arr.push({ member: 1, subprice: '0.00', price: '0.00' });
            }
        };
        //删除一行
        $scope.delTr = function (index) {
            if ($scope.arr.length == 1) {
                layer.msg('给留一件吧亲');
            }
            else if (index >= 0) {
                $scope.arr.splice(index, 1);
            } else {
                $scope.arr.pop();
            }

        };
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
            if (!$scope.goodsSpectaclesCarParams.goods.zhujing[$scope.arr.length - 1] && !$scope.goodsSpectaclesCarParams.goods.qiujing[$scope.arr.length - 1]) {
                //layer.msg('商品球镜柱镜属性不能为空',{time:1000});
            }
            //镜片加入购物车接口
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/add_to_cart_spec_jp',
                data: $scope.goodsSpectaclesCarParams,
            })
                .success(function (data) {
                    success ? success(data) : null;
                })
        }
        //普通商品购买
        $scope.add_to_cart_spec = function (success) {

            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Goods/add_to_cart_spec',
                data: $scope.goodsCarParams,
            })
                .success(function (data) {
                    success ? success(data) : null;

                })
        }
        //加入购物车
        $scope.joinCar = function () {
            //镜片加入购物车
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Distribution/checkout',
                data: {
                    id: $scope.dId
                },
            }).success(function (data) {
                layer.close(cool);
                if (data.status == 1) {
                    $state.go('checkout-distribution', { did: $scope.dId });
                } else if (data.status == -2) {
                    layer.confirm('需要医疗器械许可证，是否上传', {
                        btn: ['确定', '取消'], //按钮
                        btnAlign: 'c',
                        yes: function (index) {
                            $state.go('person-qy-msg');
                            layer.close(index);
                        },
                        btn2: function (index) {
                            layer.close(index);
                        }
                        // closeBtn: 0
                    });
                } else {
                    layer.msg(data.info, { time: 3000 });
                }
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
        //立即购买
        $scope.buyNow = function () {
            //镜片购买
            if ($scope.spectaclesData.goods_type == "goods_spectacles") {
                $scope.add_to_cart_spec_jp(function (data) {
                    if (data.status == -1) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data.status == 1) {
                        layer.msg(data.info, { time: 1000 });
                        // $rootScope.$broadcast('upCarList');
                        $state.go('shop-car');
                    } else if (data.status == 0) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data.status == -2) {
                        layer.confirm('需要医疗器械许可证，是否上传', {
                            btn: ['确定', '取消'], //按钮
                            btnAlign: 'c',
                            yes: function (index) {
                                $state.go('person-qy-msg');
                                layer.close(index);
                            },
                            btn2: function (index) {
                                layer.close(index);
                            }
                            // closeBtn: 0
                        });
                    }
                })
            }
            //普通商品购买
            else if ($scope.spectaclesData.goods_type == "goods") {
                //普通商品加入购物车接口
                $scope.add_to_cart_spec(function (data) {
                    if (data.status == -1) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data.status == 1) {
                        layer.msg(data.info, { time: 1000 });
                        // $rootScope.$broadcast('upCarList');
                        $state.go('shop-car');
                    } else if (data.status == 0) {
                        layer.msg(data.info, { time: 1000 });
                    } else if (data == 'null') {
                        layer.msg('商品数量不能为零', { time: 1000 });
                    } else if (data.status == -2) {
                        layer.confirm('需要医疗器械许可证，是否上传', {
                            btn: ['确定', '取消'], //按钮
                            btnAlign: 'c',
                            yes: function (index) {
                                $state.go('person-qy-msg');
                                layer.close(index);
                            },
                            btn2: function (index) {
                                layer.close(index);
                            }
                            // closeBtn: 0
                        });
                    }
                })
            }
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