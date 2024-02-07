import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';

const VideoCallRoom = () => {
    const {roomid} = useParams();
    const director = useSelector((state) => state.directorAuth.directorInfo);
    const myMeeting = async (element) => {
      const appID = parseInt(process.env.REACT_APP_ZEGOCLOUD_APP_ID);
      const serverSecret = process.env.REACT_APP_ZEGOCLOUD_SERVER_SECRET;
        // const appID = 1319514999;
        // const serverSecret = "0c006670def0af8f329e7b36345132d6";
        console.log(appID,"....................",serverSecret);
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomid, Date.now().toString(), director.name);
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
      <h1 className='text-center font-bold text-2xl tracking-wider mt-5'>Director Audition Room</h1>
      <div ref={myMeeting} className='mt-5'/>
    </>
  )
}

export default VideoCallRoom
