import React, { useState, useEffect } from 'react';
import { Flashcard, ProficiencyLevel } from '../types';
import { generateFlashcards } from '../services/geminiService';
import { Button } from '../components/Button';

interface FlashcardsProps {
  level: ProficiencyLevel;
  addPoints: (amount: number) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ level, addPoints }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCards = async () => {
    setLoading(true);
    const newCards = await generateFlashcards(level, "Animals and Colors");
    setCards(newCards);
    setLoading(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = (known: boolean) => {
    if (known) {
        addPoints(10);
        // Play simple sound effect logic here if desired
    }
    
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // End of deck, reload
        loadCards();
      }
    }, 200);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center text-purple-600 animate-pulse">Generating Magic Cards...</div>;
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center h-full p-6 pt-10">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Magic Cards</h2>
      
      {/* Card Container */}
      <div 
        className="relative w-full max-w-sm aspect-[3/4] perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border-4 border-purple-200 rounded-3xl shadow-xl flex flex-col items-center justify-center p-6">
            <span className="text-sm text-purple-400 uppercase tracking-widest mb-4">{currentCard.category}</span>
            <h3 className="text-6xl font-bold text-gray-800 mb-4">{currentCard.hanzi}</h3>
             <Button 
                variant="secondary" 
                size="sm" 
                className="mt-4 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentCard.hanzi);
                }}
              >
                🔊 Listen
              </Button>
             <p className="mt-8 text-gray-400 text-sm">Tap to flip</p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-purple-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 rotate-y-180 text-white">
            <h3 className="text-4xl font-bold mb-2">{currentCard.pinyin}</h3>
            <div className="w-16 h-1 bg-white/30 rounded-full mb-6"></div>
            <p className="text-3xl font-medium text-center">{currentCard.english}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex gap-4 w-full max-w-sm">
        <Button 
            className="flex-1" 
            variant="secondary"
            onClick={() => handleNext(false)}
        >
          Study Again
        </Button>
        <Button 
            className="flex-1" 
            variant="primary"
            onClick={() => handleNext(true)}
        >
          I Know It!
        </Button>
      </div>
      
      <p className="mt-4 text-purple-400 text-sm">Card {currentIndex + 1} of {cards.length}</p>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};