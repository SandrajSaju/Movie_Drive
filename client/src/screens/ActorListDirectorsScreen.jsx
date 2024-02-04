import React from 'react'
import ActorHeader from '../components/ActorHeader'
import ActorSidebar from '../components/ActorSidebar'
import ActorListDirectors from '../components/ActorListDirectors'

const ActorListDirectorsScreen = () => {
  return (
    <>
      <ActorHeader />
      <div className='flex flex-row'>
      <ActorSidebar />
      <ActorListDirectors />
      </div>
    </>
  )
}

export default ActorListDirectorsScreen
