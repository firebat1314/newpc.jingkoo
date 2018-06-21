myApp.controller('SHDIndexControl', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $window, $location, $anchorScroll, $data) {
   $anchorScroll()

   $rootScope.change = true;
   $scope.items = [{'sdsd':'1231'},{'sdsd':'1231'},{'sdsd':'1231'}];

   $scope.add_user_status = null;

   $data.Shd_add_user().success(function(res){
      if(res.status==1){
         $scope.add_user_status = true;
      }
   })
})