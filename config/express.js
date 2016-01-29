var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var fsSync = require('fs-sync');
var multer = require('multer');

//var Person = require('./app/models/person');


module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
      require(controller)(app);
  });

    
    /************************************
     *  Handle storage
     ************************************/
    
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/videos/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })

    //var upload = multer({ dest: './uploads/', limits: { fieldSize: 52428800, fileSize: 52428800 } });
    var upload = multer({ storage: storage, limits: { fieldSize: 52428800, fileSize: 52428800, files: 3 } });

    app.post('/upload-video', upload.single('video'), function(req, res, next){
        if (req.file) {
            console.log(req.file);
            res.status(200).send('File uploaded');
        }
        else {
            res.status(500).send('No files');

        }
    });
    
    /************************************
     *  End Handle storage
     ************************************/
    
    

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
