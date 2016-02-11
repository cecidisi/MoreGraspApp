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
        //$('input[name="' + field + '"]').css('background-color', bgColor);
        $('input[name="' + field + '"]').parent().addClass('has-feedback has-error');
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

    // on modal close
    $('.modal').on('hidden.bs.modal', function(evt){
        evt.stopPropagation();
        $('.modal p.error').addClass('fade');
        //$('.modal input.form-control').css('background-color', '');
        $('.modal input.form-control').parent().removeClass('has-feedback').removeClass('has-error');
        $('.modal input.form-control[type="password"]').val('');
    })

    // on input keyup
    $('.modal input.form-control').keyup(function(){
        console.log('keyup');
        $('.modal input.form-control').parent().removeClass('has-feedback').removeClass('has-error');
        $('.modal p.error').addClass('fade');
    });

})(jQuery)
