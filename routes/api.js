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

  // // GET


  router.get('/posts', function(req, res, next) {
    var posts = [];
    postsManager.showAllPosts(function(err, data) {
      if (err) {
        //err
      } else {
        data.forEach(function (post, i) {
          posts.push({
            id: post._id,
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
    postsManager.addComment(id, req.body);
    res.json(true);
  });

  router.route('/post/:id')
  .get(function(req, res, next) {
    var id = req.params.id;
    postsManager.findPost(id, function(err, data) {
      if (data) {
        res.json({
          post: data
        });
      } else {
        res.json(false);
      }
    });
  })
  .put(function(req, res, next) {
    var id = req.params.id;
    postsManager.updatePost(id, req.body);
    res.json(true);
  })
  .delete(function(req, res, next) {
    var id = req.params.id;
    postsManager.deletePost(id, function(err) {
      if (err) {
        res.json(false);
      } else {
        res.json(true);
      }
    });
  });

  router.post('/post', function(req, res, next) {
    postsManager.createPost(req.body);
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
          res.json(true);
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

  router.get('/signout', function(req, res, next) {
    delete req.session.user;
    res.redirect('/login');
  });

  router.all('*', function(req, res, next){
    req.session.user ? next() : res.redirect('/login');
  });

  return router;
}


