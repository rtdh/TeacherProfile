const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const teacherSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    mandal: {
        type: String,
        requried: true
    },
    mandalcode : {
        type : Number,
        required: true
    },
    school: {
        type: String,
        requried: true
    },
    udisecode : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    cfmsid : {
        type: String,
        requried: true
    },
    designation : {
        type: String,
        required: true
    },
    dob : {
        type: String,
        required: true
    },
    dojs : {
        type: String,
        required: true
    },
    retirementAge : { 
        type: Number,
    },
    dor : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required : true
    },
    photo : {
        type : String,
        requried: true
    },
    subjects : {
        type : String,
        required: true
    },
    moleone : {
        type : String
    },
    moletwo : {
        type : String
    },
    confirmedbyuser : {
        type : String
    },
    confirmedbymeo : {
        type : String
    }
})

module.exports = mongoose.model('Teacher', teacherSchema)