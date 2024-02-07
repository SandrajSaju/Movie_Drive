import React,{useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';

const ActorVideoCall = () => {
    const {roomid} = useParams();
    const {actorInfo} = useSelector((state) => state.actorAuth);
    const navigate = useNavigate();
    const myMeeting = async (element) => {
        const appID = 1319514999;
        const serverSecret = "0c006670def0af8f329e7b36345132d6";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomid, Date.now().toString(), actorInfo.name);
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom({
            container:element,
            sharedLinks:[
                {
                    name:"Copy Link",
                    url:`http://localhost:3000/audition/${roomid}`
                }
            ],
            scenario:{
                mode: ZegoUIKitPrebuilt.OneONoneCall
            },
            showScreenSharingButton:true
        });
    }

    useEffect(()=>{
        const temp=roomid.split('-')
        if(temp[1]!=actorInfo._id){
            navigate(`/actor/404error`);
        }
      },[])

  return (
    <>
      <h1 className='text-center font-bold text-2xl tracking-wider mt-5'>Actor's Audition Room</h1>
      <div ref={myMeeting} className='mt-5'/>
    </>
  )
}

export default ActorVideoCall
