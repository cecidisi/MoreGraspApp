var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Person = mongoose.model('Person');


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
        var person = Person(req.body);
        console.log(person);
        person.save(function(err){
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
    Person.find(function (err, persons) {
        if (err) return next(err);
        res.status(200).send(JSON.stringify(persons));
    });
});


router.get('/get-registered-candidates', function (req, res, next) {
    Person.findByStatus('registered', function (err, persons) {
        if (err) return next(err);
        res.status(200).send(JSON.stringify(persons));
    });
});


router.get('/get-accepted-candidates', function (req, res, next) {
    Person.findByStatus('accepted', function (err, persons) {
        if (err) return next(err);
        res.status(200).send(JSON.stringify(persons));
    });
});

router.get('/get-rejected-candidates', function (req, res, next) {
    Person.findByStatus('rejected', function (err, persons) {
        if (err) return next(err);
        res.status(200).send(JSON.stringify(persons));
    });
});


//  DELETE candidates

router.delete('/remove-all-candidates', function (req, res, next) {

//    Person.find(function(err, persons){
//        if (err) return next(err);
//        var total = 0;
//        persons.forEach(function(person){
//            console.log(person);
//
//            person.remove(function(err){
//                if(err) throw err;
//                total++;
//                console.log('callback remove. Total = ' + total);
//                if(total === persons.length)
//                    res.status(200).send('Deleted all Persons');
//            });
//        });
//    });

    Person.remove({}, function (err, persons) {
        if (err) return next(err);
        res.status(200).send('Deleted All');
    });

});


router.put('/update-candidate-status', function(req, res, next){

    console.log(req.body);
    if(req.body) {
        var user_id = req.body.user_id,
            status = req.body.status;

        Person.findByIdAndUpdate(user_id, { 'meta.status': status, 'meta.date_status_changed': new Date() }, function(err, user){
            if(err) throw err;
            res.status(200).send('User ' + user._id + ' --> new status = ' + status);
        });
    }
    else {
        res.status(500);
    }
});
