import React, { useEffect, useState, useRef } from 'react';
import InputEmoji from 'react-input-emoji';
import { useSelector } from 'react-redux';
import axiosInstance from '../app/axiosInstance';

const DirectorChatWindow = ({ messages, setMessages, id, findParticularChat, actorId, directorSocket, members }) => {
    const chatContainerRef = useRef(null);
    const { directorInfo } = useSelector((state) => state.directorAuth);
    const [text, setText] = useState('');

    const [directorReceivedMessage, setDirectorReceivedMessage] = useState(null);
    const [directorSentMessage, setDirectorSentMessage] = useState(null);

    const addMessage = async (id) => {
        try {
            if (text.trim() === "") {
                return;
            }
            const senderId = directorInfo._id;
            console.log('Members:', members);
            console.log('SenderId:', senderId);
            const receiverId = members?.find((id) => id !== senderId);
            console.log('ReceiverId:', receiverId);
            const newMessage = {
                chatId: id,
                senderId,
                receiverId,
                text,
            };
            const { data } = await axiosInstance.post("/chat/message", newMessage);
            findParticularChat(actorId, senderId);
            setText("");
            setDirectorSentMessage(newMessage);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const handleDirectorReceiveMessage = (data) => {
          setDirectorReceivedMessage({...data,createdAt:new Date()});
        };
        directorSocket && directorSocket.on("receive-message", handleDirectorReceiveMessage);
        return () => {
          directorSocket && directorSocket.off("receive-message", handleDirectorReceiveMessage);
        };
      }, [directorSocket]);


      useEffect(() => {
        if (directorReceivedMessage !== null && directorReceivedMessage.chatId === id) {
          setMessages((prevMessages) => [...prevMessages, directorReceivedMessage]);
        }
      }, [directorReceivedMessage, id, setMessages]);
    
      useEffect(() => {
        if (directorSentMessage !== null) {
          directorSocket && directorSocket.emit("send-message", directorSentMessage);
          setDirectorSentMessage(null);
        }
      }, [directorSentMessage, directorSocket]);

      useEffect(() => {
        if(chatContainerRef.current){
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      },[messages]);

    return (
        <>
            <div className="text-gray-600 body-font w-4/6 mt-24 bg-green-300 rounded-lg mx-5" style={{ height: '83vh' }}>
                <div className="flex flex-col justify-between">
                    <div style={{ height: '75vh', overflowY: 'auto' }} ref={chatContainerRef}>
                        {messages &&
                            messages.map((message, index) => (
                                <div key={index} className={message.senderId === directorInfo?._id ? 'text-end m-3' : 'text-start m-3'}>
                                    <div className={message.senderId === directorInfo?._id ? 'bg-red-500 inline-block text-white rounded-lg p-2' : 'bg-slate-500 inline-block text-white rounded-lg p-2'}>
                                        {message.text}
                                        <div className="text-right text-xs text-white">{new Date(message.createdAt).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="flex flex-row justify-between">
                        <InputEmoji value={text} onChange={(value) => setText(value)} />
                        <button className="bg-slate-500 w-32 rounded-xl mr-3 font-extrabold text-white" onClick={() => addMessage(id)}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DirectorChatWindow
