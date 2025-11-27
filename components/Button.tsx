import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-bold rounded-2xl shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 border-b-4 border-purple-800",
    secondary: "bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50",
    accent: "bg-amber-400 text-purple-900 hover:bg-amber-500 border-b-4 border-amber-600"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl w-full"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};