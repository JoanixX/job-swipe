import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

export default function ExplanationPage() {
  const [_, setLocation] = useLocation();
  
  const handleUserTypeSelection = (type: "student" | "business") => {
    // Guardar el tipo de usuario en localStorage para usarlo más tarde
    localStorage.setItem('userType', type);
    setLocation("/motivation");
  };

  const goBack = () => {
    setLocation("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-indigo-50 via-purple-50 to-pink-50 overflow-hidden relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-purple-300/30 to-indigo-300/20 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-1/4 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-pink-300/20 to-purple-300/10 blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-gradient-to-bl from-blue-300/10 to-indigo-300/20 blur-xl"
          animate={{ 
            scale: [1, 0.9, 1],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-400/10 to-indigo-300/20 blur-xl"
          animate={{ 
            rotate: [0, -15, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </div>

      <motion.header 
        className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 flex items-center justify-between shadow-md z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size="md" />
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button 
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-[#8A4EFC] font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Volver
          </button>
        </motion.div>
      </motion.header>
      
      <div className="flex-1 px-6 pb-16 max-w-6xl mx-auto w-full pt-10 relative z-10">
        <motion.h1 
          className="text-3xl md:text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-[#8A4EFC] via-[#BA45F0] to-[#FF6B6B] text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          ¿Cómo funciona PROJECT CORE?
        </motion.h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Step 1 */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              backgroundColor: "rgba(255, 255, 255, 1)"
            }}
          >
            <div className="h-48 bg-gradient-to-r from-[#8A4EFC]/10 to-[#BA45F0]/10 flex items-center justify-center">
              <motion.div 
                className="w-32 h-32 rounded-full bg-gradient-to-r from-[#8A4EFC]/20 to-[#BA45F0]/20 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </motion.div>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] text-white flex items-center justify-center mb-4 font-bold text-lg shadow-md">1</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Crea tu perfil</h3>
              <p className="text-gray-600">Regístrate como estudiante o MYPE y completa tu perfil con tus intereses, habilidades o necesidades.</p>
            </div>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              backgroundColor: "rgba(255, 255, 255, 1)"
            }}
          >
            <div className="h-48 bg-gradient-to-r from-[#BA45F0]/10 to-[#FF6B6B]/10 flex items-center justify-center">
              <motion.div 
                className="w-32 h-32 rounded-full bg-gradient-to-r from-[#BA45F0]/20 to-[#FF6B6B]/20 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#BA45F0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                  <path d="m15 6-6 6 6 6" />
                </svg>
              </motion.div>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#BA45F0] to-[#FF6B6B] text-white flex items-center justify-center mb-4 font-bold text-lg shadow-md">2</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Encuentra tu match</h3>
              <p className="text-gray-600">Desliza para descubrir estudiantes o MYPEs con intereses afines y oportunidades de colaboración.</p>
            </div>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              backgroundColor: "rgba(255, 255, 255, 1)"
            }}
          >
            <div className="h-48 bg-gradient-to-r from-[#FF6B6B]/10 to-[#8A4EFC]/10 flex items-center justify-center">
              <motion.div 
                className="w-32 h-32 rounded-full bg-gradient-to-r from-[#FF6B6B]/20 to-[#8A4EFC]/20 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#FF6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </motion.div>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#8A4EFC] text-white flex items-center justify-center mb-4 font-bold text-lg shadow-md">3</div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">Conecta y colabora</h3>
              <p className="text-gray-600">Cuando ambos muestran interés, ¡es un match! Ahora pueden comenzar a colaborar juntos.</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.h2 
            className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-[#FF6B6B] via-[#BA45F0] to-[#8A4EFC] text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            ¿Quién eres tú?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Student Option */}
            <motion.div 
              onClick={() => handleUserTypeSelection("student")}
              className="group cursor-pointer bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-[#BA45F0] rounded-2xl p-10 transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center relative overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.6 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                backgroundColor: "rgba(255, 255, 255, 1)"
              }}
            >
              <motion.div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#8A4EFC]/10 to-[#BA45F0]/5 blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
              
              <motion.div 
                className="mb-8 w-32 h-32 rounded-full bg-gradient-to-r from-[#8A4EFC]/20 to-[#BA45F0]/20 text-[#BA45F0] flex items-center justify-center shadow-md relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8A4EFC]/10 to-[#BA45F0]/10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </motion.div>
              
              <h3 className="font-extrabold text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] group-hover:opacity-90 transition-all">Estudiante</h3>
              <p className="text-gray-600 mb-8 text-lg">Busco oportunidades para ganar experiencia laboral y aplicar mis conocimientos académicos en el mundo real.</p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="mt-auto text-lg font-semibold px-8 py-6 h-auto bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] text-white hover:opacity-90 transition-all shadow-md">
                  Soy estudiante
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Business Option */}
            <motion.div 
              onClick={() => handleUserTypeSelection("business")}
              className="group cursor-pointer bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-[#FF6B6B] rounded-2xl p-10 transition-all duration-300 hover:shadow-xl flex flex-col items-center text-center relative overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.6 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                backgroundColor: "rgba(255, 255, 255, 1)"
              }}
            >
              <motion.div 
                className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#BA45F0]/10 to-[#FF6B6B]/5 blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0],
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
              
              <motion.div 
                className="mb-8 w-32 h-32 rounded-full bg-gradient-to-r from-[#BA45F0]/20 to-[#FF6B6B]/20 text-[#FF6B6B] flex items-center justify-center shadow-md relative z-10"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#BA45F0]/10 to-[#FF6B6B]/10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                  <path d="M21 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path>
                  <path d="M3 13h18"></path>
                </svg>
              </motion.div>
              
              <h3 className="font-extrabold text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#BA45F0] to-[#FF6B6B] group-hover:opacity-90 transition-all">Empresa (MYPE)</h3>
              <p className="text-gray-600 mb-8 text-lg">Buscamos talentos jóvenes para innovar y colaborar en nuestros proyectos y servicios de forma creativa.</p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="mt-auto text-lg font-semibold px-8 py-6 h-auto bg-gradient-to-r from-[#BA45F0] to-[#FF6B6B] text-white hover:opacity-90 transition-all shadow-md">
                  Soy una MYPE
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
