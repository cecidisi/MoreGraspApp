(function(){

    'use strict';

    var numberPanels = $('.input-panel').length;
//        currentPanel = 0;

    var $btnStart = $('#btn-start'),
        $btnPrevious =  $('#btn-previous'),
        $btnContinue = $('#btn-continue'),
        $btnSubmit = $('#btn-submit'),
        $progress = $('.progress'),
        $progressSteps = $('.progress-steps-container');

    var cbxValue = { yes: 'yes', no: 'no' };

    var curPanelKey = 'mgrp-current-panel',
        sessionKey = 'mgrp-session';
    

    /************************************************
     * Handle session data
     ************************************************/

    var updateSession = function(currentPanel) {
        var panelId = '#panel-' + currentPanel,
            panelName = $(panelId).attr('name'),
            session = JSON.parse(sessionStorage[sessionKey]);
        
        session[panelName] = {};
        $(panelId + ' .form-control').each(function(i, input){
            var field = $(input).attr('name'),
                value = $(input).val() ||'';
            // Save field values in session object
            session[panelName][field] =  value; 
            // Update fields in review panel
            $('.input-panel[name="review"] p[field="' + field + '"]').html(value);
        });
        
        $(panelId + ' .cbx-toggle').each(function(i, toggle){
            var field = $(toggle).attr('name'),
                value = $(toggle).prop('checked'),
                boolVal = value ? cbxValue.yes : cbxValue.no;
            
            // Save field values in session object
            session[panelName][field] =  boolVal; 
            // Update fields in review panel
            $('.input-panel[name="review"] p[field="' + field + '"]').html(value);
        });
        
        console.log('session updated');
        console.log(session);
        // Save session in storage
        sessionStorage[sessionKey] = JSON.stringify(session);
    }
    
    
    // on document ready
    var loadSession = function(session){
        console.log('load session');
        console.log(session);
        
        Object.keys(session).forEach(function(panelName) {
            var panelId = '#'+ $('.input-panel[name="' + panelName + '"]').attr('id');
            
            Object.keys(session[panelName]).forEach(function(fieldName){
                var value = session[panelName][fieldName];
                if(typeof value == String) {
                    // Update input and select by name in corresponding panel
                    $(panelId + ' [name="' + fieldName +'"]').val(value);                    
                    // Update field in review panel
                    $('input-panel[name="review"] p[field="' + fieldName + '"]').html(value);                    
                }
                else {
                    // BUG --> toggles not updating values
                    // Update toggles
                    $(panelId + ' .cbx-toggle[name="' + fieldName + '"]').prop('checked', value);
                    // Update field in review panel
                    value = value ? cbxValue.yes : cbxValue.no; 
                    $('input-panel[name="review"] p[field="' + fieldName + '"]').html(value);                    
                }
                //console.log(panelId + ': ' + panelName + ' --> ' + fieldName + ' = ' + value);
            });             

        });
                
//        var panelId = '#panel-'+currentPanel,
//            panelName = $(panelId).attr['name'];
//        if(session[panelName]) {
//            Object.keys(session[panelName]).forEach(function(fieldName){
//                $(panelId + ' [name="' + fieldName +'"]').val(session[panelId][fieldName]);
//            });
//        }
    };
    

    /************************************************
     * Navigation (#)
     ************************************************/
    
    var moveToFormPanel = function(currentPanel){
        
        //console.log('move to --> ' + hash);
        var panelId = '#panel-'+currentPanel;
        // show current panel and hide others
        $('.input-panel:not(' + panelId+ ')').hide();
        $(panelId).slideDown('slow');
        // update progress bar
        var progressValue = ((currentPanel) * 100/(numberPanels-1));
        $('#form-progress-bar').attr('aria-valuenow', progressValue).css('width', progressValue + '%');
        // Update steps' style
        //console.log('current panel = ' + currentPanel + '; num panel = ' + numberPanels);
        for(var i=1; i<=numberPanels; ++i) {
            if(i <= currentPanel)
                $('#progress-step-'+i).addClass('complete');
            else
                $('#progress-step-'+i).removeClass('complete');
        }
        // enable/disable buttons
        if(currentPanel > 0 && currentPanel < numberPanels-1) {
            $btnStart.hide();
            $btnPrevious.attr('href', '#panel-' + (currentPanel-1)).show();
            $btnContinue.attr('href', '#panel-' + (currentPanel+1)).show();
            $btnSubmit.hide();
            $progress.css('visibility', 'visible');
            $progressSteps.css('visibility', 'visible');
        }
        else if(currentPanel == 0) {
            $btnStart.show();
            $btnPrevious.hide();
            $btnContinue.hide();
            $btnSubmit.hide();
            $progress.css('visibility', 'hidden');
            $progressSteps.css('visibility', 'hidden');
        }
        else {
            $btnStart.hide();
            $btnPrevious.hide();
            $btnContinue.hide();
            $btnSubmit.show();
            $progress.css('visibility', 'visible');
            $progressSteps.css('visibility', 'visible');
        }
        
        // fill session data
        //loadSession();
    };
    
    
    window.onhashchange = function(){
        var hash = window.location.hash,
            hashPattern = /(#panel-)\d/
        if(hashPattern.test(hash)){
            var currentPanel = sessionStorage[curPanelKey];
            if(currentPanel > 0) updateSession(currentPanel);
            // Update currentPanel to match number in hash
            currentPanel = parseInt(hash.replace('#panel-', ''));
            // Show panel indicated in hash
            moveToFormPanel(currentPanel);
            // update panel number in session storage
            sessionStorage[curPanelKey] = currentPanel;
        } 
    }
    
    
    /************************************************
     * HTML5 File uploader
     ************************************************/

    var filesToUpload = {};
    var $fileList = $('#file-list').find('ul');
    var addSelectedFiles = function(files){
        
        for(var i=0; i<files.length; ++i) {
            var file = files[i];
            if(!filesToUpload[file.name] && /^video\/\w+/.test(file.type)) {
                filesToUpload[file.name] = file;
                var $li = $('<li/>', { class: 'video-item', name: file.name, html: '<strong>'+escape(file.name)+'</strong> ('+(file.type || 'n/a')+') - '+bytesToSize(file.size) })                 .appendTo($fileList);
                
                $('<button/>', { class: 'btn-file-output red', 'data-i18n': 'mgrp-video-upload-btn-delete', html: $.i18nCustom.val('mgrp-video-upload-btn-delete') })
                    .appendTo($li).click(function(evt){
                        evt.stopPropagation();
                        var fileName = $(this).parent().attr('name');
                        delete filesToUpload[fileName];
                        $(this).parent().remove();
                    });
            }
        }
        $('#file-input').val('');
    };

    // input file -> Select button
    $('#file-input').change(function(evt) {
        var files = evt.target.files; // FileList object
        addSelectedFiles(files);
    });

    // File Drop Area
    $('#file-drop-zone').on({
        'dragover': function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            evt.originalEvent.dataTransfer.dropEffect = 'copy';
        },
        'drop': function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.originalEvent.dataTransfer.files;
            addSelectedFiles(files);
        }});


    
    /************************************************
     * i18n init function and handler
     ************************************************/
    
    /***  Create dynamic elements after i18n locales are loaded  ***/
    var buildDynamicDOM = function(){
        /* checkboxes */
        cbxValue = { yes: $.i18nCustom.val("mgrp-toggle-on") || cbxValue.yes, no: $.i18nCustom.val("mgrp-toggle-off") || cbxValue.no };
        $('.cbx-toggle').each(function(i, cbx){
            $(cbx).attr('data-on', cbxValue.yes).attr('data-off', cbxValue.no);
        });
        $('label.toggle-on').each(function(i, lblYes){
            $(lblYes).html(cbxValue.yes);
        });
        $('label.toggle-off').each(function(i, lblNo){
            $(lblNo).html(cbxValue.no);
        });

        /* progress step labels */
        var stepWidth = parseFloat(100 / (numberPanels-1));
        for(var i=1; i<=numberPanels-1; ++i) {
            var key = $('#panel-' + i).find('h4').attr('data-i18n');
            var stepName = $.i18nCustom.val(key+'-short');
            var $step = $('<div/>', { class: 'progress-step', id: 'progress-step-'+i, style: 'width:'+stepWidth+'%;'}).appendTo($('.progress-steps-container'));
            $('<a/>', { href: '#panel-'+i, class: 'step-label', html: stepName }).appendTo($step);
        }

    };

    $.i18nCustom({
        path: '/i18n/',
        languages: ['en', 'de'],
//        locale: 'de',
        callback: buildDynamicDOM
    });


    /************************************************
     * Datetime picker
     ************************************************/
    
    $('#dtpDateInjury').datetimepicker({
        widgetPositioning: { vertical: 'bottom', horizontal: 'right' },
        viewMode: 'years',
        format: 'MM/YYYY',
        maxDate: '11/01/2015',
        keepOpen: true
    }).on('dp.change', function(e){
        var field = $(this).attr('id'),
            value = e.date.format('MM/YYYY');
        $('p[field="' + field + '"]').text(value);
    });

    /************************************************
     * Event handlers
     ************************************************/
    
    $('#cbxTermsAccepted').change(function(){
        $('#btn-start').prop('disabled', !$(this).prop('checked'));
    }).change();

    $('#lblTermsAccepted').click(function(){
        $('#cbxTermsAccepted').prop('checked', !$('#cbxTermsAccepted').prop('checked')).change();
    });
    
    
    
    
    /************************************************
     *  Update Review Panel
     ************************************************/    
    
//    //  input fields and select
//    $('input.form-control, select.form-control').change(function(){
//        var field = $(this).attr('name'),
//            value = $(this).val();
//        $('p[field="' + field + '"]').text(value);
//    }).change();
//    
//    // Toggle buttons
//    $('.cbx-toggle').bootstrapToggle().change(function(){
//        var field = $(this).attr('id'),
//            value = $(this).prop('checked') ? cbxValue.yes : cbxValue.no,
//            i18nKey = $(this).prop('checked') ? 'mgrp-toggle-on' : 'mgrp-toggle-off';
//
//        $('p[field="' + field + '"]').attr('data-i18n', i18nKey).text(value);
//    }).change();

    
    /************************************************
     * Data submit
     ************************************************/

    var submitData = function(){
        
        // TODO submit data to server
        var $bgProcessing = $('<div/>', { class: 'bg-processing' }).appendTo($('body'));
        $('<div/>', { class: 'loading' }).appendTo($bgProcessing);

        var formData = new FormData();
        var totalUploads= 0;

        var uploadFile = function(data, route){
            var path = "http://localhost:3000/upload-video";
            var xhr = new XMLHttpRequest();
            xhr.onload = function (e) {
                // file upload is complete
                //console.log(xhr.responseText);
            };
            xhr.onerror = function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('error uploading video');
                console.log(XMLHttpRequest);
                $bgProcessing.remove();
            };
            xhr.open("POST", path, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        totalUploads++;
                        if(totalUploads === Object.keys(filesToUpload).length) {
                            $bgProcessing.remove();
                            $('.input-panel').hide();
                            $('.controls-section').hide();
                            $('.input-panel-submitted').show();
                        }
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.send(data);
        };

        // Prepare user data
        var datum = { "name": "John Doe", "age": "99" };

        // POST user data. On success upload video/s
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:3000/upload",
            "method": "POST",
            "headers": { "content-type": "application/x-www-form-urlencoded" },
            "data": datum
        }).success(function(){


            Object.keys(filesToUpload).forEach(function(key){
                var formData = new FormData();
                formData.append('video', filesToUpload[key], key);
                uploadFile(formData);
            });

        }).error(function(jqXHR){
            console.log('Error');
            console.log(jqXHR);
            console.log(datum);
        });

    };
    
    
    /************************************************
     * Entry Point
     ************************************************/

    $(document).ready(function(){
        // Retrieve session or init
        var session = sessionStorage[sessionKey] ? JSON.parse(sessionStorage[sessionKey]) : {};
        sessionStorage[sessionKey] = JSON.stringify(session);
        // fill session data
        loadSession(session);

        // Redirect to corresponding panel
        var currentPanel = sessionStorage[curPanelKey] || 0;
        if(currentPanel)
            moveToFormPanel(currentPanel);
        window.location.hash = '#panel-'+currentPanel;            

        
        // Redirect to corresponding panel
//        var hash = sessionStorage[curPanelKey];
//        if(! hash || hash === '')
//            hash = window.location.hash || '#panel-0';
//        
//        window.location.hash = hash;
//        $(window).trigger('hashchange');
    });


})();

