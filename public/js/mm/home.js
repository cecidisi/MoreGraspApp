(function($){

    //  IDS
    var tblRegistredId = '#table-registered',
        tblAcceptedId = '#table-accepted';


    var getDDMMYYY = function(date){
        date = new Date(date);
        var day = date.getDay().toString().length === 1 ? '0'+date.getDay() : date.getDay(),
            month = (date.getMonth() + 1).toString().length === 1 ? '0'+(date.getMonth()+1) : date.getMonth()+1,
            year = date.getFullYear();
        return day + '/' + month + '/' + year;
    };


    var populateTable = function(tableId, data){

        var $table = $(tableId + ' tbody');
        data.forEach(function(d, i){
            var $row = $('<tr/>').appendTo($table);
            $('<th scope="row">'+(i+1)+'</th>').appendTo($row);
            $('<td/>', { html: d.personal_data.first_name + ' ' + d.personal_data.last_name }).appendTo($row);
            $('<td/>', { html: d.personal_data.email }).appendTo($row);
            $('<td/>', { html: d.personal_data.phone }).appendTo($row);
            $('<td/>', { html: getDDMMYYY(d.meta.date_registered) }).appendTo($row);
            $('<td/>', { html: d.meta.status }).appendTo($row);
        });
    };



    $(document).ready(function(){

        // Retrieve stored candidates
        $.get({ //"async": true,
            "url": "/mg-rest-api/get-registered-candidates",
        }).success(function(data, textStatus, jqXHR){
            populateTable(tblRegistredId, JSON.parse(data));
        }).error(function(jqXHR){
            console.log('Error retrieving candidates');
            console.log(jqXHR);
        });

        $.get({ //"async": true,
            "url": "/mg-rest-api/get-accepted-candidates",
        }).success(function(data, textStatus, jqXHR){
            populateTable(tblAcceptedId, JSON.parse(data));
        }).error(function(jqXHR){
            console.log('Error retrieving candidates');
            console.log(jqXHR);
        });

    });

})(jQuery)
