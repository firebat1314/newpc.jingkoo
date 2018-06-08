myApp.controller('errorControl', function ($rootScope,$scope) {
   $rootScope.isShow = true;
   //控制header和footer显隐
   $rootScope.change = false;

   $scope.goback = function(){
      history.back();
   }
})