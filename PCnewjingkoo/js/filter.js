
angular.module('myApp.filter',[])

    .filter('includedByState', function ($state) { //可以注入依赖
        return function (text) {
            return $state.includes(text);
        }
    })