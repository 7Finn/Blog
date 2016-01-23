/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"

var express = require('express');
var router = express.Router();
var debug = require('debug')('api:Serve');

module.exports = function(db) {
  var postsManager = require('../models/posts')(db);
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
  }).put(function(req, res, next) {
    var id = req.params.id;
    postsManager.updatePost(id, req.body, function(err) {
      if (err) {
        res.json(false);
      } else {
        res.json(true);
      }
    });
  }).delete(function(req, res, next) {
    var id = req.params.id;
    postsManager.deletePost(id, function(err) {
      if (err) {
        res.json(false);
      } else {
        res.json(true);
      }
    })
  });

  router.post('/post', function(req, res, next) {
    postsManager.createPost(req.body);
    res.json(req.body);
  });


  return router;
}


