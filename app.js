var express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    config = require('./config/config'),
    mkdirp = require('mkdirp'),
    fileSave = require('file-save'),
    glob = require('glob'),
    mongoose = require('mongoose'),
    generatePassword = require('password-generator');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
    require(model);
});

var   User = mongoose.model('User');
// Reset and hash admin passwords if new
User.find(function (err, users) {
    if (err) throw err;
    var env = process.env.NODE_ENV || 'development', txt = '', count = 0;
    users.forEach(function(user, i){
        if(user.login.password === 'default') {
            var pswd = generatePassword(15, false);
            user.login.password = pswd;
            user.save(function(err){
                if(err) throw err;
                user.comparePassword(pswd, function(err, callback){
                    console.log('user password reset and hashed');
                    txt += ('USERNAME = ' + user.login.username + '\n PASSWORD = ' + pswd + '\n');
                    count++;
                    if(count === users.length && txt !== '')
                        fileSave('.users-'+env).write(txt, 'utf8').end().error(function(){ console.log('Error saving users file'); });
                });
            });
        }
    });

});

// Create uploads fodler if not exist
mkdirp('/public/uploads', function(err){
    if(err) console.log('Cannot create folder --> ', err);
});

var app = express();
app.use(function(req, res, next) {
    console.log('In app.js I SHOULD ALLOW CORS!!!');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// invokes express
require('./config/express')(app, config);

// Uncomment to load over HTTP and allow livereload
app.listen(config.port, function () {
    //console.log(config);
    console.log('NODE_ENV='+process.env.NODE_ENV);
    console.log('MoreGrasp http server listening on port ' + config.port);
});

