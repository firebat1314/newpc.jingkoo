angular.module('myApp.user-controllers', ['ipCookie', 'ngSanitize'])
   //主控制
   .controller('logoCenter-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', '$window', '$location', '$anchorScroll', function($scope, $rootScope, $state, $http, ipCookie, $data, $window, $location, $anchorScroll) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

      $rootScope.goto = function() {
         $location.hash('');
         $anchorScroll.yOffset = 1;
         $anchorScroll();
      };
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });

      $rootScope.ip = $data.ip;

      $scope.getUserMsgHs = function() {
         $data.getUserMsg().success(function(data) {
            layer.close(cool);
            if (data.status == 1) {
               $scope.avatarData = data;
            } else {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            }
         })
      }
      $scope.getUserMsgHs();


      $scope.imgPreview = function(event) {
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
         reader.onload = function(e) {
            //获取图片dom
            var img = document.getElementById("preview");
            //图片路径设置为读取的图片
            $scope.img_ava = e.target.result;
            img.src = $scope.img_ava;
            $data.changeAvater({
               avatar: $scope.img_ava
            }).success(function(data) {
               if (data.status == 0) {
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  });
               } else {
                  layer.msg(data.info, {
                     icon: 1,
                     time: 3000
                  });
               }
            })
         };
         reader.readAsDataURL(file);

      }
      /* 新增客服功能 */
      $rootScope.qimoChatClick = function(access_id) {
         //this.native.showLoading();
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         if (!access_id) {
            // this.native.showToast('该店铺暂无客服');
         }
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
         var timer = setInterval(function() {
            if (typeof qimoChatClick != "undefined") {
               layer.close(cool);
               clearInterval(timer)
               setTimeout(function() {
                  qimoChatClick();
               }, 500);
            }
         }, 500)
         /* qimo.onload = qimo['onreadystatechange'] = function () {
         	 //that.native.hideLoading();
         	 if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
         		 setTimeout(function () {
         			 //console.log('客服加载完成');
         			 layer.close(cool);
         			 qimoChatClick();
         		 }, 800);
         		 qimo.onload = qimo['onreadystatechange'] = null;
         	 }
          }; */
      }

   }])

   //个人消息中心
   .controller('msgCenter-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', function($scope, $rootScope, $state, $http, ipCookie, $window) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.msg_show = true;
      $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/getTidings',
            data: {},
            headers: {
               'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
            },
         })
         .success(function(data) {
            layer.close(cool);
            //定时器
            if (data.count == 0) {
               $scope.msg_show = false;
               //					$scope.dateTime = 5;
               //					$scope.interval = setInterval(function() {
               //						if($scope.dateTime > 1) {
               //							$scope.dateTime--;
               //						} else { 
               //							$state.go('control-mb');   
               //						}
               //						$scope.$digest();
               //					}, 1000);
               //					$scope.$on('$destroy', function() {
               //						clearInterval($scope.interval);
               //					})
               $scope.goBack = function() {
                  $window.history.back();
               }
            } else {
               $scope.msgCenter_msg = data;
               $scope.getMsg(data);
               $scope.msg_show = true;

            }
         })

      $scope.ListPage = {
         page: 1,
         size: 10
      };

      $scope.getMsg = function(data) {
         $('#Pagination').pagination(data.pages, $scope.options)
      };
      //分页操作
      $scope.pageIndex = 0; //初始页索引
      $scope.pageSize = 10; //每页数据条数
      $scope.options = {
         num_edge_entries: 1, //边缘页数
         num_display_entries: 1, //主体页数
         items_per_page: 1, //每页显示1项
         // prev_text: "上一页",
         // next_text: "下一页",
         link_to: 'javascript:;',
         prev_show_always: false,
         next_show_always: false,
         current_page: 0,
         callback: function(index) {
            var cool = layer.load(0, {
               shade: [0.3, '#fff']
            });
            $scope.ListPage.page = index + 1;
            $http({
               method: "GET",
               url: '' + $rootScope.ip + '/User/getTidings',
               params: $scope.ListPage,
               headers: {
                  'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
               }
            }).success(function(data) {
               layer.close(cool);
               $scope.msgCenter_msg = data;
               $('html,body').animate({
                  'scrollTop': 0
               }, 500)
            })
         }
      }

   }])
   //个人中心-地区申请
   .controller('applyAddress-control', ['$scope', '$rootScope', '$state', '$http', '$data', function($scope, $rootScope, $state, $http, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.getRegionApplyPar = function() {
         $data.getRegionApply().success(function(res) {
            layer.close(cool);
            $scope.cityData = res;
            $scope.no_city = res.no_user_citys.length;
         })
      }
      $scope.getRegionApplyPar();
      //全选
      //		$scope.addressCheckall = function() {
      //			for(var i = 0; i < $scope.cityData.no_user_citys.length; i++) {
      //				$scope.cityData.no_user_citys[i].checked = true;
      //			}
      //		}
      //全不选
      //		$scope.addressReset = function() {
      //			for(var i = 0; i < $scope.cityData.no_user_citys.length; i++) {
      //				$scope.cityData.no_user_citys[i].checked = false;
      //			}
      //		}


      //营业执照上传
      $scope.dqYyzzPhoto = function(e) {
         //判断是否支持FileReader
         if (window.FileReader) {
            var reader = new FileReader();
         } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
         }
         //获取文件
         //var file = angular.element(e.target).files[0];
         var file = document.getElementById("dimg2").files[0];
         var imageType = /^image\//;
         //是否是图片
         if (!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
         }
         //转码
         reader.readAsDataURL(file);
         //读取完成
         reader.onload = function(e) {
            //获取图片dom
            var img = document.getElementById("dimg22");
            //图片路径设置为读取的图片
            img.src = e.target.result;
            $scope.yyzz = e.target.result;
            //				console.log($scope.yyzz)
         };
      }

      $scope.changeId = function(id) {
         $scope.cityId = id;
      }
      //提交信息
      $scope.onSubmit = function() {
         //			console.log($scope.cityId)

         $scope.addressFm = {
            region_ids: [$scope.cityId],
            reason: $scope.reason,
            phone: $scope.phone,
            zhizhao: $scope.yyzz,
         }
         $data.postRegionApply($scope.addressFm).success(function(res) {
            if (res.status == 0) {
               layer.msg(res.info, {
                  time: 3000,
                  icon: 2
               })
            } else {
               $scope.getRegionApplyPar();
               layer.msg(res.info, {
                  time: 3000,
                  icon: 1
               })
               $scope.reason = '';
               $state.go('person-addr-applysh');
            }
         })
      }

      //		重置列表
      $scope.onReset = function() {
         $scope.addressReset();
         $scope.reason = '';
         $('.app-neir .app-person').val('');
      }

   }])

   //个人中心-控制面板
   .controller('controlMb-control', ['$scope', '$rootScope', '$state', '$http', '$data', 'ipCookie', function($scope, $rootScope, $state, $http, $data, ipCookie) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $data.getUserMsg().success(function(data) {
         layer.close(cool);
         $scope.peopleData = data.user_info;
         $scope.rank_points = data.user_info.rank_points;
         $scope.next_points = data.user_info.next_points;
         $scope.Wid = $scope.rank_points / $scope.next_points * 100 + '%';
         $scope.haveYx = data.user_info.email;
         $scope.haveSj = data.user_info.mobile_phone;
      })

      $data.getUsercount().success(function(data) {
         if (data.status == 0) {
            layer.msg(data.info, {
               icon: 2,
               time: 3000
            })
         } else {
            $scope.usercount = data;
         }
      })

      $data.getAllOrder({
         size: 2
      }).success(function(data) {
         $scope.orderMsg = data;
      })


      //		去返修
      $scope.goFX = function() {
         $state.go('person-return-repair-history');
      }

      //		猜你喜欢
      $scope.picList = function() {
         $(".picScroll-left").slide({
            titCell: ".hd ul",
            mainCell: ".bd ul",
            autoPage: true,
            effect: "left",
            autoPlay: true,
            vis: 5,
            trigger: "click"
         });
      }

      $data.guessYouLike({
         page: 2,
         size: 3
      }).success(function(data) {
         if (data.status) {
            $scope.YouLike = data;
         }
      })

      $scope.gessGoods = function(goods_id) {
         $state.go('shop-detail', {
            goods_id: goods_id
         });
      }

      //查看所有有效订单
      $scope.lookThis = function(order_id) {
         $state.go('order-detail', {
            orderId: order_id
         });
      }
      //查看所有无效订单
      $scope.goTocancle = function(order_id) {
         $state.go('order-cancel', {
            orderId: order_id
         });
      }

      $scope.getNeedOrder = function(order) {
         $state.go('order-all', {
            type1: order,
         });
      }

      //去个人中心logo
      $scope.goPersonLogo = function() {
         $state.go('user-logo-center');
      }

   }])
   //个人中心-资金管理
   .controller('zijinMana-control', ['$scope', '$rootScope', '$state', '$http', '$data', 'ipCookie', function($scope, $rootScope, $state, $http, $data, ipCookie) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.person_pay = function() {
         $state.go('person-pay');
      }

      //资金管理
      $scope.userMoneyRecordHs = function() {
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $data.userMoneyRecord().success(function(data) {
            layer.close(cool);
            if (data.status == 0) {
               $scope.zjLen = data.recharge_list.page_next;
               $scope.zjLenA = data.recharge_list.length;
            } else {
               $scope.zjList = data;
               $scope.zjLen = data.recharge_list.page_next;
               $scope.zjLenA = data.recharge_list.length;
            }
         })
      }
      $scope.userMoneyRecordHs();

      var next = 1;
      $scope.up_page = function() {
         //var up = next++;
         if ($scope.zjList.recharge_list.page_next != false) {
            next++;
            var cool = layer.load(0, {
               shade: [0.3, '#fff']
            });
            $data.userMoneyRecord({
               page: next
            }).success(function(data) {
               layer.close(cool);
               if (data.status == 0) {
                  layer.msg(data.info);
               } else {
                  $scope.zjList = data;
               }
            })
         }
      }
      //up = next;

      $scope.down_page = function() {
         if (next != 1) {
            //var down = next--;
            next--;
            var cool = layer.load(0, {
               shade: [0.3, '#fff']
            });
            $data.userMoneyRecord({
               page: next
            }).success(function(data) {
               layer.close(cool);
               if (data.status == 0) {
                  layer.msg(data.info);
               } else {
                  $scope.zjList = data;
               }
            })
         } else {

         }
      }

      $scope.ListPage = {
         page: 1,
         size: 10,
      };

      $scope.zjPages = function(data) {
         $('#Pagination').pagination(data.pages, $scope.options)
      };
      //分页操作
      $scope.pageIndex = 0; //初始页索引
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
         current_page: 0,
         callback: function(index) {
            var cool = layer.load(0, {
               shade: [0.3, '#fff']
            });
            $scope.ListPage.page = index + 1;
            $data.userMoneyRecord($scope.ListPage).success(function(data) {
               layer.close(cool);
               $scope.zjList = data;
               $('html,body').animate({
                  'scrollTop': 0
               }, 500)
            })
         }
      }


      $scope.goPay = function(id) {

         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/again_recharge',
            data: {
               id: id
            },
            headers: {
               'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
            },
         }).success(function(data) {
            //console.log(data); 
            $scope.isWx = data.is_weixin;

            if (data.is_weixin == 0) {

               pingpp.createPayment(data.pingxx, function(result, err) {
                  //console.log(result, err); 
                  if (result == "success") {
                     // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                  } else if (result == "fail") {
                     // charge 不正确或者微信公众账号支付失败时会在此处返回
                  } else if (result == "cancel") {
                     // 微信公众账号支付取消支付
                  }
               });
            } else {
               $state.go('erweimaPayNew', {
                  url: data.wx_url
               });
            }

         })
      }

      //			if($scope.isWx){
      //				console.log(1)
      //				var goA = window.open();
      //				var gogo = $state.href('erweimaPayNew',{url:data.wx_url});
      //				goA.location.href = gogo;
      //			}else{
      //				console.log(2)
      //				return false;
      //			}



   }])
   //个人中心-安全中心
   .controller('saveCenter-control', ['$scope', '$rootScope', '$state', '$http', '$data', function($scope, $rootScope, $state, $http, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.getUserMsgHs = function() {
         $data.getUserMsg().success(function(data) {
            layer.close(cool);
            $scope.mobileP = data.user_info.is_pass;
            //				$scope.mobilePer = $scope.mobileP.substring(0, 3) + '*****' + $scope.mobileP.substring(8, 12)
            $scope.saveCd = data.user_info.security;
            $scope.haveYx = data.user_info.email;
            $scope.username = data.user_info.username;

            $scope.payPass = data.user_info.is_pay_pass;
         })
      }
      $scope.getUserMsgHs();

   }])
   //个人中心-地区申请审核
   .controller('applyAddressSh-control', ['$scope', '$rootScope', '$state', '$http', function($scope, $rootScope, $state, $http) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

   }])
   //个人中心-积分管理
   .controller('integralMana-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', function($scope, $rootScope, $state, $http, ipCookie) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.integralHs = function() {
         $http({
               method: "GET",
               url: '' + $rootScope.ip + '/User/accountLog',
               params: {
                  account_type: 'pay_points'
               },
               headers: {
                  'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
               },
            })
            .success(function(data) {
               layer.close(cool);
               if (data.status == 1) {
                  $scope.integralLegth = data.list.length;
                  if ($scope.integralLegth == 0) {
                     $scope.no_dd = true;
                  } else {
                     $scope.integralMg = data;
                     $scope.no_dd = false;
                  }
                  $scope.getIntegral(data);
               } else {
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  })
               }
            })

      }
      $scope.integralHs();
      $scope.ListPage = {
         page: 1,
         size: 10,
         account_type: 'pay_points',
      };

      $scope.getIntegral = function(data) {
         $('#Pagination').pagination(data.pages, $scope.options)
      };
      //分页操作
      $scope.pageIndex = 0; //初始页索引
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
         current_page: 0,
         callback: function(index) {
            var cool = layer.load(0, {
               shade: [0.3, '#fff']
            });
            $scope.ListPage.page = index + 1;
            $http({
               method: "GET",
               url: '' + $rootScope.ip + '/User/accountLog',
               params: $scope.ListPage,
               headers: {
                  'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
               }
            }).success(function(data) {
               layer.close(cool);
               $scope.integralMg = data;
               $('html,body').animate({
                  'scrollTop': 0
               }, 500)
            })
         }
      }

   }])
   //个人中心-提现
   .controller('depositMana-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', function($scope, $rootScope, $state, $http, ipCookie, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      //		得到银行名
      $http({
         method: "GET",
         url: '' + $rootScope.ip + '/User/brank_number',
         headers: {
            'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
         }
      }).success(function(data) {
         layer.close(cool);
         $scope.bankAll = data;
      })


      $data.getUserMsg().success(function(data) {
         $scope.yEMoney = data.user_info.user_withdrawable;
      })

      $scope.changeBank = function(code) {
         $scope.open_bank = code;
      };


      $scope.tjTxApply = function() {
         $data.userWithdrawal({
            pay: 'allinpay',
            brank_code: $scope.brank_code,
            open_bank: $scope.open_bank,
            name: $scope.name,
            amount: $scope.amount,
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               });
            } else {
               layer.msg(data.data, {
                  icon: 1,
                  time: 3000
               });
            }
         })
      }

   }])
   //个人中心-充值 
   .controller('personPay-control', ['$scope', '$rootScope', '$state', '$http', '$data', 'ipCookie', function($scope, $rootScope, $state, $http, $data, ipCookie) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

      $scope.payApply = function() {
         if ($scope.payment_id == undefined) {
            layer.msg('请选择一种支付方式', {
               icon: 2
            });
         } else {

            // $data.addAccount({
            //     amount:$scope.amount,
            //     note:$scope.note,
            //     pay:$scope.payment_id,
            // }).success(function (data) {
            //     if (data.status==0) {
            //         layer.msg(data.info,{icon:2})
            //     } else{

            if (!checkNumber($scope.amount)) {

            } else {
               var win = window.open();
            }


            //验证字符串是否是数字
            function checkNumber(theObj) {
               var reg = /^[0-9]+.?[0-9]*$/;
               if (reg.test(theObj)) {
                  return true;
               }
               return false;
            }


            $http({
               method: "POST",
               url: '' + $rootScope.ip + '/User/addAccount',
               data: {
                  amount: $scope.amount,
                  note: $scope.note,
                  pay: $scope.payment_id,
               },
            }).success(function(data) {
               $scope.log_id = data.log_id;
               if (data.status != 1) {
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  })
                  return;
               } else {
                  if ($scope.payment_id == 'alipay_pc_direct') {
                     var url = $state.href('alipayRecharge', {
                        log_id: $scope.log_id
                     });
                     win.location.href = url;
                  } else if ($scope.payment_id == 'upacp_pc') {

                     var url = $state.href('unionPayRecharge', {
                        log_id: $scope.log_id
                     });
                     win.location.href = url;
                  } else if ($scope.payment_id == 'wx_pub_qr') {

                     var url = $state.href('erweimaRecharge', {
                        log_id: $scope.log_id
                     });
                     win.location.href = url;
                  }
               }
            })

         }
      }


   }])
   //个人中心-企业设置-联系人信息
   .controller('lxrMsg-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', function($scope, $rootScope, $state, $http, ipCookie, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.getUserMsgHsa = function() {
         $data.getUserMsg().success(function(data) {
            layer.close(cool);
            $scope.getUserMsg = data;
         })
      }
      $scope.getUserMsgHsa();
      $scope.haveLx = function() {
         $data.getUserMsg().success(function(data) {
            $scope.getUserMsg = data;
         })
      }

      //编辑联系人姓名
      $scope.savePersonMsg = function(e, true_name) {
         $data.changePersonMsg({
            true_name: true_name
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.getUserMsgHsa();
            }
         })
      }
      //编辑联系人邮箱 
      $scope.savePersonY = function(e, email) {
         $data.changePersonMsg({
            email: email
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.getUserMsgHsa();
            }
         })
      }
      //编辑联系人QQ
      $scope.savePersonQ = function(e, qq) {
         $data.changePersonMsg({
            qq: qq
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.getUserMsgHsa();
            }
         })
      }

   }])
   //个人中心-企业设置-企业资料
   .controller('qyMsg-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', function($scope, $rootScope, $state, $http, ipCookie, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.saveQyHs = function() {
         $data.getUserMsg().success(function(data) {
            layer.close(cool);
            $scope.getQyMsg = data;
         })
      }
      $scope.saveQyHs();
      $scope.haveSj = function() {
         $data.getUserMsg().success(function(data) {
            $scope.getQyMsg = data;
         })
      }

      //三级联动
      /*添加城市初始城市列表*/
      $scope.addParamsData = {
         consignee: '',
         province: '',
         city: '',
         district: '',
         address: '',
         mobile: '',
         default: '',
         tel: ''
      }
      $data.changeRegion({
         type: 1,
         parent_id: 1
      }).success(function(res) {
         $scope.provinceList = res.data;
         $scope.provinceChange();
      })
      $scope.provinceChange = function() {
         $data.changeRegion({
            type: 2,
            parent_id: $scope.addParamsData.province
         }).success(function(res) {

            $scope.cityList = res.data;
            $scope.districtList = [];
            //				console.log($scope.addParamsData.city);
            $scope.cityChange();
            $scope.addParamsData.city = $scope.addParamsData.district = '';
         })
      }
      $scope.cityChange = function() {
         $data.changeRegion({
            type: 3,
            parent_id: $scope.addParamsData.city
         }).success(function(res) {
            $scope.districtList = res.data;
         })
      }

      //身份证正面上传
      $scope.sfzBefore = function(e) {
         //判断是否支持FileReader
         if (window.FileReader) {
            var reader = new FileReader();
         } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
         }
         //获取文件
         var file = document.getElementById("img0").files[0];
         var imageType = /^image\//;
         //是否是图片
         if (!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
         }
         //转码
         reader.readAsDataURL(file);
         //读取完成
         reader.onload = function(e) {
            //获取图片dom
            var img = document.getElementById("img00");
            //图片路径设置为读取的图片
            img.src = e.target.result;
            $scope.sfz_before = e.target.result;
            $data.changeQyMsg({
               zsfz: $scope.sfz_before
            }).success(function(data) {
               if (data.status == 0) {
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  });
               } else {
                  layer.msg(data.info, {
                     icon: 1,
                     time: 3000
                  });
               }
            })
         };
      }
      //身份证反面上传
      $scope.sfzBehind = function(e) {
         //判断是否支持FileReader
         if (window.FileReader) {
            var reader = new FileReader();
         } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
         }
         //获取文件
         var file = document.getElementById("img1").files[0];
         var imageType = /^image\//;
         //是否是图片
         if (!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
         }
         //转码
         reader.readAsDataURL(file);
         //读取完成
         reader.onload = function(e) {
            //获取图片dom
            var img = document.getElementById("img11");
            //图片路径设置为读取的图片
            img.src = e.target.result;
            $scope.sfz_behind = e.target.result;
            $data.changeQyMsg({
               fsfz: $scope.sfz_behind
            }).success(function(data) {
               if (data.status == 0) {
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  });
               } else {
                  layer.msg(data.info, {
                     icon: 1,
                     time: 3000
                  });
               }
            })
         };
      }
      //		营业执照
      $scope.yyzzPhoto = function(e) {
         //判断是否支持FileReader
         if (window.FileReader) {
            var reader = new FileReader();
         } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
         }
         //获取文件
         //var file = angular.element(e.target).files[0];
         var file = document.getElementById("img2").files[0];
         var imageType = /^image\//;
         //是否是图片
         if (!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
         }
         //转码
         reader.readAsDataURL(file);
         //读取完成
         reader.onload = function(e) {
            //获取图片dom
            var img = document.getElementById("img22");
            //图片路径设置为读取的图片
            img.src = e.target.result;
            $scope.yzPhoto = e.target.result;
            $data.changeQyMsg({
               zhizhao: $scope.yzPhoto
            }).success(function(data) {
               if (data.status == 0) {
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  });
               } else {
                  layer.msg(data.info, {
                     icon: 1,
                     time: 3000
                  });
               }
            })
         };
      }
      $scope.medicalPhoto = function(e) {
         //判断是否支持FileReader
         if (window.FileReader) {
            var reader = new FileReader();
         } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
         }
         //获取文件
         //var file = angular.element(e.target).files[0];
         var file = document.getElementById("img3").files[0];
         var imageType = /^image\//;
         //是否是图片
         if (!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
         }
         //转码
         reader.readAsDataURL(file);
         //读取完成
         reader.onload = function(e) {
            //获取图片dom
            var img = document.getElementById("img33");
            //图片路径设置为读取的图片
            img.src = e.target.result;
            $scope.medical = e.target.result;
            $data.changeQyMsg({
               medical: $scope.medical
            }).success(function(data) {
               if (data.status == 0) {
                  layer.msg(data.info, {
                     icon: 2,
                     time: 4000
                  });
               } else {
                  layer.msg(data.info, {
                     icon: 1,
                     time: 4000
                  });
               }
            })
         };
      }
      $scope.brankPermitPhoto = function(e) {
         console.log(e)
         //判断是否支持FileReader
         if (window.FileReader) {
            var reader = new FileReader();
         } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
         }
         //获取文件
         //var file = angular.element(e.target).files[0];
         var file = document.getElementById("img4").files[0];
         var imageType = /^image\//;
         //是否是图片
         if (!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
         }
         //转码
         reader.readAsDataURL(file);
         //读取完成
         reader.onload = function(e) {
            //获取图片dom
            var img = document.getElementById("img44");
            //图片路径设置为读取的图片
            img.src = e.target.result;
            $scope.brank_permit = e.target.result;
            $data.changeQyMsg({
               brank_permit: $scope.brank_permit
            }).success(function(data) {
               if (data.status == 0) {
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  });
               } else {
                  layer.msg(data.info, {
                     icon: 1,
                     time: 3000
                  });
               }
            })
         };
      }
      //编辑企业信息
      $scope.saveQyName = function(e, company) {
         $data.changeQyMsg({
            company: company
         }).success(function(data) {

            $scope.addParamsData = {
               province: '',
               city: '',
               district: '',
            }
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.saveQyHs();
            }
         })
      }
      //编辑经营所在地
      $scope.saveQyJyszd = function(e) {

         $data.changeQyMsg($scope.addParamsData).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $(e.currentTarget).parent().parent().find('.shur .stxt').val('');
               $scope.saveQyHs();
            }
         })
      }
      //编辑经营地址
      $scope.saveQyJydz = function(e, address) {
         $data.changeQyMsg({
            address: address
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.saveQyHs();
            }
         })
      }
      //编辑注册电话
      $scope.saveQyTel = function(e, zctel) {
         $data.changeQyMsg({
            zctel: zctel
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.saveQyHs();
            }
         })
      }
      //编辑银行开户许可证号
      $scope.saveQyYh = function(e, xk) {
         $data.changeQyMsg({
            xk: xk
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.saveQyHs();
            }
         })
      }
      //编辑营业执照编号
      $scope.saveQyYyzzsn = function(e, yyzzsn) {
         $data.changeQyMsg({
            yyzzsn: yyzzsn
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.saveQyHs();
            }
         })
      }
      //编辑法人信息
      $scope.saveQyFr = function(e, fr) {
         $data.changeQyMsg({
            fr: fr
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.saveQyHs();
            }
         })
      }
      //编辑身份证号
      $scope.saveQyCodeSn = function(e, code_sn) {
         $data.changeQyMsg({
            code_sn: code_sn
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.saveQyHs();
            }
         })
      }
      //编辑手机号码
      $scope.saveQyMobile = function(e, mobile) {
         $data.changeQyMsg({
            mobile: mobile
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else if (data.status == 1) {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $(e.currentTarget).parent().parent().removeClass("show");
               $(e.currentTarget).parents().parent().parent().find(".jjp").removeClass("hide");
               $scope.saveQyHs();
            }
         })
      }
   }])
   //个人中心-重置
   .controller('qyReset-control', ['$scope', '$rootScope', '$state', '$http', '$data', 'ipCookie', function($scope, $rootScope, $state, $http, $data, ipCookie) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      //定时器
      $scope.dateTime = 5;
      $scope.interval = setInterval(function() {
         if ($scope.dateTime > 1) {
            $scope.dateTime--;
         } else {
            $state.go('user-logo-center');
         }
         $scope.$digest();
      }, 1000);
      $scope.$on('$destroy', function() {
         clearInterval($scope.interval);
      })
   }])

   //个人中心-管理地址
   .controller('addressMana-control', ['$scope', '$rootScope', '$state', '$http', '$data', 'ipCookie', function($scope, $rootScope, $state, $http, $data, ipCookie) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

      $scope.areaTypeSelect = '0';
      $scope.delTanK = function(index, event) {
         $scope.show_cover = true;
      }

      $(".js_adbtn").click(function() {
         $(".js_adbr").slideDown();
         $(".js_adbr").next().hide();
      });

      $('.ix.js_querg').click(function() {
         $(".js_adbr").slideUp();
      })

      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.getEditAddressPrHs = function() {
         $data.getEditAddressPr({
            address_ids: $scope.Id
         }).success(function(data) {
            layer.close(cool);
            $scope.getEditAddress = data;
         })
      }
      $scope.getEditAddressPrHs();
      $scope.addList = function(data) {
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $http({
            method: 'GET',
            url: '' + $rootScope.ip + '/User/address_list',
            params: {
               type: $scope.areaTypeSelect > 0 ? 1 : 0
            },
            headers: {
               'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
            }
         }).success(function(data) {
            layer.close(cool);
            $scope.manaAddress = data;
            $scope.AddressOrder = data.data;
            //				var addrs = [];
            //				 for(var i in $scope.AddressOrder){
            //			        if($scope.AddressOrder[i].selected == 1){
            //			        	addrs.unshift($scope.AddressOrder[i])
            //			        }else{
            //			        	addrs.push($scope.AddressOrder[i]);
            //			        }
            //			    }
            //				 console.log(addrs); 
            $scope.haveSetAddr = data.data.length;
         })
      }
      $scope.addList();
      $scope.areaTypeChange = function() {
         $scope.addList();
      }
      $scope.delAddBtn = function(id) {
         layer.confirm('您确定要删除么？', {
            btn: ['确定', '取消'] //按钮
         }, function() {
            $data.delAddress({
               address_id: [id]
            }).success(function(data) {
               if (data.status) {
                  layer.msg('删除成功', {
                     icon: 1
                  });
                  $scope.addList();
               } else {
                  layer.msg('删除失败', {
                     icon: 2
                  });
               }
            })
         });
      }

      $scope.addParamsData = {
         consignee: '',
         province: '',
         city: '',
         district: '',
         address: '',
         mobile: '',
         default: '',
         tel: ''
      }

      $scope.getProvince = function() {
         $data.getEditAddressPr({
            address_ids: 1
         }).success(function(res) {
            $scope.areaLists = res;
         })
      }
      $scope.getProvince();
      $scope.onsubmit = function() {
         $data.PosteditAddress($.extend({
            is_interim: $scope.areaTypeSelect > 0 ? 1 : 0
         }, $scope.addParamsData)).success(function(res) {
            if (res.status == 1) {
               $(".js_adbr").slideUp();
               $scope.getEditAddressPrHs();
               $scope.addParamsData = {
                  consignee: '',
                  province: '',
                  city: '',
                  district: '',
                  address: '',
                  mobile: '',
                  default: '',
                  tel: ''
               }
               layer.msg(res.info, {
                  icon: 1,
                  time: 3000
               });
               $scope.addList();
            } else {
               layer.msg(res.info, {
                  icon: 2,
                  time: 3000
               });
            }

         })

      }
      /*添加城市初始城市列表*/
      $data.changeRegion({
         type: 1,
         parent_id: 1
      }).success(function(res) {
         $scope.provinceList = res.data;
         $scope.provinceChange();
      })
      $scope.provinceChange = function() {
         $data.changeRegion({
            type: 2,
            parent_id: $scope.addParamsData.province
         }).success(function(res) {
            $scope.cityList = res.data;
            $scope.districtList = [];
            //				$scope.cityChange();
            $scope.addParamsData.city = $scope.addParamsData.district = '';
         })
      }
      $scope.cityChange = function() {
         $data.changeRegion({
            type: 3,
            parent_id: $scope.addParamsData.city
         }).success(function(res) {
            $scope.districtList = res.data;
         })
      }

      //设置默认收货地址
      $scope.setDefaultDz = function(id, e) {
         $data.setDefault({
            address_id: id
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $scope.addList();
            }
         })
      }
      $scope.addParamsDataA = {
         province: '',
         city: '',
         district: '',
      }
      //		var getCityList = function() {
      //			/*添加城市初始城市列表*/
      //			$data.changeRegion({
      //				type: 1,
      //				parent_id: 1
      //			}).success(function(res) {
      //				$scope.provinceListA = res.data;
      //			})
      //			$data.changeRegion({
      //				type: 2,
      //				parent_id: $scope.getThisAddress.address_info.province
      //			}).success(function(res) {
      //				$scope.cityListA = res.data;
      //			})
      //			$data.changeRegion({
      //				type: 3,
      //				parent_id: $scope.getThisAddress.address_info.city
      //			}).success(function(res) {
      //				$scope.districtListA = res.data;
      //			})
      //		}
      $scope.provinceChangeA = function(addr) {
         $data.changeRegion({
            type: 2,
            parent_id: addr
         }).success(function(res) {
            $scope.getThisAddress.city_list = res.data;
            //				$scope.cityChangeA(addr);
            $scope.getThisAddress.district_list = [];
            $scope.addParamsDataA.city = $scope.addParamsDataA.district = '';
         })
      }
      $scope.cityChangeA = function(addr) {
         $data.changeRegion({
            type: 3,
            parent_id: addr
         }).success(function(res) {
            $scope.getThisAddress.district_list = res.data;
         })
      }

      //编辑信息


      $scope.changeMsgBox = function(id) {
         $data.getEditAddressPr({
            address_id: id
         }).success(function(data) {

            //				getCityList();
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else {
               $scope.neShow = 1;
               $('.changeMsgBox').show();
               $('.changeMsgBox').prev().hide();
               $(".js_adbr").hide();
               $scope.getThisAddress = data;

               $scope.addParamsDataA = {
                  address_id: id,
                  consignee: data.address_info.consignee,
                  province: data.address_info.province,
                  city: data.address_info.city,
                  district: data.address_info.district,
                  address: data.address_info.address,
                  mobile: data.address_info.mobile,
                  default: data.address_info.is_default,
                  tel: data.address_info.tel
               }

               $scope.addList();
            }

         })
      }

      $scope.qxChangeBox = function() {
         $('.changeMsgBox').hide();
      }

      //确认更改
      $scope.changePersonAddress = function() {
         $scope.addParamsDataA.default ? $scope.addParamsDataA.default = 1 : $scope.addParamsDataA.default = 0
         $data.PosteditAddress($.extend({
            is_interim: $scope.areaTypeSelect > 0 ? 1 : 0
         }, $scope.addParamsDataA)).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $('.changeMsgBox').hide();
               $scope.addList();
            }
         })
      }
   }])

   //个人中心-消息中心-无
   .controller('noMessage-control', ['$scope', '$rootScope', '$state', '$http', '$stateParams', '$window', function($scope, $rootScope, $state, $http, $stateParams, $window) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.goBack = function() {
         $window.history.back();
      }
      //定时器

   }])
   //个人中心-资金管理-提现账户明细 
   .controller('depositDetail-control', ['$scope', '$rootScope', '$state', '$http', '$data', 'ipCookie', function($scope, $rootScope, $state, $http, $data, ipCookie) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

      $scope.ListPage = {
         page: 1,
         size: 10,
         account_type: 'user_money',
      };
      $scope.getData = function(List) {
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $data.GetMoneyDetial(List).success(function(data) {
            layer.close(cool);
            if (data.count == 0) {
               $scope.no_dd = true;
            } else {
               $scope.no_dd = false;
               $scope.MoneyDetial = data;
            }
         })
      }
      $scope.getData($scope.ListPage);
      $scope.up_page = function() {
         if ($scope.MoneyDetial.has_more) {
            $scope.ListPage.page++
               $scope.getData($scope.ListPage);
         }
      }
      $scope.down_page = function() {
         if ($scope.ListPage.page > 1) {
            $scope.ListPage.page--
               $scope.getData($scope.ListPage);
         }
      }


      $scope.getIntegral = function(data) {
         $('#Pagination').pagination(data.pages, $scope.options)
      };
      //分页操作
      $scope.pageIndex = 0; //初始页索引
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
         current_page: 0,
         callback: function(index) {
            $scope.ListPage.page = index + 1;
            var cool = layer.load(0, {
               shade: [0.3, '#fff']
            });
            $http({
               method: "GET",
               url: '' + $rootScope.ip + '/User/accountLog',
               params: $scope.ListPage,
               headers: {
                  'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
               }
            }).success(function(data) {
               layer.close(cool);
               $scope.MoneyDetial = data;
               $('html,body').animate({
                  'scrollTop': 0
               }, 500)
            })
         }
      }
   }])

   //个人中心-安全中心-手机验证
   .controller('telOne-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', function($scope, $rootScope, $state, $http, ipCookie, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.goSaveTeltwoPage = function() {
         $scope.personTelMsg = {
            mobile: $scope.phoneNumber,
            type: 'one',
         }
         $data.getEditMobile($scope.personTelMsg).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               })
               $state.go('save-teltwo', {
                  phone: data.mobile
               })
            }
         })
      }
   }])
   .controller('telTwo-control', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'ipCookie', '$data', function($scope, $rootScope, $state, $stateParams, $http, ipCookie, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.phoneNumber = $stateParams.phone;

      $scope.geeteInitFn1 = function() {
         $http({
            url: '' + $rootScope.ip + '/Login/geeTestinit',
            method: 'GET',
            params: '',
         }).success(function(data) {
            //console.log(data);
            initGeetest({
               // 以下配置参数来自服务端 SDK
               gt: data.gt,
               challenge: data.challenge,
               offline: !data.success,
               new_captcha: data.new_captcha
            }, function(captchaObj) {
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

      //获取验证码
      $scope.str = '获取验证码';
      $scope.getVerify = function() {
         clearInterval($scope.interval);

         var validate = $scope.geeteTrue.getValidate();
         //console.log(validate);

         if (validate != undefined) {
            $scope.Twogeetest_challenge = validate.geetest_challenge;
            $scope.Twogeetest_validate = validate.geetest_validate;
            $scope.Twogeetest_seccode = validate.geetest_seccode;

            $data.getMobileCode({
               type: 'change',
               mobile: $scope.phoneNumber,
               skey: $scope.skey,
               is_verify: 0,
               geetest_challenge: $scope.Twogeetest_challenge,
               geetest_validate: $scope.Twogeetest_validate,
               geetest_seccode: $scope.Twogeetest_seccode

            }).success(function(data) {
               //定时器
               if (data.status == 1) {
                  $scope.hqyzm = 60;

                  layer.msg(data.info);
                  $scope.interval = setInterval(function() {
                     if ($scope.hqyzm <= 60) {
                        $scope.hqyzm--;
                        $scope.str = $scope.hqyzm + 's';
                        $scope.getVer = true;
                        if ($scope.hqyzm == 0) {
                           $scope.str = '重新获取验证码';
                           $scope.hqyzm = 60;
                           $scope.getVer = false;
                           clearInterval($scope.interval);
                        }
                     } else {

                     }
                     $scope.$digest();
                  }, 500);
                  $scope.mobileCode = data.mobileCode;
               } else {
                  $scope.geeteTrue.reset();
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  })
               }

            })

         } else {
            layer.msg('请先完成验证', {
               icon: 2,
               time: 3000
            });
         }

         $scope.$on('$destroy', function() {
            clearInterval($scope.interval);
         })
         //去第三步
         $scope.goTelThree = function() {
            $http({
                  url: '' + $rootScope.ip + '/User/edit_mobile',
                  method: 'POST',
                  data: {
                     mobile: $scope.phoneNumber,
                     //str_verify: '454',//图形验证码
                     mobile_verify: $scope.mobileCode,
                     type: 'two',
                  },
                  headers: {
                     'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
                  },
                  timeout: 5000
               })
               .success(function(data) {
                  //传参	
                  $state.go('save-telthree', {
                     phone: $scope.phoneNumber
                  });
               })
         }
      }

   }])
   .controller('telThree-control', ['$scope', '$rootScope', '$state', '$http', '$stateParams', function($scope, $rootScope, $state, $http, $stateParams) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      //		接参
      $scope.phoneNumberT = $stateParams.phone;
      //		定时器 
      $scope.dateTime = 5;
      $scope.interval = setInterval(function() {
         if ($scope.dateTime > 1) {
            $scope.dateTime--;
         } else {
            $state.go('person-save-center')
         }
         $scope.$digest();
      }, 1000);
      $scope.$on('$destroy', function() {
         clearInterval($scope.interval);
      })

   }])
   //个人中心-安全中心-密码验证1
   .controller('passOne-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', function($scope, $rootScope, $state, $http, ipCookie, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

      //		去第二步
      $scope.GoPasTwo = function() {
         $data.getEditPwd({
            type: 'one',
            old_password: $scope.old_password
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               });
            } else {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               });
               $state.go('save-passtwo');
            }
         })
      }

   }])
   .controller('passTwo-control', ['$scope', '$rootScope', '$state', '$http', '$data', function($scope, $rootScope, $state, $http, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.geeteInitFn1 = function() {
         $http({
            url: '' + $rootScope.ip + '/Login/geeTestinit',
            method: 'GET',
            params: '',
         }).success(function(data) {
            initGeetest({
               // 以下配置参数来自服务端 SDK
               gt: data.gt,
               challenge: data.challenge,
               offline: !data.success,
               new_captcha: data.new_captcha
            }, function(captchaObj) {
               $scope.geeteTrue = captchaObj;

               // 这里可以调用验证实例 captchaObj 的实例方法
               captchaObj.appendTo(".GeetestCaptchaView1");
            })
         })
      };
      $scope.geeteInitFn1();


      $scope.GoPasThereA = function() {
         var validate = $scope.geeteTrue.getValidate();
         //console.log(validate);

         if (validate != undefined) {
            $scope.Twogeetest_challenge = validate.geetest_challenge;
            $scope.Twogeetest_validate = validate.geetest_validate;
            $scope.Twogeetest_seccode = validate.geetest_seccode;
            $data.getEditPwd({
               type: 'two',
               new_password: $scope.new_password,
               con_password: $scope.con_password,
               geetest_challenge: $scope.Twogeetest_challenge,
               geetest_validate: $scope.Twogeetest_validate,
               geetest_seccode: $scope.Twogeetest_seccode
            }).success(function(data) {
               if (data.status == 0) {
                  $scope.geeteTrue.reset();
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  });
               } else {
                  layer.msg(data.info, {
                     icon: 1,
                     time: 3000
                  });
                  $state.go('save-passthree');
               }
            })
         }
      }
   }])
   .controller('passThree-control', ['$scope', '$rootScope', '$state', '$http', function($scope, $rootScope, $state, $http) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      //定时器
      $scope.dateTime = 5;
      $scope.interval = setInterval(function() {
         if ($scope.dateTime > 1) {
            $scope.dateTime--;
         } else {
            $state.go('person-save-center')
         }
         $scope.$digest();
      }, 1000);
      $scope.$on('$destroy', function() {
         clearInterval($scope.interval);
      })

   }])

   //个人中心-安全中心-支付密码验证
   .controller('payPassOne-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', '$interval', function($scope, $rootScope, $state, $http, ipCookie, $data, $interval) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      //个人信息面板信息
      $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/user_info',
            data: '',
         })
         .success(function(data) {
            $scope.userData = data;
            $scope.userPhone = data.user_info.mobile_phone;
            $scope.payPass = data.user_info.is_pay_pass;
            $scope.forgotTwoOption.phone = data.user_info.mobile_phone;
         })

      $scope.geeteInitFn1 = function() {
         $http({
            url: '' + $rootScope.ip + '/Login/geeTestinit',
            method: 'GET',
            params: '',
         }).success(function(data) {
            //console.log(data);
            initGeetest({
               // 以下配置参数来自服务端 SDK 
               gt: data.gt,
               challenge: data.challenge,
               offline: !data.success,
               new_captcha: data.new_captcha
            }, function(captchaObj) {
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

      //第一步
      $scope.forgotTwoOption = {
         step: 'one',
         phone: ''
      };

      //获取验证码接口
      $scope.codeFn = function() {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Login/verify',
            data: {
               fontSize: 32,
               length: 4,
               useNoise: true
            }
         }).success(function(data) {
            //console.log(data);
            $scope.code = data.data.skey;
            $scope.getKey();
         })
      };
      $scope.codeFn();
      //回调一次验证码接口获取图片
      $scope.getKey = function() {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Login/verify',
            data: {
               fontSize: 32,
               length: 4,
               useNoise: true,
               codeSet: $scope.code
            }
         }).success(function(data) {
            //console.log(data);
            setTimeout(function() {
               $scope.$apply(function() {
                  $scope.codeMa = data.data.captcha + '?' + Math.random(); //增加随机参数时间可强制刷新
               });
            }, 1000)
            //$scope.codeMa = data.data.captcha;
         })
      };
      //点击验证码图片切换验证码
      $scope.codeAgain = function() {
         $scope.codeFn();
      };

      //获取短信验证码
      $scope.vm = {
         data: '获取验证码',
         kedian: false,
         time: 59
      };

      $scope.info = function() {
         var validate = $scope.geeteTrue.getValidate();
         //console.log(validate);

         if (validate != undefined) {
            $scope.onegeetest_challenge = validate.geetest_challenge;
            $scope.onegeetest_validate = validate.geetest_validate;
            $scope.onegeetest_seccode = validate.geetest_seccode;
            $http({
               method: "POST",
               url: '' + $rootScope.ip + '/Login/getMobileCode',
               data: {
                  type: 'mind',
                  mobile: $scope.userPhone,
                  verify: $scope.forgotTwoOption.verify,
                  skey: $scope.code,
                  is_verify: 1,
                  geetest_challenge: $scope.onegeetest_challenge,
                  geetest_validate: $scope.onegeetest_validate,
                  geetest_seccode: $scope.onegeetest_seccode
               }
            }).success(function(data) {
               //console.log(data);
               $scope.geeteTrue.reset();
               if (data.status) {
                  layer.msg(data.info);
                  $scope.vm.kedian = true;
                  $scope.vm.data = $scope.vm.time + 's';
                  $interval(function() {
                     $scope.vm.data = ($scope.vm.time - 1) + 's';
                     $scope.vm.time--;
                     if ($scope.vm.time == 0) {
                        $scope.vm.kedian = false;
                        $scope.vm.data = '重新获取';
                        $scope.vm.time = 59;
                     }
                  }, 1000, $scope.vm.time)
               } else {

                  layer.msg(data.info);
                  $scope.codeAgain();
               }
            })
         } else {
            layer.msg('请先完成验证', {
               icon: 2,
               time: 3000
            });
         }
      };


      $scope.stepTwo = function() {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/edit_paypwd',
            data: $scope.forgotTwoOption,
         }).success(function(data) {
            //console.log(data);
            if (data.status) {
               $state.go('save-payPasstwo', {
                  verify: $scope.forgotTwoOption.verify
               });
            } else {
               layer.msg(data.info);
            }
         })
      };

   }])
   .controller('payPassTwo-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$data', '$stateParams', function($scope, $rootScope, $state, $http, ipCookie, $data, $stateParams) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.getUserMsgHs = function() {
         $data.getUserMsg().success(function(data) {
            $scope.payPass = data.user_info.is_pay_pass;
         })
      }
      $scope.getUserMsgHs();

      //第二步
      $scope.forgotThreeOption = {
         step: 'two',
         verify: $stateParams.verify
      };
      $scope.stepThree = function() {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/edit_paypwd',
            data: $scope.forgotThreeOption,
         }).success(function(data) {
            //console.log(data);
            if (data.status) {
               $state.go('save-payPassthree');
            } else {
               layer.msg(data.info);
            }
         })
      };

   }])
   .controller('payPassThree-control', ['$scope', '$rootScope', '$state', '$http', '$data', function($scope, $rootScope, $state, $http, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.getUserMsgHs = function() {
         $data.getUserMsg().success(function(data) {
            $scope.payPass = data.user_info.is_pay_pass;
         })
      }
      $scope.getUserMsgHs();

      $scope.goLogin = function() {
         $state.go('control-mb');
      };

   }])

   // 个人中心-安全中心-邮箱验证1
   .controller('emailOne-control', ['$scope', '$rootScope', '$state', '$http', '$data', function($scope, $rootScope, $state, $http, $data) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.geeteInitFn1 = function() {
         $http({
            url: '' + $rootScope.ip + '/Login/geeTestinit',
            method: 'GET',
            params: '',
         }).success(function(data) {
            //console.log(data);
            initGeetest({
               // 以下配置参数来自服务端 SDK
               gt: data.gt,
               challenge: data.challenge,
               offline: !data.success,
               new_captcha: data.new_captcha
            }, function(captchaObj) {
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


      $scope.goTwoEmail = function() {
         var validate = $scope.geeteTrue.getValidate();

         if (validate != undefined) {
            $scope.Twogeetest_challenge = validate.geetest_challenge;
            $scope.Twogeetest_validate = validate.geetest_validate;
            $scope.Twogeetest_seccode = validate.geetest_seccode;
            $data.getEmailYz({
               email: $scope.email,
               geetest_challenge: $scope.Twogeetest_challenge,
               geetest_validate: $scope.Twogeetest_validate,
               geetest_seccode: $scope.Twogeetest_seccode
            }).success(function(data) {
               if (data.status == 0) {
                  $scope.geeteTrue.reset();
                  layer.msg(data.info, {
                     icon: 2,
                     time: 3000
                  });
               } else {
                  layer.msg(data.info, {
                     icon: 1,
                     time: 3000
                  });
                  $state.go('save-emailtwo', {
                     email: $scope.email
                  });
               }
            })
         }
      }

   }])
   .controller('emailTwo-control', ['$scope', '$rootScope', '$state', '$http', '$data', '$stateParams', function($scope, $rootScope, $state, $http, $data, $stateParams) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.emailMsg = $stateParams.email;
      $scope.goThreeEmail = function() {

         if (true) {

            $state.go('save-emailthree', {
               email: $scope.email
            });
         } else {}
      }
   }])
   .controller('emailThree-control', ['$scope', '$rootScope', '$state', '$http', '$data', '$stateParams', function($scope, $rootScope, $state, $http, $data, $stateParams) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.emailMsg = $stateParams.email;

      //定时器
      $scope.dateTime = 5;
      $scope.interval = setInterval(function() {
         if ($scope.dateTime > 1) {
            $scope.dateTime--;
         } else {
            $state.go('person-save-center')
         }
         $scope.$digest();
      }, 1000);
      $scope.$on('$destroy', function() {
         clearInterval($scope.interval);
      })

   }])
   //优惠券
   .controller('personYhq-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data','$myPublic', function($scope, $rootScope, $state, $http, ipCookie, $window, $data,$myPublic) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

      $data.getYhqData({
         bonus_type: ''
      }).success(function(data) {
         $scope.couponNum1 = data.data.length;
      })
      $data.getYhqData({
         bonus_type: 'use'
      }).success(function(data) {
         $scope.couponNum2 = data.data.length;
      })
      $data.getYhqData({
         bonus_type: 'over_time'
      }).success(function(data) {
         $scope.couponNum3 = data.data.length;
      })

      $scope.getCuponList = function(bonus_type) {
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $scope.status = bonus_type;
         $data.getYhqData({
            bonus_type: bonus_type
         }).success(function(data) {
            layer.close(cool);
            if (data.data.length == 0) {
               $scope.yhq_show = true;
            } else {
               $scope.personYhq = data;
               $scope.yhq_show = false;
            }
         })
      }
      $scope.getCuponList();

      //使用优惠券
      $scope.goDpDetail = $myPublic.openCoupon;
   }])

   //	用户订单
   .controller('orderAll-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', '$stateParams', '$anchorScroll', '$location', function($scope, $rootScope, $state, $http, ipCookie, $window, $data, $stateParams, $anchorScroll, $location) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      /* 支付完成显示来镜加工弹框 */
      if ($stateParams.type1.indexOf('pay_over') > -1) {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/is_machining_goods',
            data: {
               order_id: $stateParams.type1.split('-')[1]
            },
            headers: {
               'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
            }
         }).success(function(data) {
            if (data.order_id > 0) {
               layer.confirm('支付完成', {
                  btn: ['确定', '来镜加工'], //按钮
                  title: '镜库科技',
                  btn2: function() {
                     $state.go('glassMachining', {
                        order_id: $stateParams.type1.split('-')[1]
                     })
                  }
               }, function(index) {
                  layer.close(index);
               })
            }
         })
      }
      $scope.type = $stateParams.type1;
      //		页码
      $scope.ListPage = {
         page: 1,
         size: 10,
         type: $scope.type || '',
         order_number: null
      };
      $scope.callback = function(index) {
         $scope.ListPage.page = index + 1;
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $http({
            method: "GET",
            url: '' + $rootScope.ip + '/User/order',
            params: $scope.ListPage,
            headers: {
               'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
            }
         }).success(function(data) {
            layer.close(cool);
            $scope.AllOrder = data;
            $('html,body').animate({
               'scrollTop': 0
            }, 500)
         })
      }

      $scope.getAllOrderHs = function(order) {
         $scope.AllOrder = null;
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $scope.ListPage.type = order || '';
         $scope.ListPage.page = 1;

         $data.getAllOrder({
            type: order || '',
            page: $scope.ListPage.page
         }).success(function(data) {
            layer.close(cool);
            $scope.AllOrder = data;
         })

      };
      $scope.getAllOrderHs($scope.ListPage.type);
      //		确认收货
      $scope.QrGet = function(order_id) {
         $data.QrGetGoods({
            order_id: order_id
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               });
            } else {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               });
               $scope.getAllOrderHs();
            }
         })
      }
      //删除订单
      $scope.delOrder = function(order_id) {
         layer.confirm('您确定要删除么？', {
            btn: ['确定', '取消'] //按钮
         }, function() {
            $data.delOrder({
               order_id: order_id
            }).success(function(data) {
               if (data.status) {
                  layer.msg('删除成功', {
                     icon: 1
                  });
                  $scope.getAllOrderHs($scope.ListPage.type);
               } else {
                  layer.msg('删除失败', {
                     icon: 2
                  });
               }
            })
         });
      }


      //取消订单
      $scope.cancelDd = function(order_id) {
         layer.confirm('您确定要取消么？', {
            btn: ['确定', '取消'] //按钮
         }, function() {
            $data.cancelOrder({
               order_id: order_id
            }).success(function(data) {
               if (data.status) {
                  layer.msg('取消成功', {
                     icon: 1
                  });
                  $scope.getAllOrderHs($scope.ListPage.type);
               } else {
                  layer.msg('取消失败', {
                     icon: 2
                  });
               }
            })
         });
      }
      $data.IntegralOrder().success(function(data) {
         $scope.InNum = data.count;
      })
      $data.getUsercount().success(function(data) {
         if (data.status == 1) {
            $scope.usercount = data;
         }
      })
      //去店铺
      //		$scope.goShop = function () {
      //			$state.go('');
      //		}

      //		查看更多 
      var dj = 1;
      $scope.lookMore = function(index, event) {
         if (dj == 1) {
            $(event.currentTarget).prev().css({
               'height': 'auto',
               'overflow': 'auto'
            })
            dj = 0;
         } else {
            $(event.currentTarget).prev().css({
               'height': '295px',
               'overflow': 'hidden'
            })
            dj = 1;
         }
      }


      //		得到订单详情信息
      $scope.goOrderDetail = function(id) {
         $data.getOrderInfo({
            order_id: id
         }).success(function(data) {
            if (data.status == 1) {
               $state.go('order-detail', {
                  orderId: id
               });
            } else {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               });
            }
         })
      }
      $scope.goOrderDetail1 = function(id) {
         $data.getOrderInfo({
            order_id: id
         }).success(function(data) {
            if (data.status == 1) {
               $state.go('order-cancel', {
                  orderId: id
               });
            } else {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               });
            }
         })
      }

      //去商品详情页
      $scope.goGoodsDetail = function(goods_id, cutting_id) {
         if (cutting_id > 0) {
            window.open($state.href('shop-detail-cut', {
               goods_id: goods_id,
               cutting_id: cutting_id
            }), '_blank');
         } else {
            window.open($state.href('shop-detail', {
               goods_id: goods_id
            }), '_blank');
         }
      }


      //再次购买
      $scope.buyAgain = function(order_id) {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/align_buy',
            data: {
               order_id: order_id
            },
         }).success(function(data) {
            if (data.status == 0) {
               layer.confirm('需要医疗器械许可证，是否上传', {
                  btn: ['确定', '取消'], //按钮
                  btnAlign: 'c',
                  yes: function(index) {
                     $state.go('person-qy-msg');
                     layer.close(index);
                  },
                  btn2: function(index) {
                     layer.close(index);
                  }
                  // closeBtn: 0
               });
            } else {
               $rootScope.$broadcast('upCarList');
               $state.go('shop-car');
            }
         })
      }
      //再次兑换
      $scope.dhAgain = function(goods_id) {
         $state.go('pointsMall');
      }

      //1去申请售后
      $scope.goSaleOver = function(rec_id) {
         var newOpen = window.open();
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/more_goods_repair',
            data: {
               id: rec_id
            },
            headers: {
               'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
            },
         }).success(function(data) {
            if (data.status) {

            } else {
               var urll = $state.href('return-repair-content', {
                  id: rec_id
               });
               newOpen.location.href = urll;
               //window.open(urll,'_blank');
            }
         })
      }
      //取消申请售后
      $scope.qxSaleOver = function(return_id) {
         layer.confirm('取消售后将不能再次申请', {
            btn: ['确定', '取消'] //按钮
         }, function() {
            $http({
               method: "POST",
               url: '' + $rootScope.ip + '/User/cancel_repair',
               data: {
                  id: return_id
               },
               headers: {
                  'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
               },
            }).success(function(data) {
               if (data.status) {
                  layer.msg('取消成功', {
                     icon: 1
                  });
                  $scope.getAllOrderHs();
               } else {
                  layer.msg('取消失败', {
                     icon: 2
                  });
               }
            })
         });
      }

      //		猜你喜欢
      $scope.picList = function() {
         $(".picScroll-left").slide({
            titCell: ".hd ul",
            mainCell: ".bd ul",
            autoPage: true,
            effect: "left",
            autoPlay: true,
            vis: 5,
            trigger: "click"
         });
      }

      $data.guessYouLike().success(function(data) {
         if (data.status) {
            $scope.YouLike = data;
         }
      })


      $scope.gessGoods = function(goods_id) {
         $state.go('shop-detail', {
            goods_id: goods_id
         });
      }

      //输入框查询
      $scope.serchGoods = function(order_number) {
         $scope.ListPage.order_number = order_number;
         $scope.ListPage.type = $scope.ListPage.type;
         $data.getAllOrder({
            order_number: order_number,
            type: $scope.ListPage.type
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg('请确定输入是否正确', {
                  icon: 2,
                  time: 3000
               })
            } else {
               $scope.AllDetial = data.list;
               $scope.AllDetialLength = data.list.length;
               $scope.AllOrder = data;
               $scope.getOrd(data);
            }
         })
      }
      //物流信息
      //	$scope.gzWl = function(order_id,e){
      //		$data.getWlMsg({
      //			order_id:order_id
      //		}).success(function (data) {
      //			if (data.status==0) {
      //				
      //			} else{
      //				$scope.wlData = data.data;
      //				$('.ggz-tc').show();
      //				$('.ggz-tc').css({top:e.target.offsetTop-$(window).scrollTop() - 11 +'px',left:e.target.offsetLeft-310}).show();
      //				$(document).scroll(function(){
      //					$('.ggz-tc').hide(); 
      //				})
      //			}
      //		})
      //	}

      //来镜片加工
      $scope.ljJG = function(order_parent) {
         $state.go('glassMachining', {
            order_id: order_parent
         });
      }

      $scope.renderJs = function() {
         setTimeout(function() {
            $('.genzg').hover(function(e) {
               $data.getWlMsg({
                  order_id: e.target.dataset.order
               }).success(function(data) {
                  if (data.status == 0) {

                  } else {
                     $scope.wlData = data.data;
                  }
               })
               $scope.goOrdera = function() {
                  $data.getOrderInfo({
                     order_id: e.target.dataset.order
                  }).success(function(data) {
                     if (data.status == 1) {
                        $state.go('order-detail', {
                           orderId: e.target.dataset.order
                        });
                     } else {
                        layer.msg(data.info, {
                           icon: 2,
                           time: 3000
                        });
                     }
                  })
               }
               $('.ggz-tc').css({
                  top: e.target.offsetTop - $(window).scrollTop() - 11 + 'px',
                  left: e.target.offsetLeft - 310
               }).show();
            }, function() {
               $('.ggz-tc').mouseover(function() {
                  $(this).show();

               })
               $('.ggz-tc').mouseout(function() {
                  $(this).hide();
               })
               $('.ggz-tc').hide();
            })
         }, 100);


         $(document).scroll(function() {
            $('.ggz-tc').hide();
         })
      }

      //页码
      $scope.ListPage1 = {
         page: 1,
         size: 10
      };

      $scope.callback1 = function(index) {
         $scope.ListPage1.page = index + 1;
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $data.IntegralOrder($scope.ListPage1).success(function(data) {
            layer.close(cool);
            if (data.status == 1) {
               $scope.InOrd = data;
               $scope.InOrdList = data.list;
               $('html,body').animate({
                  'scrollTop': 0
               }, 500)
            } else {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               });
            }
         })
      }
      //得到积分列表
      $scope.getAllIntegral = function() {
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $data.IntegralOrder({
            page: 1,
            size: 10
         }).success(function(data) {
            layer.close(cool);
            if (data.status == 1) {
               $scope.InOrd = data;
               $scope.InOrdList = data.list;
            } else {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               });
            }
         })
      }

      $scope.serchJfGoods = function(order_sn) {
         $data.IntegralOrder({
            order_sn: order_sn
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg('请确定输入是否正确', {
                  icon: 2,
                  time: 3000
               })
            } else {
               $scope.InOrd = data;
               $scope.InOrdList = data.list;
            }
         })

      }

      //		跳到支付页
      $scope.goOverPage = function(order_id) {
         if (!$rootScope.canCheckout) {
            layer.msg('无结算权限，请联系企业管理员', {
               time: 2000
            });
            return
         }
         $state.go('paymentNew', {
            order_id: order_id,
            type: 'order',
            log_id:'',
            is_distribution:''
         });
      }

      //		积分跳到积分详情
      $scope.goIntDetail = function(order_id) {
         $state.go('intergral-detail', {
            order_id: order_id
         });
      }

   }])
   //积分详情
   .controller('intergralDetail-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', '$stateParams', function($scope, $rootScope, $state, $http, ipCookie, $window, $data, $stateParams) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      //		接收id
      $scope.orderid = $stateParams.order_id;
      //		得到积分详情信息
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $data.IntegralDetail({
         order_id: $scope.orderid
      }).success(function(data) {
         $scope.IntegralDT = data;
         layer.close(cool);
      })
      //得到物流信息
      $data.getWlMsg({
         order_id: $scope.orderid
      }).success(function(data) {
         $scope.WlMsg = data;
      })

   }])
   //订单详情	
   .controller('orderDetail-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', '$stateParams', '$anchorScroll', '$location', function($scope, $rootScope, $state, $http, ipCookie, $window, $data, $stateParams, $anchorScroll, $location) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

      //搜索框显隐
      $scope.jf = 2;
      //		接收id
      $scope.orderid = $stateParams.orderId;

      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $data.getOrderInfo({
         order_id: $scope.orderid
      }).success(function(data) {
         layer.close(cool);
         $scope.orderDetail = data;
         $scope.butie_price = (Number(data.order.supp_subsidy_amount) + Number(data.order.subsidy_amount)).toFixed(2);
      })

      $data.getWlMsg({
         order_id: $scope.orderid
      }).success(function(data) {
         $scope.WlMsg = data;
         $scope.wlData = data.data;
      })

      //再次购买
      $scope.buyAgain1 = function(order_id) {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/align_buy',
            data: {
               order_id: order_id
            },
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else {
               $rootScope.$broadcast('upCarList');
               $state.go('shop-car');
            }
         })
      }
      //取消订单
      $scope.cancleOrder = function(order_id) {
         layer.confirm('您确定取消么？', {
            btn: ['确定', '取消'] //按钮
         }, function() {
            $data.cancelOrder({
                  order_id: order_id
               })
               .success(function(data) {
                  if (data.status) {
                     layer.msg('删除成功', {
                        icon: 1
                     });
                     $state.go('order-all', {
                        type: ''
                     });
                  } else {
                     layer.msg('删除失败', {
                        icon: 2
                     });
                  }
               })
         })

      }
      //		跳到支付页
      $scope.goOverPage = function(order_id) {
         if (!$rootScope.canCheckout) {
            layer.msg('无结算权限，请联系企业管理员', {
               time: 2000
            });
            return
         }
         if (order_id) {
            $state.go('paymentNew', {
               order_id: order_id,
               log_id: '',
               type: 'order',
               is_distribution:null
            });
         } else {
            layer.msg('请检查商品是否存在', {
               icon: 1,
               time: 3000
            });
         }
      }

      //		确认收货
      $scope.QrGet = function(order_id) {
         $data.QrGetGoods({
            order_id: order_id
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               });
            } else {
               layer.msg(data.info, {
                  icon: 1,
                  time: 3000
               });
               $state.go('order-all', {
                  type: ''
               })
            }
         })
      }
      //删除订单

      //		去商品详情
      $scope.goGoodsDetail = function(goods_id, cutting_id) {
         if (cutting_id > 0) {
            window.open($state.href('shop-detail-cut', {
               goods_id: goods_id,
               cutting_id: cutting_id
            }), '_blank');
         } else {
            window.open($state.href('shop-detail', {
               goods_id: goods_id
            }), '_blank');
         }
      }
      //详情返修

      //多个提交申请-退货

      $scope.allGoods = {
         type: '',
         orders: {
            order_ids: [$scope.orderid],
            rec_ids: []
         }
      };

      //      var cli = true;
      //      $scope.chooseSingle = function(select,index){
      //      	if(cli){
      //      		cli = false;
      //      		$scope.orderDetail.goods_list[index].select = true;	
      //      	}else{
      //      		cli = true;
      //   			$scope.orderDetail.goods_list[index].select = false;
      //      	}
      //      };
      $scope.chooseAll = function(selectall) {
         var arr = [];
         if (selectall) {
            for (var i = 0; i < $scope.orderDetail.goods_list.length; i++) {
               $scope.orderDetail.goods_list[i].select = true;
               arr.push($scope.orderDetail.goods_list[i].rec_id)
            }
         } else {
            for (var i = 0; i < $scope.orderDetail.goods_list.length; i++) {
               $scope.orderDetail.goods_list[i].select = false;
               arr = [];
            }

         }
      }

      $scope.tuihuoa = function(type) {
         $scope.allGoods.type = type;
         $scope.allGoods.orders.rec_ids = [];
         for (var i = 0; i < $scope.orderDetail.goods_list.length; i++) {
            if ($scope.orderDetail.goods_list[i].select) {
               $scope.allGoods.orders.rec_ids.push($scope.orderDetail.goods_list[i].rec_id);
            }

         }
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/is_goods_repair',
            data: $scope.allGoods,
         }).success(function(data) {
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
      };

   }])
   .controller('order-print-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', '$stateParams', '$anchorScroll', '$location', '$sce', function($scope, $rootScope, $state, $http, ipCookie, $window, $data, $stateParams, $anchorScroll, $location, $sce) {
      $rootScope.isShow = false;
      $rootScope.change = false;
      $scope.orderid = $stateParams.orderId;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $http({
         method: "POST",
         url: '' + $rootScope.ip + '/Machining/update_make',
         data: {
            mid: $stateParams.mid,
            lj_shipping_sn: $scope.wlsn
         },
      }).success(function(data) {
         $data.getOrderInfo({
            order_id: $scope.orderid,
            type: 1
         }).success(function(data) {
            layer.close(cool);

            $scope.html = ($sce.trustAsHtml(data.content));

         })
      })
   }])
   //订单详情取消的订单	
   .controller('orderCancel-control', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', '$stateParams', '$anchorScroll', '$location', function($scope, $rootScope, $state, $http, ipCookie, $window, $data, $stateParams, $anchorScroll, $location) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;
      $scope.goto = function() {
         $location.hash('');
         $anchorScroll.yOffset = 1;
         $anchorScroll();
      };
      //接收id
      $scope.orderid = $stateParams.orderId;

      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $data.getOrderInfo({
         order_id: $scope.orderid
      }).success(function(data) {
         layer.close(cool);
         $scope.orderDetailQx = data;
      })

      $scope.joinBuyCar = function(order_id) {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/User/align_buy',
            data: {
               order_id: order_id
            },
         }).success(function(data) {
            if (data.status == 0) {
               layer.msg(data.info, {
                  icon: 2,
                  time: 3000
               })
            } else {
               $rootScope.$broadcast('upCarList');
               $state.go('shop-car');
            }
         })
      }

   }])
   .controller('erweimaPayNew-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
      $rootScope.isShow = false;
      $rootScope.change = false;
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.ImgUrl = $stateParams.url;
      $http({
         method: "POST",
         url: '' + $rootScope.ip + '/Flow/get_weixin_img',
         data: {
            url: $scope.ImgUrl
         },
      }).success(function(data) {
         layer.close(cool);
         $scope.payNewData = data;
         $scope.res = ipCookie('token');
      })

      setInterval(function() {
         $http({
               method: "GET",
               url: '' + $rootScope.ip + '/Flow/check_order_pay',
               params: {
                  id: $scope.payNewData.order_no
               },
            })
            .success(function(data) {
               //console.log(data);
               if (data.status) {
                  layer.msg(data.info, {
                     icon: 1
                  });

                  $state.go('zijin-mana');

                  clearInterval(timer);
               }
            })
      }, 3000);
   }])
   // 员工管理
   .controller('EmployeeM-control', ['$scope', '$rootScope', '$http', '$state', 'ipCookie', '$stateParams', function($scope, $rootScope, $http, $state, ipCookie, $stateParams) {
      //控制首页会员中心显隐
      $rootScope.isShow = false;
      //控制header和footer显隐
      $rootScope.change = true;

      $scope.createFormdata = function() {
         $scope.userInfo = null;
         $scope.userId = null;
         $scope.type = null;
         $scope.formData = {
            true_name: null,
            position: null,
            user_name: null,
            mobile_phone: null,
            str_verify: null,
            phone_code: null,
            password: null,
            cpassword: null,
            authority: [],
            staff_status: false
         }
         $scope.authority = [{
               'label': '允许查看价格',
               'value': '1',
               checked: false
            },
            {
               'label': '允许结算',
               'value': '2',
               checked: false
            },
            {
               'label': '允许添加员工',
               'value': '3',
               checked: false
            },
            {
               'label': '允许查看员工信息',
               'value': '4',
               checked: false
            },
         ]
      }
      $scope.createFormdata();

      $scope.addStaff = function() {
         layer.confirm('请选择添加员工', {
            btn: ['注册新账号', '添加已有账号，立即验证'] //按钮
         }, function(index) {
            $scope.createFormdata();
            $scope.openStaffEditor('new', '注册新账号');
            layer.close(index);
         }, function(index) {
            $scope.createFormdata();
            $scope.openStaffEditor('yet', '添加已有账号')
         });
      }
      $scope.editorStaff = function(userId) {
         $scope.createFormdata();
         $scope.userId = userId;
         var index = layer.load(2, {
            shade: [0.1, '#000'],
            time: 10 * 1000
         });
         $http({
            url: '' + $rootScope.ip + '/Staff/edit_user',
            method: 'GET',
            params: {
               user_id: userId
            },
         }).success(function(data) {
            layer.close(index);
            if (data.status == 1) {
               $scope.userInfo = data;
               $scope.formData.mobile_phone = data.data.mobile_phone;
               $scope.formData.position = data.data.position;
               $scope.formData.true_name = data.data.true_name;
               $scope.formData.user_name = data.data.user_name;
               $scope.formData.authority = data.data.authority || [];
               $scope.formData.staff_status = data.data.is_checks == 1 ? true : false;
               for (var j = 0; j < data.data.authority.length; j++) {
                  for (var i = 0; i < $scope.authority.length; i++) {
                     var item = $scope.authority[i];
                     if (data.data.authority[j] == item.value) {
                        item.checked = true;
                     }
                  }
               }
               setTimeout(function() {
                  $scope.openStaffEditor(null, '编辑')
               }, 300);
            }
         })
      }
      $scope.openStaffEditor = function(type, title) {
         $scope.type = type;
         $scope.$apply(function() {
            $scope.type = type;
         });
         $scope.staffEditor = layer.open({
            type: 1,
            title: title, //不显示标题
            area: '1000px',
            maxmin: true, //开启最大化最小化按钮
            shadeClose: true,
            content: $('.js_adbr'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            cancel: function() {
               // layer.msg('关闭', { time: 2000, icon: 6 });
            }
         });
      }
      $scope.cancelStaffEditor = function() {
         layer.close($scope.staffEditor);
      }
      $scope.getStaffList = function() {
         // var index = layer.load(2, { shade: [0.1, '#000'], time: 10 * 1000 });
         $http({
            url: '' + $rootScope.ip + '/Staff/index',
            method: 'POST',
         }).success(function(data) {
            // layer.close(index);
            if (data.status == 1) {
               $scope.staffList = data.list;
            }
         })
      }
      $scope.getStaffList();
      $scope.deleteItem = function(user_id) {
         layer.msg('确认删除该账号', {
            time: 20000, //20s后自动关闭
            btn: ['删除', '取消'],
            yes: function(i) {
               var index = layer.load(2, {
                  shade: [0.1, '#000'],
                  time: 10 * 1000
               });
               $http({
                  url: '' + $rootScope.ip + '/Staff/del_user',
                  method: 'POST',
                  data: {
                     user_id: user_id
                  }
               }).success(function(data) {
                  layer.close(index);
                  layer.close(i);
                  if (data.status == 1) {
                     $scope.getStaffList();
                  } else {
                     layer.msg(data.info);
                  }
               })
            }
         });
      }
      $scope.changeAccess = function() {
         $scope.formData.authority = [];
         for (var i = 0; i < $scope.authority.length; i++) {
            if ($scope.authority[i].checked) {
               $scope.formData.authority.push($scope.authority[i].value)
            }
         }
      }
      $scope.save = function() {
         if ($scope.userId > 0) {
            $http({
               url: '' + $rootScope.ip + '/Staff/edit_user',
               method: 'POST',
               data: {
                  user_id: $scope.userId,
                  mobile_phone: $scope.formData.mobile_phone,
                  position: $scope.formData.position,
                  true_name: $scope.formData.true_name,
                  user_name: $scope.formData.user_name,
                  authority: $scope.formData.authority,
                  staff_status: $scope.formData.staff_status
               }
            }).success(function(data) {
               layer.msg(data.info, {
                  time: 2000
               });
               if (data.status == 1) {
                  $scope.cancelStaffEditor();
                  $scope.getStaffList();
               }
            })
         } else if ($scope.type == 'new') {
            $http({
               url: '' + $rootScope.ip + '/Staff/add_user',
               method: 'POST',
               data: $scope.formData
            }).success(function(data) {
               layer.msg(data.info, {
                  time: 2000
               });
               if (data.status == 1) {
                  $scope.cancelStaffEditor();
                  $scope.getStaffList();
               }
            })
         } else if ($scope.type == 'yet') {
            $http({
               url: '' + $rootScope.ip + '/Staff/add_now',
               method: 'POST',
               data: {
                  user_id: $scope.userInfo.data.user_id,
                  step: 'two',
                  mobile_phone: $scope.formData.mobile_phone,
                  position: $scope.formData.position,
                  true_name: $scope.formData.true_name,
                  user_name: $scope.formData.user_name,
                  authority: $scope.formData.authority,
                  str_verify: $scope.formData.str_verify,
                  phone_code: $scope.formData.phone_code,
                  staff_status: $scope.formData.staff_status
               }
            }).success(function(data) {
               layer.msg(data.info, {
                  time: 2000
               });
               if (data.status == 1) {
                  $scope.cancelStaffEditor();
                  $scope.getStaffList();
               }
            })
         }
      }
      $scope.getNext = function() {
         var index = layer.load(2, {
            shade: [0.1, '#000'],
            time: 10 * 1000
         });
         $http({
            url: '' + $rootScope.ip + '/Staff/add_now',
            method: 'POST',
            data: {
               step: 'one',
               user_name: $scope.formData.user_name
            }
         }).success(function(data) {
            layer.close(index);
            if (data.status == 1) {
               layer.close($scope.staffEditor);
               setTimeout(function() {
                  $scope.userInfo = data;
                  $scope.formData.mobile_phone = data.data.mobile_phone;
                  $scope.formData.true_name = data.data.true_name;
                  $scope.formData.user_name = data.data.user_name;
                  $scope.openStaffEditor('yet', '添加已有账号');
               }, 500);
            } else {
               layer.msg(data.info, {
                  time: 2000
               });
            }
         })
      }
      $http({
         method: "POST",
         url: '' + $rootScope.ip + '/Login/verify',
         data: {
            fontSize: 32,
            length: 4,
            useNoise: true
         }
      }).success(function(data) {
         $scope.skey = data.data.skey;
         $scope.codeFn();
      })
      //回调一次验证码接口获取图片
      $scope.codeFn = function() {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Login/verify',
            data: {
               /* fontSize: 32,
               length: 4,
               useNoise: true,
               codeSet: $scope.code */
               fontSize: 32,
               length: 4,
               useNoise: 0,
               codeSet: 0,
               skey: $scope.skey
            }
         }).success(function(data) {
            if (data.status == 1) {
               $scope.skey = data.data.skey;
               $scope.verifyImg = data.data.captcha + '?' + Math.random(); //增加随机参数时间可强制刷新
            }
         })
      };
      $scope.vwait = 60;
      $scope.vdisabled = false;
      $scope.vvalue = '发送验证码';
      $scope.vtimer;
      $scope.vtime = function() {
         if ($scope.vwait == 0) {
            $scope.vdisabled = false;
            $scope.vtimer = null;
            $scope.$apply(function() {
               $scope.vvalue = "发送验证码";
            });
            $scope.vwait = 60;
            return;
         } else {
            $scope.vdisabled = true;
            $scope.$apply(function() {
               $scope.vvalue = "(" + $scope.vwait + ")秒后重新发送";
            });
            $scope.vtimer = setTimeout(function() {
               $scope.vtime();
               $scope.vwait--;
            }, 1000)
         }
      }
      $scope.getMobileCode = function() {
         $http({
            method: "POST",
            url: '' + $rootScope.ip + '/Login/getMobileCode',
            data: {
               type: $scope.type == 'yet' ? 'member' : 'changeM',
               mobile: $scope.formData.mobile_phone,
               verify: $scope.formData.str_verify,
               skey: $scope.skey
            }
         }).success(function(data) {
            if (data.status == 1) {
               $scope.vtime();
            } else {
               $scope.codeFn();
               layer.msg(data.info);
            }
         })
      }
   }])