const mongoose = require("mongoose");

const auditionSchema = new mongoose.Schema({
    actor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Actor',
        required:true
    },
    castingCall:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CastingCall',
        required:true
    },
    time:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Audition = mongoose.model("Audition",auditionSchema);
module.exports = Audition