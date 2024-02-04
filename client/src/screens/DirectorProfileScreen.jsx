import React from 'react';
import DirectorHeader from '../components/DirectorHeader';
import DirectorSidebar from '../components/DirectorSidebar';
import DirectorProfile from '../components/DirectorProfile';

const DirectorProfileScreen = () => {
  return (
    <>
        <DirectorHeader />
        <div className='flex flex-row'>
            <DirectorSidebar />
            <DirectorProfile />
        </div>
    </>
  )
}

export default DirectorProfileScreen
