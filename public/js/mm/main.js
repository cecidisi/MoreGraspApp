(function(){

    var _this = this;
    var overviewVis, overviewTable, filterView, detailView;
    var data = [], currentUserId;
    var serverPath = 'http://localhost:3000';


    /**********************************************************************************************/
    // METHODS

    var getGoodCandidates = function(filters){
        var arr = []
        var categories = Object.keys(filters);
        data.forEach(function(d, u){
            var i = 0, flagOK = true;
            while(i < categories.length && flagOK) {
                var fields = Object.keys(filters[categories[i]]), j= 0;
                while(j < fields.length && flagOK) {
                    var filterVal = filters[categories[i]][fields[j]].value,
                        filterType = filters[categories[i]][fields[j]].type;

                    if(filterType === 'bool' && filterVal !== 'both') {
                        if((filterVal && !d[categories[i]][fields[j]]) || (!filterVal && d[categories[i]][fields[j]]))
                            flagOK = false;
                    }
                    else if(filterType === 'date' && filterVal && filterVal.getTime() > (new Date(d[categories[i]][fields[j]])).getTime() ) {
                        flagOK = false;
                    }
                    j++;
                }
                i++;
            }
            if(flagOK)
                arr.push(u);
        });
        return arr;
    };

    var changeCandidateStatus = function(user_id, status, onSuccess){
        $.ajax({
            url: serverPath + '/mg-rest-api/update-candidate-status',
            method: 'PUT',
            data: { user_id: user_id, status: status },
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }).success(function(data, textStatus, jqXHR){
            //console.log(textStatus);
            onSuccess.call(this);
        }).error(function(jqXHR){
            console.log('Error');
            console.log(jqXHR);
        });
    };


    var mmEVT = {
        onFiltersUpdated: function(filters) {
            var filters = filterView.getFilters();
            var candidatesOK = getGoodCandidates(filters);
            overviewTable.highlightItems(candidatesOK);
        },
        onFiltersCleared: function(){
            filterView.clear();
            overviewTable.removeHighlight();
        },
        onUserSelected: function(user_id){
            currentUserId = user_id;
            detailView.showUser(_.find(data, ['_id', user_id]));
        },
        onShowAll: function(){
            overviewTable.showAll();
        },
        onShowOnlyRegistered: function(){
            overviewTable.showOnlyRegistered();
        },
        onUserDeselected: function(){
            overviewTable.deselect();
            detailView.clear();
        },
        onEffectsRemoved: function(){
            currentUserId = undefined;
            overviewTable.removeHighlight();
            detailView.clear();
        },
        onUserAccepted: function() {
            changeCandidateStatus(currentUserId, 'accepted', retrieveDataAndLoadViews);
            //retrieveDataAndLoadViews();
        },
        onUserRejected: function() {
            changeCandidateStatus(currentUserId, 'rejected', retrieveDataAndLoadViews);
        }

    };


    /**********************************************************************************************/

    //  Clickable Panel header for accordion effect
    $('.panel-heading span.clickable').on('click', function () {
        if ($(this).hasClass('panel-collapsed')) {
            // expand the panel
            $(this).parents('.panel').find('.panel-body').slideDown();
            $(this).removeClass('panel-collapsed');
            $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
        else {
            // collapse the panel
            $(this).parents('.panel').find('.panel-body').slideUp();
            $(this).addClass('panel-collapsed');
            $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        }
    });

    $('#btn-update').click(function(evt){ evt.stopPropagation(); mmEVT.onFiltersUpdated(); });
    $('#btn-clear-filters').click(function(evt){ evt.stopPropagation(); mmEVT.onFiltersCleared(); });
    $('#btn-reset').click(function(evt){ evt.stopPropagation(); mmEVT.onEffectsRemoved(); });
    $('#btn-clear-details').click(function(evt){ evt.stopPropagation(); mmEVT.onUserDeselected(); });
    $('#btn-accept-candidate').click(function(evt){ evt.stopPropagation(); mmEVT.onUserAccepted(); });
    $('#btn-reject-candidate').click(function(evt){ evt.stopPropagation(); mmEVT.onUserRejected(); });
    $('#toggle-show-all').change(function(evt){
        evt.stopPropagation();
        if($(this).prop('checked')) return mmEVT.onShowAll(); return mmEVT.onShowOnlyRegistered();
    });

    /**********************************************************************************************/

    var opt = {
        filters: {
            root: '#filters-container',
            callbacks: {}
        },
        overview_vis: {
            root: '#overview-vis',
            callbacks: {
                onUserSelected: mmEVT.onUserSelected
            }
        },
        overview_table: {
            root: '#overview-table',
            callbacks: {
                onUserSelected: mmEVT.onUserSelected
            }
        },
        details: {
            root: '#root-details',
            callbacks : {
                onUserAccepted: mmEVT.onUserAccepted,
                onUserRejected: mmEVT.onUserRejected
            }
        }
    };




    var retrieveDataAndLoadViews = function(){

        overviewTable.clear();
        detailView.clear();

        $.get({
            "url": "/mg-rest-api/get-all-candidates",
        }).success(function(_data, textStatus, jqXHR){
            data = JSON.parse(_data);
            //console.log(data.length  + ' candidates retrieved');
            // load views
            overviewTable.load(data);
            $('#toggle-show-all').trigger('change');

        }).error(function(jqXHR){
            console.log('Error retrieving candidates');
            console.log(jqXHR);
        });
    };


    // Entry Point
    $(document).ready(function(){
        overviewVis = new OverviewVis(opt.overview_vis);
        overviewTable = new OverviewTable(opt.overview_table);
        detailView = new DetailView(opt.details);
        filterView = new FilterView(opt.filters);

        retrieveDataAndLoadViews();
    });

})();
