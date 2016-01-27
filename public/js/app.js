'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute', 'navCtrl', 'ngTable']).
  config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/addPost', {
        templateUrl: 'partials/addPost',
        controller: AddPostCtrl
      }).
      when('/readPost/:id', {
        templateUrl: 'partials/readPost',
        controller: ReadPostCtrl
      }).
      when('/editPost/:id', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      }).
      when('/deletePost/:id', {
        templateUrl: 'partials/deletePost',
        controller: DeletePostCtrl
      }).
      when('/hidePost/:id', {
        templateUrl: 'partials/hidePost',
        controller: HidePostCtrl
      }).
      when('/editComment/:id', {
        templateUrl: 'partials/editComment',
        controller: EditCommentCtrl
      }).
      when('/deleteComment/:id', {
        templateUrl: 'partials/deleteComment',
        controller: DeleteCommentCtrl
      }).
      when('/hideComment/:id', {
        templateUrl: 'partials/hideComment',
        controller: HideCommentCtrl
      }).
      when('/login', {
        templateUrl: 'partials/login',
        controller: LoginCtrl
      }).
      when('/regist', {
        templateUrl: 'partials/regist',
        controller: RegistCtrl
      }).
      when('/logout', {
        templateUrl: 'partials/logout',
        controller: LogoutCtrl
      }).
      when('/error', {
        templateUrl: 'partials/error',
        controller: ErrorCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
