
/*
 * GET home page.
 */
var express = require('express');
var router = express.Router();

module.exports = function(db) {    
  
    router.get('/', function(req, res){
        res.render('index');
    });

    router.get('/partials/:name', function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

    router.all('*', function(req, res){
        res.render('index');
    });
    
    return router;
}