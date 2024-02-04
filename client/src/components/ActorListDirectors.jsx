import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getAllDirectors, getSearchedDirectors } from '../feature/Actor/actorDirectorSlice';
import Loader from './Loader';

const ActorListDirectors = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllDirectors())
    }, [dispatch])

    const handleSearch = (text) => {
        dispatch(getSearchedDirectors(text))
    }

    const { loading, directors } = useSelector((state) => state.actorDirectors)
    return (
        <>
            <section className="text-gray-600 p-5 body-font w-4/5 max-md:w-3/5 ml-80 max-md:mt-40 mt-24">
                <div>
                    <h1 className="text-2xl font-bold title-font mb-4 text-gray-900 tracking-wider text-center mt-7">ALL DIRECTORS</h1>
                    <div class="flex w-full md:justify-center justify-center items-center">
                        <div class="relative mr-4 md:w-full lg:w-full xl:w-1/2 w-2/4">
                            <input type="text" onChange={(e) => handleSearch(e.target.value)} placeholder='Search Director' id="hero-field" name="hero-field" className="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-purple-200 focus:bg-transparent focus:border-slate-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <button className="inline-flex text-white bg-slate-500 border-0 py-2 px-6 focus:outline-none hover:bg-slate-700 rounded text-lg">Search</button>
                    </div>
                </div>
                <div className="container px-5 py-24 mx-auto">
                    {
                        loading ? (
                            <Loader />
                        ) : (
                            <div className="flex flex-wrap -m-4">
                                {
                                    directors && directors?.map((director) => (
                                        <div className="lg:w-1/3 lg:mb-0 mb-6 p-4">
                                            <div className="h-full text-center">
                                                <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={director.profile.profileImage} />
                                                <p className="leading-relaxed"></p>
                                                <span className="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4"></span>
                                                <h2 className="text-gray-900 font-bold title-font tracking-wider text-md">{director.name}</h2>
                                                <p className="text-gray-500">{director.profile.bio}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }

                </div>
            </section>
        </>
    )
}

export default ActorListDirectors
