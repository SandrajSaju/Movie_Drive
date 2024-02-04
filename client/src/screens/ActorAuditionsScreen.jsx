import React from 'react'
import ActorAuditions from '../components/ActorAuditions';
import ActorHeader from '../components/ActorHeader';
import ActorSidebar from '../components/ActorSidebar';

const ActorAuditionsScreen = () => {
  return (
    <>
      <ActorHeader />
      <div className='flex flex-row'>
      <ActorSidebar />
      <ActorAuditions />
      </div>
    </>
  )
}

export default ActorAuditionsScreen
