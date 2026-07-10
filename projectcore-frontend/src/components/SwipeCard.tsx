import { useState, useRef } from "react";
import { getRandomImage } from "@/lib/mockImages";
import { MapPin, DollarSign, Clock, Users } from "lucide-react";

interface SwipeCardProps {
  user: any;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails?: (user: any) => void;
}

export default function SwipeCard({ user, isTop, onSwipe, onViewDetails }: SwipeCardProps) {
  const [startX, setStartX] = useState(0);
  const currentXRef = useRef(0);
  const [swiping, setSwiping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
    setSwiping(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!swiping) return;
    
    const currentX = e.touches[0].clientX;
    currentXRef.current = currentX;
    
    const deltaX = currentX - startX;
    const rotation = deltaX / 20;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
    }
  };
  
  const handleTouchEnd = () => {
    if (!swiping || !cardRef.current) return;
    
    const deltaX = currentXRef.current - startX;
    
    if (deltaX > 100) {
      cardRef.current.style.transform = `translateX(${window.innerWidth}px) rotate(30deg)`;
      onSwipe('right');
    } else if (deltaX < -100) {
      cardRef.current.style.transform = `translateX(-${window.innerWidth}px) rotate(-30deg)`;
      onSwipe('left');
    } else {
      cardRef.current.style.transform = '';
    }
    
    setSwiping(false);
  };
  
  const handleLike = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${window.innerWidth}px) rotate(30deg)`;
      setTimeout(() => {
        onSwipe('right');
      }, 300);
    }
  };
  
  const handleDislike = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(-${window.innerWidth}px) rotate(-30deg)`;
      setTimeout(() => {
        onSwipe('left');
      }, 300);
    }
  };
  
  if (!user) return null;
  
  const profilePic = user.profilePic || getRandomImage(user.userType as 'student' | 'business');
  
  const getModalityText = (modality: any) => {
    if (modality === 1 || modality === '1') return 'Presencial';
    if (modality === 2 || modality === '2') return 'Remoto';
    if (modality === 3 || modality === '3') return 'Híbrido';
    return 'No especificada';
  };
  
  return (
    <div className="absolute inset-0 flex justify-center">
      <div
        ref={cardRef}
        className={`swipe-card absolute w-full max-w-sm h-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[32px] bg-white border border-gray-100 flex flex-col ${isTop ? 'z-10' : 'z-0 scale-95 opacity-80'}`}
        style={{ 
          transition: swiping ? 'none' : 'transform 0.3s ease-out',
          willChange: 'transform' // Fix lagginess
        }}
        onTouchStart={isTop ? handleTouchStart : undefined}
        onTouchMove={isTop ? handleTouchMove : undefined}
        onTouchEnd={isTop ? handleTouchEnd : undefined}
      >
        <div className={`flex flex-col h-full ${expanded ? 'overflow-y-auto' : 'overflow-hidden'} pb-6`}>
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                 <img src={profilePic} alt={user.company_name || user.fullName} className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-gray-700 text-sm">{user.company_name || user.fullName || "Empresa"}</span>
            </div>
            {user.match_score && (
              <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                {Math.round(user.match_score * 100)}% Match
              </div>
            )}
          </div>
          
          {/* Body */}
          <div className="px-6 py-4 flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{user.title || user.job_title || 'Vacante'}</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                <span>{user.location || user.company_location || 'Lima'} <span className="text-[#8c52ff] font-medium ml-1">{getModalityText(user.modality)}</span></span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <DollarSign className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                <span>
                  {user.salary_min && user.salary_max ? `S/ ${user.salary_min} - S/ ${user.salary_max}` : 
                   user.approximated_salary ? `S/ ${user.approximated_salary}` : 'A tratar'}
                </span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                <span>Publicado recientemente</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Habilidades Requeridas</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill: any, idx: number) => (
                    <span key={skill.id || idx} className="bg-[#f0edff] text-[#8c52ff] px-3 py-1 rounded-full text-xs font-medium">
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-[#f0edff] text-[#8c52ff] px-3 py-1 rounded-full text-xs font-medium">Liderazgo</span>
                    <span className="bg-[#f0edff] text-[#8c52ff] px-3 py-1 rounded-full text-xs font-medium">Proactividad</span>
                    <span className="bg-[#f0edff] text-[#8c52ff] px-3 py-1 rounded-full text-xs font-medium">Trabajo en equipo</span>
                  </>
                )}
              </div>
            </div>
            
            {expanded && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Descripción</h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {user.description || user.profile?.bio || 'Buscamos un perfil proactivo para unirse a nuestro equipo de trabajo en un ambiente dinámico. Tendrás la oportunidad de crecer y desarrollar tus habilidades.'}
                </p>
              </div>
            )}
          </div>
          
          <div className="px-6 pt-2 shrink-0">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (onViewDetails) onViewDetails(user);
                else setExpanded(!expanded);
              }}
              className="w-full py-3 bg-white border border-gray-200 text-[#2e3192] rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              {expanded ? 'Mostrar menos' : 'Ver Detalles Completos'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Desliza a la derecha para postular • Izquierda para pasar
            </p>
          </div>
        </div>
      </div>
      
      {/* Swipe Buttons (Outside Card) */}
      {isTop && (
        <div className="absolute -bottom-24 left-0 right-0 flex justify-center space-x-6 z-20 pointer-events-auto">
          <button 
            onClick={handleDislike}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-red-100 text-red-500 hover:bg-red-50 hover:scale-105 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button 
            onClick={handleLike}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-green-100 text-green-500 hover:bg-green-50 hover:scale-105 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
