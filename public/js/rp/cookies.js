(function($){

    // LANG
    var setCookie = function(name, value){
        console.log('set cookie ' + name + ' = ' + value);
        $.cookie(name, value, { domain: '', path: '/registration-platform' });
    };

    $('a.flag').click(function(evt){
        evt.stopPropagation();
        if(!$(this).parent().hasClass('active')) {
            var locale = $(this).attr('hreflang');
            $('a.flag').removeClass('active');
            $('a.flag').parent().removeClass('active');
            $(this).addClass('active');
            $(this).parent().addClass('active');
            setCookie('LANG', locale);
        }
    });

    $(document).ready(function(){
        if(!$.cookie('LANG')) {
            var navLang = navigator.language || navigator.userLanguage;
            setCookie('LANG', navLang.substr(0,2));
        }
    })

    // CONSENT
    if(!$.cookie('CONSENT')) {
        $('.cookie-wrapper').show();
        $('a#btn-got-it').click(function(){
            $('.cookie-wrapper').slideUp();
            setCookie('CONSENT', 'Yes');
        });
    }


})(jQuery);

