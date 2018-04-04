
angular.module('JumpModule', [])
.controller('jumpControl', ['$scope', '$rootScope', '$stateParams', '$state', '$http', 'ipCookie', '$window', '$location', '$anchorScroll', '$sce', function ($scope, $rootScope, $stateParams, $state, $http, ipCookie, $window, $location, $anchorScroll, $sce) {
   location.href = '/default.html';
}])