import React, { useState, useEffect } from 'react';
import { ProficiencyLevel } from '../types';
import { getGameContent } from '../services/geminiService';
import { Button } from '../components/Button';
import { PurpleCat } from '../components/PurpleCat';

interface GameProps {
  level: ProficiencyLevel;
  addPoints: (amount: number) => void;
}

interface Card {
  id: string; // Unique ID for the DOM element
  pairId: string; // ID to check matching
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const Game: React.FC<GameProps> = ({ level, addPoints }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewGame = async () => {
    setGameWon(false);
    setCards([]);
    const pairs = await getGameContent(level);
    
    // Transform pairs into individual cards and shuffle
    const gameCards: Card[] = [];
    pairs.forEach(pair => {
      gameCards.push({ id: pair.pairId + '-a', pairId: pair.pairId, content: pair.item1, isFlipped: false, isMatched: false });
      gameCards.push({ id: pair.pairId + '-b', pairId: pair.pairId, content: pair.item2, isFlipped: false, isMatched: false });
    });

    // Fisher-Yates shuffle
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
  };

  const handleCardClick = (card: Card) => {
    if (isProcessing || card.isFlipped || card.isMatched) return;

    // Flip the card
    const newCards = cards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c);
    setCards(newCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      checkForMatch(newSelected, newCards);
    }
  };

  const checkForMatch = (selected: Card[], currentCards: Card[]) => {
    const [first, second] = selected;
    const isMatch = first.pairId === second.pairId;

    if (isMatch) {
      addPoints(20);
      const updatedCards = currentCards.map(c => 
        (c.id === first.id || c.id === second.id) 
          ? { ...c, isMatched: true } 
          : c
      );
      setCards(updatedCards);
      setSelectedCards([]);
      setIsProcessing(false);
      
      // Check win condition
      if (updatedCards.every(c => c.isMatched)) {
        setTimeout(() => setGameWon(true), 500);
      }
    } else {
      setTimeout(() => {
        const resetCards = currentCards.map(c => 
          (c.id === first.id || c.id === second.id) 
            ? { ...c, isFlipped: false } 
            : c
        );
        setCards(resetCards);
        setSelectedCards([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  if (gameWon) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
        <div className="w-40 h-40 mb-6">
          <PurpleCat emotion="excited" />
        </div>
        <h2 className="text-3xl font-bold text-purple-600 mb-2">You Won! 🎉</h2>
        <p className="mb-8 text-gray-600">You matched all the words!</p>
        <Button onClick={startNewGame}>Play Again</Button>
      </div>
    );
  }

  if (cards.length === 0) {
     return <div className="flex h-full items-center justify-center text-purple-600">Setting up the game board...</div>;
  }

  return (
    <div className="p-4 pt-8 h-full flex flex-col items-center">
      <h2 className="text-xl font-bold text-purple-800 mb-4">Match the Words</h2>
      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`
              aspect-[4/5] rounded-xl text-lg font-bold shadow-sm transition-all duration-300 transform
              ${card.isMatched ? 'opacity-0' : 'opacity-100'}
              ${card.isFlipped 
                ? 'bg-purple-600 text-white rotate-0' 
                : 'bg-white text-transparent hover:bg-purple-50 rotate-y-180'}
            `}
            disabled={card.isMatched}
          >
             {/* Simple back pattern */}
             {!card.isFlipped && (
               <div className="w-full h-full flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full bg-purple-200"></div>
               </div>
             )}
             {card.isFlipped && card.content}
          </button>
        ))}
      </div>
    </div>
  );
};