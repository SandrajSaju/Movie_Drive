import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../app/axiosInstance';


const DirectorCreateCastingCall = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        role: '',
        project: '',
        compensation: 0,
        date: '',
        gender: 'Male',
        genre: 'Drama',
        image: ''
    })
    const [imagePreview, setImagePreview] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (!selectedImage.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        setFormData({
            ...formData,
            image: selectedImage
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedImage);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.post('/director/createcastingcall', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": localStorage.getItem("directorToken")
                }
            });
            navigate('/director/castingcalls')
        } catch (error) {
            toast.error(error.response.data.error)
        }
    }

    return (
        <>
            <section className="relative  text-gray-600 body-font  ml-60">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                        <h1 className="sm:text-3xl text-2xl font-bold title-font mb-4 text-gray-900 tracking-wider mt-10">Create Casting Call</h1>
                    </div>
                    <div className="lg:w-1/2 md:w-2/3 mx-auto">
                        <div className="flex flex-wrap -m-2">
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="title" className="leading-7 text-gray-600 text-sm font-bold">Title</label>
                                    <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="image" className="leading-7 text-gray-600 text-sm font-bold">Image</label>
                                    <input type="file" id="image" name="image" onChange={handleImageChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>

                            {imagePreview && (
                                <div className="p-2 w-full">
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="max-h-40 max-w-full object-cover m-auto" />
                                    </div>
                                </div>
                            )}


                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="description" className="leading-7 text-gray-600 text-sm font-bold">Role Description</label>
                                    <input type="text" id="role" name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="description" className="leading-7 text-gray-600 text-sm font-bold">Project Description</label>
                                    <input type="text" id="project" name="project" value={formData.project} onChange={handleInputChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <div className="relative">
                                    <label for="compensation" className="leading-7 text-gray-600 text-sm font-bold">Compensation Amount</label>
                                    <input type="number" id="compensation" name="compensation" value={formData.compensation} onChange={handleInputChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-1/2">
                                <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="age">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="p-2 w-full">
                                <div className="relative">
                                    <label for="date" className="leading-7 text-gray-600 text-sm font-bold">Audition Date</label>
                                    <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                </div>
                            </div>
                            <div className="p-2 w-full">
                                <label className="block text-gray-700 text-sm font-bold " htmlFor="age">
                                    Genre
                                </label>
                                <select
                                    id="genre"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="Drama">Drama</option>
                                    <option value="Thriller">Thriller</option>
                                    <option value="Fantasy">Fantasy</option>
                                    <option value="Romance">Romance</option>
                                    <option value="Sci-fi">Sci-fi</option>
                                    <option value="Comedy">Comedy</option>
                                    <option value="Action">Action</option>
                                    <option value="Documentary">Documentary</option>
                                </select>
                            </div>

                            <div className="p-2 w-full">
                                <button onClick={handleSubmit} className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-800 rounded text-lg">Add Casting Call</button>
                            </div>
                            <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default DirectorCreateCastingCall
