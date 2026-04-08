import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Logo from '@/components/Logo';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(10);
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLocation("/home");
          }, 500);
        }
        
        return newProgress;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, [setLocation]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-100 via-white to-indigo-100">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 relative mb-6">
          <div className="absolute inset-0 bg-gradient-multi rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Logo size="md" showText={false} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gradient-animated mb-2">PROJECT CORE</h2>
        <p className="mt-2 text-gray-600 font-medium">Personalizando tu experiencia...</p>
        
        <div className="mt-8 w-full max-w-md">
          <div className="flex justify-between mb-2 px-1">
            <span className="text-sm font-medium text-gray-500">Cargando</span>
            <span className="text-sm font-medium text-[#8A4EFC]">{progress}%</span>
          </div>
          <div className="w-full bg-white/50 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#8A4EFC] to-[#FF9736] rounded-full transition-all duration-300 ease-out animate-shimmer"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-8 flex space-x-3">
          <div className="w-4 h-4 rounded-full bg-[#8A4EFC] animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-4 h-4 rounded-full bg-[#FF9736] animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-4 h-4 rounded-full bg-[#30C971] animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
        
        <div className="mt-12 max-w-md text-center">
          <p className="text-gray-500 text-sm">
            Conectando estudiantes y empresas para una experiencia 
            laboral enriquecedora mientras continúas tus estudios
          </p>
        </div>
      </div>
    </div>
  );
}
