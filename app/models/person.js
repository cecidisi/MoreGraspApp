// Model for registered candidates

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var personSchema = new Schema({
    personal_data: {
        first_name: String,
        last_name: String,
        country: String,
        city: String,
        street: String,
        number: String,
        zip: String,
        email: String,
        phone: String
    },
    pre_injury: {
        metal_implant: Boolean,
        pacemaker: Boolean,
        medication_pump: Boolean,
        stroke: Boolean,
        epilepsy: Boolean,
        long_term_care: Boolean      
    },
    injury_details: {
        date_injury: Date,
        accidental_injury: Boolean
    },
    current_abilities: {
        hand_to_mouth: Boolean,
        glass_to_mouth: Boolean,
        extend_wrist: Boolean,
        need_improve_grasp: Boolean        
    },
    video: {
        paths: Array
    },
    misc: {
        question_how_found_us: Array,
        question_who_fills_form: Array
    },
    info: {
        date_registered: Date,
        status: String
    }
    
});

// Add date_registered before saving
// save is a built-in method 
personSchema.pre('save', function(next){
    this.info.date_registered = new Date();
    this.info.status = 'registered';
    next();
});


//personSchema.virtual('date')
//    .get(function(){
//    return this._id.getTimestamp();
//});

var Person = mongoose.model('Person', personSchema);

module.exports = Person;
