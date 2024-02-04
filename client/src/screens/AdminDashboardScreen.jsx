import React from 'react'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'
import AdminDashboard from '../components/AdminDashboard'

const AdminDashboardScreen = () => {
  return (
    <>
      <AdminHeader />
      <div className='flex flex-row'>
      <AdminSidebar />
      <AdminDashboard />
      </div>
    </>
  )
}

export default AdminDashboardScreen
