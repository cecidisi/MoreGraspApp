var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Candidate = mongoose.model('Candidate');


module.exports = function (app) {
    app.use('/mg-rest-api', router);

    /************************************
     *  Video Storage
     ************************************/

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads/')
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


//  ADD candidate

router.post('/save-candidate', function (req, res, next) {
    if(req.body) {
        var candidate = Candidate(req.body);
        console.log(candidate);
        candidate.save(function(err){
            if(err) throw err;
            console.log('New registration successful!!');
            res.status(200).send('New Registration uploaded successfully');
        });
    }
    else {
        res.status(500);
    }
});



//  GET candidates

router.get('/get-all-candidates', function (req, res, next) {
    if(req.user) {
        Candidate.find(function (err, candidates) {
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


router.put('/update-candidate-status', function(req, res, next){

    if (req.user) {
        if(req.body) {
            var id = req.body.user_id,
                status= req.body.status,
                params = {
                    status: req.body.status,
                    set_by: req.user._id
                };

            Candidate.findByIdAndUpdate(id, {
                'meta.status': status,
                'meta.date_status_changed': new Date(),
                'meta.status_changed_by': req.user._id
            }, function(err, user){
                if(err)  {
                    console.log('error in ifnd by id and update');
                    throw err;
                }
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
