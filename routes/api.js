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
  var commentsManager = require('../models/comments')(db);

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
          var subText = post.text;
          if (post.text.length > 50) subText = subText.substr(0, 50) + '...';
          posts.push({
            id: post._id,
            author : post.author,
            title: post.title,
            text: subText,
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
      postid : id,
      author : req.session.user.username,
      commentText : req.body.commentText,
    }
    commentsManager.addComment(comment, function(err, doc) {
      console.log(doc);
      res.json({
        comment : doc
      });
    });
  });

  router.route('/comment/:id')
  .get(function(req, res, next) {
    var id = req.params.id;
    commentsManager.getComment(id, function(err, data) {
      res.json({
        comment : data
      })
    })
  })
  .put(function(req, res, next) {
    var id = req.params.id;
    if (!req.session.user) res.json(false);
    commentsManager.getComment(id, function(err, data) {
      if (data && (req.session.user.username == data.author 
        || req.session.user.username == "admin@finn.com")) {
        commentsManager.updateComment(id, req.body, function(err, doc) {
          res.json({
            postid : doc
          })
        });
      } else {
        res.json(false);
      }
    });
  })
  .delete(function(req, res, next) {
    var id = req.params.id;
    if (!req.session.user) res.json(false);
    commentsManager.getComment(id, function(err, data) {
      if (data && (req.session.user.username == data.author 
        || req.session.user.username == "admin@finn.com")) {
        commentsManager.deleteComment(id, function(err, doc) {
          res.json({
            postid : doc
          })
        });
      } else {
        res.json(false);
      }
    });
  })

  router.get('/comment/postid/:id', function(req, res, next) {
    var id = req.params.id;
    commentsManager.getPostId(id)
    .then(function(postid){
      res.json({
        postid: postid
      })
    });
  })

  router.put('/comment/hide/:id', function(req, res, next) {
    if (req.session.user.username != "admin@finn.com") res.json(false);
    var id = req.params.id;
    console.log('/comment/hide/:' + id);
    commentsManager.hideComment(id, function(err, doc) {
      res.json({
        postid : doc
      })
    });
  });

  router.put('/post/hide/:id', function(req, res, next) {
    if (req.session.user.username != "admin@finn.com") res.json(false);
    var id = req.params.id;
    console.log("/post/hide/:" + id);
    postsManager.hidePost(id);
    res.json(true);
  });

  router.route('/post/:id')
  .get(function(req, res, next) {
    var id = req.params.id;
    var permissionComment = true;
    var permissionEdit = false;
    var permissionHide = false;
    postsManager.findPost(id, function(err, data) {
      if (data) {
        if (!req.session.user) permissionComment = false;
        else if (req.session.user.username == "admin@finn.com") {
          permissionEdit = true;
          permissionHide = true;
        } else if (req.session.user.username == data.author) permissionEdit = true;
        var comments = [];
        commentsManager.getComments(id, function(err, commentData) {
          commentData.forEach(function (comment, i) {
            var subText = comment.commentText;
            if (comment.commentText.length > 50) subText = subText.substr(0, 50) + '...';
            comments.push({
              _id: comment._id,
              postid : comment.postid,
              author : comment.author,
              commentText: subText,
            });
          }
          , function(err) {
            res.json({
              post: data,
              comments : comments,
              permissionComment : permissionComment,
              permissionEdit : permissionEdit,
              permissionHide : permissionHide,
            });
          });
        })
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
        commentsManager.deleteComments(id);
        res.json(true);
      } else {
        res.json(false);
      }
    });
  });


  router.route('/post')
  .get(function(req, res, next) {
    if (!req.session.user) res.json(false);
    else res.json(true);
  })
  .post(function(req, res, next) {
    var post = {
      author : req.session.user.username,
      title : req.body.title,
      text : req.body.text,
      hide : req.body.hide,
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


