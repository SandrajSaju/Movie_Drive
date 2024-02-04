import React, { useEffect, useState } from 'react';
import axiosInstance from '../app/axiosInstance';
import { useSelector } from 'react-redux';

const DirectorChatSidebar = ({ findParticularChat }) => {
    const { directorInfo } = useSelector((state) => state.directorAuth);
    const directorId = directorInfo._id
    const [actors, setActors] = useState([])

    const directorGetAllChats = async () => {
        try {
            const { data } = await axiosInstance.get(`/chat/director/${directorId}`)
            console.log("data", data)
            if (data) {
                setActors(data.actors)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        directorGetAllChats();
    }, [actors])

    return (
        <>
            <div className="text-gray-600 body-font w-1/6 max-md:w-1/6 max-md:mt-40 mt-24 bg-green-300 rounded-lg" style={{ marginLeft: "21.5rem", height: "83vh" }}>
                <div className='text-center rounded-xl m-2 h-12 px-2 py-2 font-extrabold text-2xl text-white bg-green-600'>
                    <h1>Chats</h1>
                </div>
                <hr />
                {
                    actors && actors.map(actor => (
                        <div className='text-center rounded-xl m-2 h-12 px-2 py-2 font-medium text-lg text-white bg-slate-500 cursor-pointer' onClick={() => findParticularChat(actor._id, directorInfo._id)}>
                            <h1>{actor.name}</h1>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default DirectorChatSidebar
