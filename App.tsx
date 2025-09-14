import React, { useState } from 'react';
import Header from './components/Header';
import UserProfileForm from './components/UserProfileForm';
import OutfitInput from './components/OutfitInput';
import OutfitCard from './components/OutfitCard';
import { ThemeProvider } from './contexts/ThemeContext';
import type { UserProfile, Outfit } from './types';
import { generateOutfitImage } from './services/geminiService';
import Welcome from './pages/Welcome';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'welcome' | 'main'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStart = () => {
    setAppState('main');
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleAddOutfit = async (newOutfitData: Omit<Outfit, 'id' | 'isLoading' | 'generatedImages' | 'error'>) => {
    if (!userProfile) {
      alert("Please save your profile before generating outfits.");
      return;
    }

    const newOutfit: Outfit = {
      ...newOutfitData,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      isLoading: true,
    };

    setOutfits(prev => [newOutfit, ...prev]);
    setIsProcessing(true);

    try {
      const generatedImages = await generateOutfitImage(userProfile, newOutfitData);
      setOutfits(prev =>
        prev.map(o =>
          o.id === newOutfit.id ? { ...o, isLoading: false, generatedImages } : o
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setOutfits(prev =>
        prev.map(o =>
          o.id === newOutfit.id ? { ...o, isLoading: false, error: errorMessage } : o
        )
      );
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleDeleteOutfit = (id: string) => {
      setOutfits(prev => prev.filter(o => o.id !== id));
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        {appState === 'welcome' ? (
          <Welcome onStart={handleStart} />
        ) : (
          <>
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 app-content-enter">
                {!userProfile ? (
                <UserProfileForm onProfileUpdate={handleProfileUpdate} isProcessing={isProcessing} />
                ) : (
                <>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Saved</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">You can now generate virtual try-on images.</p>
                        </div>
                        <button onClick={() => setUserProfile(null)} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Edit Profile
                        </button>
                    </div>
                    </div>

                    <OutfitInput onAddOutfit={handleAddOutfit} isProcessing={isProcessing} />
                    
                    {outfits.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Your Generated Outfits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {outfits.map(outfit => (
                            <OutfitCard key={outfit.id} outfit={outfit} onDelete={handleDeleteOutfit} />
                        ))}
                        </div>
                    </div>
                    )}
                </>
                )}
            </main>
            <Footer />
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
