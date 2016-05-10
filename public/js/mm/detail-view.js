var DetailView = (function(){

    var _this, root;
    var $root, $paneVideo = $('#pane-video'), $paneMisc = $('#pane-misc');

    var customScrollOptions = {
        axis: 'y',
        theme: 'light',
        scrollbarPosition: 'inside',
        autoHideScrollbar: true,
        scrollEasing: 'linear',
        scrollInertia: 0,
        mouseWheel: {
            enable: true,
            axis: 'y'
        },
        keyboard: {
            enable: true
        },
        advanced: {
            updateOnContentResize: true
        }
    };


    function DetailView(arguments){
        _this = this;
        var args = $.extend({
            root: ''
        }, arguments);

        this.root = args.root;
        this.callbacks = args.callbacks;
        $root = $(this.root);
        $root.mCustomScrollbar(customScrollOptions);
    }


    DetailView.prototype = {
        showUser: function(user){

            Object.keys(user).forEach(function(category){
                Object.keys(user[category]).forEach(function(field){
                    var value = user[category][field];
                    if(typeof value === 'boolean')
                        value = value ? 'Yes' : 'No';
                    if(field === 'date_injury')
                        value = value.getMMYYYY();
                    if(field === 'priorities')
                        value = value.map(function(p, i){ return (i+1)+'. '+p }).join('<br>');
                    $('p[name="' + field + '"]').html(value);
                });
            });

            // Load Video/s
            $paneVideo.empty();
            if(user.video && user.video.files && user.video.files.length) {
                user.video.files.forEach(function(videoPath){
                    var $videoContainer = $('<div/>').appendTo($paneVideo).addClass('video-container');
                    $('<video src="/uploads/' + videoPath + '" width="100%" height="100%" controls></video>').appendTo($videoContainer);
                });
            }
            else {
                $('<p/>', { text: 'No video uploaded'}).appendTo($paneVideo);
            }

            // Misc Questions
            $paneMisc.empty();
            if(user.misc && user.misc.length) {
                user.misc.forEach(function(misc){
                    var $row = $('<div/>', { class: 'detail-item lg' }).appendTo($paneMisc);
                    $('<label/>').appendTo($row).html(misc.question+':');
                    $('<p/>').appendTo($row).html(misc.answer);
                });
            }

            if(user.meta.status === 'registered') {
                $(_this.root + ' .btn').removeClass('disabled');
            }
            else {
                if(user.meta.status === 'accepted') {
                    $('#btn-accept-candidate').addClass('disabled');
                    $('#btn-reject-candidate').removeClass('disabled');
                }
                else {
                    $('#btn-accept-candidate').removeClass('disabled');
                    $('#btn-reject-candidate').addClass('disabled');
                }
            }
        },

        clear:function(){
            $(_this.root + ' p').html('');
            $(_this.root + ' .btn').addClass('disabled');
            $paneVideo.empty();
            $('<p/>', { text: 'No video uploaded'}).appendTo($paneVideo);
        }
    };

    return DetailView;
})();
