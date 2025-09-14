import React, { useState } from 'react';
import type { Outfit } from '../types';
import UploadIcon from './icons/UploadIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import CloseIcon from './icons/CloseIcon';

interface OutfitInputProps {
  onAddOutfit: (outfit: Omit<Outfit, 'id' | 'isLoading' | 'generatedImages' | 'error'>) => void;
  isProcessing: boolean;
}

const OutfitInput: React.FC<OutfitInputProps> = ({ onAddOutfit, isProcessing }) => {
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [photoMimeType, setPhotoMimeType] = useState<string | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [size, setSize] = useState('M');
  const [background, setBackground] = useState<'original' | 'white'>('original');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhoto(dataUrl);
        setPhotoMimeType(file.type);
        setPhotoPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setPhoto(undefined);
    setPhotoMimeType(undefined);
    setPhotoPreview(null);
    const fileInput = document.getElementById('outfit-photo-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !photo) {
      alert('Please provide an outfit description or upload a photo.');
      return;
    }
    onAddOutfit({ description, photo, photoMimeType, size, background });
    setDescription('');
    setPhoto(undefined);
    setPhotoMimeType(undefined);
    setPhotoPreview(null);
    const fileInput = document.getElementById('outfit-photo-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
    setSize('M');
    setBackground('original');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Generate a New Outfit</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Outfit Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., A blue denim jacket with a white t-shirt and black jeans."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isProcessing}
              ></textarea>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
                <select id="size" name="size" value={size} onChange={(e) => setSize(e.target.value)} disabled={isProcessing} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>XXL</option>
                </select>
              </div>
              <div>
                <label htmlFor="background" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Background</label>
                 <select id="background" name="background" value={background} onChange={(e) => setBackground(e.target.value as 'original' | 'white')} disabled={isProcessing} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option value="original">Keep Original</option>
                  <option value="white">Plain White</option>
                </select>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <label htmlFor="outfit-photo-upload" className="cursor-pointer w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-400">
              {photoPreview ? (
                <div className="relative w-full h-full">
                  <img src={photoPreview} alt="Outfit preview" className="w-full h-full object-contain" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700">
                    <CloseIcon className="h-4 w-4"/>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <UploadIcon className="mx-auto h-8 w-8" />
                  <span className="text-sm">Upload Image (Optional)</span>
                </div>
              )}
            </label>
            <input id="outfit-photo-upload" name="photo" type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isProcessing} />
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" disabled={isProcessing} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? <SpinnerIcon className="h-5 w-5 mr-2" /> : null}
            {isProcessing ? 'Generating...' : 'Generate Try-On'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OutfitInput;