myApp.controller('ShowSpecialControl', function ($scope, $rootScope, $stateParams, $state, $data) {

    $rootScope.change = true;
    $rootScope.isShow = false;
 
    $data.showSpecial().success(function(res){
        $scope.data = res;
    })
 })