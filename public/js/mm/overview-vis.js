var OverviewVis = (function(){

    var root, callbacks,
        svg, width, height, margin, x, y, xAxis, yAxis;

    var  pieOptions = {
        size: { pieOuterRadius: '100%', canvasHeight: '60', canvasWidth: '60' },
        effects: {
            load: { /*effect: "none"*/ },
            pullOutSegmentOnClick: { /*effect: 'none', speed: 0,*/ size: 5 },
            highlightSegmentOnMouseover: true//false
        },
        labels: {
            inner: { format: '' },
            lines: { enabled: false}
        },
        data: {
            content: [
                { label: 'injury', value: 25, color: '#000' },
                { label: 'movements', value: 25, color: '#000' },
                { label: 'pre-injury', value: 25, color: '#000' },
                { label: 'personal', value: 25, color: '#000' }
            ]
        },
        misc: {
            colors: { segmentStroke: '#ddd' },
//            canvasPadding: { top: 0, right: 0, bottom: 0, left: 0 },
            gradient: { enabled: true, percentage: 100, color: "#888" },
        }
    };

    /*******************************************************************************************/
    function OverviewVis(arguments){
        var args = $.extend(true, {
            root: '',
            callbacks: {
                onUserGlyphClick: function(user, index){}
            }
        }, arguments);

        root = args.root;
        callbacks = args.callbacks;
        this.data = [];
        init();
    }


    function init() {
        margin = { top: 5, botton: 5, left: 5, right: 5 };
        width = $(root).width() - margin.left - margin.right;
        height = $(root).height() - margin.top - margin.botton;

        svg = d3.select(root).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.right)
            .append('g')
                .attr('width', width)
                .attr('height', height)
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    }




    var _load = function(data){
        this.data = data;

        // Define scales
        x = d3.scale.ordinal()
            .domain(this.data.map(function(d){ return d.id; }))
            .rangePoints([0, width], 1.0);

        y = d3.scale.ordinal()
//            .domain(this.data.map(function(d){ return d.ellegible }))
            .domain([true, false])
            .rangePoints([0, height], 1.0);

        // Define axis' function
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickValues('');
        yAxis = d3.svg.axis().scale(y).orient("left").tickValues("");

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis).selectAll('text');

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis).selectAll('text');

//        svg.selectAll('.user-glyph').data(this.data).enter().exit();
//        svg.selectAll('.user-glyph').remove();

        var userGlyphs = svg.selectAll('.user-glyph').data(this.data).enter()
            .append('g')
            .attr('class', 'user-glyph')
            .attr('id', function(d){ return 'user-glyph-' + d.id })
            .attr('transform', function(d){ return 'translate(' + x(d.id) + ',' + (y(d.ellegible)-10) + ')' })
            .attr('width', 50)
            .attr('height', 50)
            .on('click', callbacks.onUserGlyphClick);


        this.data.forEach(function(d){
            pieOptions.data.content[0].color = d.colors.injury;
            pieOptions.data.content[1].color = d.colors.movements;
            pieOptions.data.content[2].color = d.colors.preInjury;
            pieOptions.data.content[3].color = d.colors.personal;
            var pie = new d3pie('#user-glyph-' + d.id, pieOptions);
        });

        userGlyphs.append('svg:image')
            .attr('width', 24)
            .attr('x', 18)
            .attr('height', 24)
            .attr('y', 18)
            .attr("xlink:href", function(d){ return 'media/user_' + d.personal.gender + '.png' });

    };


    OverviewVis.prototype = {
        load: _load
    };

    return OverviewVis;
})();
