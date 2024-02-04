import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axiosInstance from '../app/axiosInstance';

function ActorSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData, [name]: value
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }))
    }

    const handleActorSignUp = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = {};

        Object.keys(formData).forEach((key) => {
            if (formData[key].trim() === '') {
                formIsValid = false;
                newErrors[key] = 'This field is required';
            }
        });

        if (!formIsValid) {
            console.log(newErrors);
            setErrors(newErrors);
            return;
        }

        try {
            const { data } = await axiosInstance.post('/actor/signup', formData);
            console.log(data);
            if (data) {
                const email = data.email;
                const queryString = new URLSearchParams({ email }).toString();
                toast.success("OTP sent to Email");
                navigate(`/actor/verifyotp?${queryString}`);
            }
        } catch (error) {
            toast.error(error.response.data.error);
        }        
    }

    return (
        <div className="w-4/5 mx-auto mt-32 md:mt-5">
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <div className="lg:w-5/12 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                        <h1 className="title-font font-medium text-3xl text-gray-900">Best App For Future Actors</h1>
                        <p className="leading-relaxed mt-4">For Aspiring Actors, our app is a dream come true. Delve into the rich history of the movies, analyze the latest casting calls, and follow your Directors and become a professional actor.</p>
                    </div>
                    <div className="lg:w-1/2 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-xl font-bold text-center title-font mb-5">Actor Sign Up</h2>
                        <div className="relative mb-4">
                            <label for="full-name" className="leading-7 text-sm text-gray-600">Full Name</label>
                            <input type="text" id="full-name" value={formData.name} onChange={handleInputChange} name="name" className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${errors.name && 'border-red-500'}`} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div class="relative mb-4">
                            <label for="email" className="leading-7 text-sm text-gray-600">Email</label>
                            <input type="email" id="email" value={formData.email} onChange={handleInputChange} name="email" className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${errors.email && 'border-red-500'}`} />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div class="relative mb-4">
                            <label for="phoneNumber" className="leading-7 text-sm text-gray-600">Phone Number</label>
                            <input type="phone-number" id="phone-number" value={formData.phoneNumber} onChange={handleInputChange} name="phoneNumber" className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${errors.phoneNumber && 'border-red-500'}`} />
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                        </div>
                        <div class="relative mb-4">
                            <label for="password" className="leading-7 text-sm text-gray-600">Password</label>
                            <input type="password" id="password" value={formData.password} onChange={handleInputChange} name="password" className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${errors.password && 'border-red-500'}`} />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div class="relative mb-4">
                            <label for="password" className="leading-7 text-sm text-gray-600">Confirm Password</label>
                            <input type="password" id="confirm-password" value={formData.confirmPassword} onChange={handleInputChange} name="confirmPassword" className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${errors.confirmPassword && 'border-red-500'}`} />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <button onClick={handleActorSignUp} className="text-white bg-slate-500 border-0 py-2 px-8 focus:outline-none hover:bg-slate-700 rounded text-lg">Sign Up</button>
                        <p class="text-xs text-gray-500 mt-3 text-center">Already registered? <Link to='/actor/login'>Login here</Link></p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ActorSignup
