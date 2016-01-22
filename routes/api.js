/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"

var express = require('express');
var router = express.Router();
var debug = require('debug')('api:Serve');

var data = {
"posts": [
    {
      "title": "Lorem ipsum",
      "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      "title": "Sed egestas",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    }
  ]
};

module.exports = function(db) {
  // // GET
  router.get('/posts', function(req, res, next) {
    var posts = [];
    data.posts.forEach(function (post, i) {
      posts.push({
        id: i,
        title: post.title,
        text: post.text.substr(0, 50) + '...'
      });
    });
    res.json({
      posts: posts
    });
  });

  router.route('/post/:id')
  .get(function(req, res, next) {
    var id = req.params.id;
    if (id >= 0 && id < data.posts.length) {
      res.json({
        post: data.posts[id]
      });
    } else {
      res.json(false);
    }
  }).put(function(req, res, next) {
    var id = req.params.id;

    if (id >= 0 && id < data.posts.length) {
      data.posts[id] = req.body;
      res.json(true);
    } else {
      res.json(false);
    }
  }).delete(function(req, res, next) {
    var id = req.params.id;

    if (id >= 0 && id < data.posts.length) {
      data.posts.splice(id, 1);
      res.json(true);
    } else {
      res.json(false);
    }
  });

  router.post('/post', function(req, res, next) {
    data.posts.push(req.body);
    res.json(req.body);    
  });


  return router;
}


