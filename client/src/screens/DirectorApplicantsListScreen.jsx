import React from 'react'
import DirectorHeader from '../components/DirectorHeader'
import DirectorSidebar from '../components/DirectorSidebar'
import DirectorApplicantsList from '../components/DirectorApplicantsList'

const DirectorApplicantsListScreen = () => {
  return (
    <>
      <DirectorHeader />
      <div className='flex flex-row'>
      <DirectorSidebar />
      <DirectorApplicantsList />
      </div>
    </>
  )
}

export default DirectorApplicantsListScreen
