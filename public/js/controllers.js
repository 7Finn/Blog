'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
  $scope.key = "";
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
}


//----------------------------------评论板块----------------------------------------------//



function EditCommentCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $scope.alertType = true;
  $http.get('/api/comment/' + $routeParams.id).
    success(function(data) {
      $scope.form.text = data.comment.commentText;
    });

  $scope.editComment = function () {
    if (!($scope.form.text)) {
      $scope.alertType = false;
    } else {
      $http.put('/api/comment/' + $routeParams.id, $scope.form).
      success(function(data) {
        if (data == "false") $location.path('/');
        else $location.url('/readPost/' + data.postid);
      });
    }
  };
}

function DeleteCommentCtrl($scope, $http, $location, $routeParams) {

  $http.get('/api/comment/' + $routeParams.id).
    success(function(data) {
      $scope.commentText = data.comment.commentText;
    });

  $scope.deleteComment = function () {
    $http.delete('/api/comment/' + $routeParams.id).
      success(function(data) {
        if (data == "false") $location.path('/');
        else $location.url('/readPost/' + data.postid);
      });
  };

  $scope.home = function () {
    $http.get('/api/comment/postid/' + $routeParams.id).
      success(function(data) {
        $location.url('/readPost/' + data.postid);
      })
  };
}

function HideCommentCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/comment/' + $routeParams.id).
    success(function(data) {
      $scope.commentText = data.comment.commentText;
    });

  $scope.hideComment = function () {
    $http.put('/api/comment/hide/' + $routeParams.id, false).
      success(function(data) {
        if (data == "false") $location.url('/');
        else $location.url('/readPost/' + data.postid);
      });
  };

  $scope.home = function () {
    $http.get('/api/comment/postid/' + $routeParams.id).
      success(function(data) {
        $location.url('/readPost/' + data.postid);
      })
  };
}

//----------------------------------文章板块----------------------------------------------//


function AddPostCtrl($scope, $http, $location) {
  var post = {
    title : '',
    text : '',
    hide : false,
    comments : [],
  };
  $scope.form = {}
  $scope.alertType = true;
  $http.get('/api/post').
    success(function(data) {
      if (data == "false") $location.path('/login');
    })

  $scope.submitPost = function () {
    if (!($scope.form.title) || !($scope.form.text)) {
      $scope.alertType = false;
    } else {
      post.title = $scope.form.title;
      post.text = $scope.form.text;
      $http.post('/api/post', post).
      success(function(data) {
        $location.path('/');
      });
    }
  };
}

function ReadPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $scope.alertType = true;
  $scope.formType = false;
  $scope.permissionComment = false;
  $scope.permissionEdit = false;
  $scope.permissionHide = false;
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      if (data == "false") {
        $location.path('/login');
      } else {
        $scope.post = data.post;
        $scope.comments = data.comments;
        $scope.permissionComment = data.permissionComment;
        $scope.permissionEdit = data.permissionEdit;
        $scope.permissionHide = data.permissionHide;
      }
    });
  $scope.addComment = function () {
    $scope.formType = ($scope.formType == true) ? false : true;
    $scope.alertType = true;
  };

  $scope.submitComment = function () {
    if (!($scope.form.commentText)) {
      $scope.alertType = false;
    } else {
      $http.post('/api/post/comment/' + $routeParams.id, $scope.form).
      success(function(data) {
        if (data == "false") {
          $location.path('/');
        } else {
          $scope.formType = false;
          $scope.form.commentText = '';
          $scope.comments.push(data.comment);
        }
      });
    }
  };
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
        if (data == "false") $location.url('/');
        else $location.url('/readPost/' + $routeParams.id);
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
        if (data == "false") $location.url('/');
        else $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/readPost/' + $routeParams.id);
  };
}

function HidePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.hidePost = function () {
    $http.put('/api/post/hide/' + $routeParams.id, false).
      success(function(data) {
        if (data == "true") $location.url('/readPost/' + $routeParams.id);
        else $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/readPost/' + $routeParams.id);
  };
}

function LoginCtrl($scope, $http, $rootScope, $location) {
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
          $scope.warning = "用户信息错误。";
          $scope.alertType = false;
        } else {
          $rootScope.currentUsername = data.username;
          $rootScope.signAdress = '/logout';
          $rootScope.sign = "退出账号";
          $location.path('/');
        }
      })
    }
  };
}

function LogoutCtrl($scope, $http, $rootScope, $location) {
  $scope.logout = function () {
    $http.get('/api/logout').
      success(function(data) {
        $rootScope.currentUsername = '';
        $rootScope.signAdress = '/login';
        $rootScope.sign = "登录";
        $location.path('/login');
      });
  };

  $scope.home = function () {
    $location.url('/');
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
        if (data == "true") $location.path('/login');
        else {
          $scope.warning = data.warning;
          $scope.alertType = false;
        } 
      });
    }
  };
}

function navCtrl($scope, $rootScope, $http) {
  $rootScope.currentUsername = '';
  $rootScope.signAdress = '';
  $rootScope.sign = '';
  $http.get('/api/user').
  success(function(data) {
    if (data.username != '') {
      $rootScope.currentUsername = data.username;
      $rootScope.signAdress = '/logout';
      $rootScope.sign = "退出账号";
    } else {
      $rootScope.signAdress = '/login';
      $rootScope.sign = "登录";
    }
  });
}