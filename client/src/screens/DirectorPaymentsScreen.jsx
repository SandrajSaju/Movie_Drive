import React from 'react'
import DirectorHeader from '../components/DirectorHeader'
import DirectorSidebar from '../components/DirectorSidebar'
import DirectorPayments from '../components/DirectorPayments'

const DirectorPaymentsScreen = () => {
  return (
    <>
      <DirectorHeader />
      <div className='flex flex-row'>
      <DirectorSidebar />
      <DirectorPayments />
      </div>
    </>
  )
}

export default DirectorPaymentsScreen
