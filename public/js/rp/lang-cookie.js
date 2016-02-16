(function($){

    var setLangCookie = function(locale){
        //console.log('set cookie = ' + locale);
        $.cookie('lang', locale, { domain: '', path: '' });
    };

    $('a.flag').click(function(evt){
        evt.stopPropagation();
        var locale = $(this).attr('hreflang');
        $('a.flag').removeClass('active');
        $('a.flag').parent().removeClass('active');
        $(this).addClass('active');
        $(this).parent().addClass('active');
        setLangCookie(locale);
    });

    $(document).ready(function(){
        if(!$.cookie('lang')) {
            var navLang = navigator.language || navigator.userLanguage;
            setLangCookie(navLang.substr(0,2));
        }
    })

})(jQuery);

