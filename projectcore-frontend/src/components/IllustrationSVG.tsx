import React from "react";

interface IllustrationProps {
  className?: string;
  style?: React.CSSProperties;
}

export const StudentIllustration: React.FC<IllustrationProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 400 400"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fondo */}
    <circle cx="200" cy="200" r="150" fill="#F3EEFF" />
    
    {/* Cuerpo */}
    <g transform="translate(120, 100)">
      {/* Cabeza */}
      <circle cx="80" cy="60" r="45" fill="#8A4EFC" />
      <circle cx="65" cy="50" r="8" fill="white" />
      <circle cx="95" cy="50" r="8" fill="white" />
      <path d="M70 70 Q80 80 90 70" stroke="white" strokeWidth="3" fill="none" />
      
      {/* Cuerpo */}
      <rect x="60" y="105" width="40" height="100" rx="20" fill="#8A4EFC" />
      
      {/* Brazos */}
      <rect x="20" y="115" width="40" height="15" rx="7.5" fill="#8A4EFC" />
      <rect x="100" y="115" width="40" height="15" rx="7.5" fill="#8A4EFC" />
      
      {/* Piernas */}
      <rect x="60" y="205" width="15" height="60" rx="7.5" fill="#8A4EFC" />
      <rect x="85" y="205" width="15" height="60" rx="7.5" fill="#8A4EFC" />
      
      {/* Mochila */}
      <rect x="40" y="120" width="30" height="40" rx="5" fill="#BA45F0" />
      <rect x="45" y="110" width="20" height="10" rx="5" fill="#BA45F0" />
      
      {/* Libro flotante */}
      <g transform="translate(110, 140)">
        <rect x="0" y="0" width="30" height="25" rx="3" fill="#FFB800" />
        <rect x="5" y="5" width="20" height="2" fill="white" opacity="0.7" />
        <rect x="5" y="10" width="15" height="2" fill="white" opacity="0.7" />
        <rect x="5" y="15" width="20" height="2" fill="white" opacity="0.7" />
      </g>
      
      {/* Graduación */}
      <rect x="60" y="20" width="40" height="10" rx="5" fill="#BA45F0" />
      <rect x="75" y="5" width="10" height="15" rx="5" fill="#BA45F0" />
      <rect x="65" y="5" width="30" height="5" rx="2.5" fill="#FFB800" />
    </g>
  </svg>
);

export const BusinessIllustration: React.FC<IllustrationProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 400 400"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fondo */}
    <circle cx="200" cy="200" r="150" fill="#EEFFFD" />
    
    {/* Edificio */}
    <g transform="translate(100, 100)">
      <rect x="50" y="30" width="100" height="170" rx="5" fill="#FF6B6B" />
      
      {/* Ventanas */}
      <rect x="65" y="50" width="25" height="25" rx="3" fill="white" />
      <rect x="110" y="50" width="25" height="25" rx="3" fill="white" />
      <rect x="65" y="90" width="25" height="25" rx="3" fill="white" />
      <rect x="110" y="90" width="25" height="25" rx="3" fill="white" />
      <rect x="65" y="130" width="25" height="25" rx="3" fill="white" />
      <rect x="110" y="130" width="25" height="25" rx="3" fill="white" />
      
      {/* Puerta */}
      <rect x="85" y="170" width="30" height="30" rx="3" fill="#BA45F0" />
      <circle cx="105" cy="185" r="3" fill="white" />
      
      {/* Techo */}
      <polygon points="40,30 160,30 145,10 55,10" fill="#BA45F0" />
      
      {/* Reloj */}
      <circle cx="100" cy="20" r="10" fill="white" />
      <circle cx="100" cy="20" r="8" fill="#FFB800" />
      <line x1="100" y1="20" x2="100" y2="15" stroke="white" strokeWidth="1.5" />
      <line x1="100" y1="20" x2="103" y2="22" stroke="white" strokeWidth="1.5" />
      
      {/* Bandera */}
      <rect x="170" y="30" width="5" height="80" fill="#8A4EFC" />
      <polygon points="175,30 200,45 175,60" fill="#FFB800" />
    </g>
  </svg>
);

