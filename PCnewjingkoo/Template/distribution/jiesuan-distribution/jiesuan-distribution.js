
angular.module('CheckoutDistributionModule', [])

    .controller('checkoutDistributionControl', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function ($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
        $rootScope.isShow = false;
        $rootScope.change = true;
        // $scope.returnCar = function(){
        //   $state.go('shop-car');
        // };
        $scope.dId = $stateParams.did;
        /* —————————————— 保存用户备注信息 —————————————— */
        $scope.getNotes = function () {

                var commentArr = ($scope.jiesuanData.suppliers_notes)
            var sArr = []
            for (var j = 0; j < $scope.jiesuanData.order_label.length; j++) {
                if ($scope.jiesuanData.order_label[j].selected) {
                    sArr.push(j)
                }
            }
            return {
                note: commentArr,
                label: sArr
            }
        }
        $scope.saveNotes = function () {
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Distribution/write_notes',
                data: {
                    notes: $scope.getNotes(),
                    id: $scope.dId
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            })
        }
        //结算页所有信息接口数据
        $scope.jiesuanFn = function () {
            var cool = layer.load(0, { shade: [0.3, '#fff'] });
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/Distribution/checkout',
                data: {
                    id: $scope.dId
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                layer.close(cool);
                if (data.status == 1) {
                    $scope.jiesuanData = data;
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
                    /* //个人信息面板信息
                    $http({
                        method: "POST",
                        url: '' + $rootScope.ip + '/User/user_info',
                        data: '',
                        headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                    }).success(function (data) {
                            $scope.payPoints = data.user_info.pay_points;
                        }) */
                } else if (data.status == -2) {
                    layer.confirm('需要医疗器械许可证，是否上传', {
                        btn: ['确定', '取消'], //按钮
                        btnAlign: 'c',
                        yes: function (index) {
                            $state.go('person-qy-msg');
                            layer.close(index);
                        },
                        btn2: function (index) {
                            $state.go('shop-car');
                            layer.close(index);
                        }
                        // closeBtn: 0
                    });
                } else {
                    layer.msg(data.info, { time: 3000 });
                    history.back();
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
                url: '' + $rootScope.ip + '/Distribution/change_consignee',
                data: {
                    address_id: id,
                    id: $scope.dId
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
                if (data.status) {
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
            }).success(function (data) {
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
            }).success(function (data) {
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
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/edit_address',
                data: $scope.editData,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
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
            }).success(function (data) {
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
            }).success(function (data) {
                $scope.disDatas = data;
                $scope.bianjiData.district_list = data.data;
            })
        };
        $scope.addSetMoren = function (mor) {
            if (mor == true) {
                $scope.eeditData.default = 1;
            } else {
                $scope.eeditData.default = 0;
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
            }).success(function (data) {
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
            $http({
                method: "POST",
                url: '' + $rootScope.ip + '/User/add_address',
                data: $scope.eeditData,
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
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
            }).success(function (data) {
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
            }).success(function (data) {
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
            }).success(function (data) {
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
                url: '' + $rootScope.ip + '/Distribution/select_payment',
                data: {
                    pay_id: id,
                    id: $scope.dId
                },
                headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
            }).success(function (data) {
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
            }).success(function (data) {
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
            }).success(function (data) {
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
            }).success(function (data) {
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
        }).success(function (data) {
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
                }).success(function (data) {
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
                }).success(function (data) {
                    if (data.status) {
                        $scope.jiesuanFn();
                    }
                })
            }
        };
        $scope.submitList = function (e, index) {
            if ($scope.yeIf) {
                $http({
                    method: "POST",
                    url: '' + $rootScope.ip + '/Flow/check_pay_pass',
                    data: {
                        password: $scope.pass
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    if (data.status) {
                        $http({
                            method: "POST",
                            url: '' + $rootScope.ip + '/Distribution/done',
                            data: {
                                notes: $scope.getNotes(),
                                id: $scope.dId
                            },
                            headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                        })
                            .success(function (data) {
                                if (data.status == 1) {
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
                    url: '' + $rootScope.ip + '/Distribution/done',
                    data: {
                        notes: $scope.getNotes(),
                        id: $scope.dId
                    },
                    headers: { 'Authorization': 'Basic ' + btoa(ipCookie('token') + ':') }
                }).success(function (data) {
                    if (data.status == 1) {
                        layer.msg(data.info, { time: 1000 });
                        $state.go('paymentNew', {
                            order_id: data.order_id,
                            type: 'order'
                        });
                    } else if (data.status == -2) {
                        layer.msg(data.info, { time: 3000 });
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