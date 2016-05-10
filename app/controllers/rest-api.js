var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs'),
    passport = require('passport'),
    nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    Candidate = mongoose.model('Candidate'),
    User = mongoose.model('User');


module.exports = function (app) {

    app.use('/mg-rest-api', router);

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /************************************
     *  Video Storage
     ************************************/

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, req.body.filename || file.originalname);
        }
    })

    var upload = multer({
        storage: storage,
        limits: { fieldSize: 52428800, fileSize: 52428800, files: 3 }
    });

    router.post('/upload-video', upload.single('video'), function(req, res, next){
        console.log(req.file);

        if (req.file) {
            res.status(200).send('File "' + req.file.originalname + '" uploaded');
        }
        else {
            res.status(500).send('No files');
        }
    });

    /************************************
     *  End Video Storage
     ************************************/
};


router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err)
        if (!user)
            res.status(401).send('Login Failed');

        req.logIn(user, function(err) {
            if (err) return next(err);
            res.status(200).send('Successful login');
        });
    })(req, res, next);
});





var emailUsers = function(cb) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'moregrasp.know.center@gmail.com',
            pass: 'moregrasph2020'
        }
    });

    User.find(function(err, users){
        if(err) return cb(err);
        var done = 0;
        for(var i = 0; i < users.length; ++i) {
            var user = users[i];
            //console.log(user.login.username);
            if(user.preferences.notify_new_registration) {
                console.log('Mail to: ' + user.personal_data.email);
                var msg = "Dear " + user.personal_data.first_name + ' ' + user.personal_data.last_name + "<br><br>" +
                    "A new candidate just signed up at the MoreGrasp Registration Platform<br>" +
                    "Check it at <url>http://moregrasp.know-center.tugraz.at/matchmaking1/</url><br><br>" +
                    "Best Regards,<br><br>Know-Center - MoreGrasp support<br><br><br>"+
                    "<small>This message has been automatically generated.</small><br>"+
                    "<small>To disable these notifications, go to @username tab --> Settings --> Receive notifications of new registrations = NO </small>";

                var mailOptions = {
                    from: 'moregrasp.know.center@gmail.com',
                    to: user.personal_data.email,
                    subject: 'New registration @ MoreGrasp',
                    html: msg
                }

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log('Should return here --> ', error);
                        return cb(error);
                    }
                });
            }
            done++;
            if(done == users.length) {
                return cb(null);
            }
        }
    });
};



//  ADD candidate
router.post('/save-candidate', function (req, res, next) {
    if(req.body) {
        var candidate = Candidate(req.body);
        console.log(candidate);
        candidate.save(function(err){
            if(err) throw err;
            emailUsers(function(err){
                if(err) console.log('Error sending emails', err);
                res.status(200).send('New Registration uploaded successfully');
            });
        });
    }
    else {
        res.status(500);
    }
});



//// REQUIRES AUTH

//  GET candidates
router.get('/get-all-candidates', function (req, res, next) {

    if(req.user) {
        Candidate.getAllSorted(function (err, candidates) {
            if (err) return next(err);
            res.status(200).send(JSON.stringify(candidates));
        });
    }
    else {
        res.status(401).send('Unauthorized: Access denied');
    }
});


router.get('/get-registered-candidates', function (req, res, next) {

    if (req.user) {
        Candidate.findByStatus('registered', function (err, candidates) {
            if (err) return next(err);
            res.status(200).send(JSON.stringify(candidates));
        });
    }
    else {
        res.status(401).send('Unauthorized: Access denied');
    }
});


router.get('/get-accepted-candidates', function (req, res, next) {

    if(req.user) {
        Candidate.findByStatus('accepted', function (err, candidates) {
            if (err) return next(err);
            res.status(200).send(JSON.stringify(candidates));
        });
    }
    else {
        res.status(401).send('Unauthorized: Access denied');
    }
});


router.get('/get-rejected-candidates', function (req, res, next) {

    if(req.user) {
        Candidate.findByStatus('rejected', function (err, candidates) {
            if (err) return next(err);
            res.status(200).send(JSON.stringify(candidates));
        });
    }
    else {
        res.status(401).send('Unauthorized: Access denied');
    }
});



//  UPDATE candidate status

router.put('/update-candidate-status', function(req, res, next){
    if (req.user) {
        if(req.body) {
            var id = req.body.user_id,
                status= req.body.status,
                params = { status: req.body.status, set_by: req.user._id };

            Candidate.findByIdAndUpdate(id, {
                'meta.status': status,
                'meta.date_status_changed': new Date(),
                'meta.status_changed_by': req.user._id
            }, function(err, user){
                if(err) throw err;
                res.status(200).send('User ' + user._id + ' --> new status = ' + status);
            });
        }
        else {
            res.status(500).send('Missing parameters');
        }
    }
    else {
        res.status(401).send('Unauthorized: Access denied');
    }

});



//  DELETE candidates

router.delete('/remove-all-candidates', function (req, res, next) {

    Candidate.find(function(err, candidates){
        if (err) return next(err);
        var total = 0;
        candidates.forEach(function(candidate){
            console.log(candidate);

            candidate.remove(function(err){
                if(err) throw err;
                total++;
                console.log('callback remove. Total = ' + total);
                if(total === candidates.length)
                    res.status(200).send('Deleted all Candidates');
            });
        });
    });

    Candidate.remove({}, function (err, candidates) {
        if (err) return next(err);
        candidates.forEach(function(c){
            c.video.files.forEach(function(filePath){
                var path = './public/uploads/'+filePath;
                fs.stat(path, function(err, stats){
                    if(stats) {
                        console.log('Deleting --> ' + filePath);
                        fs.unlinkSync(path);
                    }
                });
            });

        });
        res.status(200).send('Deleted All');
    });

});

