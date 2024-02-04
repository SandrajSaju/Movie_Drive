import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate,Outlet } from 'react-router-dom';

const ActorProtect = () => {

    const {actorInfo} = useSelector(state=>state.actorAuth)

  return (
    <>
      {
        actorInfo?<Outlet />:<Navigate to='/actor/login' />
      }
    </>
  )
}

export default ActorProtect
