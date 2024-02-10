import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../app/axiosInstance';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Loader from './Loader';

const DirectorScheduledAuditions = () => {
    const navigate = useNavigate();
    const [auditions, setAuditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAudition, setSelectedAudition] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [actorId,setActorId] = useState(null)

    const handleOpenModal = (id) => {
        setActorId(id)
        setIsModalOpen(true)
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleOpenPaymentModal = (audition) => {
        setSelectedAudition(audition)
        setIsPaymentModalOpen(true)
    }
    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
    }

    const handleCreateRoom = useCallback(() => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let roomid = '';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            roomid += characters.charAt(randomIndex);
        }
        roomid=roomid+"-"+actorId

        navigate(`/directoraudition/${roomid}`)
    }, [navigate,actorId])

    const getAuditions = async () => {
        try {
            const { data } = await axiosInstance.get(`/director/getallauditions`, {
                headers: {
                    "Authorization": localStorage.getItem("directorToken")
                }
            });
            setAuditions(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            navigate(`/director/404error`)
        }
    }
    useEffect(() => {
        getAuditions()
    }, [auditions])

    const serverUrl = "http://localhost:4000"

    const createOrder = (data) => {
        // Order is created on the server and the order id is returned
        return fetch(`${serverUrl}/director/my-server/create-paypal-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // use the "body" param to optionally pass additional order information
            // like product skus and quantities
            body: JSON.stringify({
                product: {
                    directorId: selectedAudition.castingCall.director._id,
                    compensation: selectedAudition.castingCall.compensation,
                    actorId: selectedAudition.actor._id,
                    auditionId: selectedAudition._id
                },
            }),
        })
            .then((response) => response.json())
            .then((order) => order.id)
    };
    const onApprove = (data) => {
        // Order is captured on the server and the response is returned to the browser
        return fetch(`${serverUrl}/director/my-server/capture-paypal-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID,
                directorId: selectedAudition.castingCall.director._id,
                compensation: selectedAudition.castingCall.compensation,
                actorId: selectedAudition.actor._id,
                auditionId: selectedAudition._id
            })
        })
            .then((response) => {
                console.log("Payment successfull");
                setIsPaymentModalOpen(false);
                return response.json();
            }).then((data) => console.log(data))
    };

    return (
        <>
            {
                loading ? (
                    <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
                        <div className='mt-28'>
                            <Loader />
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
                        <h1 className='text-3xl font-bold title-font mb-6 text-gray-900 tracking-wider text-center'>Scheduled Auditions</h1>
                        <h1 className='text-2xl font-bold title-font mb-10 text-gray-900 tracking-wider text-center'></h1>
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Image</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">CastingCall</th>
                                    <th className="py-2 px-4 border-b">Role</th>
                                    <th className="py-2 px-4 border-b">Audition Date</th>
                                    <th className="py-2 px-4 border-b">Audition Time</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditions && auditions?.map((audition) => (

                                    <tr key={audition._id}>
                                        <td className="border-b"><img className='w-20 h-16 object-cover object-center m-auto px-1' src={audition.actor.profile.profileImage} alt='' /></td>
                                        <td className="py-2 px-4 border-b text-center font-medium">{audition.actor.name} </td>
                                        <td className="py-2 px-4 border-b text-center font-medium">{audition.castingCall.castingCallTitle}</td>
                                        <td className="py-2 px-4 border-b text-center font-medium">{audition.castingCall.roleDescription}</td>
                                        <td className="py-2 px-4 border-b text-center font-medium">{new Date(audition.castingCall.auditionDate).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b text-center font-medium">{audition.time}</td>


                                        <td className="py-2 px-4 border-b text-center space-x-3 w-96">
                                            {
                                                audition?.paid === false ? (
                                                    <>
                                                    <button
                                                className={`ml-2 px-2 py-2 w-32 text-white bg-yellow-600 hover:bg-yellow-800 rounded-lg`}
                                                onClick={() => handleOpenPaymentModal(audition)}
                                            >Select and Pay
                                            </button>
                                            <button
                                                className={`ml-2 px-2 py-2 w-32 bg-gray-800 text-white hover:bg-gray-950 rounded-lg`}
                                                onClick={()=>handleOpenModal(audition.actor._id)}
                                            >
                                                Start Audition
                                            </button>
                                                    </>
                                                ) : (
                                                    <><span className='text-green-500 font-bold'>Actor Selected</span></>
                                                )
                                            }

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {isPaymentModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
                                <div className="absolute inset-0 bg-black opacity-50"></div>
                                <div className="z-10 bg-white p-8 max-w-md w-full max-h-screen overflow-y-auto rounded-lg">
                                    <h2 className="text-2xl font-bold mb-4 text-center">Pay with Paypal</h2>
                                    <div className='mt-5'>
                                        <PayPalButtons
                                            createOrder={(data, actions) => createOrder(data, actions)}
                                            onApprove={(data, actions) => onApprove(data, actions)}
                                        />
                                        <button
                                            className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg ml-24"
                                            onClick={handleClosePaymentModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
                                <div className="absolute inset-0 bg-black opacity-50"></div>
                                <div className="z-10 bg-white p-8 max-w-md w-full max-h-screen overflow-y-auto rounded-lg">
                                    <h2 className="text-2xl font-bold mb-4 text-center">Create a Room</h2>
                                    <h3>A random generated room id and a link will be sent to actor's email.Are you sure want to create a room?</h3>
                                    <div className='mt-5'>
                                        <button
                                            className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg"
                                            onClick={handleCloseModal}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg ml-24"
                                            onClick={handleCreateRoom}
                                        >
                                            Create Room
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </>
    )
}

export default DirectorScheduledAuditions
