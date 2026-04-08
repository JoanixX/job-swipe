import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  showText?: boolean;
}

export default function Logo({ size = 'md', color = '#8A4EFC', showText = true }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 45, height: 45 },
    lg: { width: 65, height: 65 },
    xl: { width: 80, height: 80 }
  };

  const { width, height } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <img
          src="/images/logoCircular.png"
          alt="ProjectCore Logo"
          width={width}
          height={height}
          className="animate-pulse rounded-full"
          style={{ animationDuration: '3s' }}
        />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '1.5s' }}></div>
      </div>
      {showText && (
        <div className="flex items-center">
          <span className={`font-extrabold ${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl'} text-white`}>
            CHAMBEA
          </span>
          <span className={`font-extrabold ml-1 ${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl'} text-yellow-500`}>
            YA
          </span>
        </div>
      )}
    </div>
  );
}