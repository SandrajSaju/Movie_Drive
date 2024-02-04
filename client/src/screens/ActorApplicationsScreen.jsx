import React from 'react'
import ActorApplications from '../components/ActorApplications'
import ActorSidebar from '../components/ActorSidebar'
import ActorHeader from '../components/ActorHeader'

const ActorApplicationsScreen = () => {
  return (
    <>
      <ActorHeader />
      <div className='flex flex-row'>
      <ActorSidebar />
      <ActorApplications />
      </div>
    </>
  )
}

export default ActorApplicationsScreen
