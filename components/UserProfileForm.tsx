import React, { useState } from 'react';
import { UserProfile } from '../types';
import UploadIcon from './icons/UploadIcon';

interface UserProfileFormProps {
  onProfileUpdate: (profile: UserProfile) => void;
  isProcessing: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onProfileUpdate, isProcessing }) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: valueAsNumber(value) }));
  };
  
  const valueAsNumber = (value: string) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setProfile(prev => ({ ...prev, photo: dataUrl, photoMimeType: file.type }));
        setPhotoPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.photo && profile.photoMimeType && profile.age && profile.height && profile.weight) {
      onProfileUpdate(profile as UserProfile);
    } else {
      alert('Please fill out all fields and upload a photo.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Profile</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Provide your details and a full-body photo. This information will be used to generate your try-on images.</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 overflow-hidden mb-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <UploadIcon className="mx-auto h-12 w-12" />
                    <span className="text-sm">Upload Photo</span>
                  </div>
                )}
              </div>
            </label>
            <input id="photo-upload" name="photo" type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isProcessing} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Full body photo recommended</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
              <input type="number" name="age" id="age" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3" onChange={handleInputChange} disabled={isProcessing} required />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
              <input type="number" name="height" id="height" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3" onChange={handleInputChange} disabled={isProcessing} required />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
              <input type="number" name="weight" id="weight" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base p-3" onChange={handleInputChange} disabled={isProcessing} required />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <button type="submit" disabled={isProcessing} className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;