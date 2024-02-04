import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ActorHeader() {
    const {actorInfo} = useSelector(state=>state.actorAuth)
    const to = actorInfo?'/actor/home':'/explore'
    return (
        <>
        <header className="fixed z-50 w-full text-white body-font bg-slate-500 top-0">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <div className="flex title-font items-center text-gray-900 mb-4 md:mb-0">
                <img className='md:ml-9 h-10 w-10' src={process.env.PUBLIC_URL + '/movie-drive logo.png'} alt="Logo" />
                    <span className="ml-2 text-xl text-white font-extrabold">MOVIE DRIVE</span>
                </div>
                <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                    <Link to={to} className="mr-5 hover:text-gray-900">Home</Link>
                    <Link to='/services' className="mr-5 hover:text-gray-900">Services</Link>
                    <Link to='/about' className="mr-5 hover:text-gray-900">About Us</Link>
                    <Link to='/contact' className="mr-5 hover:text-gray-900">Contact</Link>
                </nav>
                <Link to={to} className="inline-flex items-center bg-slate-500 border-0 py-2 px-3 focus:outline-none hover:bg-slate-700 rounded text-base mt-4 md:mt-0 mr-9">Explore
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </Link>
            </div>
        </header>
        </>
    )
}

export default ActorHeader
