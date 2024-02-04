import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { setActorCredentials, setActorToken } from '../feature/Actor/actorAuthSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../app/axiosInstance';

function ActorLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [errors,setErrors] = useState({
        email:'',
        password:''
    })

    const [googleFormData, setGoogleFormData] = useState({
        name: '',
        email: '',
        picture: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
        setErrors((prevErrors)=>({
            ...prevErrors,
            [name]:''
        }))
    }

    const handleActorLogin = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = {};

        Object.keys(formData).forEach((key)=>{
            if(formData[key].trim() === ''){
                formIsValid=false;
                newErrors[key] = 'This field is required';
            }
        });
        if(!formIsValid){
            setErrors(newErrors);
            return;
        }
        try {
            const { data } = await axiosInstance.post('/actor/login', formData);
            console.log(data);
            dispatch(setActorCredentials(data.actor));
            dispatch(setActorToken(data.actorToken));
            setFormData({
                email: '',
                password: ''
            })

            navigate('/actor/home')
        } catch (error) {
            toast.error(error?.response?.data?.error);
            console.log(error?.response?.data?.error);
        }
    }

    const loginWithGoogle = async (googleFormData) => {
        try {
            const { data } = await axiosInstance.post('/actor/googlelogin', googleFormData);
            console.log(data);
            dispatch(setActorCredentials(data.existingActor));
            dispatch(setActorToken(data.actorToken));
            navigate('/actor/home')
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error.response.data.error);
        }
    };

    const googleLogin = async (name, email, picture) => {
        try {
            // Update state with the new values
            setGoogleFormData({
                name,
                email,
                picture
            });
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error.response.data.error);
        }
    };

    useEffect(() => {
        // Log the updated state after it has been set
        console.log(googleFormData);

        // Make the axios.post call when googleFormData changes
        if (googleFormData.name && googleFormData.email && googleFormData.picture) {
            loginWithGoogle(googleFormData);
        }
    }, [googleFormData]);


    return (
        <div className="w-4/5 mx-auto mt-32">
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <div className="lg:w-5/12 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                        <h1 className="title-font font-medium text-3xl text-gray-900">Best App For Future Actors</h1>
                        <p className="leading-relaxed mt-4">For Aspiring Actors, our app is a dream come true. Delve into the rich history of the movies, analyze the latest casting calls, and follow your Directors and become a professional actor.</p>
                    </div>
                    <div className="lg:w-1/2 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-xl font-bold text-center title-font mb-5"> Actor Log In</h2>

                        <div className="relative mb-4">
                            <label for="email" className="leading-7 text-sm text-gray-600">Email</label>
                            <input type="email" id="email" value={formData.email} onChange={handleInputChange} name="email" className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${errors.email && 'border-red-500'}`} />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="relative mb-4">
                            <label for="password" className="leading-7 text-sm text-gray-600">Password</label>
                            <input type="password" id="password" value={formData.password} onChange={handleInputChange} name="password" className={`w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out ${errors.password && 'border-red-500'}`} />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div className="relative mb-4 mx-auto">
                            <GoogleLogin
                            onSuccess={credentialResponse => {
                                const googleCredentials = jwtDecode(
                                    credentialResponse.credential
                                )
                                const { name, email, picture } = googleCredentials
                                googleLogin(name, email, picture)
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                        </div>

                        <button onClick={handleActorLogin} className="text-white bg-slate-500 border-0 py-2 px-8 focus:outline-none hover:bg-slate-700 rounded text-lg">Log In</button>
                        <p class="text-sm text-gray-500 mt-3 text-center">Do not have an Account? <Link to='/actor/signup' className='font-bold'>Sign Up here</Link></p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ActorLogin
