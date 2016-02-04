// Model for registered candidates

var fs = require('fs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var personSchema = new Schema({
    personal_data: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        number: { type: String, required: true },
        zip: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    pre_injury: {
        metal_implant: { type: Boolean, required: true },
        pacemaker:  { type: Boolean, required: true },
        medication_pump:  { type: Boolean, required: true },
        stroke:  { type: Boolean, required: true },
        epilepsy:  { type: Boolean, required: true },
        long_term_care:  { type: Boolean, required: true }
    },
    injury_details: {
        date_injury:  { type: Date, required: true },
        accidental_injury:  { type: Boolean, required: true }
    },
    current_abilities: {
        hand_to_mouth:  { type: Boolean, required: true },
        glass_to_mouth:  { type: Boolean, required: true },
        extend_wrist:  { type: Boolean, required: true },
        need_improve_grasp:  { type: Boolean, required: true }
    },
    video: {
        //paths: Array
        files: Array
    },
    misc: [{
        question:  { type: String, required: true },
        answer:  { type: String, required: true }
    }],
    meta: {
        date_registered: Date,
        status: String,
        date_status_changed: Date
    }
    
});

// Add date_registered before saving
// save is a built-in method 
personSchema.pre('save', function(next){
    this.meta.date_registered = new Date();
    this.meta.status = 'registered';
    this.meta.date_registered = new Date();
    next();
});

// Remove video files before removing document
personSchema.pre('remove', true, function(next, done){
    this.video.files.forEach(function(filePath){
        var path = './public/uploads/'+filePath;
        fs.stat(path, function(err, stats){
            if(stats) {
                console.log('Pre-remove: Deleting --> ' + filePath);
                fs.unlinkSync(path);
            }
        });
    });
    console.log(next);
    next();
})

// Find methods
personSchema.static('findByStatus', function(status, callback){
    return this.find({'meta.status': status}, callback);
});


var Person = mongoose.model('Person', personSchema);

module.exports = Person;
