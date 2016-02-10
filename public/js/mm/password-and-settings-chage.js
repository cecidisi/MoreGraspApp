(function($){

    var submitChange = function(args){
        $.post({
            url: args.url,
            data: args.data,
        }).success(function(data, textStatus, jqXHR){
            $('.modal').modal('hide');
            alert(jqXHR.responseText);
            console.log(textStatus);
        }).fail(function(jqXHR){
            $('.modal p.error').html(jqXHR.responseText).removeClass('fade');
            console.log(jqXHR);
        })
    }

    var showError = function(field, msg){
        var bgColor = 'rgba(255,255,204,.7)';
        $('input[name="' + field + '"]').css('background-color', bgColor);
        $('.modal p.error').html(msg).removeClass('fade');
    };

    $('#btn-submit-password').click(function(){
        var $form = $($(this).attr('for'));
        if(validatePasswordChange('new_password', 'repeat_password', showError))
            submitChange({ url: '/matchmaking1/change-password', data: $form.serialize() });
    });

    $('#btn-submit-settings').click(function(){
        var $form = $($(this).attr('for'));
        if(validateEmail('email', showError) && validatePhone('phone', showError))
            submitChange({ url: '/matchmaking1/change-settings', data: $form.serialize() });
    });

    $('.modal').on('hidden.bs.modal', function(evt){
        evt.stopPropagation();
        $('.modal p.error').addClass('fade');
        $('.modal input.form-control').css('background-color', '');
        $('.modal input.form-control[type="password"]').val('');
    })

    $('.modal input.form-control').keyup(function(){
        $('.modal input.form-control').css('background-color', '');
        $('.modal .bg-danger').addClass('fade');
    });

})(jQuery)
