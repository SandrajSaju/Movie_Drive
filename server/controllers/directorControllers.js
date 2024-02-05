const Director = require('../models/directorModel');
const Actor = require('../models/actorModel')
const CastingCall = require('../models/castingCallModel');
const Application = require('../models/applicationModel');
const Audition = require('../models/auditionModel')
const { generateToken } = require('../utils/generateToken');
const ImageKit = require("imagekit");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const Chat = require('../models/chatModel');
const PaidCompensation = require('../models/paidCompensation');
const saltRounds = 10;


const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const directorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please enter email and password" })
        }
        const director = await Director.findOne({ email })
        if (director && director.isVerified === true) {
            if(!director.isAdminApproved){
                return res.status(400).json({ error: "Your Verification by Admin is under Process" })
            }
            const isPasswordMatch = await bcrypt.compare(password, director.password)
            if (isPasswordMatch) {
                if(director.isBlocked){
                    return res.status(400).json({ error: "You have been blocked by the Admin" })
                }
                const directorToken = generateToken(res, director._id, "director")
                res.status(200).json({
                    director: director,
                    directorToken: directorToken
                })
            } else {
                return res.status(400).json({ error: "Email or password does not match" })
            }
        } else {
            return res.status(400).json({ error: "You are not Registered" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const directorSignup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "Please Fill all fields" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords are not matching" })
        }
        const existingDirector = await Director.findOne({ email });
        if (!existingDirector) {
            if (req.files && req.files.length > 0) {
                const imageKit = new ImageKit({
                    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                    urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
                });
                const uploadPromises = req.files.map((file) => {
                    return new Promise((resolve, reject) => {
                        imageKit.upload(
                            {
                                file: file.buffer,
                                fileName: `${Date.now()}-${file.originalname}`
                            },
                            (error, result) => {
                                if (error) {
                                    console.log("Error uploading image to imagekit", error);
                                    reject(error)
                                } else {
                                    resolve(result.url);
                                }
                            }
                        );
                    });
                });
                try {
                    const uploadImageUrls = await Promise.all(uploadPromises);
                    const hashedPassword = await bcrypt.hash(password, saltRounds)
                    const newDirector = new Director({
                        name,
                        email,
                        certificates: uploadImageUrls,
                        password: hashedPassword
                    })
                    await newDirector.save()
                    if (newDirector) {
                        let otp = Math.floor(Math.random() * 900000) + 100000;

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
                            subject: "Movie Drive Director Otp Verification Mail",
                            text: `Welcome to Movie Drive developed by Sandraj Saju.Your Otp for Verification is ${otp}.`
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("Email sent:" + info.response);
                            }
                        });

                        newDirector.otp = otp;
                        await newDirector.save();

                        res.status(201).json({
                            email: newDirector.email
                        });
                    } else {
                        res.status(400).json({ error: "Invalid Director Data" })
                    }
                } catch (error) {
                    console.log(error.message);
                    res.status(500).json({ message: "Error Uploading certificates to CDN" })
                }
            }else{
                return res.status(400).json({ error: "Please upload certificates" })
            }

        } else {
            return res.status(400).json({ error: "Director already registered" })
        }

    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message });
    }
}

const directorLogout = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout Successful'
    })
}

