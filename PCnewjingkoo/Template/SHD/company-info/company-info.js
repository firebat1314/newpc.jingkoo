myApp.controller('SHDCompanyInfoControl', function ($scope, $rootScope, $stateParams, $state, ipCookie,$data) {

   $rootScope.change = true;
   $scope.params = {
      app_amt: null,
      app_term: null,
      loan_use: null,
      com_name: null,
      business_area: null,
      business_address: null,
      com_code: null,
      local_work_time: null,
      education: null,
      marital_status: null,
      child_status: null,
      residential_area: null,
      residential_address: null,
      house_type: null,
      contact_info: [
         {
            contact_name: null,
            contact_relation: null,
            contact_mobile: null
         }, {
            contact_name: null,
            contact_relation: null,
            contact_mobile: null
         }
      ],
      email: null
   };
   $scope.params = ipCookie(ipCookie('username') + '_shd_borrowings');

   $scope.submit = function(){
      $data.Shd_preApply($scope.params).then(function(res){
         if(res.status==1){
             
         }else{
            ipCookie(ipCookie('username') + '_shd_borrowings', $scope.params);
         }
      })
      
      $state.go('SHD')
   }
})