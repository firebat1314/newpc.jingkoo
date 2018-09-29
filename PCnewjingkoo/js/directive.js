angular.module('myApp.directives', [])
   .directive('script', function() {
      return {
         restrict: 'E',
         scope: false,
         link: function(scope, elem, attr) {
            if (attr.type === 'text/javascript-lazy') {
               var s = document.createElement("script");
               s.type = "text/javascript";
               var src = elem.attr('src');
               if (src !== undefined) {
                  s.src = src;
               } else {
                  var code = elem.text();
                  s.text = code;
               }
               document.head.appendChild(s);
               elem.remove();
            }
         }
      };
   })
   .directive('repeatDone', function($timeout) {
      return {
         link: function(scope, element, attrs) {
            if (scope.$last) {
               // 这个判断意味着最后一个 OK
               $timeout(function() {
                  scope.$eval(attrs.repeatDone) // 执行绑定的表达式
               });
            }
         }
      }
   })
   .directive('downTime', function() {
      return {
         restrict: 'ECMA',
         link: function(scope, element, attrs) {
            //console.log(element[0].dataset.date)
            setTimeout(function() {
               if (element[0].dataset.date) {
                  var data = element[0].dataset.date;
                  var day = '';
                  var hour = '';
                  var minute = '';
                  var second = '';
                  setInterval(function() {
                     data -= 1;
                     day = Math.floor(data / (24 * 3600)) || 0;
                     var leave1 = data % (24 * 3600);
                     hour = Math.floor(leave1 / (3600)) || 0;
                     var leave2 = leave1 % (3600);
                     minute = Math.floor(leave2 / (60)) || 0;
                     var leave3 = leave2 % (60);
                     second = Math.round(leave3) || 0;
                     element[0].innerHTML = '剩余' + day + '天' + hour + '时' + minute + '分' + second + '秒'
                     //element[0].innerHTML = day+hour+minute+second
                  }, 1000);
               }
            }, 200);
         }
      }
   })
   .directive('downTime1', function() {
      return {
         restrict: 'ECMA',
         scope: {
            downTime1: '='
         },
         link: function(scope, element, attrs) {
            //console.log(element[0].dataset.date)
            setTimeout(function() {
               if (element[0].dataset.date) {
                  var data = element[0].dataset.date;
                  var day = '';
                  var hour = '';
                  var minute = '';
                  var second = '';
                  setInterval(function() {
                     data -= 1;
                     day = Math.floor(data / (24 * 3600)) || 0;
                     var leave1 = data % (24 * 3600);
                     hour = Math.floor(leave1 / (3600)) || 0;
                     var leave2 = leave1 % (3600);
                     minute = Math.floor(leave2 / (60)) || 0;
                     var leave3 = leave2 % (60);
                     second = Math.round(leave3) || 0;
                     element[0].innerHTML = '剩余' + hour + '时' + minute + '分'
                     //element[0].innerHTML = day+hour+minute+second
                  }, 1000);
               }
            }, 200);
         }
      }
   })
   .directive('backButton', function() {
      return {
         restrict: 'A',

         link: function(scope, element, attrs) {
            element.bind('click', goBack);

            function goBack() {
               history.back();
               scope.$apply();
            }
         }
      }
   })
   .directive('ngcLayDate', function($timeout) {
      return {
         require: '?ngModel',
         restrict: 'A',
         scope: {
            ngModel: '=',
            maxDate: '@',
            minDate: '@'
         },
         link: function(scope, element, attr, ngModel) {
            var _date = null,
               _config = {};
            // 渲染模板完成后执行
            $timeout(function() {
               // 初始化参数
               _config = {
                  elem: '#' + attr.id,
                  format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
                  max: attr.hasOwnProperty('maxDate') ? attr.maxDate : '',
                  min: attr.hasOwnProperty('minDate') ? attr.minDate : '',
                  choose: function(data) {
                     scope.$apply(setViewValue);
                  },
                  clear: function() {
                     ngModel.$setViewValue(null);
                  }
               };
               // 初始化
               _date = laydate(_config);

               // 监听日期最大值
               if (attr.hasOwnProperty('maxDate')) {
                  attr.$observe('maxDate', function(val) {
                     _config.max = val;
                  })
               }
               // 监听日期最小值
               if (attr.hasOwnProperty('minDate')) {
                  attr.$observe('minDate', function(val) {
                     _config.min = val;
                  })
               }

               // 模型值同步到视图上
               ngModel.$render = function() {
                  element.val(ngModel.$viewValue || '');
               };

               // 监听元素上的事件
               element.on('blur keyup change', function() {
                  scope.$apply(setViewValue);
               });

               setViewValue();

               // 更新模型上的视图值
               function setViewValue() {
                  var val = element.val();
                  ngModel.$setViewValue(val);
               }
            }, 0);
         }
      };
   })
   .directive('passForm', function($http) {
      return {
         restrict: 'EA',
         link: function(scope, ele, attr) {
            var inputDom = angular.element(ele[0].querySelector('.Jpass')); //密码框
            var spanDoms = ele.find('li'); //光标li
            var faguang = angular.element(ele[0].querySelector('.Jfaguang')); //发光外框
            var that = this;
            inputDom.on('focus blur keyup', function(e) {
               e = e ? e : window.event;
               e.stopPropagation();

               console.log('value len:' + this.value.length);
               console.log(e.type);
               if (e.type === 'focus') {
                  var _currFocusInputLen = this.value.length === 6 ? 5 : this.value.length;
                  spanDoms.eq(_currFocusInputLen).addClass('active');
                  faguang.css({
                     left: _currFocusInputLen * 38 + 'px',
                     opacity: 1
                  });
               } else if (e.type === 'blur') {
                  var _currBlurInputLen = this.value.length;
                  spanDoms.eq(_currBlurInputLen).removeClass('active');
                  faguang.css({
                     opacity: 0
                  });
               } else if (e.type === 'keyup') {
                  //console.log(this.value);
                  //键盘上的数字键按下才可以输入
                  if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                     var curInputLen = this.value.length; //输入的文本内容长度
                     for (var j = 0; j < 6; j++) {
                        spanDoms.eq(j).removeClass('active');
                        spanDoms.eq(curInputLen).addClass('active');
                        spanDoms.eq(curInputLen - 1).next().find('i').css({
                           backgroundColor: 'transparent'
                        });
                        spanDoms.eq(curInputLen - 1).find('i').css({
                           backgroundColor: '#000'
                        });
                        faguang.css({
                           left: curInputLen * 38 + 'px'
                        });
                     }
                     if (curInputLen === 0) {
                        spanDoms.find('i').css({
                           backgroundColor: 'transparent'
                        });
                     }
                     if (curInputLen === 6) {
                        spanDoms.eq(5).addClass('active');
                        faguang.css({
                           left: '190px'
                        });
                        //直接发起密码验证
                        var doSubmitCallback = function() {
                           scope.pass = '';
                           spanDoms.find('i').css({
                              backgroundColor: 'transparent'
                           });
                           spanDoms.removeClass('active').eq(0).addClass('active');
                           faguang.css({
                              left: '0'
                           });
                        };
                        console.log(this.value);
                        //         $http.get('http://xxxx/test.php?pass='+this.value)
                        //          .success(function(res){
                        //           console.log(res);
                        //           if(res.status){
                        //            doSubmitCallback();
                        //            console.log(that.value+'-----');
                        //           }else{
                        //            doSubmitCallback();

                        //           }
                        //          });
                     }
                  } else {
                     this.value = this.value.replace(/\D/g, '');
                  }

               }
            });
         }
      }
   })
   .directive('imgLazyLoad', function() {
      return {
         // restrict: 'E',
         // replace: true,
         // templateUrl: 'dialogDirective',
         //transclude是必须的。
         // transclude:true,
         scope: {
            src: '@imgLazyLoad',
            defaultSrc: '@'
         },
         link: function(scope, element, attrs) {

            // console.log(scope, element, attrs)
            element[0].src = scope.defaultSrc || '../img/150-39.jpg';
            //  element[0].style.width = 'auto';
            element[0].style.display = 'inline-block';
            element[0].style.verticalAlign = 'middle';
            // element[0].style.maxHeight = '100%';
            element[0].style.maxWidth = '100%';

            scope.$watch('src', function() {
               var img = new Image();
               img.src = scope.src;
               img.onload = function() {
                  //   element[0].style.width = 'initial';
                  element[0].src = scope.src;
               }
               var span = document.createElement('span');
               span.style.display = 'inline-block';
               span.style.height = '100%';
               span.style.width = '0%';
               span.style.verticalAlign = 'middle';
               element[0].parentNode.insertBefore(span, element[0])
            })
         }
      }
   })
   .directive('getImage', function($data) {
      return {
         scope: {
            getImage: '&',
            quality: '=',
            CameraOptions: '='
         },
         link: function(scope, element, attrs) {
            element.on('change', function(e) {
               if (!e) {
                  return;
               }
               var file = e.target.files[0]; //获取文件
               var imageType = /^image\//;
               e.target.value = null; //选择成功后清空input值
               if (!imageType.test(file.type)) { //判断图片
                  this.native.showToast("请选择图片！");
               } else
               if (file.size > (15 * 1024 * 1024)) {
                  this.native.showToast("图片超过限制");
               } else {
                  var reader = new FileReader();
                  reader.onload = function(event) { //读取完成
                     var base = event.target['result'];
                     var cool = layer.load(0, {
                        shade: [0.3, '#fff']
                     });
                     $data.GetFileImg({
                        img: base
                     }).success(function(res) {
                        layer.close(cool);
                        if (res.status) {
                           scope.getImage({
                              img: {
                                 img_http: res.img_http,
                                 img_url: res.img_url,
                                 base64: base
                              }
                           });
                        }
                     })
                  };
                  reader.readAsDataURL(file);
                  // console.log(reader, reader.onload, reader.onloadend, reader.readAsDataURL)
               }
            })
         }
      }
   })
   .directive('imgPreview', function() {
      return {
         scope: {
            imgPreview: '=',
         },
         link: function(scope, element, attrs) {
            element.on('click', function(e) {
               var data = [];
               for (var i = 0; i < scope.imgPreview.imgs.length; i++) {
                  var img = scope.imgPreview.imgs[i];
                  if(typeof img === 'object'){
                     data.push({
                        "alt": "",
                        "pid": i, //图片id
                        "src": img.base64, //原图地址
                        "thumb": img.base64 //缩略图地址
                     })
                  }else{
                     data.push({
                        "alt": "",
                        "pid": i, //图片id
                        "src": img, //原图地址
                        "thumb": img //缩略图地址
                     })
                  }
                  
               }
               layer.photos({
                  photos: {
                     "title": "", //相册标题
                     "id": "", //相册id
                     "start": scope.imgPreview.index, //初始显示的图片序号，默认0
                     "data": data
                  },
                  anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
               });
            })
         }
      }
   })
   .directive('adsClick', function($state, $data) {
      return {
         restrict: 'A',
         scope: {
            adsClick: '@',
            typeName: '@',
            typeValue: '@',
            typeLink: '@'
         },
         link: function(scope, element, attrs) {
            element.css('cursor', 'pointer');
            $(element).on('click', function() {
               if (scope.adsClick) {
                  var data = JSON.parse(scope.adsClick)
                  var typeName = data.link_type.type_name;
                  var typeValue = data.link_type.type_value;
                  var typeLink = data.ad_link;
                  if (!typeName || !typeValue) {

                     $data.click_census({ //广告点击统计
                        type: 'ad',
                        effect: typeLink,
                        url: '/' + location.hash
                     });
                     return window.open(typeLink);
                  }
                  $data.click_census({
                     type: 'ad',
                     effect: typeValue,
                     url: '/' + location.hash
                  });

                  if (typeName == "category") {
                     var url = $state.href('shop-list', {
                        params: encodeURIComponent(JSON.stringify({
                           cat_id: typeValue,
                        }))
                     });
                     window.open(url, '_blank');
                  } else if (typeName == "goods") {
                     var url = $state.href('shop-detail', {
                        goods_id: typeValue,
                     });
                     window.open(url, '_blank');
                  } else if (typeName == "brand") {
                     var url = $state.href('shop-list', {
                        params: encodeURIComponent(JSON.stringify({
                           brand_id: typeValue,
                        }))
                     });
                     window.open(url, '_blank');
                  } else if (typeName == "search") {
                     var url = $state.href('shop-list', {
                        params: encodeURIComponent(JSON.stringify({
                           keywords: typeValue,
                        }))
                     });
                     window.open(url, '_blank');
                  }
                  return
               }
               console.log(scope.typeName, scope.typeValue)
               if (!scope.typeName || !scope.typeValue) {
                  return location = scope.typeLink;
               }
               if (scope.typeName == "category") {
                  var url = $state.href('shop-list', {
                     params: encodeURIComponent(JSON.stringify({
                        cat_id: scope.typeValue,
                     }))
                  });
                  window.open(url, '_blank');
               } else if (scope.typeName == "goods") {
                  var url = $state.href('shop-detail', {
                     goods_id: scope.typeValue,
                  });
                  window.open(url, '_blank');
               } else if (scope.typeName == "brand") {
                  var url = $state.href('shop-list', {
                     params: encodeURIComponent(JSON.stringify({
                        brand_id: scope.typeValue,
                     }))
                  });
                  window.open(url, '_blank');
               } else if (scope.typeName == "search") {
                  var url = $state.href('shop-list', {
                     params: encodeURIComponent(JSON.stringify({
                        keywords: scope.typeValue,
                     }))
                  });
                  window.open(url, '_blank');
               }
            })
         }
      }
   })
   .directive('myLoading', function() {
      return {
         restrict: 'E',
         replace: true,
         template: '<div class="loader loader--style5" style="text-align: center;padding: 5px 0;" title="4"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="0" width="4" height="10" fill="#666666"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite" /></rect><rect x="10" y="0" width="4" height="10" fill="#666666"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite" /></rect><rect x="20" y="0" width="4" height="10" fill="#666666"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite" /></rect></svg></div>',
         link: function(scope, element, attrs) {

         }
      }
   })
   .directive('adsTop', function() {
      return {
         restrict: 'E',
         transclude: true,
         scope: {},
         controller: ["$scope", "$http", '$rootScope', 'ipCookie', function($scope, $http, $rootScope, ipCookie) {
            $http({
               method: "POST",
               url: '' + $rootScope.ip + '/Index/ads',
               data: {
                  int_pos_id: 79,
                  int_size: 1
               },
            }).success(function(data) {
               if (data.status) {
                  $scope.topads = data;
               }
            })
            $scope.close = function(e) {
               e.stopPropagation();
               $('.ads-top').fadeOut();
            }
         }],
         templateUrl: 'template/ads-top.html',
         replace: true,
         link: function(scope, element, attrs) {
            element.css('width', '100%');
         }
      };
   })
   .directive('commentStars', function() {
      return {
         restrict: 'E',
         scope: {
            starRating: '=',
            allowEdit: '@'
         },
         template: '<span><i class="iconfont icon-star"></i><i class="iconfont icon-star"></i><i class="iconfont icon-star"></i><i class="iconfont icon-star"></i><i class="iconfont icon-star"></i></span>&nbsp;<span style="color: #999999;font-size: 12px;" class="starnum"></span>',
         link: function(scope, element, attrs) {
            var starRating = scope.starRating > 0 ? scope.starRating : 0;

            function renderer(ele) {
               ele.prevAll().css({
                  color: '#d6a916',
               });
               ele.css({
                  color: '#d6a916',
               });
               ele.nextAll().css({
                  color: '#e5e5e5',
               })
            }
            element.find('i').css({
               color: '#e5e5e5',
               cursor: 'pointer',
               marginRight: '3px'
            });
            if (!starRating) {
               element.find('i').css({
                  color: '#e5e5e5',
               });
            } else {
               renderer(element.find('i').eq(starRating - 1));
            }
            if (String(scope.allowEdit) == 'false') {
               return element.find('i').css({
                  cursor: 'initial',
               });
            }
            /* scope.$watch(scope.starRating, function (n, o) {
               console.log(n, o)
            }) */
            element.find('.starnum').html(starRating + "分");
            element.find('i').on('mouseenter', function() {
               renderer($(this));
               element.find('.starnum').html($(this).index() + 1 + "分");
            })
            element.on('mouseleave', function() {
               if (!starRating) {
                  element.find('i').css({
                     color: '#e5e5e5',
                  });
               } else {
                  renderer(element.find('i').eq(starRating - 1));
               }
               element.find('.starnum').html(starRating + "分");
            })
            element.find('i').on('click', function() {
               var i = $(this).index() + 1;
               scope.starRating = starRating = i;
               scope.$apply();
            })
         }
      }
   })

   .directive('pagination', function($timeout) {
      return {
         restrict: 'ECMA',
         scope: {
            oncall: '&',
            pages: '='
         },
         template: '<div class="s-pagination" id="s-pagination"></div></div>',
         controller: function($scope, $data, $ocLazyLoad) {

         },
         link: function(scope, element, attrs) {
            scope.$watch('pages', function() {
               $('.s-pagination').pagination(scope.pages, {
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
                     scope.oncall({
                        index: index
                     })
                  }
               });
            })
         }
      }
   })
   .directive('commentPage', function() {
      return {
         restrict: 'E',
         scope: {
            goodsid: '@'
         },
         templateUrl: 'template/comment/comment-list/comment-list.html',
         controller: function($scope, $data, $ocLazyLoad) {
            $ocLazyLoad.load('template/comment/comment-list/comment-list.css');

            $scope.data = null;
            $scope.type = 0;
            $scope.getData = function(type, comment_type) {
               $scope.type = type || 0;
               $data.commentIndex({
                  comment_type: comment_type || 0,
                  goods_id: $scope.goodsid,
                  type: $scope.type,
                  page: 1
               }).success(function(res) {
                  if (res.status == 1) {
                     $scope.data = res;
                     $scope.hao_baif_rating = (res.hao_baif || 100) / 20;
                     $scope.scrollTop();
                  }
               })
            }
            $scope.getData(0);
            $scope.showPhoto = function(imgs, start) {
               var data = [];
               for (var i = 0; i < imgs.length; i++) {
                  var img = imgs[i];
                  data.push({
                     "alt": "",
                     "pid": i, //图片id
                     "src": img, //原图地址
                     "thumb": img //缩略图地址
                  })
               }
               layer.photos({
                  photos: {
                     "title": "", //相册标题
                     "id": "", //相册id
                     "start": start, //初始显示的图片序号，默认0
                     "data": data
                  },
                  anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
               });
            }
            $scope.commentCommentLaud = function(item) {
               if (!item.is_laud) {
                  $data.commentCommentLaud({
                     id: item.comment_id
                  }).success(function(res) {
                     if (res.status == 1) {
                        item.is_laud = true;
                        item.laud_count++;
                     } else {
                        layer.msg(res.info);
                     }
                  })
               } else {
                  layer.msg('已经赞过啦');
               }
            }
            $scope.callback = function(index) {
               var cool = layer.load(0, {
                  shade: [0.3, '#fff']
               });
               $data.commentIndex({
                  comment_type: 0,
                  goods_id: $scope.goodsid,
                  type: $scope.type,
                  page: index + 1
               }).success(function(data) {
                  layer.close(cool);
                  if (data.status) {
                     $scope.data = data;
                  }
                  $scope.scrollTop();
               })

            }
            $scope.scrollTop = function() {
               $("body,html").animate({
                  "scrollTop": $('.goods-mainly-right').offset().top
               }, 100)
            }
         },
         link: function(scope, element, attrs) {

         }
      }
   })
/*    .directive('commentPage', function() {
		return {
			restrict: 'E',
			scope: {
				goodsid: '@'
			},
			templateUrl: 'template/comment/comment-list/comment-list.html',
			controller: function($scope, $data, $ocLazyLoad) {
				$ocLazyLoad.load('template/comment/comment-list/comment-list.css');

				
			},
			link: function(scope, element, attrs) {

			}
		}
	}) */