import React,{useState} from 'react';
import axiosInstance from '../app/axiosInstance';

const AdminListDirectors = ({ directors, fetchDirectors }) => {
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
    const [selectedDirectorToBlock, setSelectedDirectorToBlock] = useState(null);
    const [selectedDirectorToUnblock, setSelectedDirectorToUnblock] = useState(null);

    const handleBlockClick = (director) => {
        setSelectedDirectorToBlock(director);
        setIsBlockModalOpen(true)
    }
    const handleUnblockClick = (director) => {
        setSelectedDirectorToUnblock(director);
        setIsUnblockModalOpen(true)
    }

    const handleBlockDirector = async (id) => {
        try {
            await axiosInstance.post(`/admin/blockdirector/${id}`,null,{
                headers: {
                    "Authorization": localStorage.getItem("adminToken")
                }
            });
            fetchDirectors();
            setIsBlockModalOpen(false);
            setSelectedDirectorToBlock(null)
        } catch (error) {

        }
    }

    const handleUnblockDirector = async (id) => {
        try {
            await axiosInstance.post(`/admin/unblockdirector/${id}`,null,{
                headers: {
                    "Authorization": localStorage.getItem("adminToken")
                }
            });
            fetchDirectors();
            setIsUnblockModalOpen(false);
            setSelectedDirectorToUnblock(null);
        } catch (error) {

        }
    }

    const handleCancelBlock = () => {
        setIsBlockModalOpen(false);
        setSelectedDirectorToBlock(null);
    }
    const handleCancelUnblock = () => {
        setIsUnblockModalOpen(false);
        setSelectedDirectorToUnblock(null);
    }

    return (
        <>
            <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
                <h1 className='text-3xl font-bold title-font mb-10 text-gray-900 tracking-wider text-center'>Directors' Details</h1>
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

                                    {director.isBlocked ? (
                                        <button
                                            className={`ml-2 px-4 py-2 w-24 text-white bg-green-600 hover:bg-green-800 rounded-lg`}
                                            onClick={() => handleUnblockClick(director)}
                                        >Unblock
                                        </button>
                                    ) : (
                                        <button
                                            className={`ml-2 px-4 py-2 w-24 text-white bg-red-600 hover:bg-red-800 rounded-lg`}
                                            onClick={() => handleBlockClick(director)}
                                        >Block
                                        </button>
                                    )}
                                    <button
                                        className={`ml-2 px-2 py-2 w-28 bg-gray-800 text-white hover:bg-blue-500 rounded-lg`}
                                    // onClick={() => handleBlockActor(actor._id)}
                                    >
                                        View Profile
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isBlockModalOpen && selectedDirectorToBlock && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                            &#8203;
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <p className="text-lg text-gray-700 mb-4">Are you sure you want to block {selectedDirectorToBlock.name}?</p>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleCancelBlock}
                                            type="button"
                                            className="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleBlockDirector(selectedDirectorToBlock._id)}
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-red-500 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Block
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isUnblockModalOpen && selectedDirectorToUnblock && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                            &#8203;
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <p className="text-lg text-gray-700 mb-4">Are you sure you want to unblock {selectedDirectorToUnblock.name}?</p>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleCancelUnblock}
                                            type="button"
                                            className="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleUnblockDirector(selectedDirectorToUnblock._id)}
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-green-800 shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 bg-green-600 hover:bg-green-800"
                                        >
                                            Unblock
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default AdminListDirectors
