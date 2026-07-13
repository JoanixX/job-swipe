import React from 'react'
import { Route, Switch } from 'wouter'
import LandingPage from './pages/index'
import RegisterSelection from './pages/RegisterSelection'
import RegisterStudent from './pages/RegisterStudent'
import SimpleRegisterStudent from './pages/SimpleRegisterStudent'
import StudentCVUpload from './pages/StudentCVUpload'
import RegisterCompany from './pages/RegisterCompany'
import StudentProfile from './pages/StudentProfile'
import AccountSettings from './pages/AccountSettings'
import StudentSkills from './pages/StudentSkills'
import StudentApplications from './pages/StudentApplications'
import StudentMatches from './pages/StudentMatches'
import CompanyDashboard from './pages/CompanyDashboard'
import MatchingPage from './pages/MatchingPage'
import { UserProvider } from './lib/user-context'
import Login from './pages/Login'
import PoliticaPrivacidad from './pages/politica-privacidad'
import TerminosServicio from './pages/terminos-servicio'
import PasswordRecovery from './pages/PasswordRecovery'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/not-found'

function App() {
  return (
    <UserProvider>
      <div className="App min-h-screen w-full bg-gray-900">
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/register-selection" component={RegisterSelection} />
          <Route path="/register-company" component={RegisterCompany} />
          <Route path="/register-student" component={RegisterStudent} />
          <Route path="/simple-register-student" component={SimpleRegisterStudent} />
          <Route path="/student-cv-upload" component={StudentCVUpload} />
          <Route path="/login" component={Login} />
          <Route path="/student-profile" component={StudentProfile} />
          <Route path="/account-settings" component={AccountSettings} />
          <Route path="/student-skills" component={StudentSkills} />
          <Route path="/student-applications" component={StudentApplications} />
          <Route path="/student-matches" component={StudentMatches} />
          <Route path="/matching" component={MatchingPage} />
          <Route path="/company-dashboard" component={CompanyDashboard} />
          <Route path="/politica-privacidad" component={PoliticaPrivacidad} />
          <Route path="/terminos-servicio" component={TerminosServicio} />
          <Route path="/recover-password" component={PasswordRecovery} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </UserProvider>
  )
}

export default App
