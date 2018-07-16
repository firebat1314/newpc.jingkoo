
angular.module('myApp.filter',[])

    .filter('includedByState', function ($state) { //可以注入依赖
        return function (text) {
            return $state.includes(text);
        }
    })
    .filter("hideName",function(){
      return function(input,uppercase){
          var out = input[0]+'*****'+input[input.length-1];
          
          return out;
      }
  });