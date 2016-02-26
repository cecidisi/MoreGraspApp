(function($){

    window.validatePasswordChange = function(field1, field2, onError){

        onError = onError || function(){};
        var password1 = $('input[name="' + field1 + '"]').val(),
            password2 = $('input[name="' + field2 + '"]').val(),
            illegalChars = /[\W_]/;

        // New password set
        if(password1.length === 0) {
            onError(field1, 'Enter new password'); return false;
        }
        // Contains only characters, numbers and _
        if(illegalChars.test(password1)) {
            onError(field1, 'New password contains illegal characters'); return false;
        }
        // Length > 8
        if(password1.length < 8) {
            onError(field1, 'New password should have at least 8 characters'); return false;
        }
        // Repeated password is set
        if(password2.length === 0) {
            onError(field2, 'Repeat new password'); return false;
        }
        // New and repeated passwords match
        if(password1 !== password2) {
            onError(field2, 'Repeated password does not match'); return false;
        }
        return true;
    };

    window.validateText = function(field, name, onError){
        var text = $('input[name="' + field + '"]').val(),
            regExp = /^[\D^!@#$%^&*()\+\=\[\]\\\';,.\/{}|\":<>?]+$/;

        if(text !== '') {
            if(!regExp.test(text)) {
                onError(field, 'illegal-characters');
                return false;
            }

            regExp = /\b[A-Z]/;     // Capitalized words
            if(!regExp.test(text)) {
                onError(field, 'not-capitalized');
                return false;
            }
        }
        return true;
    };


    window.validateEmail = function(field, onError) {
        var email = $('input[name="' + field + '"]').val(),
            regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regExp.test(email))
            return true;
        onError(field, 'invalid-email');
        return false
    };


    window.validatePhone = function(field, onError) {
        var phone = $('input[name="' + field + '"]').val(),
            regExp = /^[0-9\s+-]+$/;
        if(regExp.test(phone))
            return true;
        onError(field, 'invalid-phone');
        return false
    };

})(jQuery)
