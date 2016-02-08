// Model for registered candidates

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;  // for rainbow table & brute force attacks

var adminSchema = new Schema({
    personal_data: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        institution: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String }
    },
    preferences: {
        notify_new_registration: { type: Boolean, required: true, default: false }
    },
    login: {
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true }
    }
});

// Hash password before saving
adminSchema.pre('save', function(next){
    var admin = this;
    // only hash the password if it has been modified (or is new)
    if(!this.isModified('login.password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(admin.login.password, salt, function(err, hash){
            if(err) return next(err);
            // override the cleartext password with the hashed one
            this.login.password = hash;
            next();
        })
    })
});

adminSchema.methods.comparePassword = function(givenPassword, cb){
    bcrypt.compare(givenPassword, this.login.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Find methods
adminSchema.static('findByUsername', function(usernmae, callback){
    return this.find({'login.username': usernmae}, callback);
});


var Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
