import { useState, useRef, useEffect } from "react";
import { getRandomImage } from "@/lib/mockImages";

interface SwipeCardProps {
  user: any;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function SwipeCard({ user, isTop, onSwipe }: SwipeCardProps) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
    setSwiping(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!swiping) return;
    
    const currentX = e.touches[0].clientX;
    setCurrentX(currentX);
    
    const deltaX = currentX - startX;
    
    // Limit rotation to prevent excessive movement
    const rotation = deltaX / 20;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
    }
    
    // Visual cue for like/dislike
    const likeIndicator = cardRef.current?.querySelector('.like-indicator');
    const dislikeIndicator = cardRef.current?.querySelector('.dislike-indicator');
    
    if (likeIndicator && dislikeIndicator) {
      if (deltaX > 50) {
        (likeIndicator as HTMLElement).classList.remove('opacity-0');
        (dislikeIndicator as HTMLElement).classList.add('opacity-0');
      } else if (deltaX < -50) {
        (dislikeIndicator as HTMLElement).classList.remove('opacity-0');
        (likeIndicator as HTMLElement).classList.add('opacity-0');
      } else {
        (likeIndicator as HTMLElement).classList.add('opacity-0');
        (dislikeIndicator as HTMLElement).classList.add('opacity-0');
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (!swiping || !cardRef.current) return;
    
    const deltaX = currentX - startX;
    
    if (deltaX > 100) {
      // Swipe right (like)
      cardRef.current.style.transform = `translateX(${window.innerWidth}px) rotate(30deg)`;
      onSwipe('right');
    } else if (deltaX < -100) {
      // Swipe left (dislike)
      cardRef.current.style.transform = `translateX(-${window.innerWidth}px) rotate(-30deg)`;
      onSwipe('left');
    } else {
      // Return to center
      cardRef.current.style.transform = '';
      const likeIndicator = cardRef.current.querySelector('.like-indicator');
      const dislikeIndicator = cardRef.current.querySelector('.dislike-indicator');
      
      if (likeIndicator && dislikeIndicator) {
        (likeIndicator as HTMLElement).classList.add('opacity-0');
        (dislikeIndicator as HTMLElement).classList.add('opacity-0');
      }
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
  const userTypeLabel = user.userType === 'business' ? 'MYPE' : 'Estudiante';
  
  return (
    <div className="relative">
      <div
        ref={cardRef}
        className={`swipe-card absolute inset-0 w-full card-shadow rounded-2xl bg-black/40 backdrop-blur-md border border-purple-500/30 overflow-hidden ${isTop ? 'z-10' : ''}`}
        onTouchStart={isTop ? handleTouchStart : undefined}
        onTouchMove={isTop ? handleTouchMove : undefined}
        onTouchEnd={isTop ? handleTouchEnd : undefined}
      >
        <div className="relative aspect-[4/5] bg-gray-800">
          <img 
            src={profilePic}
            alt={user.fullName} 
            className="w-full h-full object-cover"
          />
          
          {/* Like/dislike indicators */}
          <div className="like-indicator opacity-0 absolute top-6 left-6 transform -rotate-12 border-4 border-green-500 text-green-400 text-xl font-bold px-3 py-1 rounded bg-black/50 backdrop-blur-sm">
            ME INTERESA
          </div>
          <div className="dislike-indicator opacity-0 absolute top-6 right-6 transform rotate-12 border-4 border-red-500 text-red-400 text-xl font-bold px-3 py-1 rounded bg-black/50 backdrop-blur-sm">
            PASAR
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
              <p className="text-gray-300">{user.title || (user.userType === 'student' ? 'Estudiante' : 'Empresa')}</p>
            </div>
            <div className={`${user.userType === 'business' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30'} px-2 py-1 rounded-full text-xs font-medium`}>
              {userTypeLabel}
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">{user.profile?.bio || `Este usuario aún no ha añadido una biografía.`}</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">Intereses:</h4>
            <div className="flex flex-wrap gap-2">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest: any) => (
                  <span key={interest.id} className="bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-medium text-purple-300">
                    {interest.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Sin intereses definidos</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isTop && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6 z-20">
          <button 
            onClick={handleDislike}
            className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm shadow-lg shadow-purple-500/20 flex items-center justify-center border border-purple-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
          <button 
            onClick={handleLike}
            className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm shadow-lg shadow-purple-500/20 flex items-center justify-center border border-purple-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
