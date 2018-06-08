myApp.controller('SHDTiedCardControl', function ($scope, $rootScope, $state, $data) {

   $rootScope.change = true;

   var params = $scope.params = {
      code_sn: null,
      cards_name: null,
      cards_phone: null,
      user_phone: null,
      bank_cards: null,
      str_verify: null,
      phone_code: null
   };
   $scope.Shd_bindCard = function () {
      $scope.downtime = 60;
      $scope.timer = setInterval(() => {
         if ($scope.downtime == 1) {
            $scope.downtime = null;
            clearInterval($scope.timer);
         } else {
            --$scope.downtime;
         }
         $scope.$apply(function () {
            $scope.downtime;
         });
      }, 1000)
      $data.Shd_bindCard(params).success(function (res) {
         if (res.status == 1) {

         }
      })
   }
   $scope.Shd_bankConfirm = function () {
      $data.Shd_bankConfirm(params).then(function(res){
         
      })
      $state.go('SHD.borrowingsInfo');
   }
})