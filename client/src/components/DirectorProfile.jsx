import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setDirectorCredentials } from '../feature/Director/directorAuthSlice';
import axiosInstance from '../app/axiosInstance';
import { useNavigate } from 'react-router-dom';

const DirectorProfile = () => {
    const navigate = useNavigate();
    const director = useSelector((state) => state.directorAuth.directorInfo);
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(director?.profile?.profileImage || '');
    const [editedDirector, setEditedDirector] = useState({
        name: '',
        gender: '',
        bio: '',
        phoneNumber: ''
    });

    const dispatch = useDispatch();
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        const formData = new FormData();
        formData.append('name', editedDirector.name);
        formData.append('phoneNumber', editedDirector.phoneNumber);
        formData.append('gender', editedDirector.gender);
        formData.append('bio', editedDirector.bio);
    
        if (imageFile) {
            formData.append('profileImage', imageFile);
        }
    
        try {
            const { data } = await axiosInstance.post('/director/updateprofile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": localStorage.getItem("directorToken")
                },
            });
    
            console.log(data.director);
            dispatch(setDirectorCredentials(data.director));
            setIsEditing(false);
        } catch (error) {
            navigate(`/director/404error`)
            console.error('Error updating profile:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedDirector({
            name: director.name,
            gender: director?.profile?.gender || '',
            phoneNumber: director?.profile?.phoneNumber || '',
            bio: director?.profile?.bio || '',
        });
    };

    return (
        <>
            <section className="text-gray-600 body-font w-4/5 max-md:w-3/5 ml-80 max-md:mt-40 mt-20">
                <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
                        <img className="object-cover object-center rounded w-80 h-96 ml-36" alt="hero" src={director.profile.profileImage} />
                    </div>

                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                        <h1 className="title-font sm:text-4xl text-3xl mb-10 font-medium text-gray-900">{director.name}
                        </h1>
                        <h1 className="title-font sm:text-xl text-lg mb-4 font-medium text-gray-900">Email: {director.email}
                        </h1>
                        <p className="mb-5 leading-relaxed font-bold">Phone No : {director?.profile?.phoneNumber}</p>
                        <p className="mb-5 leading-relaxed font-bold">Gender : {director?.profile?.gender}</p>
                        <p className="mb-14 leading-relaxed font-bold">Bio : {director?.profile?.bio}</p>
                        <div className="flex justify-center">
                            <button onClick={handleEditClick} className="inline-flex text-white bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-800 rounded text-lg">Edit Profile</button>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="z-10 bg-white p-8 max-w-md max-h-screen overflow-y-auto rounded-lg relative">
                            <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editedDirector.name}
                                    onChange={(e) => setEditedDirector({ ...editedDirector, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700">Profile Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setImageFile(file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setImagePreview(reader.result);
                                        };
                                        if (file) {
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-2 w-32 h-32 object-cover object-center rounded-md"
                                    />
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700">Phone Number:</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={editedDirector.phoneNumber}
                                    onChange={(e) => setEditedDirector({ ...editedDirector, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700">Gender:</label>
                                <select
                                    name="gender"
                                    value={editedDirector.gender}
                                    onChange={(e) => setEditedDirector({ ...editedDirector, gender: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700">Bio:</label>
                                <textarea
                                    name="bio"
                                    value={editedDirector.bio}
                                    onChange={(e) => setEditedDirector({ ...editedDirector, bio: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveEdit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default DirectorProfile
