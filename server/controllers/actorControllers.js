const Actor = require('../models/actorModel');
const Director = require('../models/directorModel')
const { generateToken } = require('../utils/generateToken');
const CastingCall = require('../models/castingCallModel');
const Application = require('../models/applicationModel');
const Audition = require('../models/auditionModel');
const PaidCompensation = require('../models/paidCompensation');
const ImageKit = require("imagekit");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const actorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide Email and Password" });
        }
        const actor = await Actor.findOne({ email })
        if (actor && actor.isVerified === true) {
            const isPasswordMatch = await bcrypt.compare(password, actor.password)
            if (isPasswordMatch) {
                if (actor.isBlocked === true) {
                    return res.status(400).json({ error: "Your Account is been blocked" });
                }
                const actorToken = generateToken(res, actor._id, "actor")
                res.status(200).json({ actor, actorToken })
            } else {
                return res.status(400).json({ error: "Email or password does not match" });
            }
        } else {
            return res.status(400).json({ error: "You are not Registered" });
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message });
    }
}

const googleLogin = async (req, res) => {
    try {
        const { name, email, picture } = req.body
        console.log(req.body)
        const existingActor = await Actor.findOne({ email })
        if (!existingActor) {
            const newActor = await Actor.create({
                name,
                email,
                profile: {
                    profileImage: picture
                }
            });
            const actorToken = generateToken(res, newActor._id, "actor")
            res.status(200).json({ existingActor: newActor, actorToken })
        } else {
            const actorToken = generateToken(res, existingActor._id, "actor")
            res.status(200).json({ existingActor, actorToken })
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message });
    }
}

const actorSignup = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, confirmPassword } = req.body;
        if (!name || !email || !phoneNumber || !password || !confirmPassword) {
            return res.status(400).json({ error: "Please fill all the field" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords doesnt match" });
        }
        const existingActor = await Actor.findOne({ email });
        if (!existingActor) {
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            const newActor = new Actor({
                name,
                email,
                phoneNumber,
                password: hashedPassword
            })
            await newActor.save()

            if (newActor) {
                let otp = Math.floor(Math.random() * 9000) + 1000;

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "sandrajdevamangalam@gmail.com",
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                let mailOptions = {
                    from: "sandrajdevamangalam@gmail.com",
                    to: email,
                    subject: "Movie Drive Otp Verification Mail",
                    text: `Welcome to Movie Drive developed by Sandraj Saju.Your Otp for Verification is ${otp}.`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent:" + info.response);
                    }
                });
                newActor.otp = otp;
                await newActor.save();

                res.status(201).json({
                    email: newActor.email
                });
            } else {
                res.status(400).json({ error: "Invalid Actor Data" })
            }
        } else {
            return res.status(400).json({ error: "Actor Already Registered" });
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message });
    }
}


const actorResendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const existingActor = await Actor.findOne({ email });
        if (existingActor) {
            let otp = Math.floor(Math.random() * 9000) + 1000;

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "sandrajdevamangalam@gmail.com",
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            let mailOptions = {
                from: "sandrajdevamangalam@gmail.com",
                to: email,
                subject: "Movie Drive Otp Verification Mail",
                text: `Welcome to Movie Drive developed by Sandraj Saju.Your Otp for Verification is ${otp}.`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent:" + info.response);
                }
            });
            existingActor.otp = otp;
            await existingActor.save();

            res.status(201).json({
                email: existingActor.email
            });
        } else {
            return res.status(400).json({ error: "Something Unexpected Happened" });
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message });
    }
}


const actorLogout = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout Successful'
    })
}

const verifyOtp = async (req, res) => {
    try {
        const { enteredOtp, email } = req.body;
        const actor = await Actor.findOne({ email });
        if (actor) {
            if (enteredOtp == actor.otp) {
                actor.isVerified = true;
                await actor.save();
                res.status(200).json("Otp Verified");
            } else {
                res.status(400).json({ error: "Enter Valid Otp" })
            }
        } else {
            res.status(400).json({ error: "Actor Not Found" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message });
    }
}

const getAllCastingCalls = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 4;
        const skip = (page - 1) * perPage;
        const castingCalls = await CastingCall.find().skip(skip).limit(perPage);
        const totalCastingCalls = await CastingCall.countDocuments();
        const totalPages = Math.ceil(totalCastingCalls / perPage);
        res.status(200).json({castingCalls,totalPages})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
}

