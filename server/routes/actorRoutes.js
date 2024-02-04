const express = require("express")
const router = express.Router()
const multer = require('multer')
const { actorLogin, actorSignup, actorLogout, getAllCastingCalls, updateActorProfile, googleLogin, verifyOtp, actorViewDetailedCastingCall, applyCastingCall, cancelApplication, ActorUploadVideo, getActorApplications, actorGetAllDirectors, actorSearchDirector, actorResendOtp,actorGetAllAuditions, actorGetPaymentHistory} = require("../controllers/actorControllers")
const { verifyToken } = require("../middlewares/authMiddleware");
const {verifyActorIsBlocked} = require("../middlewares/isBlockedMiddleware")

const profileImageStorage = multer.memoryStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const profileImageUpload = multer({ storage: profileImageStorage });

const videoStorage = multer.memoryStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const videoUpload = multer({ storage: videoStorage });

router.post("/login", actorLogin)
router.post("/googlelogin", googleLogin)
router.post("/signup", actorSignup)
router.post("/verifyotp",verifyOtp)
router.post("/logout", actorLogout)
router.get('/castingcalls', verifyToken('actor'), verifyActorIsBlocked,getAllCastingCalls)
router.patch('/updateprofile', verifyToken('actor'),verifyActorIsBlocked, profileImageUpload.single("image"), updateActorProfile);
router.get('/viewdetailedcastingcall/:id',verifyToken('actor'),verifyActorIsBlocked,actorViewDetailedCastingCall)
router.post('/applycastingcall/:id',verifyToken('actor'),verifyActorIsBlocked,applyCastingCall);
router.post('/cancelapplication/:castingCallId/:applicationId',verifyToken('actor'),verifyActorIsBlocked,cancelApplication);
router.post('/uploadvideo', verifyToken('actor'),verifyActorIsBlocked, videoUpload.single("video"), ActorUploadVideo);
router.get('/getactorapplications',verifyToken('actor'),verifyActorIsBlocked,getActorApplications);
router.get('/getalldirectors',verifyToken('actor'),verifyActorIsBlocked,actorGetAllDirectors);
router.post('/getsearcheddirectors',verifyToken('actor'),verifyActorIsBlocked,actorSearchDirector);
router.post('/resendotp',actorResendOtp);
router.get('/getscheduledauditions',verifyToken('actor'),verifyActorIsBlocked,actorGetAllAuditions);
router.get('/getallpayments',verifyToken('actor'),verifyActorIsBlocked,actorGetPaymentHistory);


module.exports = router