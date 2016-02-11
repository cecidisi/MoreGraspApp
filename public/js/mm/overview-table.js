var OverviewTable = (function($){
    var _this, $root, $table;

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


    function OverviewTable(opt){
        _this = this;
        this.data = [];
        this.root = opt.root;
        this.callbacks = opt.callbacks;
        $root = $(this.root);
        $root.mCustomScrollbar(customScrollOptions);
        $table = $(_this.root + ' table tbody');
    }

    OverviewTable.prototype = {

        load: function(_data){
            this.data = _data;
            _this.data.forEach(function(d, i){
                var $row = $('<tr index="' + i + '" class="' + d.meta.status + '"></tr>').appendTo($table);
                $('<th scope="row">'+(i+1)+'</th>').appendTo($row);
                $('<td/>', { col: 'name', html: d.personal_data.first_name + ' ' + d.personal_data.last_name }).appendTo($row);
                $('<td/>', { col: 'email', html: d.personal_data.email }).appendTo($row);
                $('<td/>', { col: 'phone', html: d.personal_data.phone }).appendTo($row);
                $('<td/>', { col: 'date_registered', html: getDDMMYYYY(d.meta.date_registered) }).appendTo($row);
                $('<td/>', { col: 'status', html: d.meta.status }).appendTo($row);

                // row selection
                $row.off().on('click', function(evt){
                    evt.stopPropagation();
                    $('tr').removeClass('selected');
                    $(this).addClass('selected');
                    var user_id = _this.data[parseInt($(this).attr('index'))]._id;
                    _this.callbacks.onUserSelected(user_id);
                });
                if(!$row.hasClass('registered'))
                    $row.hide();
            });
        },

        clear: function(){
            $table.empty();
        },

        showAll: function(){
            $table.find('tr').slideDown();
        },

        showOnlyRegistered: function(){
            $table.find('tr.accepted').slideUp();
            $table.find('tr.rejected').slideUp();
        },

        highlightItems: function(indexArr){

            $table.find('tr').each(function(i, row){
                if(indexArr.indexOf(parseInt($(row).attr('index'))) > -1)
                    $(row).addClass('highlighted'); //$(row).addClass('success');
                else
                    $(row).removeClass('highlighted'); //$(row).removeClass('success');
            });
        },
        removeHighlight: function(){
            $table.find('tr').removeClass('success').removeClass('highlighted');
        },
        deselect: function(){
            $table.find('tr').removeClass('selected');
        },


    }

    return OverviewTable;

})(jQuery);
