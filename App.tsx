import React, { useState } from 'react';
import { AppMode, ProficiencyLevel, UserState } from './types';
import { Navigation } from './components/Navigation';
import { Onboarding } from './views/Onboarding';
import { Flashcards } from './views/Flashcards';
import { Conversation } from './views/Conversation';
import { Game } from './views/Game';
import { PurpleCat } from './components/PurpleCat';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.ONBOARDING);
  const [userState, setUserState] = useState<UserState>({
    name: 'Seraphim',
    level: ProficiencyLevel.BEGINNER,
    points: 0,
    streak: 1,
    unlockedItems: []
  });

  const handleLevelSet = (level: ProficiencyLevel) => {
    setUserState(prev => ({ ...prev, level }));
    setMode(AppMode.DASHBOARD);
  };

  const addPoints = (amount: number) => {
    setUserState(prev => ({ ...prev, points: prev.points + amount }));
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.ONBOARDING:
        return <Onboarding onComplete={handleLevelSet} />;
      case AppMode.FLASHCARDS:
        return <Flashcards level={userState.level} addPoints={addPoints} />;
      case AppMode.CONVERSATION:
        return <Conversation level={userState.level} />;
      case AppMode.GAME:
        return <Game level={userState.level} addPoints={addPoints} />;
      case AppMode.DASHBOARD:
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen pb-24 px-6 text-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg border border-purple-100 mb-6">
               <div className="flex justify-between items-center mb-4">
                 <div className="text-left">
                   <h1 className="text-2xl font-bold text-gray-800">Hi, {userState.name}!</h1>
                   <p className="text-purple-500">Level: {userState.level}</p>
                 </div>
                 <div className="bg-amber-100 text-amber-600 px-4 py-2 rounded-full font-bold shadow-sm">
                   ⭐ {userState.points}
                 </div>
               </div>
               
               <div className="relative w-40 h-40 mx-auto my-6">
                 <PurpleCat emotion="happy" />
               </div>
               
               <p className="text-gray-600 mb-4">Luna is ready to learn with you! What do you want to do?</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
               <button 
                onClick={() => setMode(AppMode.FLASHCARDS)}
                className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-2xl shadow-md transition-transform active:scale-95"
               >
                 <div className="text-3xl mb-2">🎴</div>
                 <div className="font-bold">Learn</div>
               </button>
               <button 
                onClick={() => setMode(AppMode.GAME)}
                className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-2xl shadow-md transition-transform active:scale-95"
               >
                 <div className="text-3xl mb-2">🎮</div>
                 <div className="font-bold">Play</div>
               </button>
               <button 
                onClick={() => setMode(AppMode.CONVERSATION)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-2xl shadow-md transition-transform active:scale-95 col-span-2"
               >
                 <div className="text-3xl mb-2">💬</div>
                 <div className="font-bold">Chat with Luna</div>
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 text-gray-800 font-sans selection:bg-purple-200">
      <main className="h-screen overflow-hidden">
        <div className="h-full overflow-auto scroll-smooth">
            {renderContent()}
        </div>
      </main>
      <Navigation currentMode={mode} setMode={setMode} />
    </div>
  );
};

export default App;