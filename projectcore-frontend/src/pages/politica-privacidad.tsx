'use client'

import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'

export default function PoliticaPrivacidad() {
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
            Política de Privacidad
          </h1>
          
          <div className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/30 rounded-xl p-8 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Información que Recopilamos</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Información Personal:</strong> Nombre, correo electrónico, número de teléfono, información académica y profesional.</p>
                <p><strong>Información del Perfil:</strong> Habilidades, intereses, experiencia, portafolio y documentos académicos.</p>
                <p><strong>Información de Uso:</strong> Actividad en la plataforma, proyectos aplicados y preferencias de matching.</p>
                <p><strong>Información Técnica:</strong> Dirección IP, tipo de dispositivo, navegador y datos de cookies.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Cómo Utilizamos tu Información</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Matching Inteligente:</strong> Para conectar estudiantes con proyectos afines a sus habilidades e intereses.</p>
                <p><strong>Comunicación:</strong> Para notificarte sobre oportunidades, actualizaciones y mensajes importantes.</p>
                <p><strong>Mejora del Servicio:</strong> Para optimizar nuestra plataforma y algoritmos de matching.</p>
                <p><strong>Seguridad:</strong> Para proteger tu cuenta y prevenir actividades fraudulentas.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Compartir Información</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Con Empresas:</strong> Solo compartimos información relevante para el matching de proyectos, previo consentimiento.</p>
                <p><strong>Con Proveedores:</strong> Trabajamos con terceros confiables para operaciones técnicas y de soporte.</p>
                <p><strong>Legal:</strong> Podemos compartir información cuando sea requerido por ley o para proteger derechos.</p>
                <p><strong>Nunca vendemos:</strong> Tu información personal a terceros con fines comerciales.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Seguridad de Datos</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Encriptación:</strong> Utilizamos encriptación SSL para proteger la transmisión de datos.</p>
                <p><strong>Almacenamiento Seguro:</strong> Tus datos se almacenan en servidores seguros con acceso restringido.</p>
                <p><strong>Acceso Limitado:</strong> Solo personal autorizado tiene acceso a información personal.</p>
                <p><strong>Monitoreo Continuo:</strong> Implementamos medidas de seguridad y las actualizamos regularmente.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Tus Derechos</h2>
              <div className="text-gray-200 space-y-3">
                <p><strong>Acceso:</strong> Puedes solicitar una copia de la información que tenemos sobre ti.</p>
                <p><strong>Rectificación:</strong> Puedes actualizar o corregir tu información personal en cualquier momento.</p>
                <p><strong>Eliminación:</strong> Puedes solicitar la eliminación de tu cuenta y datos personales.</p>
                <p><strong>Portabilidad:</strong> Puedes solicitar la transferencia de tus datos a otro servicio.</p>
                <p><strong>Oposición:</strong> Puedes oponerte al procesamiento de tus datos en ciertas circunstancias.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies y Tecnologías Similares</h2>
              <div className="text-gray-200 space-y-3">
                <p>Utilizamos cookies para mejorar tu experiencia, recordar preferencias y analizar el uso de la plataforma.</p>
                <p>Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Retención de Datos</h2>
              <div className="text-gray-200 space-y-3">
                <p>Conservamos tu información mientras mantengas una cuenta activa o según sea necesario para los fines descritos.</p>
                <p>Al cerrar tu cuenta, eliminamos o anonimizamos tu información personal en un plazo razonable.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Menores de Edad</h2>
              <div className="text-gray-200 space-y-3">
                <p>Nuestro servicio está dirigido a estudiantes universitarios mayores de 18 años.</p>
                <p>No recopilamos intencionalmente información de menores de edad sin consentimiento parental.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Cambios a esta Política</h2>
              <div className="text-gray-200 space-y-3">
                <p>Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos.</p>
                <p>El uso continuado de la plataforma después de los cambios constituye aceptación de la nueva política.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Contacto</h2>
              <div className="text-gray-200 space-y-3">
                <p>Para preguntas sobre esta política de privacidad, contáctanos en:</p>
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