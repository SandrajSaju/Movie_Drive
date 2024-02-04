import React,{useState} from 'react'
import { setAdminCredentials, setAdminToken } from '../feature/Admin/adminAuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import axiosInstance from '../app/axiosInstance';

const AdminLogin = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.post('/admin/login', formData);
            console.log(data);
            dispatch(setAdminCredentials(data.email));
            dispatch(setAdminToken(data.adminToken));
            setFormData({
                email: '',
                password: ''
            })
            navigate('/admin/dashboard')
        } catch (error) {
            toast.error(error.response.data.error);
            console.log(error.response.data.error);
        }
    }

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
                            <h2 className="text-gray-900 text-xl font-bold text-center title-font mb-5"> Admin Log In</h2>

                            <div className="relative mb-4">
                                <label for="email" className="leading-7 text-sm text-gray-600">Email</label>
                                <input type="email" id="email" value={formData.email} onChange={handleInputChange} name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>

                            <div className="relative mb-4">
                                <label for="password" className="leading-7 text-sm text-gray-600">Password</label>
                                <input type="password" id="password" value={formData.password} onChange={handleInputChange} name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>

                            <button onClick={handleAdminLogin} className="text-white bg-gray-800 border-0 py-2 px-8 focus:outline-none hover:bg-red-500 rounded text-lg">Log In</button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default AdminLogin
