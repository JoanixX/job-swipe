'use client'

import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'

export default function TerminosServicio() {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF258D' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF258D] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#390062] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-[#FF258D] to-[#390062] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">CY</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#FF258D] to-white bg-clip-text text-transparent">
            Project Core
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => setLocation('/chambea-ya')}
          >
            🏠 Volver al Inicio
          </Button>
        </motion.div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-[#FF258D] bg-clip-text text-transparent">
            Términos de Servicio
          </h1>
          
          <div className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/30 rounded-xl p-8 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
              <div className="text-gray-200 space-y-3">
                <p>Al acceder y utilizar Project Core, aceptas estar sujeto a estos términos de servicio.</p>
                <p>Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro servicio.</p>
                <p>Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
              <div className="text-gray-200 space-y-3">
                <p>Project Core es una plataforma que conecta estudiantes universitarios peruanos con empresas que buscan talento para proyectos específicos.</p>
                <p>Ofrecemos servicios de matching inteligente, gestión de perfiles y facilitación de comunicación entre estudiantes y empresas.</p>
                <p>No somos empleadores directos ni garantizamos la obtención de proyectos o remuneración.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Elegibilidad</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Estudiantes:</strong> Debes ser estudiante universitario peruano mayor de 18 años, cursando carreras STEM o afines.</p>
                <p><strong>Empresas:</strong> Debes ser una empresa legalmente constituida en Perú con capacidad para contratar servicios.</p>
                <p><strong>Información Veraz:</strong> Toda la información proporcionada debe ser verdadera, precisa y actualizada.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Cuentas de Usuario</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Responsabilidad:</strong> Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</p>
                <p><strong>Actividad:</strong> Eres responsable de toda la actividad que ocurra bajo tu cuenta.</p>
                <p><strong>Notificación:</strong> Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.</p>
                <p><strong>Una Cuenta:</strong> No puedes crear múltiples cuentas para el mismo propósito.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Conducta del Usuario</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Prohibido:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Proporcionar información falsa o engañosa</li>
                  <li>Usar el servicio para actividades ilegales</li>
                  <li>Harassment, discriminación o comportamiento abusivo</li>
                  <li>Intentar acceder a cuentas de otros usuarios</li>
                  <li>Usar bots o scripts automatizados</li>
                  <li>Compartir contenido inapropiado o ofensivo</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Proyectos y Remuneración</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Naturaleza de los Proyectos:</strong> Los proyectos son de corto plazo (2-8 semanas) y no constituyen empleo permanente.</p>
                <p><strong>Remuneración:</strong> La remuneración varía según el proyecto y se acuerda directamente entre estudiante y empresa.</p>
                <p><strong>Responsabilidad:</strong> Project Core no es responsable por el pago, retrasos o disputas de remuneración.</p>
                <p><strong>Terminación:</strong> Cualquier parte puede terminar un proyecto con notificación previa.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Propiedad Intelectual</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Plataforma:</strong> Project Core conserva todos los derechos sobre la plataforma, software y contenido.</p>
                <p><strong>Contenido del Usuario:</strong> Conservas los derechos sobre el contenido que subas, pero nos otorgas licencia para usarlo en la plataforma.</p>
                <p><strong>Proyectos:</strong> Los derechos sobre el trabajo realizado en proyectos se acuerdan entre estudiante y empresa.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Privacidad y Datos</h2>
              <div className="text-gray-200 space-y-3">
                <p>El uso de tus datos personales se rige por nuestra Política de Privacidad.</p>
                <p>Al usar el servicio, consientes el procesamiento de tus datos según nuestra política.</p>
                <p>Implementamos medidas de seguridad para proteger tu información personal.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitación de Responsabilidad</h2>
              <div className="text-gray-200 space-y-3">
                <p>Project Core no es responsable por:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>La calidad o resultado de los proyectos</li>
                  <li>Disputas entre estudiantes y empresas</li>
                  <li>Pérdidas financieras o daños indirectos</li>
                  <li>Interrupciones del servicio por causas técnicas</li>
                  <li>Acciones de terceros o proveedores</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Terminación</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Por el Usuario:</strong> Puedes cerrar tu cuenta en cualquier momento.</p>
                <p><strong>Por Project Core:</strong> Podemos suspender o terminar tu cuenta por violación de estos términos.</p>
                <p><strong>Efectos:</strong> Al terminar, perderás acceso a la plataforma y tus datos se eliminarán según nuestra política de privacidad.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Ley Aplicable</h2>
              <div className="text-gray-200 space-y-3">
                <p>Estos términos se rigen por las leyes de Perú.</p>
                <p>Cualquier disputa se resolverá en los tribunales competentes de Lima, Perú.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contacto</h2>
              <div className="text-gray-200 space-y-3">
                <p>Para preguntas sobre estos términos de servicio, contáctanos en:</p>
                <p><strong>Email:</strong> contacto@projectcore.com</p>
                <p><strong>WhatsApp:</strong> +51 918 894 756</p>
                <p><strong>Ubicación:</strong> Lima, Perú</p>
              </div>
            </section>

            <div className="text-sm text-gray-400 mt-8 pt-6 border-t border-[#FF258D]/30">
              <p><strong>Última actualización:</strong> Enero 2025</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 