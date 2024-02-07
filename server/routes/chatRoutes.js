const express = require('express');
const { findChat, addMessage, actorPersonalChats, actorGetMessage, directorPersonalChats, directorGetMessage, actorLatestMessage } = require('../controllers/chatControllers');
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

router.get('/actor/:actorId',actorPersonalChats);
router.get('/director/:directorId',directorPersonalChats);
router.get('/find/:actorId/:directorId',findChat);
router.post('/message',addMessage);
router.get('/actor/message/:chatId',actorGetMessage);
router.get('/director/message/:chatId',directorGetMessage);
router.get('/actor/latestmessage/:actorId/:directorId',actorLatestMessage)

module.exports = router