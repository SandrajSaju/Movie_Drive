import React from 'react'
import DirectorHeader from '../components/DirectorHeader'
import DirectorSidebar from '../components/DirectorSidebar'
import DirectorScheduledAuditions from '../components/DirectorScheduledAuditions'

const DirectorScheduledAuditionsScreen = () => {
  return (
    <>
      <DirectorHeader />
      <div className='flex flex-row'>
      <DirectorSidebar />
      <DirectorScheduledAuditions />
      </div>
    </>
  )
}

export default DirectorScheduledAuditionsScreen
