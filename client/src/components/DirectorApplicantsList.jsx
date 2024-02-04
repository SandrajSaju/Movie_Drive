import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../app/axiosInstance';
import { useDispatch } from 'react-redux';
import { getActorDetails } from '../feature/Director/directorActorSlice';
import { toast } from 'react-toastify';

const DirectorApplicantsList = () => {
    const [applications, setApplications] = useState([])
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getApplicants = async () => {
        try {
            const { data } = await axiosInstance.get(`/director/getapplicants/${id}`,{
                headers: {
                    "Authorization": localStorage.getItem("directorToken")
                }
            });
            setApplications(data)
        } catch (error) {
            console.log(error);
            navigate(`/director/404error`)
        }
    }

    useEffect(() => {
        getApplicants()
    }, [])

    const handleFetchActorDetails = (actorId) => {
        dispatch(getActorDetails(actorId));
        navigate('/director/getactordetails')
    }

    const handleApproveActor = async (application) => {
        setSelectedApplication(application);
        openModal();
    }

    const handleConfirmAudition = async () => {
        try {
            closeModal();
            await axiosInstance.post(`/director/approveactor/${selectedApplication._id}`, { selectedTime },{
                headers: {
                    "Authorization": localStorage.getItem("directorToken")
                }
            });
            setSelectedApplication(null);
            setSelectedTime(null);
            getApplicants();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    }

    const handleRejectActor = async (applicationId) => {
        try {
            await axiosInstance.post(`/director/rejectactor/${applicationId}`,null,{
                headers: {
                    "Authorization": localStorage.getItem("directorToken")
                }
            });
            getApplicants()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
                <h1 className='text-3xl font-bold title-font mb-6 text-gray-900 tracking-wider text-center'>Applied Actors</h1>
                <h1 className='text-2xl font-bold title-font mb-10 text-gray-900 tracking-wider text-center'>{applications[0]?.castingCall?.castingCallTitle}</h1>
                <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Image</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications && applications?.map((application) => (
                            <tr key={application._id}>
                                <td className="border-b"><img className='w-20 h-16 object-cover object-center m-auto' src={application.actor.profile.profileImage} alt='' /></td>
                                <td className="py-2 px-4 border-b text-center">{application.actor.name}</td>
                                <td className="py-2 px-4 border-b text-center">{application.status}</td>
                                <td className="py-2 px-4 border-b text-center space-x-3">

                                    <button
                                        className={`ml-2 px-4 py-2 w-32 bg-slate-500 text-white hover:bg-slate-700`}
                                        onClick={() => handleFetchActorDetails(application.actor._id)}
                                    >View Profile
                                    </button>
                                    {application?.status === "Pending" ? (
                                        <>
                                            <button
                                                className={`ml-2 px-4 py-2 w-24 text-white bg-green-600 hover:bg-green-800`}
                                                onClick={() => handleApproveActor(application)}
                                            >Approve
                                            </button>
                                            <button
                                                className={`ml-2 px-2 py-2 w-24 bg-red-500 text-white hover:bg-red-700`}
                                                onClick={() => handleRejectActor(application._id)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : ("")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedApplication && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                        &#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h2 className="text-lg text-gray-900 font-bold mb-4">Select Audition Time</h2>
                                    <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
                                    <div  className="flex justify-end">
                                    <button className="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={closeModal}>Cancel</button>
                                    <button onClick={handleConfirmAudition} className="inline-flex justify-center rounded-md border border-green-500 shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Confirm</button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default DirectorApplicantsList
