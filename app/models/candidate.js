// Model for registered candidates

var fs = require('fs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var candidateSchema = new Schema({
    personal_data: {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String },
        number: { type: String },
        zip: { type: String },
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
        files: Array
    },
    misc: [{
        question:  { type: String},
        answer:  { type: String}
    }],
    meta: {
        date_registered: Date,
        status: String,
        date_status_changed: Date,
        status_changed_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
});

// Add date_registered before saving
// save is a built-in method
candidateSchema.pre('save', function(next){
    this.meta.date_registered = new Date();
    this.meta.status = 'registered';
    this.meta.date_status_changed = new Date();
    next();
});

// Remove video files before removing document
candidateSchema.pre('remove', true, function(next, done){
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

// Schema static methods
candidateSchema.static('findByStatus', function(status, callback){
    return this.find({'meta.status': status}, callback);
});




var Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
