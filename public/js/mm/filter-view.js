var FilterView = (function(){

    var _this,
        $root = $(''), $btnUpdate = $('#btn-update');

    var customScrollOptions = {
        axis: 'y',
        theme: 'light',
        scrollbarPosition: 'outside',
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

    function init() {
        $root.mCustomScrollbar(customScrollOptions);

        //  Datetime Pickers
        $('.datetimepicker').datetimepicker({
            widgetPositioning: { vertical: 'bottom', horizontal: 'right' },
            viewMode: 'years',
            format: 'MM/YYYY',
            maxDate: getMMDDYYYY(new Date()),
            keepOpen: true,
            useCurrent: false
        }).on('dp.change', function(e){
            //$('#datetimepickerFrom').data('DateTimePicker').maxDate(e.date);
        });

    }


    function FilterView(arguments){
        _this = this;
        var args = $.extend(true, {
            root: '',
            callbacks: {}
        }, arguments);
        this.root = args.root;
        this.callbacks = args.callbacks;
        $root = $(this.root);
        init();
    }


    FilterView.prototype = {

        getFilters: function(){

            var filters = {};
            $('.filter-item').each(function(i, filterItem){
                var $filter = $(filterItem),
                    field = $filter.attr('filter-name'),
                    category = $filter.attr('filter-category'),
                    type = $filter.attr('filter-type'),
                    value;

                if(type === 'bool') {
                    value = $filter.find('.btn.active input').attr('value');
                    if(value !== 'both')
                        value = value === 'true' ? true : false;
                }
                else if(type === 'date') {
                    value = $('.datetimepicker').find('input').val();
                    value = value !== '' ? value.MMYYYYtoDate() : undefined;
                 }

                if(!filters[category])
                    filters[category] = {};
                filters[category][field] = { value: value, type: type };
            });
            return filters;
        },

        clear: function(){

            // clear toggle buttons
            $(this.root + ' .btn').each(function(i, toggle){
                var $toggle = $(toggle);
                if($toggle.find('input').attr('value') === 'both')
                    $toggle.addClass('active');
                else
                    $toggle.removeClass('active');
            });

            // Clear datetimepicker
            $(this.root + ' .datetimepicker input').val('');
        }



    };

    return FilterView;

})();
