import React, { useEffect, useState } from 'react'
import axiosInstance from '../app/axiosInstance'
import { useNavigate } from 'react-router-dom'

const ActorAuditions = () => {
  const [auditions, setAuditions] = useState([])
  const [value, setValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleJoinRoom = () => {
    navigate(`/audition/${value}`);
  }
  const handleOpenModal = () => {
    setIsModalOpen(true)
}
const handleCloseModal = () => {
    setIsModalOpen(false);
    setValue("")
}

  const fetchAllAuditions = async () => {
    try {
      const { data } = await axiosInstance.get('/actor/getscheduledauditions', {
        headers: {
          "Authorization": localStorage.getItem("actorToken")
        }
      });
      setAuditions(data.auditions)
    } catch (error) {
      navigate(`/actor/404error`);
    }
  }

  useEffect(() => {
    fetchAllAuditions()
  }, [])

  return (
    <>
      <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
        <h1 className='text-3xl font-bold title-font mb-6 text-gray-900 tracking-wider text-center'>Scheduled Auditions</h1>
        <h1 className='text-2xl font-bold title-font mb-10 text-gray-900 tracking-wider text-center'></h1>
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
          <thead>
            <tr>

              <th className="py-2 px-4 border-b">CastingCall</th>
              <th className="py-2 px-4 border-b">Director Name</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Audition Date</th>
              <th className="py-2 px-4 border-b">Audition Time</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auditions && auditions?.map((audition) => (

              <tr key={audition._id}>
                <td className="py-2 px-4 border-b text-center font-medium">{audition.castingCall.castingCallTitle}</td>
                <td className="py-2 px-4 border-b text-center font-medium">{audition?.castingCall?.director?.name}</td>
                <td className="py-2 px-4 border-b text-center font-medium">{audition.castingCall.roleDescription}</td>
                <td className="py-2 px-4 border-b text-center font-medium">{new Date(audition.castingCall.auditionDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b text-center font-medium">{audition.time}</td>


                <td className="py-2 px-4 border-b text-center space-x-3 w-96">

                  <button
                    className={`ml-2 px-4 py-2 w-24 text-white bg-green-600 hover:bg-green-800 rounded-lg`}
                  // onClick={() => handleStartChat(audition.castingCall.director._id,audition.actor._id)}
                  >Chat
                  </button>
                  <button
                    className={`ml-2 px-3 py-2 w-32 bg-gray-800 text-white hover:bg-gray-950 rounded-lg`}
                    onClick={handleOpenModal}
                  >
                    Join Audition
                  </button>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-10 bg-white p-8 max-w-md w-full max-h-screen overflow-y-auto rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">Join Room</h2>
              <input
                type="text"
                id="videoUpload"
                name="video"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder='Enter Room Code'
                className='w-full'
              />
              <div className='mt-5'>
                <button
                  className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  className="p-2 bg-slate-500 text-white w-32 h-10 hover:bg-slate-700 rounded-lg ml-24"
                  onClick={handleJoinRoom}
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ActorAuditions
