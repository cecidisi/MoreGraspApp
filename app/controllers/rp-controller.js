var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Person = mongoose.model('Person');

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

router.get('/faq', function(req, res, next){
    res.render('rp/faq', {
        title: 'Registration Platform'
    });
});


router.get('/register', function(req, res, next){
    res.render('rp/register',  { title: 'Registration Platform' });
});
