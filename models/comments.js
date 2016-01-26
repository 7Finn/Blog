
module.exports = function(db) {
	var comments = db.collection('comments');
    var ObjectID = require('mongodb').ObjectID;

	return {
        addComment : function(comment, callback) {
            comments.insert(comment, function(err, doc) {
                callback(err, comment);
            });
        },
        getComments : function(postid, callback) {
            comments.find({postid : postid}, function(err, doc) {
                callback(err, doc);
            });
        },
        getComment : function(id, callback) {
            comments.findOne({_id: ObjectID(id)}, function(err, doc) {
                callback(err, doc);
            })
        },
        getPostId : function(id) {
            return comments.findOne({_id: ObjectID(id)}).then(function(data) {
                return data.postid;
            });
        },
        updateComment : function(id, data, callback) {
            comments.updateOne({_id: ObjectID(id)}, {$set:{commentText:data.text}});
            comments.findOne({_id: ObjectID(id)}, function(err, doc) {
                callback(err, doc.postid);
            })
        },
        deleteComment : function(id, callback) {
            var postid;
            comments.findOne({_id: ObjectID(id)}, function(err, doc) {
                postid = doc.postid;
                comments.remove({_id:ObjectID(id)});
                callback(err, postid);
            })
        },
        hideComment : function(id, callback) {
            comments.updateOne({_id: ObjectID(id)}, {$set:{hide : true}});
            comments.findOne({_id: ObjectID(id)}, function(err, doc) {
                callback(err, doc.postid);
            })
        },
        deleteComments : function(postid) {
            comments.remove({postid : postid});
        },
    }
};

