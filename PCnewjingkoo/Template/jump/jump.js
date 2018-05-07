
angular.module('JumpModule', [])
   .controller('jumpControl', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ipCookie', '$window', '$location', '$anchorScroll', '$sce', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $window, $location, $anchorScroll, $sce) {
      $scope.token = $stateParams.token
      if ($scope.token) {
         $http({
            url: '' + $rootScope.ip + '/Login/fastLogin',
            method: 'POST',
            data: { fastToken: $scope.token },
            headers: { 'Authorization': 'Basic ' + btoa($scope.token + ':') }
         }).success(function (data) {
            if (data.status == 1) {
               $state.go('home');
               ipCookie("token", data.data.token, { expires: 21 });
               ipCookie("username", data.data.user_name, { expires: 21 });
               ipCookie("phone_number", data.data.mobile_phone, { expires: 21 });
               ipCookie("login_by_phone", false, { expires: 21 });
               ipCookie("has_login", true, { expires: 21 });
            } else if (data.status == -2) {
               layer.confirm('请绑定企业信息', {
                  btn: ['绑定', '取消'] //按钮
               }, function (index) {
                  $state.go('registerCompany');
                  layer.close(index)
               }, function () {
                  layer.msg('请绑定企业信息后登陆', {
                     time: 20000, //20s后自动关闭
                     btn: ['知道了']
                  });
               });
            } else {
               layer.msg(data.info, { time: 2500 }, function () {
                  // location.href = '/default.html';
               });
            }
         });
      } else {
         location.href = '/default.html';
      }
   }])