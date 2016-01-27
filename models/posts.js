
module.exports = function(db) {
	var posts = db.collection('posts');
    var ObjectID = require('mongodb').ObjectID;

	return {
        createPost: function(post) {
            return posts.insert(post);
        },
        showAllPosts: function() {
            return new Promise(function(resolve, reject) {
                resolve(posts.find());
            });
        },
        findPost: function(id) {
            return posts.findOne({_id:ObjectID(id)})
        },
        deletePost: function(id) {
            return posts.remove({_id:ObjectID(id)});
        },
        updatePost: function(id, data) {
            return posts.updateOne({_id:ObjectID(id)}, {$set:{title:data.title, text:data.text}});
        },
        hidePost: function(id) {
            return posts.updateOne({_id:ObjectID(id)}, {$set:{hide : true}});
        },
    }
};

