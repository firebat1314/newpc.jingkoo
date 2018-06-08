myApp.controller('SHDBorrowingsPersonInfoControl', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $window, $location, $anchorScroll, $sce) {

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

   $scope.education = [
      { label: '高中及以下', id: '0' },
      { label: '专科', id: '1' },
      { label: '本科', id: '2' },
      { label: '硕士及以上', id: '3' },
   ]
   $scope.marital_status = [
      { label: '已婚', id: '1' },
      { label: '未婚', id: '2' },
      { label: '离异', id: '3' },
      { label: '丧偶', id: '4' },
      { label: '其他', id: '0' },
   ]
   $scope.child_status = [
      { label: '有', id: '1' },
      { label: '无', id: '2' },
   ]
   $scope.house_type = [
      { label: '自有全款', id: '0' },
      { label: '自有有按揭', id: '1' },
      { label: '租赁', id: '2' },
   ]
   $scope.contact_relation = [
      { label: '配偶', id: 'C' },
      { label: '父母', id: 'D' },
      { label: '子女', id: 'H' },
      { label: '兄弟姐妹', id: 'X' },
      { label: '亲属', id: 'L' },
      { label: '同事', id: 'W' },
      { label: '同学', id: 'T' },
      { label: '朋友', id: 'Y' },
      { label: '其他', id: 'O' },
   ]


   $scope.next = function () {
      ipCookie(ipCookie('username') + '_shd_borrowings', $scope.params);
      $state.go('SHD.companyInfo');
   }
})