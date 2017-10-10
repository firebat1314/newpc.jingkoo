
(function (ng) {
    'use strict';
    var app = ng.module('ngLoadScript', []);
    app.directive('script', function() {
        return {
            restrict: 'E',
            scope: false,
            link: function(scope, elem, attr)
            {
                if (attr.type==='text/javascript-lazy')
                {
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    var src = elem.attr('src');
                    if(src!==undefined)
                    {
                        s.src = src;
                    }
                    else
                    {
                        var code = elem.text();
                        s.text = code;
                    }
                    document.head.appendChild(s);
                    elem.remove();
                }
            }
        };
    });
}(angular));

angular.module('myApp', [
    'myApp.controllers',
    'myApp.user-controllers',
    'myApp.router',
    'myApp.directives',
    'ngLoadScript',
    'ipCookie',
    'ngSanitize',
    'myApp.services',
    'afkl.lazyImage'
])
// function get_html(html){
//     console.log(html);
//     return html;
// }