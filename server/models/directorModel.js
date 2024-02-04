const mongoose = require('mongoose');

const directorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type:Number
    },
    certificates: [{
        type: String,
        required: true
    }],
    profile: {
        gender: {
            type: String
        },
        phoneNumber: {
            type: Number
        },
        movies: [String],
        bio: {
            type: String
        },
        profileImage: {
            type: String,
            default:"https://png.pngtree.com/png-vector/20220807/ourmid/pngtree-man-avatar-wearing-gray-suit-png-image_6102786.png"
        }
    },
    castingCalls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CastingCall'
    }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdminApproved: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })

const Director = mongoose.model('Director', directorSchema);
module.exports = Director;