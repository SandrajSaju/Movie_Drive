import React, { useEffect, useState } from 'react';
import axiosInstance from '../app/axiosInstance';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ActorChatSidebar = ({ findParticularChat }) => {
    const navigate = useNavigate();
    const { actorInfo } = useSelector((state) => state.actorAuth);
    const [directors, setDirectors] = useState([])
    const [selectedDirectorId, setSelectedDirectorId] = useState(null)

    const actorGetAllChats = async () => {
        try {
            const { data } = await axiosInstance.get(`/chat/actor/${actorInfo._id}`)
            if (data) {
                setDirectors(data.directors)
            }
        } catch (error) {
            navigate(`/actor/404error`)
            console.log(error.message);
        }
    }

    useEffect(() => {
        actorGetAllChats();
    }, [directors])

    const handleDirectorClick = (directorId) => {
        findParticularChat(directorId, actorInfo._id);
        setSelectedDirectorId(directorId);
    }

    return (
        <>
            <div className="text-gray-600 body-font w-1/6 max-md:w-1/6 max-md:mt-40 mt-24 bg-green-300 rounded-lg" style={{ marginLeft: "21.5rem", height: "83vh" }}>
                <div className='text-center rounded-xl m-2 h-12 px-2 py-2 font-extrabold text-2xl text-white bg-green-600'>
                    <h1>Chats</h1>
                </div>
                <hr />
                {
                    directors && directors.map(director => (
                        <div className={`text-center rounded-xl m-2 h-12 px-2 py-2 font-medium text-lg text-white cursor-pointer ${selectedDirectorId === director._id ? 'bg-slate-700' : 'bg-slate-500'}`} onClick={() => handleDirectorClick(director._id)}>
                            <h1>{director.name}</h1>
                        </div>
                    ))
                }

            </div>
        </>
    )
}

export default ActorChatSidebar
