import { useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimationControls, PanInfo } from "framer-motion";
import { MapPin, Banknote, Building2 } from "lucide-react";
import CompatibilityBadge from "./CompatibilityBadge";

interface SwipeCardProps {
  user: any;
  /** Posición en la baraja: 0 = tarjeta superior (arrastrable) */
  index: number;
  /** Dirección forzada por los botones externos (solo aplica a la tarjeta superior) */
  forcedExit?: 'left' | 'right' | null;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails?: (user: any) => void;
}

const SWIPE_THRESHOLD = 110;

const getModalityText = (modality: any) => {
  if (modality === 1 || modality === '1') return 'Presencial';
  if (modality === 2 || modality === '2') return 'Remoto';
  if (modality === 3 || modality === '3') return 'Híbrido';
  return 'No especificada';
};

export default function SwipeCard({ user, index, forcedExit, onSwipe, onViewDetails }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-14, 14]);
  const likeOpacity = useTransform(x, [30, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -30], [1, 0]);
  const controls = useAnimationControls();

  const isTop = index === 0;

  const flyOut = async (direction: 'left' | 'right') => {
    await controls.start({
      x: direction === 'right' ? 600 : -600,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    });
    onSwipe(direction);
  };

  // Swipe disparado desde los botones externos
  useEffect(() => {
    if (isTop && forcedExit) {
      flyOut(forcedExit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedExit, isTop]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const distance = info.offset.x;
    const velocity = info.velocity.x;
    if (distance > SWIPE_THRESHOLD || velocity > 600) {
      flyOut('right');
    } else if (distance < -SWIPE_THRESHOLD || velocity < -600) {
      flyOut('left');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
    }
  };

  if (!user) return null;

  return (
    <motion.div
      className="absolute inset-0 select-none"
      style={{
        zIndex: 30 - index,
        // Las tarjetas de atrás se asoman levemente por abajo, sin transparencias que se mezclen
        scale: 1 - index * 0.04,
        y: index * 12,
      }}
      animate={{ scale: 1 - index * 0.04, y: index * 12 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        style={{ x, rotate: isTop ? rotate : 0 }}
        animate={controls}
        onDragEnd={isTop ? handleDragEnd : undefined}
        className={`w-full h-full bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {/* Indicadores LIKE / NOPE */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-6 left-6 z-20 border-4 border-green-500 text-green-500 font-extrabold text-2xl px-4 py-1 rounded-xl rotate-[-14deg] bg-white/70 dark:bg-gray-900/70"
            >
              POSTULAR
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-6 right-6 z-20 border-4 border-red-500 text-red-500 font-extrabold text-2xl px-4 py-1 rounded-xl rotate-[14deg] bg-white/70 dark:bg-gray-900/70"
            >
              PASAR
            </motion.div>
          </>
        )}

        {/* Cabecera con degradado de marca */}
        <div className="h-32 shrink-0 flex items-end justify-between px-6 pb-4" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #4150BC 55%, #6366F1 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">{user.company_name || 'Empresa'}</span>
          </div>
          <CompatibilityBadge score={user.match_score} onGradient />
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5 flex-1 flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">{user.title || 'Vacante'}</h2>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
              <span>{user.location || 'Lima'} · <span className="text-[#6366F1] font-medium">{getModalityText(user.modality)}</span></span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Banknote className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
              <span>{user.approximated_salary ? `S/ ${user.approximated_salary}` : 'A tratar'}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
            {user.description || 'Sin descripción disponible.'}
          </p>

          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {user.skills.slice(0, 5).map((skill: any, idx: number) => (
                <span key={skill.id || idx} className="bg-indigo-50 dark:bg-indigo-950 text-[#6366F1] px-3 py-1 rounded-full text-xs font-medium">
                  {skill.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(user);
              }}
              className="w-full py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#1E3A8A] dark:text-indigo-300 rounded-xl font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Ver Detalles Completos
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
