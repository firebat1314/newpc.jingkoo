myApp.controller('noCommentListController', function($scope, $rootScope, $stateParams, $state, $data) {

   $rootScope.change = true;
   $rootScope.isShow = false;


   $data.commentNoComment({
      page: 1,
      size: 10
   }).success(function(res) {
      if (res.status == 1) {
         $scope.noCommentData = res;
      }
   })
   $scope.pingjia = function(id) {

   }
   $scope.callback = function(index) {
      $data.commentNoComment({
         page: index + 1,
         size: 10
      }).success(function(res) {
         if (res.status == 1) {
            $scope.noCommentData = res;
            $('html,body').animate({
               'scrollTop': 0
            }, 500)
         }
      })
   }
})