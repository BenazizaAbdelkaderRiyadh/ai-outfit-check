import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4 welcome-enter">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 welcome-title">
        Welcome to Virtual Try-On AI
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 welcome-subtitle">
        See yourself in any outfit. Upload your photo, describe your style, and let our AI create your new look in seconds.
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transform hover:scale-105 transition-transform duration-300 welcome-button"
      >
        Get Started
      </button>
    </div>
  );
};

export default Welcome;