const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    senderId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    text: {
        type:String
    },
    isRead: {
        type: Boolean,
        default: false
    },
},{
    timestamps:true
});

const Message = mongoose.model("Message",messageSchema);
module.exports = Message