import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const Public = ({ role }) => {
  const { actorInfo, directorInfo, adminEmail } = useSelector((state) => ({
    actorInfo: state.actorAuth.actorInfo,
    directorInfo: state.directorAuth.directorInfo,
    adminEmail: state.adminAuth.adminEmail,
  }));

  const isAuthenticated =
    role === 'actor' ? !!actorInfo : role === 'director' ? !!directorInfo : !!adminEmail;

  const redirectPath =
    role === 'actor' ? '/actor/home' : role === 'director' ? '/director/home' : '/admin/getallactors';

  return (
    <>
      {isAuthenticated ? <Navigate to={redirectPath} /> : <Outlet />}
    </>
  );
};

export default Public;
