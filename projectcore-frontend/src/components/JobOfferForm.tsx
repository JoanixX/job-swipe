import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar, DollarSign, Clock, MapPin, Briefcase } from 'lucide-react';
import { JobOfferCreate } from '@/services/api';
import { apiService } from '@/services/api';

interface JobOfferFormProps {
  onClose: () => void;
  onSubmit: (jobOffer: JobOfferCreate) => Promise<void>;
  companyId: number;
  editingJobOffer?: any;
}

interface Area {
  id: number;
  name: string;
}

interface ExperienceDetail {
  id: number;
  name: string;
}

export const JobOfferForm: React.FC<JobOfferFormProps> = ({
  onClose,
  onSubmit,
  companyId,
  editingJobOffer
}) => {
  const [formData, setFormData] = useState<JobOfferCreate>({
    company_id: companyId,
    title: '',
    description: '',
    required_hours: 0,
    approximated_salary: 0,
    duration: 0,
    start_date: '',
    area_id: 0,
    experience_id: 0,
    modality: 1
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const [experienceDetails, setExperienceDetails] = useState<ExperienceDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadFormData();
    if (editingJobOffer) {
      setFormData({
        company_id: companyId,
        title: editingJobOffer.title || '',
        description: editingJobOffer.description || '',
        required_hours: editingJobOffer.required_hours || 0,
        approximated_salary: editingJobOffer.approximated_salary || 0,
        duration: editingJobOffer.duration || 0,
        start_date: editingJobOffer.start_date || '',
        area_id: editingJobOffer.area_id || 0,
        experience_id: editingJobOffer.experience_id || 0,
        modality: editingJobOffer.modality || 1
      });
    }
  }, [editingJobOffer, companyId]);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      
      // Load areas and experience details for dropdowns
      const [areasData, experienceData] = await Promise.all([
        apiService.getAllAreas().catch(() => []),
        apiService.getAllExperienceDetails().catch(() => [])
      ]);

      setAreas(areasData);
      setExperienceDetails(experienceData);
    } catch (error) {
      console.error('Error loading form data:', error);
      // Set default values if API calls fail
      setAreas([
        { id: 1, name: 'Tecnología' },
        { id: 2, name: 'Marketing' },
        { id: 3, name: 'Diseño' },
        { id: 4, name: 'Ventas' },
        { id: 5, name: 'Administración' }
      ]);
      setExperienceDetails([
        { id: 1, name: 'Sin experiencia' },
        { id: 2, name: 'Junior (1-2 años)' },
        { id: 3, name: 'Intermedio (3-5 años)' },
        { id: 4, name: 'Senior (5+ años)' }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field: keyof JobOfferCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.start_date || 
        !formData.area_id || !formData.experience_id) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting job offer:', error);
      alert('Error al crear la oferta de trabajo. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const modalityOptions = [
    { value: 1, label: 'Presencial' },
    { value: 2, label: 'Remoto' },
    { value: 3, label: 'Híbrido' }
  ];

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white text-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {editingJobOffer ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
              </CardTitle>
              <CardDescription>
                {editingJobOffer ? 'Modifica los detalles del proyecto' : 'Completa los detalles para publicar tu proyecto'}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Título del Proyecto *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="ej. Desarrollador Frontend React"
                  required
                  className="w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Descripción del Proyecto *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe las responsabilidades, requisitos y objetivos del proyecto..."
                  required
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* Grid for numeric inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="required_hours" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horas Requeridas *
                  </Label>
                  <Input
                    id="required_hours"
                    type="number"
                    value={formData.required_hours}
                    onChange={(e) => handleInputChange('required_hours', parseInt(e.target.value) || 0)}
                    placeholder="40"
                    required
                    min="1"
                    max="60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approximated_salary" className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Salario Aproximado (S/) *
                  </Label>
                  <Input
                    id="approximated_salary"
                    type="number"
                    value={formData.approximated_salary}
                    onChange={(e) => handleInputChange('approximated_salary', parseInt(e.target.value) || 0)}
                    placeholder="1500"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Duración (meses) *
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    placeholder="6"
                    required
                    min="1"
                    max="24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de Inicio *
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area_id" className="text-sm font-medium">
                    Área *
                  </Label>
                  <Select
                    value={formData.area_id.toString()}
                    onValueChange={(value) => handleInputChange('area_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_id" className="text-sm font-medium">
                    Nivel de Experiencia *
                  </Label>
                  <Select
                    value={formData.experience_id.toString()}
                    onValueChange={(value) => handleInputChange('experience_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona experiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceDetails.map((exp) => (
                        <SelectItem key={exp.id} value={exp.id.toString()}>
                          {exp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modality" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Modalidad *
                </Label>
                <Select
                  value={formData.modality.toString()}
                  onValueChange={(value) => handleInputChange('modality', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingJobOffer ? 'Actualizando...' : 'Creando...'}
                    </div>
                  ) : (
                    editingJobOffer ? 'Actualizar Proyecto' : 'Crear Proyecto'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
