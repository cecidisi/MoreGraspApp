(function(){

    'use strict';

    var numberPanels = $('.input-panel').length;

    var $btnStart = $('#btn-start'),
        $btnPrevious =  $('#btn-previous'),
        $btnContinue = $('#btn-continue'),
        $btnSubmit = $('#btn-submit'),
        $progress = $('.progress'),
        $progressSteps = $('.progress-steps-container');

    var cbxValue = { yes: 'yes', no: 'no' };

    var curPanelKey = 'mgrp-current-panel',
        sessionKey = 'mgrp-session';
    
    var filesToUpload = {},
        videosToUpload = [];


    /************************************************
     * Handle session data
     ************************************************/

    var updateSession = function(currentPanel) {
        var panelId = '#panel-' + currentPanel,
            panelName = $(panelId).attr('name'),
            session = JSON.parse(sessionStorage[sessionKey]);
        
        session[panelName] = {};
        // text inputs
        $(panelId + ' .form-control').each(function(i, input){
            var field = $(input).attr('name'),
                value = $(input).val() ||'';
            // Save field values in session object
            session[panelName][field] =  value; 
            // Update fields in review panel
            $('.input-panel[name="review"] p[field="' + field + '"]').html(value);
        });
        // checkboxes
        $(panelId + ' .cbx-toggle.main').each(function(i, toggle){
            var field = $(toggle).attr('name'),
                boolVal = $(toggle).prop('checked'),
                //value = boolVal ? cbxValue.yes : cbxValue.no,
                toggleClass = boolVal ? 'toggle-on' : 'toggle-off',
                value = $('.cbx-toggle[name="' + field + '"]').parent().find('.'+toggleClass).text();
            
            // Save field values in session object
            session[panelName][field] =  boolVal;
            // Update fields in review panel
            $('.input-panel[name="review"] p[field="' + field + '"]').html(value);
        });
        // radio buttons
//        for(var p=1; p<=3; ++p) {
//            var $(panelId + ' rd-priority label.active input[value="'+p+'"]')
//        }


        
        // Injury
        if(panelName == 'injury_details') {
            // Set injury date
            var dateParts = session.injury_details.date_injury.split('/');  // set along with all inputs
            session.injury_details.date_injury = new Date(parseInt(dateParts[1]), parseInt(dateParts[0]) - 1);
        }

        // Video/s
        if(panelName === 'video') {
            // Set video paths
            session.video.files = [];
            // Store filestoUpload in array specifying new filename
            // used on submit to iterate and send videos one by one
            videosToUpload = [];
            // Clear file list in review panel
            $('.input-panel[name="review"] #video-paths').empty();
            Object.keys(filesToUpload).forEach(function(originalFileName, i){
                var newFileName = session.personal_data.last_name.toLowerCase().replace(' ', '_') + '-video-' + i + '_' + (new Date()).getTimestamp() +         filesToUpload[originalFileName].type.replace('video/', '.');
                videosToUpload.push({ filename: newFileName, file: filesToUpload[originalFileName], originalname: originalFileName });
                // session keeps new filenames
                session.video.files.push(newFileName);
                $('.input-panel[name="review"] #video-paths').append('<li>'+originalFileName+'</li>');
            });
        }

        // Misc
        if(panelName == 'misc') {
            session.misc = [];

            var questions = {
                q1: { question: 'How s/he found MoreGrasp', answer: '' },
                q2: { question: 'Who filled the form', answer: '' }
            };
            Object.keys(questions).forEach(function(q){
                var ansOnReview = '';
                $(panelId + ' input.cbx-toggle.misc[question="'+q+'"]').each(function(i, toggle){
                    var $toggle = $(toggle);
                    if($toggle.prop('checked')) {
                        var opt = $toggle.attr('option'), optShow = $toggle.attr('option-show');
                        // to be saved in session
                        questions[q].answer = questions[q].answer === '' ? opt : questions[q].answer+', '+opt;
                        // to appear on Review
                        ansOnReview = ansOnReview === '' ? optShow : ansOnReview+', '+optShow;
                    }
                })
                session.misc.push(questions[q])
                $('.input-panel[name="review"] p[field="' + q + '"]').html(ansOnReview);
            });

//
//            $(panelId + ' .cbx-toggle.misc').each(function(i, toggle){
//                var $toggle = $(toggle),
//                    field = $toggle.attr('name'),
//                    boolVal = $toggle.prop('checked');
//
//                if(boolVal) {
//                    var q = $toggle.attr('question'), option = $toggle.attr('option');
//                    questions[q].answer = questions[q].answer === '' ? option : questions[q].answer + ', ' + option;
//                }
//            });
//            // Save question answers in session object and update fields in review panel
//            session.misc = [];
//            Object.keys(questions).forEach(function(q){
//                session.misc.push(questions[q]);
//                $('.input-panel[name="review"] p[field="' + q + '"]').html(questions[q].answer);
//            });
        }
        //console.log('session updated');
        //console.log(session);
        // Save session in storage
        sessionStorage[sessionKey] = JSON.stringify(session);
    }
    
    
    // on document ready
    var loadSession = function(session){
        //console.log('load session');
        //console.log(session);
        
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
     * Field validation -> mandatory and format
     ************************************************/

    var clearErrorMsg = function(){
        $('input').parent().removeClass('has-error');
        $('p.error').hide();
    };

    var showError = function(fields, errorToShow){
        clearErrorMsg();
        fields = Array.isArray(fields) ? fields : [fields];
        fields.forEach(function(field){
            $('input[name="' + field + '"]').parent().addClass('has-error');
        });
        $('p#error-'+errorToShow).fadeIn();
        return false;
    };

    var validateFields = function(panel){
        var $panel = $(panel);

        // UNCOMMENT FOR EASY FLOW
        return true;

        // Validate mandatory fields
        var emptyFields = [];
        $('#panel-'+panel + ' input.mandatory').each(function(i, input){
            if($(input).val() === '')
                emptyFields.push($(input).attr('name'))
        });
        if(emptyFields.length)
            return showError(emptyFields, 'mandatory-fields');

        // Validate text fields
        var textfields = [ 'first_name', 'last_name', 'city', 'street' ];
        for(var i=0; i<textfields.length; ++i) {
            var field = textfields[i],
                name = $('input[name="' + field + '"]').siblings().text();

            if(!window.validateText(field, name, showError))
                return false;
        }

        // Validate email
        var email = $('input[name="email"]').val();
        if(!window.validateEmail('email', showError))
            return false;

        // Validate phone
        var phone = $('input[name="phone"]').val();
        if(!window.validatePhone('phone', showError))
            return false;

        return true;
    };

    // Clear error message on input keyup
    $('input').keyup(clearErrorMsg);

    

    /************************************************
     * Panel / Progress Setup
     ************************************************/
    var moveToFormPanel = function(currentPanel){
        clearErrorMsg();
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
        if(!isNaN(currentPanel)) {
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
        }
        else {
            // #panel-submitted
            $('.input-panel').hide();
            $('.controls-section').hide();
            $('#panel-submitted').show();
            sessionStorage.removeItem(sessionKey);
            sessionStorage.removeItem(curPanelKey);
        }

    };


    /************************************************
     * Hash Navigation
     ************************************************/
    window.onhashchange = function(){
        var hash = window.location.hash,
            hashPattern = /(#panel-)\d/
        if(hashPattern.test(hash)){
            // current panel is the previous state before pressing previous/continue
            var currentPanel = parseInt(sessionStorage[curPanelKey]);
            currentPanel = isNaN(currentPanel) ? currentPanel : parseInt(currentPanel);

            if(currentPanel > 0 && currentPanel < numberPanels) {
                updateSession(currentPanel);
            }

            if(currentPanel !== 1 || validateFields(currentPanel)) {
                // Update currentPanel to match number in hash
                currentPanel = parseInt(hash.replace('#panel-', ''));
                // Show panel indicated in hash
                moveToFormPanel(currentPanel);
                // update panel number in session storage
                sessionStorage[curPanelKey] = currentPanel;
            }
            else {
                // stay in current panel
                window.location.hash = '#panel-1';
            }
        } 
    }
    
    /************************************************
     * Check Terms & conditions accepted
     ************************************************/
    // Uncomment for normal workflow
    $('#toggle-terms-and-conditions').change(function() {
        if($(this).prop('checked'))
            $('#btn-start').removeClass('disabled');
        else
            $('#btn-start').addClass('disabled');
    }).change();

    $('#lblTermsAccepted').click(function(){
        $('#toggle-terms-and-conditions').prop('checked', !$('#toggle-terms-and-conditions').prop('checked'));
    });

    
    /************************************************
     * HTML5 File uploader
     ************************************************/
    var $fileList = $('#file-list').find('ul');
    var addSelectedFiles = function(files){
        
        for(var i=0; i<files.length; ++i) {
            var file = files[i];
            if(!filesToUpload[file.name] && /^video\/\w+/.test(file.type)) {
                filesToUpload[file.name] = file;
                var $li = $('<li/>', { class: 'video-item', name: file.name, html: '<strong>'+escape(file.name)+'</strong> ('+(file.type || 'n/a')+') - '+bytesToSize(file.size) })                 .appendTo($fileList);
                
                $('<button/>', { class: 'btn-file-output red', html: 'X' })
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
     * Datetime picker
     ************************************************/
    $('#dtpDateInjury').datetimepicker({
        widgetPositioning: { vertical: 'bottom', horizontal: 'right' },
        viewMode: 'years',
        format: 'MM/YYYY',
        maxDate: (new Date()).toDDMMYYYY(),
        keepOpen: true
    }).on('dp.change', function(e){
        var field = $(this).attr('id'),
            value = e.date.format('MM/YYYY');
        $('p[field="' + field + '"]').text(value);
    });


    /************************************************
     * Priority/needs radio buttons
     ************************************************/
    $('.rd-priority input[type="radio"]').change(function(evt){
        evt.stopPropagation();
        var $elem = $(this),
            val = $elem.val(),
            $row = $elem.parent().parent().parent();

        $row.siblings().each(function(i, siblingRow){
            var $sibling = $(siblingRow),
                $rdInput = $sibling.find('input[value="'+val+'"]'),
                $parent = $rdInput.parent();
            $rdInput.prop('checked', false);
            $parent.removeClass('active');
        });
    });


    /************************************************
     * Data submission
     ************************************************/

    var submitData = function(){

        // Prepare user data
        var session = JSON.parse(sessionStorage[sessionKey]);
        var data = $.extend(true, {}, session);
        
        // TODO submit data to server
        var $bgProcessing = $('<div/>', { class: 'bg-processing' }).appendTo($('body'));
        $('<div/>', { class: 'loading' }).appendTo($bgProcessing);

        var totalUploads= 0;
        var onAllUploaded = function(){
            $bgProcessing.remove();
            sessionStorage[curPanelKey] = 'submitted';
            moveToFormPanel('submitted');
        };

        // Video upload functions
        var uploadVideoFile = function(video){

            var formData = new FormData();
            formData.append('filename', video.filename);
            formData.append('video', video.file, video.key);

            var path = "/mg-rest-api/upload-video";
            var xhr = new XMLHttpRequest();

            xhr.onerror = function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('error uploading video');
                console.log(XMLHttpRequest);
                $bgProcessing.remove();
            };
            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        totalUploads++;
                        if(totalUploads === Object.keys(filesToUpload).length)
                            onAllUploaded.call(this);
                    } else {
                        console.error(xhr.statusText);
                        console.error(xhr);
                    }
                }
            };
            xhr.open("POST", path, true);
            xhr.send(formData);
        };

        // POST user data. On success upload video/s
        $.ajax({
            "async": true,
            "url": "/mg-rest-api/save-candidate",
            "method": "POST",
            "headers": { "content-type": "application/x-www-form-urlencoded" },
            "data": data
        }).success(function(data, textStatus, jqXHR){
            //console.log(textStatus);
            if(videosToUpload.length > 0)
                videosToUpload.forEach(function(video){ uploadVideoFile(video) });
            else
                onAllUploaded.call(this);
        }).error(function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
            console.log(jqXHR);
            $bgProcessing.remove();
            alert(textStatus);
        });

    };
    
    $('a#btn-submit').click(function(evt){
        evt.stopPropagation();
        submitData();
    });
    

    /************************************************
     * Entry Point
     ************************************************/
    $(document).ready(function(){
        // Retrieve session or init
//        var session = sessionStorage[sessionKey] ? JSON.parse(sessionStorage[sessionKey]) : {};
//        sessionStorage[sessionKey] = JSON.stringify(session);
        // fill session data
//        setTimeout(function(){ loadSession(session); }, 1);

        // Redirect to corresponding panel
//        var currentPanel = parseInt(sessionStorage[curPanelKey]) || 0;
//        currentPanel = isNaN(currentPanel) ? currentPanel : parseInt(currentPanel);
//        if(currentPanel)
//            moveToFormPanel(currentPanel);
//        window.location.hash = '#panel-'+currentPanel;

        // Init session
        sessionStorage[sessionKey] = JSON.stringify({});
        sessionStorage[curPanelKey] = 0;
        moveToFormPanel(0);
        window.location.hash = '#panel-0';
    });

})();

