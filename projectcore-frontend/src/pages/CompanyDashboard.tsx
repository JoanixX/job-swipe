import React, { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Eye, 
  LayoutDashboard,
  LogOut,
  CheckCircle2,
  ChevronRight,
  Plus,
  Star,
  Mail,
  Calendar,
  Lock,
  Trash2,
  Download,
  Edit2,
  X,
  ChevronLeft,
  Save,
  XCircle
} from 'lucide-react'
import { API_BASE_URL } from '@/services/backend-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUser } from '@/lib/user-context'

export default function CompanyDashboard() {
  const { user, setUser } = useUser()
  const [, setLocation] = useLocation()
  const [activeView, setActiveView] = useState('dashboard')
  
  // Post Offer State
  const [postStep, setPostStep] = useState(1)
  const [offerData, setOfferData] = useState({
    title: '',
    location: '',
    modality: 'Híbrido',
    salary: '',
    description: '',
    skills: '',
    requirements: '',
    benefits: ''
  })
  const [currentSkill, setCurrentSkill] = useState('')
  
  // Company Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [companyProfile, setCompanyProfile] = useState({
    name: 'TechCorp SAC',
    ruc: '20123456789',
    email: 'reclutamiento@techcorp.com',
    phone: '+51 999 111 222',
    website: 'techcorp.com',
    address: 'Av. Principal 123, San Isidro, Lima'
  })

  // Candidates State
  const [companyOffers, setCompanyOffers] = useState<any[]>([])
  const [selectedOffer, setSelectedOffer] = useState<string>('')
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  
  // Edit Offer State
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null)
  const [editOfferData, setEditOfferData] = useState({
    title: '', location: '', modality: 'Híbrido', salary: '', description: '', skills: '', requirements: '', benefits: ''
  })
  
  const [candidatesList, setCandidatesList] = useState<any[]>([])
  const [candidateStats, setCandidateStats] = useState({ matchPromedio: 0, topCandidatos: 0, contactados: 0, entrevistas: 0 })

  // Security State
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })

  useEffect(() => {
    const companyId = localStorage.getItem('companyId')
    
    if (activeView === 'company-profile' && companyId) {
      fetch(`${API_BASE_URL}/company/${companyId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.name) {
            setCompanyProfile({
              name: data.name || '',
              ruc: data.ruc || '',
              email: data.contact_email || data.email || '',
              phone: data.phone || '',
              website: data.website || '',
              address: data.location || ''
            })
          }
        })
        .catch(err => console.error("Error fetching company profile:", err))
    }

    if ((activeView === 'candidates' || activeView === 'dashboard') && companyId) {
      fetch(`${API_BASE_URL}/company/${companyId}/job_offers`)
        .then(res => res.json())
        .then((data: any[]) => {
          if (Array.isArray(data)) {
            setCompanyOffers(data.map(offer => ({
              ...offer,
              id: offer.id.toString(),
            })))
          }
        })
        .catch(err => {
          console.error("Error fetching company offers:", err)
          // Fallback to empty if it fails
          setCompanyOffers([])
        })
      
      setSelectedOffer('') // Select nothing by default
    }
  }, [activeView])

  const parseOfferDescription = (desc: string) => {
    let description = desc || '';
    let requirements = '';
    let benefits = '';
    let skills = '';
    const reqSplit = description.split('\n\nRequisitos:\n');
    description = reqSplit[0];
    if (reqSplit[1]) {
      const benSplit = reqSplit[1].split('\n\nBeneficios:\n');
      requirements = benSplit[0];
      if (benSplit[1]) {
        const skillsSplit = benSplit[1].split('\n\nHabilidades Técnicas:\n');
        benefits = skillsSplit[0];
        skills = skillsSplit[1] || '';
      }
    }
    return { description, requirements, benefits, skills };
  }

  const openEditOffer = (offer: any) => {
    const parsed = parseOfferDescription(offer.description);
    setEditOfferData({
      title: offer.title || '',
      location: offer.location || '', 
      modality: offer.modality === 1 ? 'Presencial' : offer.modality === 2 ? 'Híbrido' : 'Remoto',
      salary: offer.approximated_salary?.toString() || '',
      description: parsed.description,
      requirements: parsed.requirements,
      benefits: parsed.benefits,
      skills: parsed.skills
    });
    setEditingOfferId(offer.id);
    setActiveView('edit-offer');
  }

  const handleUpdateOffer = async () => {
    if (!editingOfferId) return;
    try {
      const payload = {
        company_id: parseInt(localStorage.getItem('companyId') || '0'),
        title: editOfferData.title,
        description: `${editOfferData.description}\n\nRequisitos:\n${editOfferData.requirements}\n\nBeneficios:\n${editOfferData.benefits}\n\nHabilidades Técnicas:\n${editOfferData.skills}`,
        required_hours: 30,
        approximated_salary: parseInt(editOfferData.salary) || 0,
        duration: 6,
        start_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        modality: editOfferData.modality === 'Presencial' ? 1 : editOfferData.modality === 'Híbrido' ? 2 : 3,
        location: editOfferData.location || null
      }
      const response = await fetch(`${API_BASE_URL}/job_offer/${editingOfferId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (response.ok) {
        alert("Vacante actualizada exitosamente");
        setActiveView('dashboard');
      } else {
        alert("Error al actualizar la vacante");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red");
    }
  }

  const handleDeleteOffer = async () => {
    if (!editingOfferId) return;
    if (!window.confirm("¿Seguro que quieres cerrar esta vacante?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/job_offer/${editingOfferId}`, { method: 'DELETE' })
      if (response.ok) {
        alert("Vacante cerrada exitosamente");
        setActiveView('dashboard');
      } else {
        alert("Error al cerrar la vacante");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red");
    }
  }

  const fetchCandidatesForOffer = async (offerId: string) => {
    if (!offerId) {
      setCandidatesList([])
      setCandidateStats({ matchPromedio: 0, topCandidatos: 0, contactados: 0, entrevistas: 0 })
      return
    }

    try {
      const matchRes = await fetch(`${API_BASE_URL}/aimodel/job_offer/best_students/${offerId}`, { method: 'POST' })
      if (!matchRes.ok) throw new Error("Error fetching best students")
      
      const matchData = await matchRes.json()
      
      if (!Array.isArray(matchData) || matchData.length === 0) {
        setCandidatesList([])
        setCandidateStats({ matchPromedio: 0, topCandidatos: 0, contactados: 0, entrevistas: 0 })
        return
      }

      const detailedCandidates = await Promise.all(matchData.map(async (match: any) => {
        try {
          const studentRes = await fetch(`${API_BASE_URL}/student/${match.student_id}`)
          const studentData = await studentRes.json()
          
          const skillsRes = await fetch(`${API_BASE_URL}/student/${match.student_id}/skills`)
          const skillsData = await skillsRes.json()
          const skills = Array.isArray(skillsData) ? skillsData.map((s: any) => s.skill_name || `Skill ${s.skill_id}`) : []

          return {
            name: `Estudiante Universitario #${match.student_id}`, // Name not available directly in student endpoint
            email: 'Candidato protegido',
            uni: studentData.university || 'Universidad Registrada',
            match: Math.round(match.score * 100),
            skills: skills.slice(0, 3), // Show up to 3 skills
            time: 'Reciente',
            score: match.score
          }
        } catch (e) {
          return null
        }
      }))

      const validCandidates = detailedCandidates.filter(c => c !== null).sort((a, b) => b.score - a.score)
      
      const avgMatch = validCandidates.length > 0 
        ? validCandidates.reduce((acc, curr) => acc + curr.match, 0) / validCandidates.length
        : 0

      setCandidateStats({ 
        matchPromedio: Math.round(avgMatch * 10) / 10, 
        topCandidatos: validCandidates.length, 
        contactados: 0, 
        entrevistas: 0 
      })
      setCandidatesList(validCandidates)

    } catch (err) {
      console.error("Error fetching candidates:", err)
      setCandidatesList([])
      setCandidateStats({ matchPromedio: 0, topCandidatos: 0, contactados: 0, entrevistas: 0 })
    }
  }

  useEffect(() => {
    fetchCandidatesForOffer(selectedOffer)
  }, [selectedOffer])

  const publishOffer = async () => {
    const companyId = localStorage.getItem('companyId')
    if (!companyId) {
      alert("No se encontró el ID de la empresa.")
      return
    }

    try {
      const payload = {
        company_id: parseInt(companyId),
        title: offerData.title,
        description: `${offerData.description}\n\nRequisitos:\n${offerData.requirements}\n\nBeneficios:\n${offerData.benefits}\n\nHabilidades Técnicas:\n${offerData.skills}`,
        required_hours: 30, // Default for practicante
        approximated_salary: parseInt(offerData.salary) || 0,
        duration: 6, // Default 6 months
        start_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Next month
        modality: offerData.modality === 'Presencial' ? 1 : offerData.modality === 'Híbrido' ? 2 : 3,
        location: offerData.location || null
      }

      const response = await fetch(`${API_BASE_URL}/register/job_offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setPostStep(4)
      } else {
        const errorData = await response.json()
        alert(`Error al publicar: ${JSON.stringify(errorData)}`)
      }
    } catch (error) {
      console.error("Error publishing offer:", error)
      alert("Ocurrió un error de conexión al publicar la oferta.")
    }
  }

  const handleUpdateProfile = async () => {
    const companyId = localStorage.getItem('companyId')
    if (!companyId) return

    try {
      // El backend requiere name, industry, company_culture para CompanyCreate
      const response = await fetch(`${API_BASE_URL}/company/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: companyProfile.name,
          industry: "Desarrollo", // Default fallback if not fetched
          company_culture: "Innovadora",
          // Extra fields in case backend is updated to support them:
          contact_email: companyProfile.email,
          phone: companyProfile.phone,
          website: companyProfile.website,
          location: companyProfile.address
        })
      })

      if (response.ok) {
        setIsEditingProfile(false)
        alert("Perfil actualizado exitosamente")
      } else {
        alert("Hubo un error al actualizar el perfil")
      }
    } catch (err) {
      console.error(err)
      alert("Error de red al actualizar el perfil")
    }
  }

  const handleUpdatePassword = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert("Por favor llena todos los campos de contraseña")
      return
    }
    if (passwordData.new !== passwordData.confirm) {
      alert("Las nuevas contraseñas no coinciden")
      return
    }

    const email = localStorage.getItem('userEmail') // Suponiendo que se guarda el email al hacer login
    // Si no está, podríamos usar un endpoint que use el companyId o el token
    try {
      const response = await fetch(`${API_BASE_URL}/user/${email || 'current'}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: passwordData.current,
          new_password: passwordData.new
        })
      })

      if (response.ok) {
        alert("Contraseña actualizada exitosamente")
        setPasswordData({ current: '', new: '', confirm: '' })
      } else {
        alert("Error al actualizar contraseña. Verifica tu contraseña actual.")
      }
    } catch (err) {
      console.error(err)
      alert("Error de red al actualizar la contraseña")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('companyId')
    setUser(null)
    setLocation('/')
  }

  const renderSidebar = () => (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-50 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 leading-tight">JobSwipe</h2>
          <p className="text-xs text-gray-500">Panel Empresarial</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'dashboard' 
              ? 'bg-[#1e3a8a] text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('post-offer')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'post-offer' 
              ? 'bg-[#1e3a8a] text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          Publicar Oferta
        </button>
        <button
          onClick={() => {
            setActiveView('candidates')
            setSelectedCandidate(null)
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'candidates' 
              ? 'bg-[#1e3a8a] text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-5 h-5" />
          Candidatos IA
        </button>
      </nav>

      <div className="p-4 border-t border-gray-50 space-y-1">
        <button 
          onClick={() => setActiveView('company-profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'company-profile' 
              ? 'bg-[#1e3a8a] text-white' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-5 h-5" />
          Mi Empresa
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500">Monitorea tu rendimiento de reclutamiento</p>
        </div>
        <Button 
          className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white gap-2 rounded-lg"
          onClick={() => setActiveView('post-offer')}
        >
          <Plus className="w-4 h-4" />
          Publicar Nueva Oferta
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Vacantes Activas</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">12</h3>
            <p className="text-xs text-gray-400 mt-2">+2 esta semana</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Postulantes Totales</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">347</h3>
            <p className="text-xs text-gray-400 mt-2">+48 esta semana</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Vistas de Perfil</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">1,203</h3>
            <p className="text-xs text-gray-400 mt-2">+12% vs semana anterior</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Match Promedio</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">84%</h3>
            <p className="text-xs text-gray-400 mt-2">+3% de mejora</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Vacantes Publicadas</h3>
          <Card className="bg-white border-gray-100 shadow-sm rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-50">
              {companyOffers.length > 0 ? companyOffers.map((offer, i) => (
                <div key={offer.id} onClick={() => openEditOffer(offer)} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-semibold text-gray-900">{offer.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">S/ {offer.approximated_salary}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Postulantes</p>
                      <p className="font-semibold text-[#1e3a8a]">{Math.floor(Math.random() * 50)}</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-medium">
                      Activa
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="p-5 text-center text-gray-500">No hay vacantes publicadas aún.</div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Acciones Rápidas</h3>
          <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 space-y-3">
              <button className="w-full text-left p-4 rounded-lg border border-gray-100 hover:border-[#1e3a8a]/20 hover:bg-blue-50/30 transition-all group">
                <h4 className="font-semibold text-gray-900 group-hover:text-[#1e3a8a]">Revisar Nuevos Candidatos</h4>
                <p className="text-xs text-gray-400 mt-1">23 candidatos esperando</p>
              </button>
              <button className="w-full text-left p-4 rounded-lg border border-gray-100 hover:border-[#1e3a8a]/20 hover:bg-blue-50/30 transition-all group">
                <h4 className="font-semibold text-gray-900 group-hover:text-[#1e3a8a]">Programar Entrevistas</h4>
                <p className="text-xs text-gray-400 mt-1">5 invitaciones pendientes</p>
              </button>
              <button className="w-full text-left p-4 rounded-lg border border-gray-100 hover:border-[#1e3a8a]/20 hover:bg-blue-50/30 transition-all group">
                <h4 className="font-semibold text-gray-900 group-hover:text-[#1e3a8a]">Exportar Reportes</h4>
                <p className="text-xs text-gray-400 mt-1">Generar analíticas</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderPostOffer = () => {
    if (postStep === 4) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Oferta Publicada Exitosamente!</h2>
          <p className="text-gray-500 text-center max-w-md mb-8">
            Tu vacante está ahora activa y los candidatos pueden empezar a postular. El motor de IA comenzará a buscar los mejores matches.
          </p>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="border-gray-200 text-gray-600 rounded-lg"
              onClick={() => {
                setPostStep(1)
                setOfferData({
                  title: '', location: '', modality: 'Híbrido', salary: '', description: '', skills: '', requirements: '', benefits: ''
                })
              }}
            >
              Publicar Otra Oferta
            </Button>
            <Button 
              className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg"
              onClick={() => {
                setActiveView('dashboard')
                setPostStep(1)
              }}
            >
              Ir al Dashboard
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Publicar Nueva Oferta</h1>
          <p className="text-gray-500 mt-1">Completa los detalles para crear tu vacante bajo Modalidad Formativa</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-4">
          {[
            { step: 1, label: 'Información Básica' },
            { step: 2, label: 'Requisitos' },
            { step: 3, label: 'Revisión' }
          ].map((s, i) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  postStep >= s.step ? 'bg-[#1e3a8a] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {s.step}
                </div>
                <span className={`text-sm font-medium ${postStep >= s.step ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-px bg-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-8">
            {postStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Título de la Práctica</label>
                  <Input 
                    placeholder="ej. Practicante de Desarrollo Web" 
                    className="bg-white border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] text-gray-900"
                    value={offerData.title}
                    onChange={e => setOfferData({...offerData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Ubicación</label>
                  <Input 
                    placeholder="ej. San Isidro, Lima" 
                    className="bg-white border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] text-gray-900"
                    value={offerData.location}
                    onChange={e => setOfferData({...offerData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Modalidad de Trabajo</label>
                  <Select value={offerData.modality} onValueChange={(val) => setOfferData({...offerData, modality: val})}>
                    <SelectTrigger className="bg-white border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] text-gray-900">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900">
                      <SelectItem value="Presencial" className="text-gray-900 focus:bg-gray-100">Presencial</SelectItem>
                      <SelectItem value="Híbrido" className="text-gray-900 focus:bg-gray-100">Híbrido</SelectItem>
                      <SelectItem value="Remoto" className="text-gray-900 focus:bg-gray-100">Remoto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Subvención Mensual (S/)</label>
                  <Input 
                    type="number"
                    placeholder="ej. 1200" 
                    className="bg-white border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] text-gray-900"
                    value={offerData.salary}
                    onChange={e => setOfferData({...offerData, salary: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Descripción de la Práctica</label>
                  <Textarea 
                    placeholder="Describe las responsabilidades y lo que el practicante realizará..." 
                    className="min-h-[120px] bg-white border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] text-gray-900"
                    value={offerData.description}
                    onChange={e => setOfferData({...offerData, description: e.target.value})}
                  />
                </div>
              </div>
            )}

            {postStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Habilidades Técnicas Requeridas</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {offerData.skills.split(',').filter(Boolean).map((skill, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 text-gray-900 shadow-sm text-sm rounded-md">
                        {skill}
                        <button type="button" onClick={() => {
                          const newSkills = offerData.skills.split(',').filter(s => s !== skill).join(',');
                          setOfferData({...offerData, skills: newSkills});
                        }} className="hover:text-red-500 text-gray-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input 
                    placeholder="Escribe una habilidad y presiona Enter o Coma" 
                    className="bg-white border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] text-gray-900"
                    value={currentSkill}
                    onChange={e => {
                      const val = e.target.value;
                      if (val.endsWith(',')) {
                        const newSkill = val.slice(0, -1).trim();
                        if (newSkill) {
                          const currentSkills = offerData.skills ? offerData.skills.split(',') : [];
                          if (!currentSkills.includes(newSkill)) {
                            setOfferData({...offerData, skills: [...currentSkills, newSkill].join(',')});
                          }
                        }
                        setCurrentSkill('');
                      } else {
                        setCurrentSkill(val);
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const newSkill = currentSkill.trim();
                        if (newSkill) {
                          const currentSkills = offerData.skills ? offerData.skills.split(',') : [];
                          if (!currentSkills.includes(newSkill)) {
                            setOfferData({...offerData, skills: [...currentSkills, newSkill].join(',')});
                          }
                        }
                        setCurrentSkill('');
                      }
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-2">La IA usará estas habilidades para calcular el % de match con candidatos</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Requisitos del Postulante</label>
                  <Textarea 
                    placeholder="Lista los requisitos académicos y de experiencia..." 
                    className="min-h-[100px] bg-white border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] text-gray-900"
                    value={offerData.requirements}
                    onChange={e => setOfferData({...offerData, requirements: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Beneficios y Ventajas</label>
                  <Textarea 
                    placeholder="Lista los beneficios, capacitaciones, horarios flexibles..." 
                    className="min-h-[100px] bg-white border-gray-200 focus:border-[#1e3a8a] focus:ring-[#1e3a8a] text-gray-900"
                    value={offerData.benefits}
                    onChange={e => setOfferData({...offerData, benefits: e.target.value})}
                  />
                </div>
              </div>
            )}

            {postStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-bold text-gray-900">Revisa tu Publicación</h3>
                  <p className="text-sm text-gray-500">Verifica toda la información antes de publicar</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Título</p>
                    <p className="font-semibold text-gray-900">{offerData.title || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ubicación</p>
                    <p className="font-semibold text-gray-900">{offerData.location || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Modalidad</p>
                    <p className="font-semibold text-gray-900">{offerData.modality || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Subvención</p>
                    <p className="font-semibold text-gray-900">S/ {offerData.salary || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Habilidades Requeridas</p>
                    <p className="font-semibold text-gray-900">{offerData.skills || 'No especificadas'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <Button 
                variant="ghost"
                className={`text-gray-500 hover:bg-gray-50 ${postStep === 1 ? 'invisible' : ''}`}
                onClick={() => setPostStep(p => Math.max(1, p - 1))}
              >
                Atrás
              </Button>
              <Button 
                className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg gap-2"
                onClick={() => {
                  // Validaciones
                  if (postStep === 1) {
                    if (!offerData.title || !offerData.location || !offerData.modality || !offerData.salary || !offerData.description) {
                      alert('Por favor completa todos los campos de Información Básica.');
                      return;
                    }
                  } else if (postStep === 2) {
                    if (!offerData.skills || !offerData.requirements || !offerData.benefits) {
                      alert('Por favor completa todos los campos de Requisitos.');
                      return;
                    }
                  } else if (postStep === 3) {
                    publishOffer();
                    return;
                  }
                  
                  setPostStep(p => Math.min(4, p + 1))
                }}
              >
                {postStep === 3 ? 'Publicar Oferta' : 'Siguiente'}
                {postStep < 3 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderCandidateProfile = () => {
    const c = selectedCandidate
    return (
      <div className="space-y-6 max-w-5xl">
        <button 
          onClick={() => setSelectedCandidate(null)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Volver a la Lista
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{c.name}</h1>
            <p className="text-gray-500 text-lg mt-1">{c.uni}</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl text-center">
            <p className="text-2xl font-bold">{c.match}%</p>
            <p className="text-xs font-semibold">Match IA</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" /> Información de Contacto
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-center gap-3"><Mail className="w-4 h-4" /> {c.email}</p>
                  <p className="flex items-center gap-3"><span className="w-4 h-4 text-center">📞</span> +51 999 888 777</p>
                  <p className="flex items-center gap-3"><span className="w-4 h-4 text-center">🔗</span> linkedin.com/in/{c.name.split(' ')[0].toLowerCase()}</p>
                  <p className="flex items-center gap-3"><span className="w-4 h-4 text-center">🌐</span> {c.name.split(' ')[0].toLowerCase()}.dev</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-400" /> Habilidades Técnicas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {c.skills.map((s: string) => (
                    <Badge key={s} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none px-3 py-1">
                      {s}
                    </Badge>
                  ))}
                  <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none px-3 py-1">HTML/CSS</Badge>
                  <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none px-3 py-1">Git</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-400" /> Experiencia
                </h3>
                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-indigo-100">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1"></div>
                    <h4 className="font-bold text-gray-900">Voluntariado Técnico</h4>
                    <p className="text-sm text-gray-500 mb-2">TechForGood • 6 meses</p>
                    <p className="text-sm text-gray-600">Desarrollo de aplicación web para ONG local usando React</p>
                  </div>
                  <div className="relative pl-6 border-l-2 border-indigo-100">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1"></div>
                    <h4 className="font-bold text-gray-900">Proyecto Universitario</h4>
                    <p className="text-sm text-gray-500 mb-2">Universidad • 4 meses</p>
                    <p className="text-sm text-gray-600">Sistema de gestión académica con Node.js y MongoDB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" /> Idiomas
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Español (Nativo)</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Inglés (Intermedio)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-400" /> Información Académica
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400">Universidad</p>
                    <p className="font-medium text-gray-900 text-sm">{c.uni}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Carrera</p>
                    <p className="font-medium text-gray-900 text-sm">Ingeniería de Sistemas</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ciclo Actual</p>
                    <p className="font-medium text-gray-900 text-sm">9no ciclo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">Disponibilidad</h3>
                <p className="text-emerald-600 font-medium">Inmediata</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Gestión de Candidato</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Aceptar Candidato
                  </Button>
                  <Button variant="outline" className="w-full border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
                    <Trash2 className="w-4 h-4 mr-2" /> Descartar
                  </Button>
                  <p className="text-xs text-gray-400 text-center mt-2 leading-relaxed">
                    Al aceptar, se enviará un correo automático al candidato y se creará un Match oficial.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderCandidates = () => {
    if (selectedCandidate) {
      return renderCandidateProfile()
    }

    const currentOfferName = selectedOffer 
      ? companyOffers.find(o => o.id === selectedOffer)?.title || ''
      : 'Ninguna oferta seleccionada'

    return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidatos con IA</h1>
          <p className="text-gray-500 mt-1">Postulantes filtrados para: <span className="font-semibold text-[#1e3a8a]">{currentOfferName}</span></p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedOffer} onValueChange={setSelectedOffer}>
            <SelectTrigger className="w-64 bg-white border-gray-100 shadow-sm h-10 text-gray-900 font-bold">
              <SelectValue placeholder="Selecciona una oferta" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              {companyOffers.map(offer => (
                <SelectItem key={offer.id} value={offer.id} className="text-gray-900 font-semibold focus:bg-gray-100">
                  {offer.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white border-gray-200 text-gray-700 shadow-sm gap-2 rounded-lg h-10">
            <Download className="w-4 h-4" /> Exportar CSV
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <p className="text-sm text-gray-500 font-medium">Match Promedio</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{candidateStats.matchPromedio}%</h3>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-orange-400" />
              <p className="text-sm text-gray-500 font-medium">Top Candidatos</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{candidateStats.topCandidatos}</h3>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-green-500" />
              <p className="text-sm text-gray-500 font-medium">Contactados</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{candidateStats.contactados}</h3>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <p className="text-sm text-gray-500 font-medium">Entrevistas</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{candidateStats.entrevistas}</h3>
          </CardContent>
        </Card>
      </div>

      {selectedOffer && candidatesList.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <Users className="w-5 h-5 text-blue-500" />
          <p><strong>Filtro IA activo:</strong> Mostrando solo candidatos con compatibilidad ≥ 30% ({candidatesList.length} candidatos)</p>
        </div>
      )}

      <Card className="bg-white border-gray-100 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="py-4 px-6 font-semibold">Rank</th>
                <th className="py-4 px-6 font-semibold">Candidato</th>
                <th className="py-4 px-6 font-semibold">% Match IA</th>
                <th className="py-4 px-6 font-semibold">Top Skills</th>
                <th className="py-4 px-6 font-semibold">Postulación</th>
                <th className="py-4 px-6 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidatesList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No hay candidatos para mostrar. Selecciona una oferta arriba para ver los resultados del emparejamiento con IA.
                  </td>
                </tr>
              ) : (
                candidatesList.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                      {i < candidateStats.topCandidatos && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.email}</p>
                      <p className="text-xs text-gray-400">{c.uni}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${c.match}%` }} />
                      </div>
                      <span className="font-medium text-emerald-600">{c.match}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {c.skills.map((s: string) => (
                        <span key={s} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{c.time}</td>
                  <td className="py-4 px-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedCandidate(c)}
                      className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Ver Perfil
                    </Button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
    )
  }

  const renderCompanyProfile = () => (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil Empresarial</h1>
        <p className="text-gray-500 mt-1">Gestiona la información de tu empresa</p>
      </div>

      <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 bg-[#1e3a8a] rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{companyProfile.name || 'Empresa'}</h2>
              <p className="text-sm text-gray-500">RUC: {companyProfile.ruc || 'N/A'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Nombre de la Empresa</label>
              <Input 
                value={companyProfile.name}
                onChange={e => setCompanyProfile({...companyProfile, name: e.target.value})}
                readOnly={!isEditingProfile}
                className={`border-white focus:border-gray-200 bg-gray-50 shadow-none focus:bg-white text-gray-900 ${!isEditingProfile ? 'opacity-75 cursor-not-allowed' : ''}`} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Correo Corporativo</label>
              <Input 
                value={companyProfile.email}
                onChange={e => setCompanyProfile({...companyProfile, email: e.target.value})}
                readOnly={!isEditingProfile}
                className={`border-white focus:border-gray-200 bg-gray-50 shadow-none focus:bg-white text-gray-900 ${!isEditingProfile ? 'opacity-75 cursor-not-allowed' : ''}`} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Teléfono</label>
              <Input 
                value={companyProfile.phone}
                onChange={e => setCompanyProfile({...companyProfile, phone: e.target.value})}
                readOnly={!isEditingProfile}
                className={`border-white focus:border-gray-200 bg-gray-50 shadow-none focus:bg-white text-gray-900 ${!isEditingProfile ? 'opacity-75 cursor-not-allowed' : ''}`} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Sitio Web</label>
              <Input 
                value={companyProfile.website}
                onChange={e => setCompanyProfile({...companyProfile, website: e.target.value})}
                readOnly={!isEditingProfile}
                className={`border-white focus:border-gray-200 bg-gray-50 shadow-none focus:bg-white text-gray-900 ${!isEditingProfile ? 'opacity-75 cursor-not-allowed' : ''}`} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Dirección</label>
              <Input 
                value={companyProfile.address}
                onChange={e => setCompanyProfile({...companyProfile, address: e.target.value})}
                readOnly={!isEditingProfile}
                className={`border-white focus:border-gray-200 bg-gray-50 shadow-none focus:bg-white text-gray-900 ${!isEditingProfile ? 'opacity-75 cursor-not-allowed' : ''}`} 
              />
            </div>
          </div>

          <div className="flex gap-4">
            {!isEditingProfile ? (
              <Button 
                onClick={() => setIsEditingProfile(true)}
                className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Editar
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  className="w-full border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdateProfile}
                  className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg"
                >
                  <Building2 className="w-4 h-4 mr-2" /> Guardar Cambios
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
            <Lock className="w-5 h-5" />
            <h3>Seguridad</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Contraseña Actual</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.current}
                onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                className="border-gray-200 focus:border-[#1e3a8a]" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Nueva Contraseña</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.new}
                onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                className="border-gray-200 focus:border-[#1e3a8a]" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Confirmar Nueva Contraseña</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={passwordData.confirm}
                onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                className="border-gray-200 focus:border-[#1e3a8a]" 
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setPasswordData({ current: '', new: '', confirm: '' })}
              className="w-full border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdatePassword}
              className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg"
            >
              Guardar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
            <LogOut className="w-5 h-5" />
            <h3>Cerrar Sesión</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Salir de tu cuenta empresarial en este dispositivo</p>
          <Button variant="outline" onClick={handleLogout} className="w-full border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-100 shadow-sm rounded-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
            <Trash2 className="w-5 h-5" />
            <h3>Zona de Peligro</h3>
          </div>
          <p className="text-sm text-red-500 mb-4">
            Eliminar la cuenta empresarial es permanente. Se borrarán todas tus vacantes publicadas, candidatos y datos históricos.
          </p>
          <Button variant="outline" className="w-full border-red-200 text-red-600 bg-white hover:bg-red-50 hover:text-red-700 rounded-lg">
            Eliminar Cuenta Empresarial
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderEditOffer = () => (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveView('dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Editar Vacante
          </h1>
          <p className="text-sm text-gray-500">ID: {editingOfferId}</p>
        </div>
      </div>

      <Card className="bg-white border-gray-100 shadow-sm rounded-xl">
        <CardContent className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Título de la Práctica</label>
            <Input 
              value={editOfferData.title} 
              onChange={e => setEditOfferData({...editOfferData, title: e.target.value})}
              className="bg-white border-gray-200 text-gray-900 focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Ubicación</label>
            <Input 
              value={editOfferData.location} 
              onChange={e => setEditOfferData({...editOfferData, location: e.target.value})}
              className="bg-white border-gray-200 text-gray-900 focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Modalidad de Trabajo</label>
            <Select value={editOfferData.modality} onValueChange={v => setEditOfferData({...editOfferData, modality: v})}>
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Selecciona..." />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900">
                <SelectItem value="Presencial">Presencial</SelectItem>
                <SelectItem value="Remoto">Remoto</SelectItem>
                <SelectItem value="Híbrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Subvención Mensual (S/)</label>
            <Input 
              type="number"
              value={editOfferData.salary} 
              onChange={e => setEditOfferData({...editOfferData, salary: e.target.value})}
              className="bg-white border-gray-200 text-gray-900 focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Habilidades Técnicas Requeridas</label>
            <Input 
              value={editOfferData.skills} 
              onChange={e => setEditOfferData({...editOfferData, skills: e.target.value})}
              className="bg-white border-gray-200 text-gray-900 focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Descripción</label>
            <Textarea 
              value={editOfferData.description} 
              onChange={e => setEditOfferData({...editOfferData, description: e.target.value})}
              className="min-h-[120px] bg-white border-gray-200 text-gray-900 focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Requisitos</label>
            <Textarea 
              value={editOfferData.requirements} 
              onChange={e => setEditOfferData({...editOfferData, requirements: e.target.value})}
              className="min-h-[120px] bg-white border-gray-200 text-gray-900 focus:border-[#1e3a8a]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Beneficios</label>
            <Textarea 
              value={editOfferData.benefits} 
              onChange={e => setEditOfferData({...editOfferData, benefits: e.target.value})}
              className="min-h-[120px] bg-white border-gray-200 text-gray-900 focus:border-[#1e3a8a]"
            />
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button 
              onClick={handleUpdateOffer}
              className="flex-1 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white rounded-lg h-12"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
            <Button 
              onClick={handleDeleteOffer}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg h-12"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cerrar Vacante
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">
      {renderSidebar()}
      
      <div className="flex-1 ml-64 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView + postStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'post-offer' && renderPostOffer()}
            {activeView === 'candidates' && renderCandidates()}
            {activeView === 'company-profile' && renderCompanyProfile()}
            {activeView === 'edit-offer' && renderEditOffer()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
