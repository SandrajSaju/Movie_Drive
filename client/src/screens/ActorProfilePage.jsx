import React from 'react'
import ActorHeader from '../components/ActorHeader'
import ActorSidebar from '../components/ActorSidebar'
import ActorProfile from '../components/ActorProfile'

const ActorProfilePage = () => {
  return (
    <>
      <ActorHeader />
      <div className='flex'>
      <ActorSidebar />
      <ActorProfile />
      </div>
    </>
  )
}

export default ActorProfilePage
