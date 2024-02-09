import React, { useEffect, useState } from 'react';
import DirectorHeader from "../components/DirectorHeader"
import DirectorSidebar from "../components/DirectorSidebar"
import DirectorChatSidebar from '../components/DirectorChatSidebar';
import DirectorChatWindow from '../components/DirectorChatWindow';
import axiosInstance from '../app/axiosInstance';
import {io} from 'socket.io-client';
import { useSelector } from 'react-redux';

const DirectorChatScreen = () => {
  const [messages, setMessages] = useState([])
  const [id, setId] = useState("")
  const [actorId, setActorId] = useState("")
  const [members,setMembers] = useState([])

  const {directorInfo} = useSelector((state)=>state.directorAuth);
  const directorId = directorInfo && directorInfo._id
  
  const [socket,setSocket] = useState("");
  const [onlineUsers,setOnlineUsers] = useState("")

  const findParticularChat = async (actorId, directorId) => {
    try {
      const { data } = await axiosInstance.get(`/chat/find/${actorId}/${directorId}`);
      if (data) {
        const chatId = data._id;
        setId(chatId)
        setActorId(actorId)
        setMembers(data.members)
        const res = await axiosInstance.get(`/chat/director/message/${chatId}`);
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
    const newSocket =  io("https://moviedrive.onrender.com");
    newSocket.on("connect",()=>{
      setSocket(newSocket);
      newSocket.emit("new-user-add",directorId);
      newSocket.on('get-users',(users) => {
        setOnlineUsers(users)
      })
    })
    return ()=>{
      newSocket.disconnect();
    }
  },[directorId])

  return (
    <>
      <DirectorHeader />
      <div className='flex flex-row justify-between'>
        <DirectorSidebar />
        <DirectorChatSidebar findParticularChat={findParticularChat} />
        <DirectorChatWindow messages={messages} id={id} findParticularChat={findParticularChat} actorId={actorId} directorSocket={socket} members={members} setMessages={setMessages} />
      </div>
    </>
  )
}

export default DirectorChatScreen
