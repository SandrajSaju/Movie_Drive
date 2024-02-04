import React from 'react'
import ActorHeader from '../components/ActorHeader'
import ActorSidebar from '../components/ActorSidebar'
import ActorCastingCalls from '../components/ActorCastingCalls'

function ActorHomeScreen() {
  return (
    <>
      <ActorHeader />
      <div className='flex flex-row space-between'>
      <ActorSidebar />
      <ActorCastingCalls />
      </div>
    </>
  )
}

export default ActorHomeScreen
