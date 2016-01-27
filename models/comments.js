
module.exports = function(db) {
	var comments = db.collection('comments');
    var ObjectID = require('mongodb').ObjectID;

	return {
        addComment : function(comment) {
            return comments.insert(comment).then(function() {
                return comment;
            })
        },
        getComments : function(postid) {
            return new Promise(function(resolve, reject) {
                resolve(comments.find({postid : postid}));
            })
        },
        getComment : function(id) {
            return comments.findOne({_id: ObjectID(id)})
        },
        getPostId : function(id) {
            return comments.findOne({_id: ObjectID(id)}).then(function(data) {
                return data.postid;
            });
        },
        updateComment : function(id, data) {
            comments.updateOne({_id: ObjectID(id)}, {$set:{commentText:data.text}});
            return comments.findOne({_id: ObjectID(id)})
                    .then(function(data) {
                        return data.postid;
                    });
        },
        deleteComment : function(id) {
            var postid;
            return comments.findOne({_id: ObjectID(id)})
                    .then(function(data) {
                        postid = data.postid;
                        comments.remove({_id:ObjectID(id)});
                    })
                    .then(function() {
                        return postid;
                    });
        },
        hideComment : function(id) {
            comments.updateOne({_id: ObjectID(id)}, {$set:{hide : true}})
            return comments.findOne({_id: ObjectID(id)})
                    .then(function(data) {
                        return data.postid;
                    });
        },
        deleteComments : function(postid) {
            return comments.remove({postid : postid});
        },
    }
};

