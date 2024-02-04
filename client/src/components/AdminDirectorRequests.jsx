import React, { useState } from 'react';
import axiosInstance from '../app/axiosInstance';
import AdminViewCertificates from './AdminViewCertificates';

const AdminDirectorRequests = ({ directors, fetchDirectorRequests }) => {
    const [selectedDirectorCertificates, setSelectedDirectorCertificates] = useState([]);
    const [isCertificatesModalOpen, setCertificatesModalOpen] = useState(false);

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedDirectorToApprove, setSelectedDirectorToApprove] = useState(null);
    const [selectedDirectorToReject, setSelectedDirectorToReject] = useState(null);

    const handleApproveClick = (director) => {
        setSelectedDirectorToApprove(director);
        setIsApproveModalOpen(true)
    }
    const handleRejectClick = (director) => {
        setSelectedDirectorToReject(director);
        setIsRejectModalOpen(true)
    }

    const handleViewCertificates = (certificates) => {
        setSelectedDirectorCertificates(certificates);
        setCertificatesModalOpen(true);
    };

    const handleCloseCertificatesModal = () => {
        setCertificatesModalOpen(false);
    };

    const handleApproveDirector = async (id) => {
        try {
            await axiosInstance.post(`/admin/approvedirector/${id}`,null,{
                headers: {
                    "Authorization": localStorage.getItem("adminToken")
                }
            });
            fetchDirectorRequests();
            setIsApproveModalOpen(false);
            setSelectedDirectorToApprove(null);
        } catch (error) {

        }
    }

    const handleRejectDirector = async (id) => {
        try {
            await axiosInstance.post(`/admin/rejectdirector/${id}`,null,{
                headers: {
                    "Authorization": localStorage.getItem("adminToken")
                }
            });
            fetchDirectorRequests();
            setIsRejectModalOpen(false);
            setSelectedDirectorToReject(null);
        } catch (error) {

        }
    }

    const handleCancelApprove = () => {
        setIsApproveModalOpen(false);
        setSelectedDirectorToApprove(null);
    }
    const handleCancelReject = () => {
        setIsRejectModalOpen(false);
        setSelectedDirectorToReject(null);
    }
    return (
        <>
            <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
                <h1 className='text-3xl font-bold title-font mb-10 text-gray-900 tracking-wider text-center'>Director Requests</h1>
                <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Image</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {directors.map((director) => (
                            <tr key={director._id}>
                                <td className="border-b"><img className='w-12 h-12 m-auto' src={director?.profile?.profileImage} alt='' /></td>
                                <td className="py-2 px-4 border-b text-center">{director.name}</td>
                                <td className="py-2 px-4 border-b text-center">{director.email}</td>
                                <td className="py-2 px-4 border-b text-center space-x-3">
                                    <button
                                        className={`ml-2 px-2 py-2 w-36 bg-gray-800 text-white hover:bg-blue-500 rounded-lg`}
                                        onClick={() => handleViewCertificates(director.certificates)}
                                    >
                                        View Certificates
                                    </button>

                                    <button
                                        className={`ml-2 px-4 py-2 w-24 text-white bg-green-600 hover:bg-green-800 rounded-lg`}
                                        onClick={() => handleApproveClick(director)}
                                    >Approve
                                    </button>
                                    <button
                                        className={`ml-2 px-4 py-2 w-24 text-white bg-red-600 hover:bg-red-800 rounded-lg`}
                                        onClick={() => handleRejectClick(director)}
                                    >Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isCertificatesModalOpen && (
                <AdminViewCertificates
                    certificates={selectedDirectorCertificates}
                    onClose={handleCloseCertificatesModal}
                />
            )}

            {isApproveModalOpen && selectedDirectorToApprove && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                        &#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <p className="text-lg text-gray-700 mb-4">Are you sure you want to approve {selectedDirectorToApprove.name} as a Director?</p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleCancelApprove}
                                        type="button"
                                        className="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleApproveDirector(selectedDirectorToApprove._id)}
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-green-800 shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 bg-green-600 hover:bg-green-800"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isRejectModalOpen && selectedDirectorToReject && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                        &#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <p className="text-lg text-gray-700 mb-4">Are you sure you want to reject {selectedDirectorToReject.name} 's Request?</p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleCancelReject}
                                        type="button"
                                        className="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleRejectDirector(selectedDirectorToReject._id)}
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-red-500 shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 bg-red-500 hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminDirectorRequests
