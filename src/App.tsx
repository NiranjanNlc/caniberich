import { AuthProvider } from './contexts/AuthContext'
import { AuthGuard } from './components/auth/AuthGuard'
import { PasswordlessLogin } from './components/auth/PasswordlessLogin'
import { AppNavigation } from './components/navigation/AppNavigation'
import './index.css'

function AppContent() {
  return (
    <AuthGuard fallback={<PasswordlessLogin />}>
      <AppNavigation />
    </AuthGuard>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App