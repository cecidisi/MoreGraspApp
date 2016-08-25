var express = require('express'),
    router = express.Router(),
    i18n = require('i18n-2');

var countries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'The Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];


module.exports = function (app) {
    app.use('/registration-platform', router);
};


router.get('/', function(req, res, next){
    res.redirect('/registration-platform/home');
});

router.param('lang', function(req, res, next, locale){
    console.log('lang query = '+ locale);
    req.i18n.setLocale(locale);
    res.cookie('LANG', locale);
    next();
});


router.get('/home', function(req, res, next){
    var locale = req.cookies.LANG || 'en';
    console.log('Home lang = '+locale);
    res.render('rp/index', { locale: locale, current_tab: 'home' });
});


router.get('/register', function(req, res, next){
    var locale = req.cookies.LANG || 'en';
    console.log('Register lang = '+locale);
    res.render('rp/register',  { locale: locale, current_tab: 'register', countries: countries });
});


router.get('/faq', function(req, res, next){
    var locale = req.cookies.LANG || 'en';
    console.log('FAQ lang = '+locale);
    res.render('rp/faq', { locale: locale, current_tab: 'faq' });
});
