(function($) {
    'use strict';
    $.fn.scrollTo = function(target, options, callback){

        if(typeof options === 'function' && arguments.length === 2){
            callback = options;
            options = target;
        }

        var settings =
            $.extend({
                scrollTarget  : target,
                offsetTop     : 0,
                duration      : 0,
                easing        : 'swing'
            }, options);

        return this.each(function(){
            var scrollPane = $(this);

            var scrollTarget;
            if( typeof settings.scrollTarget === 'number' ){
                scrollTarget = settings.scrollTarget;
            }
            else{
                if( settings.scrollTarget === 'top' ){
                    scrollTarget = 0;
                }
                else{
                    scrollTarget = $(settings.scrollTarget);
                    settings.offsetTop += scrollPane.offset().top;
                }
            }

            console.log(scrollTarget);
            //var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
            var scrollY = (typeof scrollTarget === 'number') ? scrollTarget : scrollPane.scrollTop() + scrollTarget.offset().top - settings.offsetTop;

            console.log('scrollY = ' + scrollY);
            scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
                if (typeof callback === 'function') { callback.call(this); }
            });
        });
    };


}(jQuery));


