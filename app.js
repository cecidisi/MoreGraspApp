var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
    require(model);
});

// Create  admins if not exist
var Admin = mongoose.model('Admin');

Admin.findByUsername('gmuellerputz', function (err, admins) {
    if (err) throw err;
    if(admins.length === 0) {
        var admin = new Admin({
            personal_data: {
                first_name: 'Gernot',
                last_name: 'Mueller-Putz',
                institution: 'TUG',
                country: 'Austria',
                city: 'Graz',
                email: 'gernot.mueller@tugraz.at'
            },
            preferences: {
                notify_new_registration: false
            },
            login: {
                username: 'gmuellerputz',
                password: 'ed3p_xz0aVaETez'
            }
        });

        admin.save(function(err){
            if(err) throw err;
        });
    }
});


var app = express();
require('./config/express')(app, config);

app.listen(config.port, function () {
    console.log(config);
    console.log('Express server listening on port ' + config.port);
});
