myApp.controller('SHDBorrowingsInfoControl', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $window, $location, $sce) {
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
   $scope.params = ipCookie(ipCookie('username')+'_shd_borrowings');
   /* setInterval(function(){
      ipCookie(ipCookie('username')+'_shd_borrowings', params);
   },5000) */

   $scope.loan_use = [
      { label: '采购货物', id: 1 },
      { label: '扩大业务', id: 2 },
      { label: '资金周转', id: 3 },
      { label: '技术改造', id: 4 },
      { label: '经营场所租金', id: 5 },
      { label: '经营场所装修', id: 6 },
      { label: '其他', id: 7 }
   ];
   $scope.app_term = [
      { label: '一个月', id: 1 },
      { label: '三个月', id: 3 },
   ];
   $scope.next = function () {
      ipCookie(ipCookie('username')+'_shd_borrowings', $scope.params);
      $state.go('SHD.borrowingsPersonInfo');
   }
})