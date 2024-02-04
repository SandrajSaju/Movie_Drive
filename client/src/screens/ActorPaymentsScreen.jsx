import React from 'react'
import ActorPayments from '../components/ActorPayments'
import ActorSidebar from '../components/ActorSidebar'
import ActorHeader from '../components/ActorHeader'

const ActorPaymentsScreen = () => {
  return (
    <>
      <ActorHeader />
      <div className='flex flex-row'>
      <ActorSidebar />
      <ActorPayments />
      </div>
    </>
  )
}

export default ActorPaymentsScreen
