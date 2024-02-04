import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


const AdminProtect = () => {

    const { adminEmail } = useSelector(state => state.adminAuth)

    return (
        <>
            {
                adminEmail ? <Outlet /> : <Navigate to='/admin/login' />
            }
        </>
    )
}

export default AdminProtect
