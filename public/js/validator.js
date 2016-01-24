var validator = {
  ERROR_MESSAGE: {
    // 成功
    0: '',
    // 用户名
    10: '用户名须以英文字母开头×',
    11: '用户名应多于6位×',
    12: '用户名应少于18位×',
    13: '用户名只可包含字母、数字或下划线×',
    14: '用户名不可为空×',
    // 学号
    20: '学号开头不应为0×',
    21: '学号长度应为8位×',
    23: '学号只可包含数字×',
    24: '学号不可为空×',
    // 手机号
    30: '手机号开头不应为0×',
    31: '手机号长度应为11位×',
    33: '手机号只可包含数字×',
    34: '手机号不可为空×',
    // 邮箱
    43: '邮箱格式不正确×',
    44: '邮箱不可为空×',
    //密码
    50: '密码为6~12位×',
    51: '只能包含数字、字母、中划线、下划线×',
    54: '密码不可为空×',
    55: '两次输入的密码不一致×',
  },

  form: {
    username: {
      status: false,
      errorMessage: "",
    },
    password: {
      status: false,
      errorMessage: "",
    },
    repeatPassword: {
      status: false,
      errorMessage: "",
    },
  }, 

  findFormatErrors: function(user) {
    var errorMessages = {
      username : "",
      password : "",
    };
    for (var key in user) {
      if (user.hasOwnProperty(key)) {
        if (!validator.isFieldValid(key, user[key])) errorMessages[key] = validator.form[key].errorMessage;
      }
    }
    return errorMessages;
  },

  isUsernameValid: function (username){
    this.form.username.status = false;
    var re = /^[a-zA-Z0-9 \-]+@(([a-zA-Z0-9 \-])+\.)+[a-zA-Z]{2,4}$/;
    var len = username.length;
    if (len == 0) this.form.username.errorMessage = this.ERROR_MESSAGE[0];
    //判断username是否非法
    else if (!re.test(username)) this.form.username.errorMessage = this.ERROR_MESSAGE[43];
    else {
      this.form.username.status = true;
      this.form.username.errorMessage = this.ERROR_MESSAGE[0];
    }
    return this.form.username.status;
  },

  isPasswordValid: function (password) {
    this.password = password;
    this.form.password.status = false;
    var reNum = /^[a-zA-Z0-9_\-]+$/;
    var len = password.length;
    if (len == 0) this.form.password.errorMessage = this.ERROR_MESSAGE[0];
    else if (len < 6 || len > 12) this.form.password.errorMessage = this.ERROR_MESSAGE[50];
    else if (!reNum.test(password)) this.form.password.errorMessage = this.ERROR_MESSAGE[51];
    else {
      this.form.password.status = true;
      this.form.password.errorMessage = this.ERROR_MESSAGE[0];
    }
    return this.form.password.status;
  },

  isRepeatPasswordValid: function (repeatPassword) {
    var len = repeatPassword.length;
    if (len == 0) this.form.repeatPassword.errorMessage = this.ERROR_MESSAGE[0];
    else if (repeatPassword != this.password) this.form.repeatPassword.errorMessage = this.ERROR_MESSAGE[55];
    else if (repeatPassword == this.password) {
        this.form.repeatPassword.status = true;
        this.form.repeatPassword.errorMessage = this.ERROR_MESSAGE[0];
    }
    return this.form.repeatPassword.status;
  },

  isFieldValid: function(fieldname, value){
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function(){
    return this.form.username.status 
    && this.form.password.status
    && ((typeof window !== 'object') || this.form.repeatPassword.status);
  },

  getErrorMessage: function(fieldname){
    return this.form[fieldname].errorMessage;
  },

  isAttrValueUnique: function(registry, user, attr){
    for (var key in registry) {
      if (registry.hasOwnProperty(key) && registry[key][attr] == user[attr] && attr != 'password') return false;
    }
    return true;
  },
}

if (typeof module == 'object') { // 服务端共享
  module.exports = validator
}


