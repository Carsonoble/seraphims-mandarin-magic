import React from 'react';

interface PurpleCatProps {
  emotion?: 'happy' | 'talking' | 'sleepy' | 'excited';
  className?: string;
}

export const PurpleCat: React.FC<PurpleCatProps> = ({ emotion = 'happy', className = '' }) => {
  return (
    <div className={`relative ${className}`} title="Luna the Cat">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
        {/* Body */}
        <circle cx="100" cy="110" r="70" fill="#9333EA" />
        <circle cx="100" cy="110" r="55" fill="#A855F7" />
        
        {/* Ears */}
        <path d="M40 70 L70 100 L40 120 Z" fill="#9333EA" transform="rotate(-30 55 95)" />
        <path d="M160 70 L130 100 L160 120 Z" fill="#9333EA" transform="rotate(30 145 95)" />
        
        {/* Inner Ears */}
        <path d="M45 75 L65 95 L45 110 Z" fill="#F3E8FF" transform="rotate(-30 55 95)" />
        <path d="M155 75 L135 95 L155 110 Z" fill="#F3E8FF" transform="rotate(30 145 95)" />

        {/* Eyes */}
        <ellipse cx="75" cy="100" rx="10" ry="12" fill="white" />
        <ellipse cx="125" cy="100" rx="10" ry="12" fill="white" />
        
        {/* Pupils */}
        <circle cx="75" cy="100" r="5" fill="black">
          {emotion === 'excited' && <animate attributeName="cy" values="100;95;100" dur="0.5s" repeatCount="indefinite" />}
        </circle>
        <circle cx="125" cy="100" r="5" fill="black">
          {emotion === 'excited' && <animate attributeName="cy" values="100;95;100" dur="0.5s" repeatCount="indefinite" />}
        </circle>

        {/* Nose */}
        <polygon points="95,115 105,115 100,122" fill="#F472B6" />

        {/* Mouth */}
        {emotion === 'talking' ? (
           <path d="M90 125 Q100 135 110 125" fill="none" stroke="black" strokeWidth="3" >
             <animate attributeName="d" values="M90 125 Q100 135 110 125; M90 125 Q100 140 110 125; M90 125 Q100 135 110 125" dur="0.3s" repeatCount="indefinite"/>
           </path>
        ) : (
          <path d="M90 125 Q95 130 100 125 Q105 130 110 125" fill="none" stroke="black" strokeWidth="3" />
        )}

        {/* Whiskers */}
        <line x1="50" y1="115" x2="20" y2="110" stroke="#DDD" strokeWidth="2" />
        <line x1="50" y1="120" x2="20" y2="125" stroke="#DDD" strokeWidth="2" />
        <line x1="150" y1="115" x2="180" y2="110" stroke="#DDD" strokeWidth="2" />
        <line x1="150" y1="120" x2="180" y2="125" stroke="#DDD" strokeWidth="2" />

        {/* Collar */}
        <path d="M60 160 Q100 180 140 160" stroke="#FBBF24" strokeWidth="8" fill="none" />
        <circle cx="100" cy="170" r="8" fill="#F59E0B" />
      </svg>
    </div>
  );
};