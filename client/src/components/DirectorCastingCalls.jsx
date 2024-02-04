import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCastingCall, getCastingCalls, editCastingCall ,recoverCastingCall} from '../feature/CastingCalls/castingCallsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from './Loader';

const DirectorCastingCalls = () => {
    const castingCalls = useSelector(state => state.castingCalls.castingCalls);
    const loading = useSelector(state => state.castingCalls.loading);
    const dispatch = useDispatch()

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCastingCall, setSelectedCastingCall] = useState(null);
    const [editedCastingCall, setEditedCastingCall] = useState({
        title: '',
        role: '',
        project: '',
        compensation: 0,
        date: '',
        gender: 'Male',
        genre: 'Drama',
        image: ''
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false);
    const [selectedCastingCallToDelete, setSelectedCastingCallToDelete] = useState(null)
    const [selectedCastingCallToRecover, setSelectedCastingCallToRecover] = useState(null)

    const handleEditClick = async (castingCall) => {
        setSelectedCastingCall(castingCall);
        const formattedDate = castingCall.auditionDate ? new Date(castingCall.auditionDate).toISOString().split('T')[0] : '';

        setEditedCastingCall({
            title: castingCall.castingCallTitle,
            role: castingCall.roleDescription,
            project: castingCall.projectDescription,
            compensation: castingCall.compensation,
            date: formattedDate,
            gender: castingCall.gender,
            genre: castingCall.genre,
            image: castingCall.image
        });
        setIsEditModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCastingCall((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (!selectedImage.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        setEditedCastingCall({
            ...editedCastingCall,
            image: selectedImage
        })
    }

    const handleUpdateCastingCall = async () => {
        console.log("iddddd", selectedCastingCall._id, "seeeeen", editedCastingCall);
        const formData = new FormData();


        formData.append("title", editedCastingCall.title);
        formData.append("role", editedCastingCall.role);
        formData.append("project", editedCastingCall.project);
        formData.append("compensation", editedCastingCall.compensation);
        formData.append("date", editedCastingCall.date);
        formData.append("gender", editedCastingCall.gender);
        formData.append("genre", editedCastingCall.genre);

        formData.append("image", editedCastingCall.image);

        // Dispatch action to edit casting call
        await dispatch(editCastingCall({ id: selectedCastingCall._id, editedCastingCall: formData }));

        // Close the edit modal and refresh casting calls
        setIsEditModalOpen(false);
        setSelectedCastingCall(null);
        setEditedCastingCall({
            title: '',
            role: '',
            project: '',
            compensation: 0,
            date: '',
            gender: 'Male',
            genre: 'Drama',
            image: ''
        });
        dispatch(getCastingCalls());
    };

    const handleDeleteClick = (castingCall) => {
        setSelectedCastingCallToDelete(castingCall);
        setIsDeleteModalOpen(true)
    }
    const handleRecoverClick = (castingCall) => {
        setSelectedCastingCallToRecover(castingCall);
        setIsRecoverModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        await dispatch(deleteCastingCall(selectedCastingCallToDelete._id));
        setIsEditModalOpen(false);
        setSelectedCastingCallToDelete(null)
        dispatch(getCastingCalls());
    }

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setSelectedCastingCallToDelete(null)
    }

    const handleConfirmRecover = async () => {
        await dispatch(recoverCastingCall(selectedCastingCallToRecover._id));
        setIsEditModalOpen(false);
        setSelectedCastingCallToRecover(null)
        dispatch(getCastingCalls());
    }

    const handleCancelRecover = () => {
        setIsRecoverModalOpen(false);
        setSelectedCastingCallToRecover(null)
    }

    useEffect(() => {
        dispatch(getCastingCalls())
    }, [dispatch])

    return (
        <>
        {
            loading && (
                <section className="text-gray-600 body-font w-4/5 max-md:w-3/5 ml-96 max-md:ml-44">
                <div className="container px-5 py-24 mx-auto">
                   <div className="flex flex-col w-full text-center mb-10">
                        <h1 className="text-2xl font-bold title-font mb-4 text-gray-900 tracking-wider">CASTING CALLS</h1>
                        <Link to='/director/addcastingcall' className=' ml-auto '><button className='bg-green-600 w-36 h-10 rounded-xl p-2 text-white font-bold'>Add Casting Call</button></Link>
                    </div> 
                    <div className="">
                        <Loader />
                    </div>
                </div>
                </section>
            )
        }
            {
               !loading &&  castingCalls && castingCalls.length === 0 && (
                    <section className="text-gray-600 body-font w-4/5 max-md:w-3/5 ml-96 max-md:ml-44">
                        <div className="container px-5 py-24 mx-auto">
                            <div className="flex flex-col w-full text-center mb-10">
                                <h1 className="text-2xl font-bold title-font mb-4 text-gray-900 tracking-wider">CASTING CALLS</h1>
                                <Link to='/director/addcastingcall' className=' ml-auto '><button className='bg-green-600 w-36 h-10 rounded-xl p-2 text-white font-bold'>Add Casting Call</button></Link>
                            </div>
                            <div className="flex flex-wrap -m-4">
                                <h4 className='text-xl font-bold mb-4 text-gray-500 tracking-wider text-center'>You Didnt added any Casting Calls yet...</h4>
                            </div>
                        </div>
                    </section>
                )
            }
            { !loading && castingCalls && castingCalls.length !== 0 && (<section className="text-gray-600 body-font w-4/5 max-md:w-3/5 ml-96 max-md:ml-44">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col w-full text-center mb-10">
                        <h1 className="text-2xl font-bold title-font mb-4 text-gray-900 tracking-wider">CASTING CALLS</h1>
                        <Link to='/director/addcastingcall' className=' ml-auto '><button className='bg-green-600 w-36 h-10 rounded-xl p-2 text-white font-bold'>Add Casting Call</button></Link>
                    </div>
                    <div className="flex flex-wrap -m-4">
                        {
                            castingCalls && castingCalls?.map(castingCall => (
                                <div key={castingCall._id} className="p-4 lg:w-1/2">
                                    <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                                        <img alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src={castingCall.image} />
                                        <div className="flex-grow sm:pl-8">
                                            <h2 className="title-font font-bold text-lg text-gray-900">{castingCall.castingCallTitle}</h2>
                                            <h3 className="text-gray-900 mb-3 font-medium">Role - {castingCall.roleDescription}</h3>
                                            <p className="mb-4 text-gray-500">{castingCall.projectDescription}</p>
                                            <span className="inline-flex space-x-10">
                                                {
                                                    castingCall.isDeleted === false ? (
                                                        <>
                                                            <button onClick={() => handleEditClick(castingCall)} className='p-2 bg-green-600 text-white w-24 h-10 hover:bg-green-700 rounded-lg'>Edit</button>
                                                            <button onClick={() => handleDeleteClick(castingCall)} className='p-2 bg-red-500 text-white w-24 h-10 hover:bg-red-700 rounded-lg'>Delete</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => handleRecoverClick(castingCall)} className='p-2 bg-indigo-500 text-white w-24 h-10 hover:bg-indigo-700 rounded-lg'>Recover</button>
                                                        </>
                                                    )
                                                }

                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>


                </div>

                {isEditModalOpen && selectedCastingCall && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                            &#8203;
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    {/* Edit form fields go here */}
                                    <div className="p-2">
                                        <div className="relative">
                                            <label for="title" className="leading-7 text-gray-600 text-sm font-bold">Title</label>
                                            <input type="text" id="title" name="title" value={editedCastingCall.title} onChange={handleChange}
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <div className="relative">
                                            <label for="image" className="leading-7 text-gray-600 text-sm font-bold">Image</label>
                                            <input type="file" id="image" name="image" onChange={handleImageChange}
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <div className="relative">
                                            <label for="description" className="leading-7 text-gray-600 text-sm font-bold">Role Description</label>
                                            <input type="text" id="role" name="role" onChange={handleChange}
                                                value={editedCastingCall.role} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <div className="relative">
                                            <label for="description" className="leading-7 text-gray-600 text-sm font-bold">Project Description</label>
                                            <input type="text" id="project" name="project" value={editedCastingCall.project} onChange={handleChange}
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <div className="relative">
                                            <label for="compensation" className="leading-7 text-gray-600 text-sm font-bold">Compensation Amount</label>
                                            <input type="number" id="compensation" name="compensation" value={editedCastingCall.compensation} onChange={handleChange}
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="age">
                                            Gender
                                        </label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={editedCastingCall.gender}
                                            onChange={handleChange}
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
                                            <input type="date" id="date" name="date" value={editedCastingCall.date || ''} onChange={handleChange}
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>
                                    </div>
                                    <div className="p-2 w-full">
                                        <label className="block text-gray-700 text-sm font-bold " htmlFor="age">
                                            Genre
                                        </label>
                                        <select
                                            id="genre"
                                            name="genre"
                                            value={editedCastingCall.genre}
                                            onChange={handleChange}
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
                                    {/* You can reuse the form fields from DirectorCreateCastingCall */}
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={handleUpdateCastingCall}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isDeleteModalOpen && selectedCastingCallToDelete && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                            &#8203;
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <p className="text-lg text-gray-700 mb-4">Are you sure you want to delete this casting call?</p>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleCancelDelete}
                                            type="button"
                                            className="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmDelete}
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-red-500 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isRecoverModalOpen && selectedCastingCallToRecover && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                            &#8203;
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <p className="text-lg text-gray-700 mb-4">Are you sure you want to recover this casting call?</p>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleCancelRecover}
                                            type="button"
                                            className="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmRecover}
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-indigo-500 shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Recover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>)}
        </>
    )
}

export default DirectorCastingCalls
