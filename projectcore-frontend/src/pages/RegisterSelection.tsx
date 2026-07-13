import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { ArrowLeft, GraduationCap, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';

const studentBenefits = [
  'Acceso a oportunidades de prácticas',
  'Conexión directa con empresas',
  'Tu CV analizado con IA',
  'Postula con un simple swipe'
];

const companyBenefits = [
  'Acceso a talento estudiantil calificado',
  'Publicación de vacantes en minutos',
  'Candidatos ordenados por compatibilidad',
  'Herramientas de selección eficientes'
];

export default function RegisterSelection() {
  const [, setLocation] = useLocation();

  const renderCard = (
    type: 'student' | 'company',
    delay: number
  ) => {
    const isStudent = type === 'student';
    return (
      <motion.div
        initial={{ opacity: 0, x: isStudent ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 h-full cursor-pointer group hover:-translate-y-1 transition-all duration-300"
          onClick={() => setLocation(isStudent ? '/simple-register-student' : '/register-company')}
        >
          <div className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 bg-[#2D4A9F]/10 rounded-full w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isStudent
                ? <GraduationCap className="text-[#1E3A8A] w-9 h-9" />
                : <Building2 className="text-[#1E3A8A] w-9 h-9" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {isStudent ? 'Soy Estudiante' : 'Soy Empresa'}
            </h2>
            <p className="text-gray-500">
              {isStudent
                ? 'Busco prácticas profesionales y oportunidades de crecimiento'
                : 'Busco talento estudiantil para mi organización'}
            </p>
          </div>

          <div className="space-y-3 my-6">
            {(isStudent ? studentBenefits : companyBenefits).map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-[#4F6CDB] shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <button
            className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isStudent ? 'Registrarme como Estudiante' : 'Registrarme como Empresa'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen auth-gradient text-white font-sans">
      <div className="relative z-10 p-6">
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Logo size="lg" variant="light" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¡Únete a JobSwipe!
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Conectamos talento estudiantil con oportunidades reales.
              Elige tu perfil para comenzar tu registro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {renderCard('student', 0.2)}
            {renderCard('company', 0.4)}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-10"
          >
            <p className="text-white/70">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setLocation('/login')}
                className="text-white font-semibold hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
