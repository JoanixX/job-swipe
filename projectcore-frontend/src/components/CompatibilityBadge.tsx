import { Flame, ThumbsUp, Minus } from 'lucide-react';

interface CompatibilityBadgeProps {
  /** Score entre 0 y 1 (como lo devuelve el matching IA) */
  score?: number | null;
  /** Estilo sobre fondo oscuro (cabecera degradada de la SwipeCard) */
  onGradient?: boolean;
}

/**
 * Indicador de afinidad por tramos:
 *  ≥70% → "Match ideal" (verde, con llama y pulso)
 *  50–69% → "Buena afinidad" (ámbar)
 *  <50% → porcentaje neutro
 */
export default function CompatibilityBadge({ score, onGradient = false }: CompatibilityBadgeProps) {
  if (score == null) return null;
  const pct = Math.round(score * 100);

  if (pct >= 70) {
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse ${
        onGradient ? 'bg-white text-green-600' : 'bg-green-500 text-white'
      }`} style={{ animationDuration: '2s' }}>
        <Flame className="w-3.5 h-3.5" />
        {pct}% · Match ideal
      </span>
    );
  }

  if (pct >= 50) {
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
        onGradient ? 'bg-white text-amber-600' : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
      }`}>
        <ThumbsUp className="w-3.5 h-3.5" />
        {pct}% · Buena afinidad
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
      onGradient ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
    }`}>
      <Minus className="w-3.5 h-3.5" />
      {pct}% afinidad
    </span>
  );
}
