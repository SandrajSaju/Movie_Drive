const mongoose = require('mongoose');

const castingCallSchema = mongoose.Schema({
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director',
        required: true
    },
    castingCallTitle: {
        type: String,
        required: true
    },
    roleDescription: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String
    },
    compensation: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    genre:{
        type:String,
        required:true,
        enum:['Thriller','Action','Drama','Comedy','Fantasy','Romance','Documentary','Sci-fi']
    },
    image: {
        type: String,
        required:true
    },
    auditionDate: {
        type: Date,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    appliedActors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Actor'
    }]
})

const CastingCallModel = mongoose.model('CastingCall', castingCallSchema);

module.exports = CastingCallModel