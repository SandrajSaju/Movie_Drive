import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../app/axiosInstance';
import { useNavigate } from 'react-router-dom';

const DirectorPayments = () => {
    const navigate = useNavigate();
    const [payments,setPayments] = useState([]);
    const getPayments = async () => {
        try {
            const { data } = await axiosInstance.get(`/director/getallpayments`, {
                headers: {
                    "Authorization": localStorage.getItem("directorToken")
                }
            });
            setPayments(data)
        } catch (error) {
            console.log(error);
            navigate(`/director/404error`)
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
                            <th className="py-2 px-4 border-b text-lg">Name (Actor)</th>
                            <th className="py-2 px-4 border-b text-lg">Role</th>
                            <th className="py-2 px-4 border-b text-lg">Amount Paid</th>
                            <th className="py-2 px-4 border-b text-lg">Date of Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments && payments?.map((payment) => (

                            <tr key={payment._id}>
                                <td className="py-2 px-4 border-b text-center font-medium">{payment.audition.castingCall.castingCallTitle}</td>
                                <td className="py-2 px-4 border-b text-center font-medium">{payment.actor.name}</td>
                                <td className="py-2 px-4 border-b text-center font-medium">{payment.audition.castingCall.roleDescription}</td>
                                <td className="py-2 px-4 border-b text-center font-bold text-red-500">₹ {payment.actorCompensation}</td>
                                <td className="py-2 px-4 border-b text-center font-medium">{new Date(payment.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    </>
  )
}

export default DirectorPayments
