
(function($){
    var handleScreenSize = function() {
        console.log(window.screen.availWidth);
        if(window.screen.availWidth >= 768 && window.screen.availWidth <= 1024) {
            console.log('resize big');
            // input fields
            $('.form-control').addClass('input-lg');
            // toggles
            $('.toggle.btn').addClass('btn-lg');
            $('.toggle-on.btn').addClass('btn-lg');
            $('.toggle-off.btn').addClass('btn-lg');
            $('.toggle-handle.btn').addClass('btn-lg');
            // buttons
            $('.btn-sizable').addClass('btn-lg');
            // radio buttons
            $('.rd-priority').addClass('btn-group-lg');
            $('.rd-priority label').addClass('btn-lg');
        }
        else{
            console.log('resize normal');
            // input fields
            $('.form-control').removeClass('input-lg');
            // toggles
            $('.toggle.btn').removeClass('btn-lg');
            $('.toggle-on.btn').removeClass('btn-lg');
            $('.toggle-off.btn').removeClass('btn-lg');
            $('.toggle-handle.btn').removeClass('btn-lg');
            // buttons
            $('.btn-sizable').removeClass('btn-lg');
            // radio buttons
            $('.rd-priority').removeClass('btn-group-lg');
            $('.rd-priority label').removeClass('btn-lg');
        }

    }

    window.addEventListener('resize', function(evt){
        handleScreenSize();
    });

    $(document).ready(function(){
        handleScreenSize();
    });

})(jQuery);
