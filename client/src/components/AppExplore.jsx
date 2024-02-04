import React from 'react'
import { Link } from 'react-router-dom'

function AppExplore() {
    return (
        <>
            <section className="text-gray-600 body-font mt-20 mx-20">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap -mx-4 -mb-10 text-center">
                        <div className="sm:w-1/2 mb-10 px-4">
                            <div className="rounded-lg h-80 overflow-hidden">
                                <img alt="content" className="object-cover object-center h-full w-full" src="https://malayalam.filmibeat.com/fanimg/artist/130/asif-ali-photos-images-1646.jpg" />
                            </div>
                            <h2 className="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">Are you an Actor?</h2>
                            <p className="leading-relaxed text-base">If you are an Actor and you wish to act in a movie,Get here!</p>
                            <Link to='/actor/login'><button className="flex mx-auto mt-6 text-white bg-slate-500 border-0 py-2 px-5 focus:outline-none hover:bg-slate-700 rounded">SignIn as Actor</button></Link>
                        </div>
                        <div className="sm:w-1/2 mb-10 px-4">
                            <div className="rounded-lg h-80 overflow-hidden">
                                <img alt="content" className="object-cover object-center h-full w-full" src="https://static.toiimg.com/thumb/msid-87833183,imgsize-51878,width-641,resizemode-4/87833183.jpg" />
                            </div>
                            <h2 className="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">Are you a Director?</h2>
                            <p className="leading-relaxed text-base">If you are a Director and you need to cast extreme talents actors,Come On!</p>
                            <Link to='/director/login'><button className="flex mx-auto mt-6 text-white bg-slate-500 border-0 py-2 px-5 focus:outline-none hover:bg-slate-700 rounded">SignIn as Director</button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AppExplore
