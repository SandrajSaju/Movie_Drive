import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import axiosInstance from '../app/axiosInstance';

const OtpVerification = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const email = queryParams.get("email")

    const [enteredOtp, setEnteredOtp] = useState('')
    const [timer, setTimer] = useState(45);
    const [showResendButton, setShowResendButton] = useState(false)

    const handleInputChange = (e) => {
        setEnteredOtp(e.target.value)
    }

    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/actor/verifyotp', { enteredOtp, email})
            toast.success("Verification Successfull");
            navigate('/actor/login')
        } catch (error) {
            toast.error(error.response.data.error)
        }
    }

    const handleResendOtp = async () => {
        try {
            const { data } = await axiosInstance.post('/actor/resendotp', { email });
            setTimer(45);
            setShowResendButton(false)
            toast.success('OTP resent to Email');
        } catch (error) {
            toast.error(error.response.data.error);
        }   
    }

    useEffect(()=>{
        let interval;
        if(timer>0){
            interval = setInterval(()=>{
                setTimer((prevTimer)=>prevTimer - 1)
            },1000);
        }else{
            setShowResendButton(true);
            clearInterval(interval);
        }
        return ()=>clearInterval(interval);
    },[timer])

    return (
        <>
            <div className="w-4/5 mx-auto mt-32">
                <section className="text-gray-600 body-font">
                    <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                        <div className="lg:w-5/12 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                            <h1 className="title-font font-medium text-3xl text-gray-900">Best App For Future Actors</h1>
                            <p className="leading-relaxed mt-4">For Aspiring Actors, our app is a dream come true. Delve into the rich history of the movies, analyze the latest casting calls, and follow your Directors and become a professional actor.</p>
                        </div>
                        <div className="lg:w-1/2 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                            <h2 className="text-gray-900 text-xl font-bold text-center title-font mb-5">OTP Verification</h2>

                            <div className="relative mb-4">
                                <label for="otp" className="leading-7 text-sm text-gray-600">Enter Otp</label>
                                <input type="text" id="otp" value={enteredOtp} onChange={handleInputChange} name="otp" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>
                            <button onClick={verifyOtp} className="text-white bg-slate-500 border-0 py-2 px-8 focus:outline-none hover:bg-slate-700 rounded text-lg">Submit</button>

                            {timer === 0 && showResendButton && (
                                <button
                                    onClick={handleResendOtp}
                                    className="text-white bg-slate-500 border-0 py-2 px-8 focus:outline-none hover:bg-slate-700 rounded text-lg mt-2"
                                >
                                    Resend OTP
                                </button>
                            )}

                            {timer > 0 && <p className="text-xs text-gray-900 mt-3 text-center font-bold tracking-wider">Time left: {timer} seconds</p>}
                            {timer === 0 && !showResendButton && (
                                <p className="text-xs text-gray-500 mt-3 text-center">Click Resend OTP to try again</p>
                            )}

                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default OtpVerification
