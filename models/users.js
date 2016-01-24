var bcrypt = require('bcrypt-nodejs');
var validator = require('../public/js/validator');

module.exports = function(db) {
	var users = db.collection('users');
	
	return {
        findUser: function(username, password, callback) {
            users.findOne({username: username}, function(err, doc) {
            	if (doc == null) {
            		callback("用户不存在", doc);
            	} else {
            		bcrypt.compare(password, doc.password, function(err, res) {
            			if (res) callback(null, doc);
            			else callback("密码错误", doc);
            		});
            	}
            });
        },

        createUser: function(user) {
            console.log("createUser: ");
            console.log(user);
            return bcrypt.hash(user.password, null, null, function(error, hash) {
                user.password = hash;
                user.rePassword = hash;
                return users.insert(user);
            });
        },

        checkUser: function(user) {
            var errorMessage ="用户名已被注册";
            console.log("checkUser : ");
            console.log(user);
            return new Promise(function(resolve, reject) {
                var flag = true;
                if (flag == true) resolve(user);
                else reject(errorMessage);
            }).then(function() {
                return users.findOne({username:user.username})
                    .then(function(existedUser) {
                        console.log('Exist: ', existedUser);
                        return existedUser ? Promise.reject(errorMessage) : Promise.resolve(user);
                    });
            });
        },
    }
};

