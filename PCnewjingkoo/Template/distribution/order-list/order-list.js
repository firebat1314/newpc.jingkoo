myApp.controller('orderListDistributionControl', ['$scope', '$rootScope', '$state', '$http', 'ipCookie', '$window', '$data', '$stateParams', '$anchorScroll', '$location', function($scope, $rootScope, $state, $http, ipCookie, $window, $data, $stateParams, $anchorScroll, $location) {
   //获取用户订单信息
   //控制首页会员中心显隐
   $rootScope.isShow = false;
   //控制header和footer显隐
   $rootScope.change = true;

   $scope.ListPage = {
      page: 1,
      size: 10,
      type: $stateParams.type1 || '',
      order_number: null
   };


   $scope.getOrd = function(data) {
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
         $data.getAllOrderD({
            type: '',
            page: $scope.ListPage.page
         }).success(function(data) {
            layer.close(cool);
            $scope.AllOrder = data;
            $('html,body').animate({
               'scrollTop': 0
            }, 500)
         })
      }
   }
   $scope.getAllOrderHs = function(order) {
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $scope.ListPage.type = order;

      $data.getAllOrderD({
         type: order || '',
         page: $scope.ListPage.page
      }).success(function(data) {
         layer.close(cool);
         $scope.AllOrder = data;
         $scope.getOrd(data);
         $scope.getOrderLength();
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
            $scope.getOrderLength();
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
               $scope.getOrderLength();
            } else {
               layer.msg('取消失败', {
                  icon: 2
               });
            }
         })
      });
   }

   //		获取不同的订单信息
   //		未支付
   $scope.getOrderLength = function() {
      $data.getAllOrderD({
         type: 'unpay'
      }).success(function(data) {
         $scope.orderpay = data.count;
      })
      $data.getAllOrderD({
         type: 'collect'
      }).success(function(data) {
         $scope.orderDsh = data.count;
      })
      $data.IntegralOrder().success(function(data) {
         $scope.InNum = data.count;
      })
   }

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
            $state.go('order-detail-d', {
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
   $scope.token = ipCookie('token');
   $scope.viewerContract = function(order_id) {
      var w = window.open();
      $http({
         method: "POST",
         url: '' + $rootScope.ip + '/Distribution/infoUrl',
         data: {
            order_id: order_id
         },
      }).success(function(data) {
         if (data.status) {
            w.location = data.url;
         } else {
            layer.msg(data.info);
            w.close();
         }
      })
   }
   $scope.downloadContract = function(order_id) {
      location.href = $rootScope.ip + '/Distribution/downloadPdf?order_id=' + order_id + '&token=' + ipCookie('token');
   }
   $scope.sealContract = function(order_id) {
      var w = window.open();
      $http({
         method: "POST",
         url: '' + $rootScope.ip + '/Seal/index',
         data: {
            order_id: order_id
         },
      }).success(function(data) {
         if (data.status) {
            w.location = data.url;
         } else {
            layer.msg(data.info);
            w.close();
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
      $data.getAllOrderD({
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


   //					
   //	$scope.goOrdera = function (e) {
   //		$data.getOrderInfo({order_id:e.target.dataset.order}).success(function (data) {
   //			if (data.status==1) {
   //				$state.go('order-detail',{
   //					orderId : e.target.dataset.order
   //				});
   //			} else{
   //				layer.msg(data.info,{icon:2,time:1000});
   //			}
   //		})		
   //	}
   //			$('.genzg').click(function (e) {
   //				$('.ggz-tc').css({top:e.target.offsetTop-$(window).scrollTop() - 11 +'px',left:e.target.offsetLeft-310}).show();
   //			})
   //			$('.ggz-tc').mouseleave(function(){
   //				$('.ggz-tc').hide();
   //			})
   //			$('.ggz-tc').mouseover(function(){
   //				$('.ggz-tc').show();
   //			})
   //		
   //			$(document).scroll(function(){
   //				$('.ggz-tc').hide();
   //				
   //			})


   //页码
   $scope.ListPage1 = {
      page: 1,
      size: 10
   };

   $scope.getOrd1 = function(data) {
      $('#Pagination').pagination(data.pages, $scope.options1)
   };
   //分页操作
   $scope.pageIndex = 0; //初始页索引
   $scope.pageSize = 10; //每页数据条数
   $scope.options1 = {
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
         $scope.ListPage1.page = index + 1;
         var cool = layer.load(0, {
            shade: [0.3, '#fff']
         });
         $http({
            method: "GET",
            url: '' + $rootScope.ip + '/User/exchangeGoods',
            params: $scope.ListPage1,
            headers: {
               'Authorization': 'Basic ' + btoa(ipCookie('token') + ':')
            }
         }).success(function(data) {
            layer.close(cool);
            $scope.InOrd = data;
            $scope.InOrdList = data.list;
            $('html,body').animate({
               'scrollTop': 0
            }, 500)
         })
      }
   }

   //得到积分列表
   $scope.getAllIntegral = function() {
      var cool = layer.load(0, {
         shade: [0.3, '#fff']
      });
      $data.IntegralOrder().success(function(data) {
         layer.close(cool);
         if (data.status == 0) {
            layer.msg(data.info, {
               icon: 2,
               time: 3000
            });
         } else {
            $scope.InOrd = data;
            $scope.InOrdList = data.list;
            $scope.getOrd1(data);
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
         log_id: 0,
         type: 'order',
         is_distribution: 1
      });
   }

   //		积分跳到积分详情
   $scope.goIntDetail = function(order_id) {
      $state.go('intergral-detail', {
         order_id: order_id
      });
   }
}])