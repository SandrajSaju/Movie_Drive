import React from 'react'
import { useSelector } from 'react-redux'

const ApplicantDetails = () => {
    const { actorDetails } = useSelector((state) => state.actorDetails)
    return (
        <>
            <section className="text-gray-900 body-font w-4/5 max-md:w-3/5 ml-80 max-md:mt-40 mt-16">
                <div className="container mx-auto flex px-5 py-12 items-center justify-center flex-col">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-extrabold text-gray-900">{actorDetails.name}</h1>
                    <img className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src={actorDetails?.profile?.profileImage} />
                    <div className="text-center lg:w-2/3 w-full">
                        <p className="mb-3 leading-relaxed text-xl font-bold">Email: {actorDetails?.email}</p>
                        <p className="mb-3 leading-relaxed text-xl font-bold">Phone No: {actorDetails?.phoneNumber}</p>
                        <p className="mb-3 leading-relaxed text-xl font-bold">Age: {actorDetails.profile?.age}</p>
                        <p className="leading-relaxed text-xl font-bold">Gender: {actorDetails.profile?.gender}</p>
                        <div className="flex justify-center">
                            {/* <button className="inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg">Button</button>
                                <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button> */}
                        </div>
                    </div>
                </div>
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-center text-gray-900">Profile Videos</h1>
                <div className="grid grid-cols-3 gap-8 mt-8 px-5">
                        {actorDetails?.profile?.profileVideos?.map((videoUrl, index) => (
                            <div key={index} className="relative">
                                <video
                                    className="w-full h-60 rounded-2xl object-cover"
                                    controls
                                >
                                    <source src={videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ))}
                    </div>
            </section>
        </>
    )
}

export default ApplicantDetails
