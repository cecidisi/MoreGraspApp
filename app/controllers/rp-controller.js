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
//    next();
});




router.post('/register', function (req, res, next) {
//    Article.find(function (err, articles) {
//        if (err) return next(err);
//        res.render('index', {
//            title: 'Generator-Express MVC',
//            articles: articles
//        });
//    });
    
    if(req.body) {
        console.log('Entra POST register');
        console.log(req.body);
        
        var person = Person(req.body);
        person.save(function(err){
            if(err) throw err;
            console.log('New registration successful!!');
        });
        
        res.status(200).send('New Registration uploaded successfully');
    }
    else {
        res.status(500);
    }
    
});


//module.exports = router;