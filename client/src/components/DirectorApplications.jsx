import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCastingCalls } from '../feature/CastingCalls/castingCallsSlice';
import { Link } from 'react-router-dom';

const DirectorApplications = () => {
    const dispatch = useDispatch()
    const castingCalls = useSelector((state) => state.castingCalls.castingCalls)

    useEffect(() => {
        dispatch(getCastingCalls())
    }, [])

    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden w-4/5 max-md:w-3/5 ml-96 mt-16">
                <div className="container px-5 py-24 mx-auto">
                    <div className="-my-8 divide-y-2 divide-gray-100">
                        <h1 className="text-3xl font-extrabold title-font mb-10 text-gray-900 tracking-wider text-center">Applications</h1>
                        {
                           castingCalls && castingCalls?.map(castingCall => (
                                <div className="py-8 flex flex-wrap md:flex-nowrap">
                                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                                        {/* <span className="font-semibold title-font text-gray-700">CASTING CALL</span> */}
                                        {/* <span className="mt-1 text-gray-500 text-sm">12 Jun 2019</span> */}
                                        <img alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src={castingCall.image} />
                                    </div>
                                    <div className="md:flex-grow">
                                        <h2 className="text-2xl font-bold text-gray-900 title-font mb-2">{castingCall.castingCallTitle}</h2>
                                        <p className="leading-relaxed">{castingCall.projectDescription}</p>
                                        <Link to={`/director/applications/${castingCall._id}`} className="text-indigo-900 inline-flex items-center mt-10 font-bold">View Applicants
                                            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"></path>
                                                <path d="M12 5l7 7-7 7"></path>
                                            </svg>
                                        </Link>
                                    </div>

                                    <div className="md:flex-grow">
                                        <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">{castingCall.roleDescription}</h2>
                                        <p className="leading-relaxed">{castingCall.gender}</p>
                                        <p className="leading-relaxed">Compensation - {castingCall.compensation}</p>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export default DirectorApplications
