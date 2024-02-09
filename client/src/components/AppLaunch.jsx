import React,{useState} from 'react'
import AppFeatures from './AppFeatures';
import './styles/HeadingAnimation.css'

function AppLaunch() {
  return (
    <div className='mt-32 text-center font-bold'>
      <div className='bg-slate-300 py-3'>
      <h1 className='text-2xl'><span className='animate-left-to-right'>Welcome to <b className='text-red-500'>Movie - Drive</b></span></h1>
      </div>
      <AppFeatures />
    </div>
  )
}

export default AppLaunch
