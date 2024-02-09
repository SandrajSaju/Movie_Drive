import React, { useEffect, useState, useRef } from 'react';
import InputEmoji from 'react-input-emoji';
import { useSelector } from 'react-redux';
import axiosInstance from '../app/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ActorChatWindow = ({ messages, setMessages, id, findParticularChat, actorId, actorSocket, members }) => {
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const { actorInfo } = useSelector((state) => state.actorAuth);
    const [text, setText] = useState('');

    const [actorReceivedMessage, setActorReceivedMessage] = useState(null);
    const [actorSentMessage, setActorSentMessage] = useState(null);

    const addMessage = async (id) => {
        try {
            if (text.trim() === "") {
                return;
            }
            const senderId = actorInfo._id;
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
            setActorSentMessage(newMessage);
        } catch (error) {
            navigate(`/actor/404error`)
            console.error(error.message);
        }
    };
    
    useEffect(() => {
        const handleActorReceiveMessage = (data) => {
          setActorReceivedMessage({...data,createdAt:new Date()});
        };
        actorSocket && actorSocket.on("receive-message", handleActorReceiveMessage);
        return () => {
            actorSocket && actorSocket.off("receive-message", handleActorReceiveMessage);
        };
      }, [actorSocket]);

      useEffect(() => {
        if (actorReceivedMessage !== null && actorReceivedMessage.chatId === id) {
          setMessages((prevMessages) => [...prevMessages, actorReceivedMessage]);
        }
      }, [actorReceivedMessage, id, setMessages]);

      useEffect(() => {
        if (actorSentMessage !== null) {
          actorSocket && actorSocket.emit("send-message", actorSentMessage);
          setActorSentMessage(null);
        }
      }, [actorSentMessage, actorSocket]);

    //   useEffect(() => {
    //     // Scroll to the bottom when messages change
    //     if (chatContainerRef.current) {
    //         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    //     }
    // }, [messages]);

    return (
        <>
            <div className="text-gray-600 body-font w-4/6 mt-24 bg-green-300 rounded-lg mx-5" style={{ height: '83vh' }}>
                <div className="flex flex-col justify-between">
                    {id? (
                        <>
                    <div style={{ height: '75vh', overflowY: 'auto' }} ref={chatContainerRef}>
                        {messages &&
                            messages.map((message, index) => (
                                <div key={index} className={message.senderId === actorInfo?._id ? 'text-end m-3' : 'text-start m-3'}>
                                    <div className={message.senderId === actorInfo?._id ? 'bg-red-500 inline-block text-white rounded-lg p-2' : 'bg-slate-500 inline-block text-white rounded-lg p-2'}>
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
                    </>
                    ) : (
                        <div className="text-center mt-10 text-lg text-gray-900 body-font">
                            Click on a director to view the chat.
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ActorChatWindow
