var express = require('express'),
    router = express.Router(),
    passport = require('passport');


module.exports = function (app) {
    app.use('/matchmaking1', router);
};


router.get('/', function(req, res, next){
    console.log(req.user);
    if(req.user)
        res.redirect('/matchmaking1/home');
    else
        res.redirect('/matchmaking1/login');
});

router.get('/login', function(req, res, next){
    res.render('mm/login', {
        title: 'Matchmaking Platform',
        user: req.user
    });
});

router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err)
        if (!user) {
            return res.redirect('/matchmaking1')
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/matchmaking1');
        });
    })(req, res, next);

});

router.get('/home', function(req, res, next){
    if(req.user)
        res.render('mm/index', { title: 'Matchmaking Platform', user: req.user });
    else
        res.redirect('/matchmaking1');
});

router.get('/registrations', function(req, res, next){
    if(req.user)
        res.render('mm/registrations', { title: 'Matchmaking Platform', user: req.user });
    else
        res.redirect('/matchmaking1');
});


router.post('/change-password', function(req, res, next){

    if(req.user) {
        if(req.body) {
            var user = req.user;
            user.comparePassword(req.body.current_password, function(err, isMatch){
                if(err) return next(err);
                if(!isMatch) {
                    res.status(404).send('Current password incorrect');
                }
                else {
                    user.login.password = req.body.new_password;
                    user.save(function(err){
                        if(err) return next(err);
                        res.status(200).send('Password changed successfully');
                    })
                }
            })
        }
        else{
            res.status(500).send('Parameter missing');
        }
    }
    else {
        res.status(401).send('Unauthorized: Access denied')
    }

});


router.post('/change-settings', function(req, res, next){

    console.log(req.body);
    if(req.user) {
        if(req.body) {
            var user = req.user;
            user.updateSettings(req.body, function(err){
                if(err) return next(err);
                res.status(200).send('Settings updated successfully');
            })
        }
        else{
            res.status(500).send('Parameter missing');
        }
    }
    else {
        res.status(401).send('Unauthorized: Access denied')
    }

});


router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/matchmaking1');
});

