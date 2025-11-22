import React from 'react';

interface LoadingStateProps {
  progress: number; // 0-100
  theme: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ progress, theme }) => {
  const messages = [
    "Dreaming up ideas...",
    "Sketching outlines...",
    "Adding magic details...",
    "Cleaning up the lines...",
    "Almost ready to color!"
  ];
  
  // Select message based on progress chunk
  const messageIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
      <div className="w-32 h-32 mb-6 relative">
        {/* Animated crayon or pencil SVG could go here, using simple spinner for now */}
        <div className="absolute inset-0 border-8 border-slate-200 rounded-full"></div>
        <div 
          className="absolute inset-0 border-8 border-indigo-500 rounded-full border-t-transparent animate-spin"
        ></div>
      </div>
      <h3 className="text-2xl font-bold text-indigo-600 mb-2">Creating "{theme}"</h3>
      <p className="text-slate-500 mb-6">{messages[messageIndex]}</p>
      
      <div className="w-64 h-4 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-slate-400 mt-2">{Math.round(progress)}%</p>
    </div>
  );
};
