import { useLocation } from "wouter";

interface BottomNavigationProps {
  activePage: "inicio" | "movimientos" | "matches" | "perfil";
}

export default function BottomNavigation({ activePage }: BottomNavigationProps) {
  const [_, setLocation] = useLocation();
  
  return (
    <div className="border-t border-gray-200 flex justify-around items-center py-3 px-2 bg-white relative z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <button 
        className={`flex flex-col items-center justify-center w-20 ${activePage === "inicio" ? "text-[#2e3192]" : "text-gray-400 hover:text-gray-600"}`}
        onClick={() => setLocation("/matching")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={activePage === "inicio" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={activePage === "inicio" ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className={`text-xs mt-1 ${activePage === "inicio" ? "font-semibold" : "font-medium"}`}>Inicio</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-20 ${activePage === "movimientos" ? "text-[#2e3192]" : "text-gray-400 hover:text-gray-600"}`}
        onClick={() => setLocation("/student-applications")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={activePage === "movimientos" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={activePage === "movimientos" ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span className={`text-xs mt-1 ${activePage === "movimientos" ? "font-semibold" : "font-medium"}`}>Movimientos</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-20 ${activePage === "matches" ? "text-[#2e3192]" : "text-gray-400 hover:text-gray-600"}`}
        onClick={() => setLocation("/student-matches")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={activePage === "matches" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={activePage === "matches" ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span className={`text-xs mt-1 ${activePage === "matches" ? "font-semibold" : "font-medium"}`}>Matches</span>
      </button>
      
      <button 
        className={`flex flex-col items-center justify-center w-20 ${activePage === "perfil" ? "text-[#2e3192]" : "text-gray-400 hover:text-gray-600"}`}
        onClick={() => setLocation("/student-profile")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={activePage === "perfil" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={activePage === "perfil" ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span className={`text-xs mt-1 ${activePage === "perfil" ? "font-semibold" : "font-medium"}`}>Perfil</span>
      </button>
    </div>
  );
}

