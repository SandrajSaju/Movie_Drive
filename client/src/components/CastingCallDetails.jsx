import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actorDetailedCastingCall } from '../feature/CastingCalls/castingCallsSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../app/axiosInstance';

const CastingCallDetails = () => {
    const dispatch = useDispatch();
    const castingCall = useSelector(state => state.castingCalls.castingCalls);
    const actor = useSelector((state) => state.actorAuth.actorInfo)
    const { id } = useParams();
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        const fetchCastingCallDetails = async () => {
            try {
                dispatch(actorDetailedCastingCall(id));
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchCastingCallDetails();
    }, [dispatch, id]);

    const handleApplyCastingCall = async (id) => {
        try {
            await axiosInstance.post(`/actor/applycastingcall/${id}`, null, {
                headers:{
                    "Authorization": localStorage.getItem("actorToken")
                }
            });
            dispatch(actorDetailedCastingCall(id))
        } catch (error) {
            toast.error(error.response.data.error)
        }
    }

    return (
        <>
            <section className="text-gray-600 body-font w-4/5 max-md:w-3/5 ml-96 mt-16">
                <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
                        <img className="object-cover object-center rounded" alt="hero" src={castingCall.image} />
                    </div>
                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                        <h1 className="title-font sm:text-4xl text-3xl mb-12 font-bold text-gray-900">{castingCall.castingCallTitle}
                            <br className="hidden lg:inline-block font-lg" />
                        </h1>
                        <h2 className='title-font sm:text-2xl text-xl mb-4 font-mono font-bold text-gray-900'>Role - {castingCall.castingCallTitle} </h2>
                        <h2 className='title-font sm:text-2xl text-xl mb-4 font-mono font-bold text-gray-900'>Director - {castingCall?.director?.name} </h2>
                        <p className="mb-4 leading-relaxed text-gray-900 font-mono font-bold">Genre - {castingCall.genre}</p>
                        <p className="mb-4 leading-relaxed text-gray-900 font-mono font-bold">Project Description - {castingCall.projectDescription}</p>
                        <p className="mb-4 leading-relaxed text-gray-900 font-mono font-bold">Compensation - {castingCall.compensation}</p>
                        <p className="mb-4 leading-relaxed text-gray-900 font-mono font-bold">Gender - {castingCall.gender}</p>
                        <p className="mb-4 leading-relaxed text-gray-900 font-mono font-bold">Audition Date - {formatDate(castingCall.auditionDate)}</p>
                        <div className="flex justify-center mt-5">
                            {
                                castingCall.appliedActors && !castingCall.appliedActors.includes(actor._id) ? (
                                    <button onClick={() => { handleApplyCastingCall(castingCall._id) }} className="inline-flex text-white bg-slate-500 border-0 py-2 px-6 focus:outline-none hover:bg-slate-700 rounded text-lg">Apply Now</button>

                                ) : (
                                    <>
                                    <div className="inline-flex text-gray-700 bg-green-400 border-0 py-2 px-6 rounded text-lg font-bold w-96 text-center">Applied</div>
                                    </>
                                )
                            }

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CastingCallDetails