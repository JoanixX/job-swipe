import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../ui/input'

interface PasswordInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hasError?: boolean
  autoComplete?: string
}

/** Input de contraseña con botón para mostrar/ocultar */
export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = 'Ingresa tu contraseña',
  hasError = false,
  autoComplete = 'current-password'
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`bg-transparent text-gray-900 pr-10 focus:border-[#4F6CDB] focus:ring-[#4F6CDB] ${hasError ? 'border-red-300' : 'border-gray-200'}`}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}
