
module.exports = function(db) {
	var posts = db.collection('posts');
    var ObjectID = require('mongodb').ObjectID;

	return {
        createPost: function(post) {
            posts.insert(post);
        },
        showAllPosts: function(callback) {
            posts.find(function(err, doc) {
                callback(err, doc);
            });
        },
        findPost: function(id, callback) {
            posts.findOne({_id:ObjectID(id)}, function(err, doc) {
                callback(err, doc);
            });
        },
        deletePost: function(id) {
            posts.remove({_id:ObjectID(id)});
        },
        updatePost: function(id, data) {
            posts.updateOne({_id:ObjectID(id)}, {$set:{title:data.title, text:data.text}});
        },
        addComment : function(postid, comment) {
            posts.findOne({_id:ObjectID(postid)}, function(err, doc) {
                doc.comments.push(comment);
                posts.updateOne({_id:ObjectID(postid)}, {$set:{comments : doc.comments}});
            });
        },
    }
};

