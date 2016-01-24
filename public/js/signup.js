$(function() {
    reflash();
    selectHeight();
	var $input = $('input').not('#reset');
    $input.focus(function() {
        $(this).parent().find('.span').removeClass('init-position').addClass('up-position');
        $(this).parent().addClass('blue-div');
    })
    $input.blur(function() {
        var self = this;
        var $this = $(this);
        $this.parent().find('.span').removeClass('up-position').addClass('init-position');
        if ($(this).val()) {
            if (validator.isFieldValid(this.name, $(this).val())) {
                clearWarning($this.parent(), validator.form[this.name].errorMessage);
            } else {
                setWarning($this.parent(), validator.form[this.name].errorMessage);
            }
            $this.parent().removeClass('blue-div').addClass('used-div');
            $this.parent().find('.span').removeClass('up-position').addClass('used-span');
        } else { //如果为空则不作处理
            $this.parent().removeClass('blue-div red-div');
            $this.parent().find('.span').removeClass('used-span').addClass('init-position');
            clearWarning($this.parent(), "");
        }
    });
    $('#reset').click(clearAll);
    $('#post').click(post);
});


function setWarning(obj, errorMessage) {
    obj.addClass('red-div');
    obj.find('.span').addClass('warning-span');
    obj.find('.warning').text(errorMessage);
}

function clearWarning(obj, errorMessage) {
    obj.removeClass('red-div');
    obj.find('.span').removeClass('warning-span');
    errorMessage = "";
    obj.find('.warning').text(errorMessage);
}

function clearAll() {
	$('.input-div').removeClass("blue-div red-div used-div");
	$('.span').removeClass('used-span up-position warning-span').addClass('init-position');
	$('.input').val("");
	$('.warning').text("");
}

function reflash() {
    var inputs = $('input').not('#reset');
    for (var i = 0; i < inputs.length; ++i) {
        if ($(inputs[i]).val() && $(inputs[i]).parent().find('.warning').text() != '') {
            $(inputs[i]).parent().addClass('red-div');
            $(inputs[i]).parent().find('.span').addClass('warning-span up-position');
        } else if ($(inputs[i]).val()) {
            $(inputs[i]).parent().removeClass('blue-div').addClass('used-div');
            $(inputs[i]).parent().find('.span').removeClass('up-position').addClass('used-span');
            
        }
    }
}

function checkEmpty() {
    if ($('#name-div').find('input').val() == '' && validator.form.username.status == false) 
        setWarning($('#name-div'), validator.ERROR_MESSAGE[14]);
    if ($('#id-div').find('input').val() == '' && validator.form.sid.status == false) 
        setWarning($('#id-div'), validator.ERROR_MESSAGE[24]);
    if ($('#phone-div').find('input').val() == '' && validator.form.phone.status == false) 
        setWarning($('#phone-div'), validator.ERROR_MESSAGE[34]);
    if ($('#email-div').find('input').val() == '' && validator.form.email.status == false) 
        setWarning($('#email-div'), validator.ERROR_MESSAGE[44]);
    if ($('#password-div').find('input').val() == '' && validator.form.password.status == false) 
        setWarning($('#password-div'), validator.ERROR_MESSAGE[54]);
}


function post () {
    $('input').not('#reset').blur();
    checkEmpty();
    if (!validator.isFormValid() && this.type == 'submit') return false;
}

function selectHeight() {
    var title = $(document).attr("title");
    if (title == '注册') $('.container').css('height', 600);
    if (title == '登录') $('.container').css('height', 300);
}