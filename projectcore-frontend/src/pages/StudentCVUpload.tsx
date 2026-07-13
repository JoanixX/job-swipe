import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { UploadCloud, Loader2, FileText, X, Plus, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/user-context'
import { studentAPI, authAPI, API_BASE_URL } from '@/services/backend-api'

const IA_API_URL = import.meta.env.VITE_IA_API_URL || 'http://localhost:8001/api'
const MAX_SIZE_MB = 5

type Step = 'select' | 'processing' | 'review'

export default function StudentCVUpload() {
  const [, setLocation] = useLocation()
  const { user, setUser } = useUser()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('select')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [extractionFailed, setExtractionFailed] = useState(false)
  const [cvSaved, setCvSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Formulario del CV JobSwipe, prellenado con datos del usuario + lo extraído por la IA
  const [cvForm, setCvForm] = useState({
    name: user?.name || '',
    university: user?.profileData?.university || '',
    career: user?.profileData?.career || '',
    academic_cycle: user?.profileData?.academic_cycle || 1,
    phone: user?.phone || '',
    linkedin: user?.linkedin || '',
    description: user?.profileData?.description || ''
  })

  const studentId = user?.profileData?.related_id || 0
  const userId = user?.profileData?.user_id || Number(localStorage.getItem('userId') || 0)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

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

  const handleFile = async (selected: File) => {
    setFileError('')

    if (selected.type !== 'application/pdf') {
      setFileError('Solo se permiten archivos PDF. Convierte tu CV a PDF e inténtalo de nuevo.')
      return
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`El archivo supera los ${MAX_SIZE_MB} MB permitidos.`)
      return
    }

    setFile(selected)
    setStep('processing')
    setExtractionFailed(false)

    // En paralelo: guardar el PDF en el backend y extraer habilidades con la IA
    const uploadPromise = (async () => {
      if (!userId) return false
      const fd = new FormData()
      fd.append('file', selected)
      const res = await fetch(`${API_BASE_URL}/upload/cv/${userId}`, {
        method: 'POST',
        body: fd
      })
      return res.ok
    })()

    const extractPromise = (async () => {
      const fd = new FormData()
      fd.append('file', selected)
      const res = await fetch(`${IA_API_URL}/extract_skills`, {
        method: 'POST',
        body: fd
      })
      if (!res.ok) throw new Error('extraction_failed')
      const data = await res.json()
      return (data.skills || []) as string[]
    })()

    const [uploadResult, extractResult] = await Promise.allSettled([uploadPromise, extractPromise])

    setCvSaved(uploadResult.status === 'fulfilled' && uploadResult.value === true)

    if (extractResult.status === 'fulfilled') {
      setSkills(Array.from(new Set(extractResult.value)))
    } else {
      setExtractionFailed(true)
      setSkills([])
    }

    setStep('review')
  }

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill))

  const addSkill = () => {
    const trimmed = newSkill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
    }
    setNewSkill('')
  }

  const handleConfirm = async () => {
    setIsSaving(true)
    try {
      // 1. Guardar habilidades en el perfil
      if (studentId) {
        for (const skill of skills) {
          try {
            await studentAPI.addSkillByName(Number(studentId), skill)
          } catch (e) {
            console.error(`Error agregando habilidad ${skill}:`, e)
          }
        }
      }

      // 2. Guardar los datos del formulario del CV
      try {
        if (userId) {
          await authAPI.updateUser(userId, {
            name: cvForm.name,
            phone: cvForm.phone,
            linkedin: cvForm.linkedin,
            description: cvForm.description,
          })
        }
        if (studentId) {
          await studentAPI.update(Number(studentId), {
            university: cvForm.university,
            career: cvForm.career,
            academic_cycle: Number(cvForm.academic_cycle) || 1,
          })
        }
      } catch (e) {
        console.error('Error actualizando el perfil desde el CV:', e)
      }

      // 3. Reflejar en el contexto de usuario
      if (user) {
        setUser({
          ...user,
          name: cvForm.name,
          phone: cvForm.phone,
          linkedin: cvForm.linkedin,
          profileData: {
            ...user.profileData,
            university: cvForm.university,
            career: cvForm.career,
            academic_cycle: cvForm.academic_cycle,
            description: cvForm.description,
          }
        })
      }

      setLocation('/student-profile')
    } finally {
      setIsSaving(false)
    }
  }

  const resetSelection = () => {
    setFile(null)
    setSkills([])
    setStep('select')
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"

  return (
    <div className="min-h-screen auth-gradient text-white flex flex-col font-sans">
      <div className="p-6 relative z-20" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full text-center ${step === 'review' ? 'max-w-2xl' : 'max-w-lg'}`}
        >
          <h1 className="text-3xl font-bold mb-3">
            {step === 'review' ? 'Tu CV en JobSwipe' : 'Sube tu CV'}
          </h1>
          <p className="text-white/90 text-lg mb-8 font-medium">
            {step === 'review'
              ? 'Revisa lo que completamos con tu CV y ajústalo antes de continuar'
              : 'Nuestra IA extraerá tus habilidades automáticamente'}
          </p>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left">
            <AnimatePresence mode="wait">
              {step === 'select' && (
                <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div
                    className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-all cursor-pointer ${
                      isDragging
                        ? 'border-[#6366F1] bg-indigo-50 scale-[1.02]'
                        : 'border-gray-300 hover:border-[#6366F1] hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="application/pdf"
                    />

                    <div className={`mb-4 transition-colors ${isDragging ? 'text-[#6366F1]' : 'text-gray-400'}`}>
                      <UploadCloud className="w-16 h-16" />
                    </div>

                    <h3 className="text-gray-900 font-bold text-lg mb-2">
                      {isDragging ? '¡Suéltalo aquí!' : 'Arrastra tu CV aquí'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">o haz clic para seleccionar</p>

                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">
                      Solo PDF · máx. {MAX_SIZE_MB} MB
                    </span>
                  </div>

                  {fileError && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                      {fileError}
                    </div>
                  )}

                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setLocation('/student-profile')}
                      className="text-[#6366F1] hover:text-[#2D4A9F] font-medium transition-colors"
                    >
                      Omitir por ahora
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <Loader2 className="w-12 h-12 text-[#6366F1] animate-spin mb-4" />
                  <p className="text-gray-900 font-bold text-lg">Analizando CV con IA...</p>
                  <p className="text-gray-500 text-sm mb-4">Guardando tu documento y extrayendo habilidades</p>
                  {file && (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                      <FileText className="w-4 h-4 text-[#6366F1]" />
                      <span className="text-gray-700 text-sm font-medium">{file.name}</span>
                      <span className="text-gray-400 text-xs">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'review' && (
                <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Estado del CV */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cvSaved ? 'bg-green-50' : 'bg-amber-50'}`}>
                      {cvSaved
                        ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                        : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold">
                        {cvSaved ? 'CV guardado correctamente' : 'CV procesado'}
                      </h3>
                      {file && <p className="text-gray-400 text-xs">{file.name}</p>}
                    </div>
                  </div>

                  {extractionFailed && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-6">
                      No pudimos extraer habilidades automáticamente. Completa el formulario manualmente.
                    </div>
                  )}

                  {/* Formulario del CV JobSwipe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Nombre Completo</label>
                      <input type="text" value={cvForm.name} onChange={(e) => setCvForm({ ...cvForm, name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Universidad</label>
                      <input type="text" value={cvForm.university} onChange={(e) => setCvForm({ ...cvForm, university: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Carrera</label>
                      <input type="text" value={cvForm.career} onChange={(e) => setCvForm({ ...cvForm, career: e.target.value })} className={inputClass} placeholder="Ej. Ingeniería de Sistemas" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Ciclo Académico</label>
                      <select
                        value={cvForm.academic_cycle}
                        onChange={(e) => setCvForm({ ...cvForm, academic_cycle: Number(e.target.value) })}
                        className={inputClass}
                      >
                        <option value={0}>Ya terminé</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(c => (
                          <option key={c} value={c}>{c}° ciclo</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Teléfono</label>
                      <input type="tel" value={cvForm.phone} onChange={(e) => setCvForm({ ...cvForm, phone: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">LinkedIn</label>
                      <input type="url" value={cvForm.linkedin} onChange={(e) => setCvForm({ ...cvForm, linkedin: e.target.value })} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Descripción Profesional</label>
                      <textarea
                        value={cvForm.description}
                        onChange={(e) => setCvForm({ ...cvForm, description: e.target.value })}
                        rows={2}
                        maxLength={350}
                        className={inputClass}
                        placeholder="Un resumen breve de tu perfil"
                      />
                    </div>
                  </div>

                  {/* Habilidades extraídas */}
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6366F1]" />
                    <label className="text-xs font-semibold text-gray-700">
                      Habilidades detectadas por la IA ({skills.length}) — quita o agrega las que quieras
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                    {skills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 bg-[#6366F1]/10 text-[#1E3A8A] text-sm font-medium px-3 py-1.5 rounded-full"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          aria-label={`Quitar ${skill}`}
                          className="text-[#1E3A8A]/50 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-8">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                      placeholder="Agregar habilidad..."
                      className={`flex-1 ${inputClass}`}
                    />
                    <button
                      onClick={addSkill}
                      aria-label="Agregar habilidad"
                      className="bg-[#6366F1]/10 text-[#1E3A8A] rounded-xl px-3 hover:bg-[#6366F1]/20 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <Button
                    onClick={handleConfirm}
                    disabled={isSaving}
                    className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base transition-colors disabled:opacity-70"
                  >
                    {isSaving
                      ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</span>
                      : 'Continuar con estos datos'}
                  </Button>

                  <div className="mt-4 text-center">
                    <button
                      onClick={resetSelection}
                      className="text-[#6366F1] hover:text-[#2D4A9F] text-sm font-medium transition-colors"
                    >
                      Subir otro archivo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
