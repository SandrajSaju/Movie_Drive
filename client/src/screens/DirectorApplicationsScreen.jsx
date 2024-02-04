import React from 'react';
import DirectorHeader from '../components/DirectorHeader';
import DirectorSidebar from '../components/DirectorSidebar';
import DirectorApplications from '../components/DirectorApplications';


const DirectorApplicationsScreen = () => {
  return (
    <>
      <DirectorHeader />
      <div className='flex'>
      <DirectorSidebar />
      <DirectorApplications/>
      </div>
    </>
  )
}

export default DirectorApplicationsScreen
