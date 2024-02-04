const mongoose = require('mongoose')

const actorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number
    },
    otp: {
        type:Number
    },
    password: {
        type: String
    },
    profile: {
        age: {
            type: Number
        },
        gender: {
            type: String
        },
        profileImage: {
            type: String
        },
        profileVideos: [String]
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Actor = mongoose.model('Actor', actorSchema)

module.exports = Actor