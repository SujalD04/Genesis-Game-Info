import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white animate__animated animate__fadeIn animate__delay-1s">
      {/* Animated Title */}
      <h1 className="text-6xl font-extrabold text-blue-300 animate__animated animate__fadeIn animate__delay-1s">
        404
      </h1>
      
      {/* Subtitle */}
      <h2 className="text-3xl text-blue-100 mt-4 animate__animated animate__fadeIn animate__delay-2s">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-lg text-blue-200 mt-6 max-w-xl text-center animate__animated animate__fadeIn animate__delay-3s">
        Sorry, the page you're looking for doesn't exist. Check the URL or go back to the homepage.
      </p>

      {/* Button to Redirect to Home */}
      <a
        href="/"
        className="mt-6 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transform hover:scale-105 transition-all animate__animated animate__fadeIn animate__delay-4s"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
