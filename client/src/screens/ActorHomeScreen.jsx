import React, { Suspense } from 'react'
import ActorHeader from '../components/ActorHeader'
import ActorSidebar from '../components/ActorSidebar'
import Loader from '../components/Loader';
// import ActorCastingCalls from '../components/ActorCastingCalls'
const LazyActorCastingCalls = React.lazy(() => import('../components/ActorCastingCalls'));

function ActorHomeScreen() {
  return (
    <>
      <ActorHeader />
      <div className='flex flex-row space-between'>
        <ActorSidebar />
        <Suspense fallback={
          <section className="text-gray-600 body-font w-4/5 max-md:w-3/5 ml-80 max-md:ml-64 px-10">
            <div className="container px-5 py-24 mx-auto pl-6">
              <div className="flex flex-col text-center w-full mb-8 mt-5">
                <h1 className="text-2xl font-bold title-font mb-4 text-gray-900 tracking-wider">CASTING CALLS</h1>
              </div>
              <Loader />
            </div>
          </section>
        }>
          <LazyActorCastingCalls />
        </Suspense>
      </div>
    </>
  )
}

export default ActorHomeScreen