const directorVerifyOtp = async (req, res) => {
    try {
        const { enteredOtp, email } = req.body;
        const director = await Director.findOne({ email });
        if (director) {
            if (enteredOtp == director.otp) {
                director.isVerified = true;
                await director.save();
                res.status(200).json("Otp Verified");
            } else {
                res.status(400).json({error:"Enter Valid Otp"})
            }
        } else {
            res.status(400).json({ error: "Director Not Found" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message });
    }
}

const createCastingCall = async (req, res) => {
    try {
        const { title, role, project, compensation, date, gender, genre } = req.body
        if (!title || !role || !project || !compensation || !date || !gender || !genre) {
            return res.status(400).json({ error: "Please Fill all fields" })
        }
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
            const newCastingCall = new CastingCall({
                director: req.directorId,
                castingCallTitle: title,
                roleDescription: role,
                projectDescription: project,
                compensation,
                gender,
                auditionDate: date,
                genre,
                image: imageUrl
            })
            await newCastingCall.save()
            return res.status(201).json(newCastingCall)
        } else {
            return res.status(400).json({ error: "Please upload an Image" })
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getDirectorCastingCalls = async (req, res) => {
    try {
        const directorCastingCalls = await CastingCall.find({ director: req.directorId}).populate("appliedActors");
        res.status(200).json(directorCastingCalls)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
}

const deleteCastingCall = async (req, res) => {
    try {
        const castingCall = await CastingCall.findById(req.params.id);
        castingCall.isDeleted = true;
        await castingCall.save(); 
        res.status(200).json({
            message: 'Deleted Successfully'
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
}

const recoverCastingCall = async (req, res) => {
    try {
        const castingCall = await CastingCall.findById(req.params.id);
        castingCall.isDeleted = false;
        await castingCall.save(); 
        res.status(200).json({
            message: 'Recovered Successfully'
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message })
    }
}

const editCastingCall = async (req, res) => {
    try {
        const { id } = req.params;
        const editedCastingCall = req.body;
        const existingCastingCall = await CastingCall.findById(id);

        if (!existingCastingCall) {
            return res.status(404).json({ message: 'Casting Call not found' });
        }

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
            existingCastingCall.castingCallTitle = editedCastingCall.title;
            existingCastingCall.roleDescription = editedCastingCall.role;
            existingCastingCall.projectDescription = editedCastingCall.project;
            existingCastingCall.compensation = editedCastingCall.compensation;
            existingCastingCall.gender = editedCastingCall.gender;
            existingCastingCall.genre = editedCastingCall.genre;
            existingCastingCall.auditionDate = editedCastingCall.date;
            existingCastingCall.image = imageUrl;
            const updatedCastingCall = await existingCastingCall.save();
            return res.status(200).json({
                message: 'Casting Call updated successfully',
                castingCall: updatedCastingCall
            });
        } else {
            existingCastingCall.castingCallTitle = editedCastingCall.title;
            existingCastingCall.roleDescription = editedCastingCall.role;
            existingCastingCall.projectDescription = editedCastingCall.project;
            existingCastingCall.compensation = editedCastingCall.compensation;
            existingCastingCall.gender = editedCastingCall.gender;
            existingCastingCall.genre = editedCastingCall.genre;
            existingCastingCall.auditionDate = editedCastingCall.date;
            const updatedCastingCall = await existingCastingCall.save();
            return res.status(200).json({
                message: 'Casting Call updated successfully',
                castingCall: updatedCastingCall
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

const directorGetApplications = async (req, res) => {
    try {
        const { id } = req.params;
        const applications = await Application.find({ castingCall: id, status: { $ne: "Cancelled" } }).populate('actor').populate({
            path: 'castingCall',
            populate: {
                path: 'director',
                model: 'Director'
            }
        });
        res.status(200).json(applications);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

const directorApproveActor = async (req, res) => {
    try {
        const { id } = req.params;
        const {selectedTime} = req.body;
        if( selectedTime === null ){
            return res.status(400).json({error:"Please add a time slot for audition"})
        }

        const existingAudition = await Audition.findOne({
            time:selectedTime,
            // "castingCall.director":req.directorId
        });
        console.log(existingAudition);
        if(existingAudition){
            return res.status(400).json({error:"You have another Audition at the same time"})
        }

        const application = await Application.findById(id).populate('actor').populate({
            path: 'castingCall',
            populate: {
                path: 'director',
                model: 'Director'
            }
        });
        application.status = 'Approved';
        await application.save();

        const newAudition = new Audition({
            actor:application.actor,
            castingCall:application.castingCall,
            time:selectedTime,
        });
        await newAudition.save();

        const chat = await Chat.findOne({
            members:{$all:[req.directorId,newAudition.actor]}
        });
        if(!chat){
            const newChat = new Chat({
                members:[req.directorId,newAudition.actor]
            });
            await newChat.save();
        }
        const auditionDate = application.castingCall.auditionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "sandrajdevamangalam@gmail.com",
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: "sandrajdevamangalam@gmail.com",
            to: application.actor.email,
            subject: `Application for ${application.castingCall.castingCallTitle} Approved`,
            text: `Hi ${application.actor.name},\nYour application towards ${application.castingCall.castingCallTitle} is been Approved by ${application.castingCall.director.name} and the audition is scheduled on ${auditionDate} at ${newAudition.time}.Congragulations, now you can chat with ${application.castingCall.director.name}.\n\n\nThank You\nMovie Drive`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent:" + info.response);
            }
        });

        res.status(200).json({ message: "Application Approved" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

const directorRejectActor = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id).populate('actor').populate({
            path: 'castingCall',
            populate: {
                path: 'director',
                model: 'Director'
            }
        });
        application.status = 'Rejected';
        await application.save();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "sandrajdevamangalam@gmail.com",
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: "sandrajdevamangalam@gmail.com",
            to: application.actor.email,
            subject: `Application for ${application.castingCall.castingCallTitle} Rejected`,
            text: `Hi ${application.actor.name},\nSorry, your application towards ${application.castingCall.castingCallTitle} is been Rejected by ${application.castingCall.director.name}.\n\n\nThank You\nMovie Drive`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent:" + info.response);
            }
        });
        res.status(200).json({ message: "Application Rejected" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

const updateDirectorProfile = async (req, res) => {
    try {
        const { name,phoneNumber,gender,bio } = req.body;
        const director = await Director.findOne({ _id: req.directorId })
        director.name = name || director.name;
        director.profile.phoneNumber = phoneNumber || director.profile.phoneNumber;
        director.profile.bio = bio || director.profile.bio
        director.profile.gender = gender || director.profile.gender;

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
            console.log(imageUrl);
            director.profile.profileImage = imageUrl || director.profile.profileImage
        }

        await director.save();
        res.status(200).json({ message: "Director Profile Updated Successfully", director })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const directorGetActorDetails = async (req,res) => {
    try {
        const actorId = req.params.id;
        const actor = await Actor.findById(actorId);
        res.status(200).json(actor)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const directorScheduledAuditions = async (req, res) => {
    try {
        const director = await Director.findById(req.directorId);

        const auditions = await Audition.find().populate('actor').populate({
            path: 'castingCall',
            populate: {
                path: 'director',
                model: 'Director'
            }
        });
        const filteredAuditions = auditions.filter(audition => {
            return audition.castingCall.director._id.toString() == req.directorId
        });
        res.status(200).json(filteredAuditions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const directorGetPaymentHistory = async (req,res) => {
    try {
        const payments = await PaidCompensation.find({director:req.directorId}).populate('actor').populate({
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



/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
    try {
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      console.log();
      const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
      ).toString("base64");
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
  
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }
  };
  
  /**
   * Create an order to start the transaction.
   * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
   */
  const createOrder = async (data) => {
    // use the cart information passed from the front-end to calculate the purchase unit details

    console.log(
      "shopping cart information passed from the frontend createOrder() callback:",
      data.product,
    );
  
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: data.product.compensation,
          },
        },
      ],
    };
  
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
  
    return handleResponse(response);
  };
  
  /**
   * Capture payment for the created order to complete the transaction.
   * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
   */
  const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    });
  
    return handleResponse(response);
  };
  
  async function handleResponse(response) {
    try {
      const jsonResponse = await response.json();
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  }


module.exports = {
    directorLogin,
    directorSignup,
    directorLogout,
    createCastingCall,
    getDirectorCastingCalls,
    deleteCastingCall,
    recoverCastingCall,
    editCastingCall,
    directorGetApplications,
    directorApproveActor,
    directorRejectActor,
    directorVerifyOtp,
    updateDirectorProfile,
    directorGetActorDetails,
    directorScheduledAuditions,
    directorGetPaymentHistory,
    generateAccessToken,
    createOrder,
    captureOrder
}