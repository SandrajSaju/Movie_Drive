import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <>
      <header className="fixed z-50 w-full text-white body-font top-0 bg-gray-900">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <div className="flex title-font items-center text-gray-900 mb-4 md:mb-0">
                        <img className='md:ml-9 h-10 w-10' src={process.env.PUBLIC_URL + '/movie-drive admin new.jpg'} alt="Logo" />
                        <span className="ml-2 text-xl text-white font-extrabold">MOVIE DRIVE</span>
                    </div>
                    <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                        <Link to='/admin/getallactors' className="mr-5 hover:text-gray-900">Home</Link>
                        <Link to='/services' className="mr-5 hover:text-gray-900">Services</Link>
                        <Link to='/about' className="mr-5 hover:text-gray-900">About Us</Link>
                        <Link to='/contact' className="mr-5 hover:text-gray-900">Contact</Link>
                    </nav>
                </div>
            </header>
    </>
  )
}

export default AdminHeader