export const MatchIllustration: React.FC<IllustrationProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 400 400"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fondo */}
    <circle cx="200" cy="200" r="150" fill="#FFF4E6" />
    
    {/* Elementos de conexión */}
    <g transform="translate(100, 100)">
      {/* Círculo Estudiante */}
      <circle cx="60" cy="100" r="40" fill="#8A4EFC" opacity="0.8" />
      <circle cx="50" cy="90" r="7" fill="white" />
      <circle cx="70" cy="90" r="7" fill="white" />
      <path d="M55 110 Q60 115 65 110" stroke="white" strokeWidth="2" fill="none" />
      
      {/* Círculo Empresa */}
      <circle cx="240" cy="100" r="40" fill="#FF6B6B" opacity="0.8" />
      <rect x="225" y="80" width="30" height="30" rx="3" fill="white" />
      <rect x="230" y="85" width="20" height="5" rx="2" fill="#FF6B6B" />
      <rect x="230" y="95" width="20" height="5" rx="2" fill="#FF6B6B" />
      <rect x="230" y="105" width="20" height="5" rx="2" fill="#FF6B6B" />
      
      {/* Línea conectora */}
      <line x1="100" y1="100" x2="200" y2="100" stroke="#BA45F0" strokeWidth="5" strokeDasharray="10,10" />
      
      {/* Elemento central */}
      <circle cx="150" cy="100" r="30" fill="#FFB800" />
      <path d="M135 100 L150 85 L165 100 L150 115 Z" fill="white" />
      
      {/* Estrellas decorativas */}
      <polygon points="80,60 85,70 95,75 85,80 80,90 75,80 65,75 75,70" fill="#FFB800" opacity="0.7" />
      <polygon points="220,60 225,70 235,75 225,80 220,90 215,80 205,75 215,70" fill="#8A4EFC" opacity="0.7" />
      <polygon points="150,140 155,150 165,155 155,160 150,170 145,160 135,155 145,150" fill="#BA45F0" opacity="0.7" />
    </g>
  </svg>
);

export const DynamicBackgroundSVG: React.FC<IllustrationProps> = ({ className, style }) => (
  <svg 
    className={className}
    style={style}
    viewBox="0 0 1440 800" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8A4EFC" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#FFB800" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#BA45F0" stopOpacity="0.07" />
        <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="grad3" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#8A4EFC" stopOpacity="0.03" />
        <stop offset="100%" stopColor="#BA45F0" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    
    {/* Fondo principal */}
    <rect width="100%" height="100%" fill="white" />
    
    {/* Formas orgánicas superpuestas */}
    <path d="M0,96L48,122.7C96,149,192,203,288,202.7C384,203,480,149,576,133.3C672,117,768,139,864,138.7C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" fill="url(#grad1)" />
    
    <path d="M0,96L48,101.3C96,107,192,117,288,133.3C384,149,480,171,576,170.7C672,171,768,149,864,149.3C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" transform="rotate(180 720 160)" fill="url(#grad2)" />
    
    <path d="M0,224L48,213.3C96,203,192,181,288,165.3C384,149,480,139,576,133.3C672,128,768,128,864,138.7C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" transform="translate(0, 500)" fill="url(#grad3)" />
    
    {/* Círculos decorativos */}
    <circle cx="100" cy="700" r="60" fill="#8A4EFC" opacity="0.1" />
    <circle cx="1350" cy="100" r="80" fill="#BA45F0" opacity="0.1" />
    <circle cx="700" cy="400" r="100" fill="#FFB800" opacity="0.05" />
    <circle cx="200" cy="200" r="40" fill="#FF6B6B" opacity="0.1" />
    <circle cx="1200" cy="600" r="70" fill="#8A4EFC" opacity="0.07" />
    
    {/* Patrones de puntos */}
    <g opacity="0.4">
      {[...Array(10)].map((_, i) => (
        <circle key={i} cx={150 + i * 30} cy="100" r="3" fill="#BA45F0" />
      ))}
      {[...Array(10)].map((_, i) => (
        <circle key={i} cx={950 + i * 30} cy="300" r="3" fill="#8A4EFC" />
      ))}
      {[...Array(10)].map((_, i) => (
        <circle key={i} cx={250 + i * 30} cy="500" r="3" fill="#FF6B6B" />
      ))}
    </g>
    
    {/* Líneas decorativas */}
    <line x1="0" y1="150" x2="300" y2="150" stroke="#8A4EFC" strokeWidth="1" opacity="0.2" />
    <line x1="1140" y1="250" x2="1440" y2="250" stroke="#BA45F0" strokeWidth="1" opacity="0.2" />
    <line x1="600" y1="700" x2="900" y2="700" stroke="#FFB800" strokeWidth="1" opacity="0.2" />
  </svg>
);