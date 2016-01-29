(function($) {
    'use strict';

    var i18nHanlder, _this;

    i18nHanlder = function(options){
        this.settings = $.extend({
            path: './',
            languages: [],
            defaultLang: 'en',
            locale: navigator.language || navigator.userLanguage,
            attr: 'data-i18n',
            callback: function(){}
        }, options);



        this.locales = {};
        _this = this;
    }

    i18nHanlder.prototype = {

        init: function() {
            var loadedFiles = 0;

            $.when(
                _this.settings.languages.forEach(function(lang, i, arrLang){
                    $.getJSON(_this.settings.path +''+ lang+'.json', function(data){
                        _this.locales[lang] = data;
                        loadedFiles++;
                        if(loadedFiles === arrLang.length) {
                            // change locale string in dom
                            _this.updateDOM();
                            _this.settings.callback.call(this);
                        }
                    }).fail(function(){
                        console.log('Failed reading file --> ', lang+'.json');
                    });
                })
            )
            return _this;
        },

        updateDOM: function(){
            $('['+_this.settings.attr+']').each(function(i, elem){
                var $elem = $(elem),
                    key = $elem.attr(_this.settings.attr),
                    val = _this.getValue(key);
                if(val) {
                    // console.log(key+' --> '+val);
                    if(typeof $elem.attr(_this.settings.attr+'-noreplace') === undefined || $elem.attr(_this.settings.attr+'-noreplace') === undefined) {
                        $elem.html(val);
                    }
                    else {
                        var $children = $elem.children().clone(true).detach();
                        $elem.html(val).append($children);
                    }
                }
            });
            return this;
        },

        load: function(opt){
            opt = $.extend({ locale: '', data: '' }, opt);
            _this.locales[opt.locale] = opt.data;
            return _this;
        },

        setLocale: function(locale){
            _this.settings.locale = locale;
            return _this;
        },

        getValue: function(key){
            var locale = _this.settings.locale;
            var test = function(){ return (_this.locales[locale] && _this.locales[locale][key]) ? true : false; }

            if(test()) return _this.locales[locale][key];

            if(locale.length > 2) {
                locale.substr(0, 2);
                if(test()) return _this.locales[locale][key];
            }
            locale = _this.settings.defaultLang;
            if(test()) return _this.locales[locale][key];

            return false;
        }

    };




    $.i18nCustom = function(options){

        var i18n = new i18nHanlder(options);
        i18n.init();

        $.i18nCustom.load = function(opt){
            return i18n.load(opt);
        }

        $.i18nCustom.update = function(){
            return i18n.updateDOM();
        }

        $.i18nCustom.val = function(key){
            return i18n.getValue(key)
        }

        $.i18nCustom.locale = function(locale){
            i18n.setLocale(locale);
        }

        $.i18nCustom.constructor = i18nHanlder;

    };


}(jQuery));
