import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { UploadCloud, Loader2 } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { studentAPI } from '@/services/backend-api'

export default function StudentCVUpload() {
  const [, setLocation] = useLocation()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { user } = useUser()
  const studentId = user?.profileData?.related_id || user?.id || 0

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      alert('Por favor sube solo archivos PDF')
      return
    }

    setIsUploading(true)

    try {
      // 1. Upload to KawsAI extraction endpoint
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('http://localhost:8001/api/extract_skills', {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) {
        throw new Error('Error extrayendo habilidades del PDF')
      }
      
      const data = await res.json()
      const extractedSkills: string[] = data.skills || []
      
      if (extractedSkills.length > 0 && studentId) {
        // 2. Add each extracted skill to the student profile
        for (const skill of extractedSkills) {
          try {
            await studentAPI.addSkillByName(studentId, skill)
          } catch (e) {
            console.error(`Error adding skill ${skill}:`, e)
          }
        }
        alert(`¡CV analizado con éxito! Se encontraron ${extractedSkills.length} habilidades: ${extractedSkills.join(', ')}.`)
      } else if (extractedSkills.length === 0) {
        alert('El CV fue procesado pero no se encontraron habilidades tecnológicas clave. Puedes agregarlas manualmente luego.')
      }
      
      setLocation('/student-profile')
    } catch (error) {
      console.error(error)
      alert('Hubo un error al procesar tu CV. Inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D4A9F] to-[#4F6CDB] text-white flex flex-col items-center justify-center p-4 font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg text-center"
      >
        <h1 className="text-3xl font-bold mb-3">Sube tu CV</h1>
        <p className="text-white/90 text-lg mb-8 font-medium">Nuestra IA extraerá tus habilidades automáticamente</p>

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#4F6CDB] animate-spin mb-4" />
              <p className="text-gray-900 font-bold text-lg">Analizando CV con IA...</p>
              <p className="text-gray-500 text-sm">Extrayendo habilidades clave</p>
            </div>
          )}
          
          <div 
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-colors cursor-pointer ${
              isDragging ? 'border-[#4F6CDB] bg-blue-50' : 'border-gray-300 hover:border-[#4F6CDB] hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
            />
            
            <div className="mb-4 text-gray-400">
              <UploadCloud className="w-16 h-16" />
            </div>
            
            <h3 className="text-gray-900 font-bold text-lg mb-2">Arrastra tu CV aquí</h3>
            <p className="text-gray-500 text-sm mb-4">o haz clic para seleccionar</p>
            
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">
              Solo archivos PDF
            </span>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => setLocation('/student-profile')}
              className="text-[#4F6CDB] hover:text-[#2D4A9F] font-medium transition-colors"
            >
              Omitir por ahora
            </button>
          </div>
          
        </div>
      </motion.div>
      
    </div>
  )
}
