import React,{useEffect, useState} from 'react'
import ActorHeader from '../components/ActorHeader'
import ActorSidebar from '../components/ActorSidebar'
import ActorChatSidebar from '../components/ActorChatSidebar'
import ActorChatWindow from '../components/ActorChatWindow'
import axiosInstance from '../app/axiosInstance'
import {io} from 'socket.io-client';
import { useSelector } from 'react-redux';

const ActorChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [members,setMembers] = useState([])
  const { actorInfo } = useSelector((state) => state.actorAuth);
  const actorId = actorInfo._id

  const [socket, setSocket] = useState("");
  const [onlineUsers, setOnlineUsers] = useState("")

  const findParticularChat = async (actorId, directorId) => {
    try {
      const { data } = await axiosInstance.get(`/chat/find/${actorId}/${directorId}`);
      if (data) {
        const chatId = data._id;
        setId(chatId)
        setDirectorId(actorId)
        setMembers(data.members)
        const res = await axiosInstance.get(`/chat/actor/message/${chatId}`);
        if (res) {
          setMessages(res.data)
        }
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(()=>{
    // const newSocket = io("http://localhost:8080");
    const newSocket = io("https://moviedrive.onrender.com");
    newSocket.on("connect",()=>{
      setSocket(newSocket);
      newSocket.emit("new-user-add",actorId);
      newSocket.on('get-users',(users) => {
        setOnlineUsers(users)
      })
    })
    return ()=>{
      newSocket.disconnect();
    }
  },[actorId])

  return (
    <>
      <ActorHeader />
      <div className='flex flex-row justify-between'>
        <ActorSidebar />
        <ActorChatSidebar findParticularChat={findParticularChat} />
        <ActorChatWindow messages={messages} id={id} findParticularChat={findParticularChat} actorId={directorId} actorSocket={socket} members={members}  setMessages={setMessages} />
      </div>
    </>
  )
}

export default ActorChatScreen
