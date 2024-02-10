const express = require("express")
const router = express.Router()
const multer = require('multer');
const { directorLogin, directorSignup, directorLogout, createCastingCall, getDirectorCastingCalls, deleteCastingCall, editCastingCall, directorApproveActor, directorRejectActor, directorGetApplications, directorVerifyOtp, updateDirectorProfile, directorGetActorDetails, directorScheduledAuditions, recoverCastingCall, directorGetPaymentHistory, generateAccessToken, createOrder, captureOrder} = require('../controllers/directorControllers');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifyDirectorIsBlocked } = require("../middlewares/isBlockedMiddleware");
const PaidCompensation = require('../models/paidCompensation');

const castingCallImageStorage = multer.memoryStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const castingCallImageUpload = multer({ storage: castingCallImageStorage });

const certificateStorage = multer.memoryStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const directorCertificatesUpload = multer({ storage: certificateStorage });

const directorProfileImageStorage = multer.memoryStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const directorProfileImageUpload = multer({ storage: directorProfileImageStorage });


router.post("/login", directorLogin)
router.post("/signup", directorCertificatesUpload.array('images'), directorSignup)
router.post("/verifyotp", directorVerifyOtp)
router.post("/logout", directorLogout)
router.post('/createcastingcall', verifyToken("director"), verifyDirectorIsBlocked, castingCallImageUpload.single("image"), createCastingCall)
router.get('/getcastingcalls', verifyToken("director"), verifyDirectorIsBlocked, getDirectorCastingCalls)
router.delete('/deletecastingcall/:id', verifyToken("director"), verifyDirectorIsBlocked, deleteCastingCall)
router.delete('/recovercastingcall/:id', verifyToken("director"), verifyDirectorIsBlocked, recoverCastingCall)
router.put('/editcastingcall/:id', verifyToken("director"), verifyDirectorIsBlocked, castingCallImageUpload.single("image"), editCastingCall);
router.get('/getapplicants/:id', verifyToken("director"), verifyDirectorIsBlocked, directorGetApplications)
router.post('/approveactor/:id', verifyToken("director"), verifyDirectorIsBlocked, directorApproveActor);
router.post('/rejectactor/:id', verifyToken("director"), verifyDirectorIsBlocked, directorRejectActor);
router.post('/updateprofile', verifyToken("director"), verifyDirectorIsBlocked, directorProfileImageUpload.single("profileImage"), updateDirectorProfile);
router.get('/getactordetails/:id', verifyToken("director"), verifyDirectorIsBlocked, directorGetActorDetails);
router.get('/getallauditions', verifyToken("director"), verifyDirectorIsBlocked, directorScheduledAuditions);
router.get('/getallchats', verifyToken("director"), verifyDirectorIsBlocked, directorScheduledAuditions);
router.get('/getallpayments', verifyToken("director"), verifyDirectorIsBlocked, directorGetPaymentHistory);

router.post("/my-server/create-paypal-order", async (req, res) => {
    try {
        // use the cart information passed from the front-end to calculate the order amount detals
        // console.log(req.body);
        const { jsonResponse, httpStatusCode } = await createOrder(req.body);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

router.post("/my-server/capture-paypal-order", async (req, res) => {
    try {
        const { jsonResponse, httpStatusCode } = await captureOrder(req.body.orderID);
        console.log(req.body);
        const compensation = req.body.compensation;
        const adminCompensation = compensation * 0.1;
        const actorCompensation = compensation * 0.9;
        const paidCompensation = new PaidCompensation({
            director: req.body.directorId,
            actor: req.body.actorId,
            audition: req.body.auditionId,
            adminCompensation: adminCompensation,
            actorCompensation: actorCompensation
        })
        await paidCompensation.save()
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
});

module.exports = router