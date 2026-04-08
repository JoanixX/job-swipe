import React from 'react'
import { Route, Switch } from 'wouter'
import LandingPage from './pages/index'
import RegisterSelection from './pages/RegisterSelection'
import RegisterStudent from './pages/RegisterStudent'
import SimpleRegisterStudent from './pages/SimpleRegisterStudent'
import RegisterCompany from './pages/RegisterCompany'
import InnovativeRegister from './pages/InnovativeRegister'
import CompanySubscriptionRegister from './pages/CompanySubscriptionRegister'
import SimpleStudentDashboard from './pages/SimpleStudentDashboard'
import NewStudentDashboard from './pages/NewStudentDashboard'
import StudentProfile from './pages/StudentProfile'
import SimpleCompanyDashboard from './pages/SimpleCompanyDashboard'
import { UserProvider } from './lib/user-context'
import Login from './pages/Login'
import PoliticaPrivacidad from './pages/politica-privacidad'
import TerminosServicio from './pages/terminos-servicio'
import WhatsAppAssistant from './components/WhatsAppAssistant'

function App() {
  return (
    <UserProvider>
      <div className="App min-h-screen w-full bg-gray-900">
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/register" component={InnovativeRegister} />
          <Route path="/register-selection" component={RegisterSelection} />
          <Route path="/register-company" component={RegisterCompany} />
          <Route path="/register-student" component={RegisterStudent} />
          <Route path="/simple-register-student" component={SimpleRegisterStudent} />
          <Route path="/login" component={Login} />
          <Route path="/student-dashboard" component={NewStudentDashboard} />
          <Route path="/student-profile" component={StudentProfile} />
          <Route path="/company-dashboard" component={SimpleCompanyDashboard} />
          <Route path="/politica-privacidad" component={PoliticaPrivacidad} />
          <Route path="/terminos-servicio" component={TerminosServicio} />
        </Switch>
        <WhatsAppAssistant />
      </div>
    </UserProvider>
  )
}

export default App
