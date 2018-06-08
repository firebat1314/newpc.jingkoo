myApp.controller('SHDBorrowingsControl', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $data) {
  $rootScope.change = true;

  $scope.params = {
    loan_amt: null,
    loan_term: null,
    bank_code: null,
    sms_check_code: null,
    app_term: null,
    bank_card_no: null
  };
  
  $scope.loan_term = [
    { label: '一个月', id: 1 },
    { label: '三个月', id: 3 },
 ];
  $scope.getMobileCode = function () {

    $data.Shd_sendSignCheckCode().then(res => {
      if (res.status == 1) {
        $scope.downtime = 60;
        var timer = setInterval(() => {
          if ($scope.downtime == 1) {
            $scope.downtime = null;
            clearInterval(timer);
          } else {
            --$scope.downtime;
          }
          $scope.$apply(function () {
            $scope.downtime;
          });
        }, 1000)
      }
    })
  }
  $scope.signedAffirm = function () {
    $scope.layerbox = layer.open({
      type: 1,
      shade: false,
      area: ['420px', '220px'], //宽高
      title: false,
      content: $('.signed-affirm'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
      cancel: function (index) {
        
      }
    });
  }
  $scope.affirm = function(){
    $data.Shd_loanSetup($scope.params).then(res => {
      layer.close($scope.layerbox)

    })
  }
  $scope.cancel = function(){
    layer.close($scope.layerbox)

  }
})