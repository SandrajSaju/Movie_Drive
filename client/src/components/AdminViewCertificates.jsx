import React from 'react'

const AdminViewCertificates = ({ certificates, onClose }) => {
    return (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                    &#8203;
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <p className="text-2xl text-gray-700 mb-4 font-bold">Director Certificates</p>

                            <div className="grid grid-cols-2 gap-4">
                                {certificates.map((certificate, index) => (
                                    <img
                                        key={index}
                                        src={certificate}
                                        alt={`Certificate ${index + 1}`}
                                        className="w-full h-48 object-cover rounded"
                                    />
                                ))}
                            </div>

                            <div className="flex justify-center mt-5">

                                <button
                                    onClick={onClose}
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-red-500 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminViewCertificates
