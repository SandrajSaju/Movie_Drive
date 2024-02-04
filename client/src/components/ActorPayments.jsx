import React, { useEffect, useState } from 'react';
import axiosInstance from '../app/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ActorPayments = () => {
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();
    const getPayments = async () => {
        try {
            const { data } = await axiosInstance.get(`/actor/getallpayments`, {
                headers: {
                    "Authorization": localStorage.getItem("actorToken")
                }
            });
            setPayments(data)
        } catch (error) {
            navigate(`/actor/404error`)
            console.log(error);
        }
    }
    useEffect(() => {
        getPayments()
    }, [])
    return (
        <>
            <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
                <h1 className='text-3xl font-bold title-font mb-6 text-gray-900 tracking-wider text-center'>Payment History</h1>
                <h1 className='text-2xl font-bold title-font mb-10 text-gray-900 tracking-wider text-center'></h1>
                <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-lg">Casting Call</th>
                            <th className="py-2 px-4 border-b text-lg">Director Name</th>
                            <th className="py-2 px-4 border-b text-lg">Role</th>
                            <th className="py-2 px-4 border-b text-lg">Amount Received</th>
                            <th className="py-2 px-4 border-b text-lg">Date of Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments && payments?.map((payment) => (

                            <tr key={payment._id}>
                                <td className="py-2 px-4 border-b text-center font-medium">{payment.audition.castingCall.castingCallTitle}</td>
                                <td className="py-2 px-4 border-b text-center font-medium">{payment.director.name}</td>
                                <td className="py-2 px-4 border-b text-center font-medium">{payment.audition.castingCall.roleDescription}</td>
                                <td className="py-2 px-4 border-b text-center font-bold text-green-600">₹ {payment.audition.castingCall.compensation}</td>
                                <td className="py-2 px-4 border-b text-center font-medium">{new Date(payment.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ActorPayments
