import { useLocation } from "wouter";
import { useUser } from "@/lib/userContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Star, Sparkles } from "lucide-react";
import { StudentIllustration, BusinessIllustration, MatchIllustration } from "@/components/IllustrationSVG";

export default function MotivationPage() {
  const [_, setLocation] = useLocation();
  const { user } = useUser();
  
  const handleContinue = () => {
    setLocation("/signup");
  };

  const goBack = () => {
    setLocation("/explanation");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-indigo-50 overflow-hidden">
      {/* Elementos de fondo decorativos */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-[#8A4EFC]/10 to-[#BA45F0]/5 blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FF6B6B]/10 to-[#FFB800]/5 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
        />
        <motion.div 
          className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full bg-[#36D399]/10 blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            y: [0, -30, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2 
          }}
        />
      </div>
      
      {/* Header con efecto de aparición */}
      <motion.header 
        className="sticky top-0 backdrop-blur-md bg-white/80 border-b border-gray-100 py-4 px-6 flex justify-between items-center shadow-sm z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <Logo size="md" />
        </motion.div>
        
        <motion.button 
          onClick={goBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#8A4EFC] px-3 py-2 rounded-lg hover:bg-[#8A4EFC]/5 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowRight className="h-5 w-5 rotate-180" />
          <span className="font-medium">Volver</span>
        </motion.button>
      </motion.header>
      
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        {/* Contenido principal */}
        <motion.div 
          className="max-w-6xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Columna izquierda - Ilustraciones */}
            <motion.div 
              className="relative bg-gradient-to-br from-[#8A4EFC]/5 to-[#BA45F0]/10 p-8 md:p-12 flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full max-w-md">
                <motion.div 
                  className="flex justify-between mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  {/* Estudiante */}
                  <motion.div 
                    className="flex-1"
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut" 
                    }}
                  >
                    <StudentIllustration className="w-full h-auto" />
                  </motion.div>
                  
                  {/* Conexión entre figuras */}
                  <motion.div 
                    className="flex items-center justify-center w-16"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut" 
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <motion.div 
                        className="text-pink-500 text-2xl"
                        animate={{ 
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity
                        }}
                      >
                        ❤️
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Empresa */}
                  <motion.div 
                    className="flex-1"
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 3.5, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <BusinessIllustration className="w-full h-auto" />
                  </motion.div>
                </motion.div>
                
                {/* Match ilustración */}
                <motion.div 
                  className="relative flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    <MatchIllustration className="w-80 h-auto" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB800] text-white font-bold py-3 px-6 rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0.8, 1.1, 1],
                      rotate: [-5, 5, 0]
                    }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 1.2,
                      times: [0, 0.7, 1]
                    }}
                  >
                    ¡CHAMBAZO!
                  </motion.div>
                </motion.div>
                
                {/* Estrellas de valoración */}
                <motion.div 
                  className="flex justify-center mt-6 gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.2
                      }}
                    >
                      <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Columna derecha - Texto */}
            <motion.div 
              className="p-8 md:p-12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.h1 
                  className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight"
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0]">
                    ¡Estás a un paso
                  </span>
                  <br />
                  <span className="text-gray-800">
                    de tu <span className="text-[#FF6B6B]">chamba ideal</span>!
                    <motion.span 
                      className="inline-block ml-2 text-white"
                      animate={{ 
                        rotate: [0, 10, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Sparkles className="h-8 w-8" />
                    </motion.span>
                  </span>
                </motion.h1>
              </motion.div>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                En <span className="font-bold text-[#8A4EFC]">PROJECT CORE</span> conectamos el talento joven 
                con empresas innovadoras para crear oportunidades de crecimiento mutuo que 
                transforman el futuro laboral.
              </motion.p>
              
              <motion.div 
                className="space-y-5 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {[
                  "Gana experiencia laboral real mientras aplicas tus conocimientos académicos",
                  "Conéctate con empresas que valoran tus habilidades únicas y perspectiva fresca",
                  "Crea tu red profesional mientras construyes un portafolio impresionante"
                ].map((text, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                    whileHover={{ x: 5, backgroundColor: "#8A4EFC10" }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#8A4EFC]/10 text-[#8A4EFC] flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-gray-700">{text}</p>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-r from-[#8A4EFC]/10 to-[#BA45F0]/10 rounded-xl p-5 mb-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8A4EFC]/30 to-[#BA45F0]/20 rounded-full -mr-16 -mt-16"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 45, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                
                <div className="relative">
                  <p className="text-lg text-gray-700 italic font-medium">
                    "Las mejores oportunidades llegan cuando conectamos el talento con quien realmente lo valora."
                  </p>
                  <div className="mt-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#8A4EFC] flex items-center justify-center text-white text-xs font-bold mr-2">
                      CY
                    </div>
                    <p className="text-sm text-gray-600">PROJECT CORE Team</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    onClick={handleContinue}
                    className="w-full py-7 text-lg font-bold rounded-xl shadow-lg bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] hover:opacity-90 border-0"
                  >
                    <motion.span 
                      className="flex items-center justify-center gap-2"
                      animate={{ 
                        x: [0, 5, 0],
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      ¡COMENZAR AHORA! <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </Button>
                </motion.div>
                
                <motion.p 
                  className="text-center text-gray-500 mt-4"
                  animate={{ 
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  A un paso de encontrar tu <span className="font-medium text-[#8A4EFC]">chamba ideal</span>
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
