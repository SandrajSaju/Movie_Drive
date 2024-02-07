const express = require("express");
const router = express.Router();
const { adminLogin, adminGetActors, adminLogout, adminBlockActor, adminUnblockActor, adminGetDirectors,adminBlockDirector,adminUnblockDirector, getDirectorRequests, adminApproveDirector, adminRejectDirector, adminGetActorAndDirectorCount, adminGetCastingCallsByGenre, adminGetPaymentHistory} = require("../controllers/adminControllers");
const { verifyToken } = require("../middlewares/authMiddleware");


router.post('/login', adminLogin);
router.get('/getallactors', verifyToken("admin"), adminGetActors);
router.post('/logout',adminLogout);
router.post('/blockactor/:id',verifyToken("admin"), adminBlockActor)
router.post('/unblockactor/:id',verifyToken("admin"), adminUnblockActor);
router.get('/getalldirectors', verifyToken("admin"), adminGetDirectors);
router.post('/blockdirector/:id',verifyToken("admin"), adminBlockDirector)
router.post('/unblockdirector/:id',verifyToken("admin"), adminUnblockDirector);
router.get('/getdirectorrequests', verifyToken("admin"), getDirectorRequests);
router.post('/approvedirector/:id',verifyToken("admin"), adminApproveDirector);
router.post('/rejectdirector/:id',verifyToken("admin"), adminRejectDirector);
router.get('/dashboard/actordirectorcount', verifyToken("admin"), adminGetActorAndDirectorCount);
router.get('/dashboard/castingcallsbygenre', verifyToken("admin"), adminGetCastingCallsByGenre);
router.get('/dashboard/paymenthistory', verifyToken("admin"), adminGetPaymentHistory);

module.exports = router;