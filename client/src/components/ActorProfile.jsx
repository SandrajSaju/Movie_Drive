import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActorCredentials } from '../feature/Actor/actorAuthSlice';
import { toast } from 'react-toastify'
import axiosInstance from '../app/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ActorProfile = () => {
    const navigate = useNavigate();
    const { actorInfo } = useSelector(state => state.actorAuth)
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingVideos, setIsAddingVideos] = useState(false);
    const [video, setVideo] = useState('');
    const [editedInfo, setEditedInfo] = useState({
        name: actorInfo.name,
        email: actorInfo.email,
        phoneNumber: actorInfo.phoneNumber,
        profile: {
            age: actorInfo.profile.age,
            gender: actorInfo.profile.gender,
            profileImage: actorInfo.profile.profileImage
        }
    })
    const [selectedImage, setSelectedImage] = useState(null)
    const dispatch = useDispatch()

    const handleOpenAddVideosModal = () => {
        setIsAddingVideos(true);
    };
    const handleCloseAddVideosModal = () => {
        setVideo('')
        setIsAddingVideos(false);
    };
    const renderedVideo = (<div>
            {/* Render video details here */}
            {video && video instanceof Blob && (
            <video width="320" height="240" controls className='mt-5 w-full'>
                <source src={URL.createObjectURL(video)} type={video.type} />
                Your browser does not support the video tag.
            </video>
        )}
        </div>)

    const handleVideoChange = (e) => {
        const selectedVideo = e.target.files[0];
        if(!selectedVideo.type.startsWith("video/")){
           return toast.error("Please select a video file");
        }
        setVideo(selectedVideo);
    };

    const handleInputChange = (e) => {
        if (e.target.name.startsWith('profile.')) {
            setEditedInfo({
                ...editedInfo,
                profile: {
                    ...editedInfo.profile,
                    [e.target.name.split('.')[1]]: e.target.value,
                },
            });
        } else {
            setEditedInfo({
                ...editedInfo,
                [e.target.name]: e.target.value,
            });
        }
    }

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (!selectedImage.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        setEditedInfo({
            ...editedInfo,
            // image: selectedImage
            profile: {
                ...editedInfo.profile,
                profileImage: URL.createObjectURL(selectedImage)
            }
        })
        setSelectedImage(selectedImage)
    }

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editedInfo.name);
            formData.append('email', editedInfo.email);
            formData.append('phoneNumber', editedInfo.phoneNumber);
            formData.append('profile.age', editedInfo.profile.age);
            formData.append('profile.gender', editedInfo.profile.gender);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const { data } = await axiosInstance.patch('/actor/updateprofile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": localStorage.getItem("actorToken")
                }
            });
            dispatch(setActorCredentials(data.actor))
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message)
        }
    };

    const handleSaveVideos = async (e) => {
        try {
            const formData = new FormData();
            formData.append("video",video);
            const {data} = await axiosInstance.post('/actor/uploadvideo',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": localStorage.getItem("actorToken")
                }
            });
            dispatch(setActorCredentials(data.actor))
            toast.success("Video uploaded");
            setVideo('')
            setIsAddingVideos(false);
        } catch (error) {
            navigate(`/actor/404error`)
            console.log(error);
        }
    }

    return (
        <>
            <section className="text-gray-600 body-font w-4/5 max-md:w-3/5 ml-80">
                <div className="container px-5 py-24 mx-auto flex flex-col">
                    <div className="lg:w-4/6 mx-auto">
                        <h1 className="text-2xl font-bold title-font mb-4 text-gray-900 tracking-wider text-center mt-7">DETAILED PROFILE</h1>
                        <div className="rounded-lg h-72 overflow-hidden mt-8">
                            <img alt="content" className="object-cover object-center px-12 h-full w-full" src={actorInfo.profile.profileImage} />
                        </div>
                        <div className="flex flex-col sm:flex-row mt-10 mx-auto">
                            <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                                <div className="flex flex-col items-center text-center justify-center">
                                    <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">{actorInfo.name}</h2>
                                    <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                                    <button onClick={() => {
                                        setIsEditing(true);
                                        setEditedInfo({ ...actorInfo });
                                    }} className='p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg'>Edit Profile</button>
                                    <button onClick={handleOpenAddVideosModal} className='p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg mt-3'>Add Videos</button>
                                </div>
                            </div>
                            <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                                <p className="leading-relaxed text-lg mb-4 font-bold">Full Name - <span className='font-medium'>{actorInfo.name}</span></p>
                                <p className="leading-relaxed text-lg mb-4 font-bold">Age - <span className='font-medium'>{actorInfo.profile.age}</span></p>
                                <p className="leading-relaxed text-lg mb-4 font-bold">Gender - <span className='font-medium'>{actorInfo.profile.gender}</span></p>
                                <p className="leading-relaxed text-lg mb-4 font-bold">Email - <span className='font-medium'>{actorInfo.email}</span></p>
                                <p className="leading-relaxed text-lg mb-4 font-bold">Phone Number - <span className='font-medium'>{actorInfo.phoneNumber}</span></p>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold title-font mb-4 text-gray-900 tracking-wider text-center">PROFILE VIDEOS</h1>
                        
                        <div className="grid grid-cols-2 gap-8 mt-8">
                        {actorInfo.profile.profileVideos.map((videoUrl, index) => (
                            <div key={index} className="relative">
                                <video
                                    className="w-full h-80 object-cover rounded-xl"
                                    controls
                                >
                                    <source src={videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ))}
                    </div>

                    </div>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="z-10 bg-white p-8 max-w-md max-h-screen overflow-y-auto rounded-lg relative">
                            <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={editedInfo.name}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image</label>
                                <input type="file" id="image" name="image" onChange={handleImageChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>

                            {editedInfo.profile.profileImage && (
                                <div className="mb-4">
                                    <p className="block text-gray-700 text-sm font-bold mb-2">Image Preview</p>
                                    <img
                                        src={editedInfo.profile.profileImage}
                                        alt="Preview"
                                        className="w-full h-40 object-cover"
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Age
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="profile.age"
                                    value={editedInfo.profile.age}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="profile.gender"  // Update the name to include 'profile.'
                                    value={editedInfo.profile.gender}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >

                                    <option value="Male" selected={editedInfo.profile.gender === 'Male'}>Male</option>
                                    <option value="Female" selected={editedInfo.profile.gender === 'Female'}>Female</option>
                                    <option value="Other" selected={editedInfo.profile.gender === 'Other'}>Other</option>

                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={editedInfo.email}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={editedInfo.phoneNumber}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <button
                                    className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg"
                                    onClick={handleSaveChanges}
                                >
                                    Save Changes
                                </button>
                                <button
                                    className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg ml-24"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isAddingVideos && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="z-10 bg-white p-8 max-w-md w-full max-h-screen overflow-y-auto rounded-lg">
                            <h2 className="text-2xl font-bold mb-4 text-center">Add Videos</h2>
                            {/* Add video input fields and logic here */}
                            <input
                                type="file"
                                id="videoUpload"
                                name="video"
                                accept="video/*"
                                onChange={handleVideoChange }
                            />
                            {renderedVideo}
                            <div className='mt-5'>
                                <button
                                    className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg"
                                    onClick={handleCloseAddVideosModal}
                                >
                                    Close
                                </button>
                                <button
                                    className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg ml-24"
                                    onClick={handleSaveVideos}
                                >
                                    Save Videos
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </section>
        </>
    )
}

export default ActorProfile
