# Flujo de Navegación - MypeMatch

## 🚀 Estructura del Proyecto

El proyecto MypeMatch es una **aplicación unificada** que combina la landing page y la funcionalidad principal:

### **Aplicación Principal** (`/`)
- **Tecnología**: React + Vite + TypeScript + Wouter
- **Puerto**: 5000 (configurado en el servidor))
- **Propósito**: Landing page + Aplicación funcional de matching
- **URL**: `http://localhost:5000`

## 🔄 Flujo de Navegación

### **Paso 1: Landing Page (Página Principal)**
1. El usuario accede a `http://localhost:5000`
2. Ve la landing page con información sobre Project Core
3. Encuentra el botón "MYPE MATCH" en la página

### **Paso 2: Redirección**
1. Al hacer clic en el botón "MYPE MATCH"
2. Se ejecuta la función `handleProjectCoreClick()`
3. Se redirige automáticamente a `/auth-page`

### **Paso 3: Página de Autenticación**
1. El usuario llega a la página de autenticación
2. Puede elegir entre registrarse o iniciar sesión
3. Al registrarse, se redirige al flujo de onboarding

## 🛠️ Configuración Técnica

### **Redirección Implementada**

```typescript
const handleProjectCoreClick = () => {
  // Redirigir a la página de autenticación
  window.location.href = '/auth-page';
};
```

### **Rutas Configuradas**

#### Aplicación Principal (React + Wouter)
- `/` - Landing page principal
- `/auth-page` - Página de autenticación
- `/explanation` - Explicación del funcionamiento
- `/motivation` - Página de motivación
- `/signup` - Registro
- `/auth` - Autenticación
- `/home` - Dashboard principal
- `/matching` - Sistema de matching
- `/profile` - Perfil de usuario

## 🚀 Cómo Ejecutar

### **Aplicación Principal**
```bash
cd MypeMatch
npm install
npm run dev
# Accede a http://localhost:5000
```

## 🔧 Configuración de Entornos

### **Desarrollo**
- Aplicación Principal: `http://localhost:5000`
- Redirección: `http://localhost:5000/auth-page`

### **Producción**
- Aplicación Principal: `https://app.tudominio.com`
- Redirección: `https://app.tudominio.com/auth-page`

## 📱 Experiencia de Usuario

1. **Primera Impresión**: Landing page atractiva con animaciones espaciales
2. **Call-to-Action**: Botón "MYPE MATCH" prominente
3. **Transición Suave**: Redirección automática a la autenticación
4. **Onboarding**: Explicación clara del funcionamiento
5. **Selección de Tipo**: Elección entre Estudiante o MYPE
6. **Motivación**: Página que inspira a continuar
7. **Registro**: Proceso de creación de cuenta

## 🎯 Beneficios de esta Arquitectura

- **Simplicidad**: Una sola aplicación para mantener
- **Performance**: Carga más rápida al tener todo en un lugar
- **SEO**: Landing page integrada en la aplicación principal
- **Escalabilidad**: Fácil de expandir con nuevas funcionalidades
- **Mantenimiento**: Código más organizado y centralizado

## 🔄 Flujo Completo

```
Landing Page (5000) 
    ↓ [Botón MYPE MATCH]
Auth Page (5000)
    ↓ [Registro/Login]
Explanation Page (5000)
    ↓ [Selección de tipo]
Motivation Page (5000)
    ↓ [Continuar]
SignUp Page (5000)
    ↓ [Registro exitoso]
Home Page (5000)
    ↓ [Navegación]
Matching Page (5000)
    ↓ [Swipe]
Profile Page (5000)
```

## 🎨 Características de la Landing Page

### **Diseño Espacial**
- Fondo negro con animaciones de estrellas
- Elementos flotantes: cohete, astronauta, planeta, capibara
- Gradientes púrpura y azul para efectos visuales
- Tipografía moderna con tracking amplio

### **Secciones Principales**
1. **Hero Section**: Título principal "ROMPE BARRERAS CONECTA PERSONAS"
2. **About Section**: Información sobre la empresa y su misión
3. **Mission Section**: Visión, misión y valores
4. **Stats Section**: Estadísticas de impacto
5. **Partners Section**: Logos de empresas colaboradoras
6. **Team Section**: Equipo de trabajo

### **Elementos Interactivos**
- Botón "CONÓCENOS" para explorar la página
- Botón "MYPE MATCH" para acceder a la plataforma
- Navegación suave entre secciones
- Animaciones con Framer Motion

Esta arquitectura unificada permite una experiencia de usuario fluida desde el primer contacto hasta el uso completo de la plataforma, todo en una sola aplicación. 
