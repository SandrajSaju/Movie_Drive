const Chat = require('../models/chatModel');
const Actor = require('../models/actorModel');
const Director = require('../models/directorModel');
const Message = require('../models/messageModel')

// const createChat = async (req, res) => {
//     try {
//         const chat = await Chat.findOne({
//             members: { $all: [req.body.actorId, req.body.directorId] }
//         });
//         if (!chat) {
//             const newChat = new Chat({
//                 members: [req.body.actorId, req.body.directorId]
//             });
//             await newChat.save();
//             return res.status(200).json(newChat)
//         }
//         res.status(200).json(chat);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json(error.message)
//     }
// }

const directorPersonalChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            members: { $in: [req.params.directorId] }
        }).sort({updatedAt:-1})
        .exec()
        const memberArray = [];
        if (chats) {
            for (const chat of chats) {
                for (const member of chat.members) {
                    if (member.toString() !== req.params.directorId.toString()) {
                        const person = await Actor.findById(member);
                        memberArray.push(person);
                    }
                }
            }
        }
        res.status(200).json({ actors: memberArray })
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}

const actorPersonalChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            members: { $in: [req.params.actorId] }
        })
        .sort({updatedAt:-1})
        .exec()
        const memberArray = [];
        if (chats) {
            for (const chat of chats) {
                for (const member of chat.members) {
                    if (member.toString() !== req.params.actorId.toString()) {
                        const person = await Director.findById(member);
                        memberArray.push(person);
                    }
                }

            }
        }
        res.status(200).json({ directors: memberArray })
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}


const findChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [req.params.actorId, req.params.directorId] }
        });
        res.status(200).json(chat)
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}

const addMessage = async (req, res) => {
    try {
        const { chatId, senderId, text } = req.body;
        const message = new Message({
            chatId,
            senderId,
            text
        });
        const result = await message.save();

        const chat = await Chat.findById(chatId);
        chat.updatedAt = Date.now();
        await chat.save()
        
        res.status(200).json(result)
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}

// const getMessage = async (req, res) => {
//     try {
//         const chatId = req.params.chatId;
//         const message = await Message.find({ chatId });
//         res.status(200).json(message)
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json(error.message)
//     }
// }

const actorGetMessage = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const message = await Message.find({ chatId });
        res.status(200).json(message)
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}

const directorGetMessage = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const message = await Message.find({ chatId });
        res.status(200).json(message)
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}

// const actorMarkAsRead = async (req,res)=> {
//     try {
//         const messageId = req.params.id
//         await Message.findByIdAndUpdate(messageId,{isRead:true});
//         res.status(200).json({message:"Message marked as read."})
//     } catch (error) {
//         console.log(error.message)
//         res.status(200).json({error:error.message})
//     }
// }

const actorLatestMessage = async (req,res) => {
    try {
        const {actorId,directorId} =req.params;
        const latestMessage = await Message.find({
            $or:[
                { senderId: actorId, receiverId: directorId },
                { senderId: directorId, receiverId: actorId }
            ]
        }).sort({createdAt: -1}).limit(1)
        console.log(latestMessage);
        res.status(200).json(latestMessage)
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}

module.exports = {
    actorPersonalChats,
    directorPersonalChats,
    findChat,
    addMessage,
    actorGetMessage,
    directorGetMessage,
    // actorMarkAsRead,
    actorLatestMessage
}