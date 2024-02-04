const Actor = require('../models/actorModel');
const Director = require('../models/directorModel');

const verifyActorIsBlocked = async (req,res,next) => {
    try {
        const actor = await Actor.findById(req.actorId);
        if(actor.isBlocked === true){
            return res.status(403).json({ message: 'Forbidden: User is blocked' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const verifyDirectorIsBlocked = async (req,res,next) => {
    try {
        const director = await Director.findById(req.directorId);
        if(director.isBlocked === true){
            return res.status(403).json({ message: 'Forbidden: User is blocked' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    verifyActorIsBlocked,
    verifyDirectorIsBlocked
}