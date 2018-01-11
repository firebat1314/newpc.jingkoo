
angular.module('ShopListModule', [])

.controller('ShopListControl', ['$scope', '$rootScope', '$stateParams', '$http', 'ipCookie', '$window', '$location', '$data', '$anchorScroll', '$state', '$timeout', function ($scope, $rootScope, $stateParams, $http, ipCookie, $window, $location, $data, $anchorScroll, $state, $timeout) {
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
                   }
               })
       }
   };
}])