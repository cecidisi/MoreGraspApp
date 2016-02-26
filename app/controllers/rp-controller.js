var express = require('express'),
    router = express.Router(),
    i18n = require('i18n-2');

var countries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'The Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];


module.exports = function (app) {
    app.use('/registration-platform', router);
};

var changeLangCookie = function(req, res, next){
    console.log(req.cookies.lang);
    req.i18n.setLocale(req.params.lang);
    res.cookie('lang', req.params.lang);
};


router.get('/', function(req, res, next){
    res.redirect('/registration-platform/home');
});

router.get('/home', function(req, res, next){
    var locale = req.cookies.lang || 'en';
    res.render('rp/index', { title: 'Registration Platform', locale: locale });
});



router.get('/register', function(req, res, next){
    var locale = req.cookies.lang || 'en';
    res.render('rp/register',  { title: 'Registration Platform', countries: countries, locale: locale });
});



router.get('/faq', function(req, res, next){
    var locale = req.cookies.lang || 'en';
    console.log('locale in faq = ' + locale);
    res.render('rp/faq', { title: 'Registration Platform', locale: locale });
});

