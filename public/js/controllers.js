'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
}

function AddPostCtrl($scope, $http, $location) {
  var post = {
    title : '',
    text : '',
    comments : [],
  };
  $scope.alertType = true;
  $scope.submitPost = function () {
    if (!($scope.form.title) || !($scope.form.text)) {
      $scope.alertType = false;
    } else {
      post.title = $scope.form.title;
      post.text = $scope.form.text;
      console.log(post);
      $http.post('/api/post', post).
      success(function(data) {
        $location.path('/');
      });
    }
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $scope.alertType = true;
  $scope.formType = false;
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.addComment = function () {
    $scope.formType = true;
  }

  $scope.submitComment = function () {
    if (!($scope.form.commentText)) {
      $scope.alertType = false;
    } else {
      $http.post('/api/post/comment/' + $routeParams.id, $scope.form).
      success(function(data) {
        // $location.url('/readPost/' + $routeParams.id);
      });
    }
  }
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $scope.alertType = true;
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    if (!($scope.form.title) || !($scope.form.text)) {
      $scope.alertType = false;
    } else {
      $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
    }
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

function LoginCtrl($scope, $http, $location) {
  $scope.form = {
    username : '',
    password : ''
  };
  $scope.alertType = true;
  $scope.loginBtn = function () {
    if (!($scope.form.username) || !($scope.form.password)) {
      $scope.warning = "用户信息不合法。";
      $scope.alertType = false;
    } else {
      $http.post('/api/login', $scope.form).
      success(function(data) {
        if (data == "false") {
          console.log("This is false");
          $scope.warning = "用户信息错误。";
          $scope.alertType = false;
        } else {
          console.log("This is true");
          $location.path('/');
        }
      })
    }
  };
}


function RegistCtrl($scope, $http, $location) {
  $scope.form = {
    username : '',
    password : '',
    rePassword : '',
  };
  $scope.alertType = true;
  $scope.registBtn = function () {
    if (!($scope.form.username) || !($scope.form.password) || !($scope.form.rePassword)) {
      $scope.warning = "用户信息不合法。";
      $scope.alertType = false;
    } else if ($scope.form.password != $scope.form.rePassword) {
      $scope.warning = "两次输入密码不一致。";
      $scope.alertType = false;
    } else {
      $http.post('/api/regist', $scope.form).
      success(function(data) {
        $location.path('/login');
      });
    }
  };
}
