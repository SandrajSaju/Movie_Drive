const mongoose = require("mongoose");

const paidCompensationSchema = new mongoose.Schema({
    director: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Director',
        required:true
    },
    actor: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Actor',
        required:true
    },
    audition: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Audition',
        required:true
    },
},{
    timestamps:true
})

const PaidCompensation = mongoose.model("PaidCompensation",paidCompensationSchema);
module.exports = PaidCompensation;