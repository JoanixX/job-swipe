import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GoogleUser } from './google-auth'

interface UserData {
  id?: string
  name: string
  email: string
  picture?: string
  userType: 'student' | 'company'
  isGoogleAuth: boolean
  profileData?: any
}

interface UserContextType {
  user: UserData | null
  setUser: (user: UserData | null) => void
  updateProfile: (data: any) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<UserData | null>(null)

  useEffect(() => {
    // Load user data from localStorage on mount
    const savedUser = localStorage.getItem('userData')
    const googleUser = localStorage.getItem('googleUser')
    
    if (savedUser) {
      setUserState(JSON.parse(savedUser))
    } else if (googleUser) {
      const gUser: GoogleUser = JSON.parse(googleUser)
      setUserState({
        name: gUser.name,
        email: gUser.email,
        picture: gUser.picture,
        userType: 'student', // Default, will be updated during registration
        isGoogleAuth: true
      })
    }
  }, [])

  const setUser = (userData: UserData | null) => {
    setUserState(userData)
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData))
    } else {
      localStorage.removeItem('userData')
      localStorage.removeItem('googleUser')
    }
  }

  const updateProfile = async (data: any) => {
    if (user) {
      try {
        // Update student data in backend
        const updateData: any = {}
        if (data.career) updateData.career = data.career
        if (data.academic_cycle) updateData.academic_cycle = parseInt(data.academic_cycle)
        if (data.weekly_availability) updateData.weekly_availability = parseInt(data.weekly_availability)
        if (data.preferred_modality) updateData.preferred_modality = parseInt(data.preferred_modality)
        if (data.location) updateData.location = data.location
        if (data.main_motivation) updateData.main_motivation = data.main_motivation
        if (data.description) updateData.description = data.description
        
        console.log('Updating profile with data:', updateData)
        console.log('Student ID:', user.profileData?.related_id)
        
        const response = await fetch(`/api/student/${user.profileData?.related_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        })

        if (response.ok) {
          console.log('Profile updated successfully in backend')
          
          // Update local state only after successful backend update
          const updatedUser = {
            ...user,
            profileData: { ...user.profileData, ...data }
          }
          setUser(updatedUser)
          
          // Also update the student data in localStorage for persistence
          const currentUserData = localStorage.getItem('userData')
          if (currentUserData) {
            const parsedUserData = JSON.parse(currentUserData)
            parsedUserData.profileData = { ...parsedUserData.profileData, ...data }
            localStorage.setItem('userData', JSON.stringify(parsedUserData))
          }
        } else {
          const errorText = await response.text()
          console.error('Failed to update profile in backend:', errorText)
          alert('Error al actualizar el perfil. Por favor intenta nuevamente.')
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Error al actualizar el perfil. Por favor intenta nuevamente.')
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userData')
    localStorage.removeItem('googleUser')
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  )
}
