var express = require('express'),
    i18n = require('i18n-2'),
    glob = require('glob'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    locale = require('locale');


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

    // config supported locales
    var supportedLocales = new locale.Locales(['en', 'de']);
    app.use(locale(supportedLocales));

    // config i18n
    i18n.expressBind(app, {
        locales: ['en', 'de'],
        //defaultLocale: 'en',
        directory: './public/i18n',
        cookieName: 'lang'
    });

    app.use(function(req, res, next){
        req.i18n.setLocaleFromSubdomain();
        req.i18n.setLocaleFromCookie();
        req.i18n.setLocaleFromQuery(req);
        next();
    });

    // Session
    app.use(session({
        secret: 'session secret key',
        resave: false,
        saveUninitialized: false
    }));

    app.use(compress());

    // Passport
    // Change for HTTP basic strategy
    var User = mongoose.model('User');
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({ 'login.username': username }, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Unknown username.' });
            user.comparePassword(password, function(err, isMatch) {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

  app.use(passport.initialize());
  app.use(passport.session());
  // END Passport


  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
      require(controller)(app);
  });
    
    

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
