import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:p-8">
        <div className="flex justify-center items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made by{' '}
            <a
              href="https://github.com/BenazizaAbdelkaderRiyadh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Benaziza Abdelkader Riyadh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
