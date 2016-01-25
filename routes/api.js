/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"

var express = require('express');
var router = express.Router();

module.exports = function(db) {
  var postsManager = require('../models/posts')(db);
  var userManager = require('../models/users')(db);


  // router.all('*', function(req, res, next){
  //   req.session.user ? next() : res.redirect('/login');
  // });
  router.get('/user', function(req, res) {
      if (req.session.user) {
          res.json({
              username : req.session.user.username
          })
      } else {
          res.json({
              username : ''
          })
      }
  });

  router.get('/posts', function(req, res, next) {
    var posts = [];
    postsManager.showAllPosts(function(err, data) {
      if (err) {
        //err
      } else {
        data.forEach(function (post, i) {
          posts.push({
            id: post._id,
            author : post.author,
            title: post.title,
            text: post.text.substr(0, 50) + '...'
          });
        }
        , function(err) {
          res.json({
            posts: posts
          });
        });
      }
    });
  });

  router.post('/post/comment/:id', function(req, res, next) {
    var id = req.params.id;
    var comment = {
      author : req.session.user.username,
      commentText : req.body.commentText,
    }
    postsManager.addComment(id, comment);
    res.json(true);
  });

  router.route('/post/:id')
  .get(function(req, res, next) {
    var id = req.params.id;
    postsManager.findPost(id, function(err, data) {
      if (data) {
        var permissionComment = true;
        var permissionEdit = false;
        if (!req.session.user) permissionComment = false;
        else if (req.session.user.username == data.author 
                || req.session.user.username == "admin@finn.com") permissionEdit = true;
        res.json({
          post: data,
          permissionComment : permissionComment,
          permissionEdit : permissionEdit,
        });
      } else {
        res.json(false);
      }
    });
  })
  .put(function(req, res, next) {
    var id = req.params.id;
    if (!req.session.user) res.json(false);
    postsManager.findPost(id, function(err, data) {
      if (data && (req.session.user.username == data.author 
        || req.session.user.username == "admin@finn.com")) {
        postsManager.updatePost(id, req.body);
        res.json(true);
      } else {
        res.json(false);
      }
    });
  })
  .delete(function(req, res, next) {
    var id = req.params.id;
    if (!req.session.user) res.json(false);
    postsManager.findPost(id, function(err, data) {
      if (data && (req.session.user.username == data.author 
        || req.session.user.username == "admin@finn.com")) {
        postsManager.deletePost(id);
        res.json(true);
      } else {
        res.json(false);
      }
    });
  });

  router.post('/post', function(req, res, next) {
    var post = {
      author : req.session.user.username,
      title : req.body.title,
      text : req.body.text,
      comments : [],
    }
    postsManager.createPost(post);
    res.json(req.body);
  });

  router.post('/login', function(req, res, next) {
    try {
      userManager.findUser(req.body.username, req.body.password, function(err, user) {
        if (err) {
          console.log("信息错误");
          res.json(false);
        } else {
          req.session.user = user;
          console.log("登录成功: ");
          console.log(user);
          res.json(user);
        }  
      });
    } catch(error) {
        console.log("登录出错:" + error);
        res.json(false);
      };
  });



  router.post('/regist', function(req, res, next) {
    var user = req.body;
    userManager.checkUser(user)
      .then(userManager.createUser)
      .then(function(){
        req.session.user = user;
        debug("User session", user);
        res.json(true);
      })
      .catch(function(error){
        console.log("Regist Error:" + error);
        res.json({
          warning : error
        })
      });
  });

  router.get('/logout', function(req, res, next) {
    console.log("/logout");
    delete req.session.user;
    res.redirect('/login');
  });

  return router;
}


