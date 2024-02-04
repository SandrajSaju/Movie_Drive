import React from 'react'
import DirectorHeader from '../components/DirectorHeader'
import DirectorSidebar from '../components/DirectorSidebar'
import ApplicantDetails from '../components/ApplicantDetails'

const ApplicantDetailsScreen = () => {
  return (
    <>
      <DirectorHeader />
        <div className='flex flex-row'>
            <DirectorSidebar />
            <ApplicantDetails />
        </div>
    </>
  )
}

export default ApplicantDetailsScreen
