var myApp = angular.module('myApp', [
    'ipCookie',
    'ngSanitize',
    'myApp.HttServices',
    'myApp.controllers',
    'myApp.user-controllers',
    'myApp.router',
    'myApp.directives',
    'myApp.filter',
    'afkl.lazyImage',
    // 'ui.bootstrap'
])
myApp.config(function ($provide, $compileProvider, $controllerProvider, $filterProvider) {
    myApp.controller = $controllerProvider.register;
    myApp.directive = $compileProvider.directive;
    myApp.filter = $filterProvider.register;
    myApp.factory = $provide.factory;
    myApp.service = $provide.service;
    myApp.constant = $provide.constant;

    
});