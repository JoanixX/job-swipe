import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 'dark' para fondos claros (texto #1E3A8A), 'light' para fondos oscuros (texto blanco) */
  variant?: 'dark' | 'light';
  showText?: boolean;
}

export default function Logo({ size = 'md', variant = 'dark', showText = true }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 27 },
    md: { width: 45, height: 38 },
    lg: { width: 65, height: 54 },
    xl: { width: 80, height: 67 }
  };

  const { width, height } = sizes[size];
  const textSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl';
  // En modo oscuro el azul marino no contrasta: el texto pasa a blanco automáticamente
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1E3A8A] dark:text-white';

  return (
    <div className="flex items-center gap-2">
      <img
        src="/images/JobSwipe.svg"
        alt="Logo de JobSwipe"
        width={width}
        height={height}
      />
      {showText && (
        <span className={`font-extrabold ${textSize} ${textColor}`}>
          JobSwipe
        </span>
      )}
    </div>
  );
}
