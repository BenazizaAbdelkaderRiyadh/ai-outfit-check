import React, { useState, useEffect, useCallback } from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import CloseIcon from './icons/CloseIcon';
import DownloadIcon from './icons/DownloadIcon';

interface ImageModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, showPrev, showNext]);

  if (!isOpen) return null;

  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = images[currentIndex];
      link.download = `virtual-try-on-${currentIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-white dark:bg-gray-900 p-2 rounded-lg max-w-4xl w-full max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <div className="relative flex justify-center items-center">
          <img src={images[currentIndex]} alt={`Generated image ${currentIndex + 1}`} className="w-auto h-auto max-w-full max-h-[calc(95vh-60px)] object-contain" />
          
          <button onClick={onClose} className="absolute top-2 right-2 p-2 bg-black bg-opacity-40 text-white rounded-full hover:bg-opacity-60 transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
          
           <button onClick={handleDownload} className="absolute top-2 left-2 p-2 bg-black bg-opacity-40 text-white rounded-full hover:bg-opacity-60 transition-colors">
            <DownloadIcon className="h-6 w-6" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-40 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button onClick={showPrev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-40 text-white rounded-full hover:bg-opacity-60 transition-colors">
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
            <button onClick={showNext} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-40 text-white rounded-full hover:bg-opacity-60 transition-colors">
              <ChevronRightIcon className="h-8 w-8" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
