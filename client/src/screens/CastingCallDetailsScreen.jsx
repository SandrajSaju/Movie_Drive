import React from 'react'
import ActorHeader from '../components/ActorHeader'
import ActorSidebar from '../components/ActorSidebar'
import CastingCallDetails from '../components/CastingCallDetails'

const CastingCallDetailsScreen = () => {
  return (
    <>
      <ActorHeader />
      <div className='flex'>
      <ActorSidebar />
      <CastingCallDetails />
      </div>
    </>
  )
}

export default CastingCallDetailsScreen
