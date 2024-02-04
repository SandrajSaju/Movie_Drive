import React from 'react';

const ActorErrorScreen = () => {
    return (
        <>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <h1 className="text-9xl font-bold text-gray-700 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Oops! The page you are looking for does not exist.</p>
                    <p className="text-lg text-gray-600 mb-8">Return to <a href="/" className="text-blue-500 font-bold hover:underline">home</a>.</p>
                    <img src="https://example.com/your-404-image.jpg" alt="404 Illustration" className="max-w-full h-auto mx-auto" />
                </div>
            </div>
        </>
    )
}

export default ActorErrorScreen
