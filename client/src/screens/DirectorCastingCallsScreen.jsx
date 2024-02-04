import React from 'react'
import DirectorHeader from '../components/DirectorHeader'
import DirectorSidebar from '../components/DirectorSidebar'
import DirectorCastingCalls from '../components/DirectorCastingCalls'

const DirectorCastingCallsScreen = () => {
  return (
    <>
      <DirectorHeader />
      <div className='flex'>
      <DirectorSidebar />
      <DirectorCastingCalls />
      </div>
      
    </>
  )
}

export default DirectorCastingCallsScreen
