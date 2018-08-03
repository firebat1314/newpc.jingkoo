myApp.controller('jingkuFinanceController', function ($scope, $rootScope, $stateParams, $state, $data) {

   $rootScope.change = true;
   $rootScope.isShow = false;

   $data.jingku_finance().success(function (res) {
      $scope.data = res;
   })
})