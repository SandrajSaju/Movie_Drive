import React from 'react';
import { useParams } from 'react-router-dom';
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';

const VideoCallRoom = () => {
    const {roomid} = useParams();

    const myMeeting = async (element) => {
        const appID = 1319514999;
        const serverSecret = "0c006670def0af8f329e7b36345132d6";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomid, Date.now().toString(), "Name");
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

  return (
    <>
      <h1 className='text-center font-bold text-2xl tracking-wider mt-5'>Video Call Audition Room</h1>
      <div ref={myMeeting} className='mt-5'/>
    </>
  )
}

export default VideoCallRoom