const updateActorProfile = async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        const actor = await Actor.findOne({ _id: req.actorId })
        actor.name = name || actor.name;
        actor.email = email || actor.email;
        actor.phoneNumber = phoneNumber || actor.phoneNumber;
        actor.profile.age = req.body["profile.age"] || actor.profile.age
        actor.profile.gender = req.body["profile.gender"] || actor.profile.gender

        if (req.file) {
            const imagekit = new ImageKit({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
            });

            const uploadImage = () => {
                return new Promise((resolve, reject) => {
                    imagekit.upload(
                        {
                            file: req.file.buffer,
                            fileName: `${Date.now()}-${req.file.originalname}`
                        },
                        (error, result) => {
                            if (error) {
                                console.log("Error uploading image to imagekit", error);
                                reject(error);
                            } else {
                                resolve(result.url);
                            }
                        }
                    )
                })
            }
            const imageUrl = await uploadImage();
            actor.profile.profileImage = imageUrl || actor.profile.profileImage
        }
        await actor.save();
        res.status(200).json({ message: "Actor Profile Updated Successfully", actor })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const actorViewDetailedCastingCall = async (req, res) => {
    try {
        const id = req.params.id;
        const castingCall = await CastingCall.findById(id).populate('director');
        res.status(200).json(castingCall)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const applyCastingCall = async (req, res) => {
    try {
        const { id } = req.params;
        const castingCall = await CastingCall.findById(id);
        const actor = await Actor.findById(req.actorId);
        if (actor) {
            if (!actor.profile.gender || !actor.profile.age || !actor.profile.profileImage) {
                return res.status(400).json({ error: "Please Complete Your Profile" })
            }
            if (actor.profile.profileVideos.length === 0) {
                return res.status(400).json({ error: "Please add atleast one profile video" })
            }
            if (actor.profile.gender === castingCall.gender) {
                const existingApplication = await Application.findOne({ actor: req.actorId, castingCall: id });
                if (existingApplication) {
                    existingApplication.status = "Pending";
                    existingApplication.save();
                    if (!(castingCall.appliedActors.includes(actor._id))) {
                        castingCall.appliedActors.push(actor._id)
                        await castingCall.save()
                    }
                    res.status(200).json(existingApplication)
                } else {
                    const newApplication = new Application({
                        actor: req.actorId,
                        castingCall: id
                    })
                    await newApplication.save();
                    castingCall.appliedActors.push(actor._id)
                    await castingCall.save()
                    res.status(200).json(newApplication)
                }
            } else {
                return res.status(400).json({ error: "This Casting Call require a different gender" })
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const cancelApplication = async (req, res) => {
    try {
        const { castingCallId, applicationId } = req.params;
        const castingCall = await CastingCall.findById(castingCallId);

        const actorIndex = castingCall.appliedActors.findIndex((actor) => req.actorId)
        const deletedId = castingCall.appliedActors.splice(actorIndex, 1)
        castingCall.save()

        const application = await Application.findById(applicationId);
        application.status = "Cancelled";
        await application.save();
        res.status(200).json({ message: "Cancelled Successfully" })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
}

const ActorUploadVideo = async (req, res) => {
    try {
        const actor = await Actor.findById(req.actorId);

        if (req.file) {
            const imagekit = new ImageKit({
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
            });
            const uploadVideo = () => {
                return new Promise((resolve, reject) => {
                    imagekit.upload(
                        {
                            file: req.file.buffer,
                            fileName: `${Date.now()}-${req.file.originalname}`
                        },
                        (error, result) => {
                            if (error) {
                                console.log("Error Uploading video to imagekit", error);
                                reject(error)
                            } else {
                                resolve(result.url)
                            }
                        }
                    )
                })
            }

            try {
                const videoUrl = await uploadVideo();
                actor.profile.profileVideos.push(videoUrl);
            } catch (error) {
                return res.status(500).json({ error: "Video upload failed" })
            }
        }
        await actor.save();
        res.status(200).json({ message: "Video updated Successfully", actor });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getActorApplications = async (req, res) => {
    try {
        const applications = await Application.find({ actor: req.actorId, status: { $ne: "Cancelled" } })
            .populate('actor')
            .populate({
                path: 'castingCall',
                populate: {
                    path: 'director',
                    model: 'Director'
                }
            })
        res.status(200).json(applications)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const actorGetAllDirectors = async (req, res) => {
    try {
        const allDirectors = await Director.find({ isAdminApproved: true, isBlocked: false });
        res.status(200).json(allDirectors)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

const actorSearchDirector = async (req, res) => {
    try {
        const { text } = req.body;
        const directors = await Director.find({ name: new RegExp(text, 'i'), isAdminApproved: true, isBlocked: false });
        res.status(200).json(directors)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

const actorGetAllAuditions = async (req, res) => {
    try {
        const auditions = await Audition.find({ actor: req.actorId }).populate('actor')
            .populate({
                path: 'castingCall',
                populate: {
                    path: 'director',
                    model: 'Director'
                }
            })
        res.status(200).json({ auditions: auditions })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

const actorGetPaymentHistory = async (req,res) => {
    try {
        const payments = await PaidCompensation.find({actor:req.actorId}).populate('director').populate({
            path:'audition',
            populate: {
                path:'castingCall',
                populate: {
                    path: 'director',
                    model: 'Director'
                }
            }
        });

        res.status(200).json(payments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    actorLogin,
    googleLogin,
    actorSignup,
    verifyOtp,
    actorLogout,
    getAllCastingCalls,
    updateActorProfile,
    actorViewDetailedCastingCall,
    applyCastingCall,
    cancelApplication,
    ActorUploadVideo,
    getActorApplications,
    actorGetAllDirectors,
    actorSearchDirector,
    actorResendOtp,
    actorGetAllAuditions,
    actorGetPaymentHistory
}