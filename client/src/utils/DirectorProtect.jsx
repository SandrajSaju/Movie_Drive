import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate,Outlet } from 'react-router-dom';

const DirectorProtect = () => {
    const {directorInfo} = useSelector(state=>state.directorAuth)
  return (
    <>
      {
        directorInfo?<Outlet />:<Navigate to='/director/login' />
      }
    </>
  )
}

export default DirectorProtect
