import React, { useState } from 'react';
import { UserState, ProficiencyLevel, AppMode } from '../types';
import { PurpleCat } from '../components/PurpleCat';
import { Button } from '../components/Button';
import { assessInitialLevel } from '../services/geminiService';

interface OnboardingProps {
  onComplete: (level: ProficiencyLevel) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Simple "Get to know you" flow
  const steps = [
    {
      text: "Ni Hao, Seraphim! 👋 I'm Luna, your magical Mandarin cat!",
      action: "Hi Luna!",
      catEmotion: "happy" as const
    },
    {
      text: "I love the color purple, just like you! Ready to learn some magic words?",
      action: "Yes, I'm ready!",
      catEmotion: "excited" as const
    },
    {
      text: "Awesome! Do you already know how to say 'Cat' in Mandarin?",
      options: [
        { label: "No, teach me!", value: "beginner" },
        { label: "Is it 'Māo'?", value: "intermediate" },
      ],
      catEmotion: "talking" as const
    }
  ];

  const handleAction = async (value?: string) => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      // Simulate analysis or actually call Gemini if we had a more complex chat here.
      // For now, simple logic based on her self-report + Gemini check.
      
      const level = value === 'intermediate' 
        ? await assessInitialLevel(["User knows basic words like Mao"]) 
        : ProficiencyLevel.BEGINNER;

      // Small delay for dramatic effect
      setTimeout(() => {
        onComplete(level);
        setLoading(false);
      }, 1500);
    }
  };

  const currentStep = steps[step];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-purple-50 text-center">
      <div className="w-48 h-48 mb-8 animate-bounce-slow">
        <PurpleCat emotion={currentStep.catEmotion} />
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl max-w-md w-full border-2 border-purple-100 mb-8">
        <p className="text-xl text-purple-900 font-medium leading-relaxed">
          {currentStep.text}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        {loading ? (
          <div className="text-purple-600 animate-pulse font-bold">Luna is preparing your magic book...</div>
        ) : (
          <>
            {currentStep.options ? (
              currentStep.options.map((opt) => (
                <Button key={opt.label} onClick={() => handleAction(opt.value)} variant="secondary" className="w-full mb-2">
                  {opt.label}
                </Button>
              ))
            ) : (
              <Button onClick={() => handleAction()} variant="primary" size="lg">
                {currentStep.action}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};