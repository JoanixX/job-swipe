import { useEffect } from "react";
import { getRandomImage } from "@/lib/mockImages";
import { useUser } from "@/lib/userContext";

interface MatchModalProps {
  matchedUser: any;
  onClose: () => void;
}

export default function MatchModal({ matchedUser, onClose }: MatchModalProps) {
  const { user } = useUser();
  
  useEffect(() => {
    // Automatically close the modal after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const userProfilePic = user?.profilePic || getRandomImage(user?.userType as 'student' | 'business');
  const matchedUserProfilePic = matchedUser.profilePic || getRandomImage(matchedUser.userType as 'student' | 'business');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center animate-slide-in">
        <div className="mb-4">
          <div className="h-20 w-20 bg-[hsl(var(--accent))] rounded-full mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">¡Es un match!</h3>
        <p className="text-gray-600 mb-4">Ambos han demostrado interés. Ahora pueden ponerse en contacto.</p>
        <div className="flex justify-center space-x-4 mb-4">
          {/* Profile images of matched users */}
          <div className="h-16 w-16 rounded-full bg-gray-300 border-2 border-[hsl(var(--accent))] overflow-hidden">
            <img src={userProfilePic} alt="Tu perfil" className="h-full w-full object-cover" />
          </div>
          <div className="h-16 w-16 rounded-full bg-gray-300 border-2 border-[hsl(var(--accent))] overflow-hidden">
            <img src={matchedUserProfilePic} alt={matchedUser.fullName} className="h-full w-full object-cover" />
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-full py-3 rounded-lg font-medium bg-[hsl(var(--accent))] text-white"
        >
          Enviar mensaje
        </button>
      </div>
    </div>
  );
}
