var express = require('express'),
    router = express.Router(),
    request = require('request'),
    url = require('url'),
    mongoose = require('mongoose'),
    Person = mongoose.model('Person');

module.exports = function (app) {
    app.use('/matchmaking1', router);
};


router.get('/', function(req, res, next){
    res.redirect('/matchmaking1/home');
});

router.get('/home', function(req, res, next){

//    console.log(url.parse('/mg-rest-api/get-registered-candidates'));
//    request.get('http://localhost:3000/mg-rest-api/get-registered-candidates', function(error, response, body){
//        if(error) throw error;
//        var persons = JSON.parse(body);
//        res.render('mm/index', {
//            title: 'Matchmaking Platform',
//            persons: persons
//        });
//    })


    res.render('mm/index', {
        title: 'Matchmaking Platform'
    });
});

router.get('/new-registrations', function(req, res, next){
    res.render('mm/new-registrations', {
        title: 'Registration Platform'
    });
});
