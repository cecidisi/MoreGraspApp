var express = require('express'),
    config = require('./config/config'),
    mkdirp = require('mkdirp'),
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
    users.forEach(function(user){
        if(user.login.password === 'default') {
            var pswd = generatePassword(15, false);
            user.login.password = pswd;
            user.save(function(err){
                if(err) throw err;
                user.comparePassword(pswd, function(err, callback){
                    console.log('user password reset and hashed');
                    console.log('USERNAME = ' + user.login.username);
                    console.log('PASSWORD = ' + pswd);
                });
            });
        }
    });
});

// Create uploads fodler if not exist
//mkdirp('/public/uploads', function(err){
//    if(err) console.log('Cannot create folder --> ', err);
//});

var app = express();
// invokes express
require('./config/express')(app, config);

app.listen(config.port, function () {
    console.log(config);
    console.log('Express server listening on port ' + config.port);
});
