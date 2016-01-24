$(function() {
    $('#reset').click(clearAll);
    $('#post').click(post);
});


function setWarning(obj, errorMessage) {
    obj.removeClass('alert-info').addClass('alert-danger');
    obj.text(errorMessage);
}


function checkEmpty() {
    if ($('#username').val == '' || $('#password').val() == '') {
        setWarning($('#password-div'), "用户信息不可为空×");
        return false;
    }
    return true;
}


function post () {
    $('input').not('#reset').blur();
    if (!checkEmpty() && this.type == 'submit') return false;
}


var ERROR_MESSAGE = {
    // 成功
    0: '',
    // 用户名
    14: '用户名不可为空×',
    54: '密码不可为空×',
}