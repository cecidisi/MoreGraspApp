var express = require('express'),
    router = express.Router();

var countries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'The Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',        'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];


module.exports = function (app) {
    app.use('/registration-platform', router);
};


router.get('/', function(req, res, next){
    res.redirect('/registration-platform/home');
});

router.get('/home', function(req, res, next){
    res.render('rp/index', {
        title: 'Registration Platform'
    });
});

router.get('/register', function(req, res, next){
    res.render('rp/register',  { title: 'Registration Platform', countries: countries });
});

router.get('/faq', function(req, res, next){
    res.render('rp/faq', {
        title: 'Registration Platform'
    });
});

