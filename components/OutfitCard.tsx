import React, { useState } from 'react';
import { Outfit } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';
import ImageModal from './ImageModal';
import ExpandIcon from './icons/ExpandIcon';
import TrashIcon from './icons/TrashIcon';

interface OutfitCardProps {
  outfit: Outfit;
  onDelete: (id: string) => void;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  const openModal = (index: number) => {
    setModalInitialIndex(index);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
        <button
            onClick={() => onDelete(outfit.id)}
            className="absolute top-2 right-2 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors z-10"
            aria-label="Delete outfit"
          >
            <TrashIcon className="h-4 w-4" />
        </button>
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2"><strong>Size:</strong> {outfit.size} | <strong>Background:</strong> {outfit.background === 'white' ? 'White' : 'Original'}</p>
          <p className="text-gray-800 dark:text-gray-200 min-h-[40px]">{outfit.description || "Outfit from image"}</p>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {outfit.isLoading && (
            <div className="flex flex-col items-center justify-center h-48">
              <SpinnerIcon className="h-12 w-12 text-indigo-500" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Generating your try-on...</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This may take a moment.</p>
            </div>
          )}
          {outfit.error && (
            <div className="flex items-center justify-center h-48 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-center text-sm">{outfit.error}</p>
            </div>
          )}
          {outfit.generatedImages && outfit.generatedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {outfit.generatedImages.map((image, index) => (
                <div key={index} className="relative group cursor-pointer aspect-square" onClick={() => openModal(index)}>
                  <img src={image} alt={`Generated outfit view ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 rounded-md">
                        <ExpandIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && outfit.generatedImages && (
        <ImageModal 
          images={outfit.generatedImages}
          isOpen={isModalOpen}
          onClose={closeModal}
          initialIndex={modalInitialIndex}
        />
      )}
    </>
  );
};

export default OutfitCard;