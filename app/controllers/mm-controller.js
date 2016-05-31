var express = require('express'),
    router = express.Router(),
    passport = require('passport');


// Set root route
module.exports = function (app) {
    app.use('/matchmaking1', router);
};


// ROOT ROUTING --> if user logged in, redirects to Home, otherwise to login page
router.get('/', function(req, res, next){
    console.log(req.user);
    if(req.user)
        res.redirect('/matchmaking1/home');
    else
        res.redirect('/matchmaking1/login');
});


router.route('/login')
    // ROUTING TO LOGIN PAGE
    .get(function(req, res, next){
        res.render('mm/login', {
            title: 'Matchmaking Platform',
            user: req.user
        });
    })
    // AUTHENTICATION AND LOGIN (user stays logged in for the rest of the session)
    .post(function(req, res, next){
        passport.authenticate('local', function(err, user, info) {
            if (err) return next(err)
            if (!user)
                return res.redirect('/matchmaking1');

            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.redirect('/matchmaking1');
            });
        })(req, res, next);
    });


// ROUTING TO HOME (checks user is logged in)
router.get('/home', function(req, res, next){
    if(req.user)
        res.render('mm/index', { title: 'Matchmaking Platform', user: req.user });
    else
        res.redirect('/matchmaking1');
});

// ROUTING TO REGISTRATIONS (checks user is logged in)
router.get('/registrations', function(req, res, next){
    if(req.user)
        res.render('mm/registrations', { title: 'Matchmaking Platform', user: req.user });
    else
        res.redirect('/matchmaking1');
});


// CHANGE PASSWORD: requirments checked on client.
// Server only checks that current pasword matches and updates with new password
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


// CHANGE SETTINGS --> email, phone and preferences
router.post('/change-settings', function(req, res, next){
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

// LOGOUT
router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/matchmaking1');
});

