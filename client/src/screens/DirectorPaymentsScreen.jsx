import React,{Suspense} from 'react'
import DirectorHeader from '../components/DirectorHeader'
import DirectorSidebar from '../components/DirectorSidebar'
import Loader from '../components/Loader'
const DirectorPaymentsLazy = React.lazy(() => import('../components/DirectorPayments'))

const DirectorPaymentsScreen = () => {
  return (
    <>
      <DirectorHeader />
      <div className='flex flex-row'>
      <DirectorSidebar />
      <Suspense fallback={
        <>
          <div className="container mx-auto p-4 w-4/5 max-md:w-3/5 ml-80 mt-24">
              <h1 className='text-3xl font-bold title-font mb-6 text-gray-900 tracking-wider text-center'>Payment History</h1>
              <h1 className='text-2xl font-bold title-font mb-10 text-gray-900 tracking-wider text-center'></h1>
              <Loader />
          </div>
        </>
      }>
        <DirectorPaymentsLazy />
      </Suspense>
      </div>
    </>
  )
}

export default DirectorPaymentsScreen
