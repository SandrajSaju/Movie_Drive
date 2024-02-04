const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
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
    status:{
        type:String,
        default:"Pending",
        enum:['Pending','Rejected','Approved','Cancelled']
    }
},{
    timestamps:true
})

const Application = mongoose.model("Application",applicationSchema);
module.exports = Application