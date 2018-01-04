
angular.module('myApp.directives', [])
    .directive('repeatDone', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    // 这个判断意味着最后一个 OK
                    $timeout(function () {
                        scope.$eval(attrs.repeatDone)    // 执行绑定的表达式
                    });
                }
            }
        }
    })
    .directive('downTime', function () {
        return {
            restrict: 'ECMA',
            link: function (scope, element, attrs) {
                //console.log(element[0].dataset.date)
                setTimeout(function () {
                    if (element[0].dataset.date) {
                        var data = element[0].dataset.date;
                        var day = '';
                        var hour = '';
                        var minute = '';
                        var second = '';
                        setInterval(function () {
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
    .directive('downTime1', function () {
        return {
            restrict: 'ECMA',
            link: function (scope, element, attrs) {
                //console.log(element[0].dataset.date)
                setTimeout(function () {
                    if (element[0].dataset.date) {
                        var data = element[0].dataset.date;
                        var day = '';
                        var hour = '';
                        var minute = '';
                        var second = '';
                        setInterval(function () {
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
    .directive('backButton', function () {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                element.bind('click', goBack);

                function goBack() {
                    history.back();
                    scope.$apply();
                }
            }
        }
    })
    .directive('ngcLayDate', function ($timeout) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '=',
                maxDate: '@',
                minDate: '@'
            },
            link: function (scope, element, attr, ngModel) {
                var _date = null, _config = {};
                // 渲染模板完成后执行
                $timeout(function () {
                    // 初始化参数
                    _config = {
                        elem: '#' + attr.id,
                        format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
                        max: attr.hasOwnProperty('maxDate') ? attr.maxDate : '',
                        min: attr.hasOwnProperty('minDate') ? attr.minDate : '',
                        choose: function (data) {
                            scope.$apply(setViewValue);
                        },
                        clear: function () {
                            ngModel.$setViewValue(null);
                        }
                    };
                    // 初始化
                    _date = laydate(_config);

                    // 监听日期最大值
                    if (attr.hasOwnProperty('maxDate')) {
                        attr.$observe('maxDate', function (val) {
                            _config.max = val;
                        })
                    }
                    // 监听日期最小值
                    if (attr.hasOwnProperty('minDate')) {
                        attr.$observe('minDate', function (val) {
                            _config.min = val;
                        })
                    }

                    // 模型值同步到视图上
                    ngModel.$render = function () {
                        element.val(ngModel.$viewValue || '');
                    };

                    // 监听元素上的事件
                    element.on('blur keyup change', function () {
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
    .directive('passForm', function ($http) {
        return {
            restrict: 'EA',
            link: function (scope, ele, attr) {
                var inputDom = angular.element(ele[0].querySelector('.Jpass'));//密码框
                var spanDoms = ele.find('li');//光标li
                var faguang = angular.element(ele[0].querySelector('.Jfaguang'));//发光外框
                var that = this;
                inputDom.on('focus blur keyup', function (e) {
                    e = e ? e : window.event;
                    e.stopPropagation();

                    console.log('value len:' + this.value.length);
                    console.log(e.type);
                    if (e.type === 'focus') {
                        var _currFocusInputLen = this.value.length === 6 ? 5 : this.value.length;
                        spanDoms.eq(_currFocusInputLen).addClass('active');
                        faguang.css({ left: _currFocusInputLen * 38 + 'px', opacity: 1 });
                    } else if (e.type === 'blur') {
                        var _currBlurInputLen = this.value.length;
                        spanDoms.eq(_currBlurInputLen).removeClass('active');
                        faguang.css({ opacity: 0 });
                    } else if (e.type === 'keyup') {
                        //console.log(this.value);
                        //键盘上的数字键按下才可以输入
                        if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                            var curInputLen = this.value.length;//输入的文本内容长度
                            for (var j = 0; j < 6; j++) {
                                spanDoms.eq(j).removeClass('active');
                                spanDoms.eq(curInputLen).addClass('active');
                                spanDoms.eq(curInputLen - 1).next().find('i').css({ backgroundColor: 'transparent' });
                                spanDoms.eq(curInputLen - 1).find('i').css({ backgroundColor: '#000' });
                                faguang.css({
                                    left: curInputLen * 38 + 'px'
                                });
                            }
                            if (curInputLen === 0) {
                                spanDoms.find('i').css({ backgroundColor: 'transparent' });
                            }
                            if (curInputLen === 6) {
                                spanDoms.eq(5).addClass('active');
                                faguang.css({
                                    left: '190px'
                                });
                                //直接发起密码验证
                                var doSubmitCallback = function () {
                                    scope.pass = '';
                                    spanDoms.find('i').css({ backgroundColor: 'transparent' });
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
    .directive('imgLazyLoad', function () {
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
            link: function (scope, element, attrs) {
                // console.log(scope, element, attrs)
                element[0].src = scope.defaultSrc||'../img/150-39.jpg';
                element[0].style.width = 'auto';
                element[0].style.display = 'inline-block';
                element[0].style.verticalAlign = 'middle';
                element[0].style.maxHeight = '100%';
                element[0].style.maxWidth = '100%';

                var img = new Image();
                img.src = scope.src;
                img.onload = function () {
                    element[0].style.width = 'inherit';
                    element[0].src = scope.src;
                }
                var span = document.createElement('span');
                span.style.display = 'inline-block';
                span.style.height = '100%';
                span.style.verticalAlign = 'middle';
                element[0].parentNode.insertBefore(span,element[0])
            }
        }
    })

