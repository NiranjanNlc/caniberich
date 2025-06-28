import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { HomePage } from '../home/HomePage'
import { GameManager } from '../game/GameManager'
import { ProfileManager } from '../profile/ProfileManager'
import { GameDashboard } from '../game/GameDashboard'
import { Home, Play, User, BarChart3, LogOut } from 'lucide-react'

type AppView = 'home' | 'game' | 'profile' | 'stats'

export function AppNavigation() {
  const { signOut } = useAuth()
  const [currentView, setCurrentView] = useState<AppView>('home')

  const handleStartGame = () => {
    setCurrentView('game')
  }

  const handleViewProfile = () => {
    setCurrentView('profile')
  }

  const handleViewStats = () => {
    setCurrentView('stats')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage 
            onStartGame={handleStartGame}
            onViewProfile={handleViewProfile}
            onViewStats={handleViewStats}
          />
        )
      case 'game':
        return <GameManager />
      case 'profile':
        return <ProfileManager />
      case 'stats':
        return <GameDashboard />
      default:
        return (
          <HomePage 
            onStartGame={handleStartGame}
            onViewProfile={handleViewProfile}
            onViewStats={handleViewStats}
          />
        )
    }
  }

  // Show navigation bar only when not on home page
  const showNavigation = currentView !== 'home'

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && (
        <nav className="bg-white shadow-lg border-b">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <button
                  onClick={handleBackToHome}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
                
                <button
                  onClick={handleStartGame}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'game' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Play className="w-5 h-5" />
                  <span>Play Game</span>
                </button>
                
                <button
                  onClick={handleViewStats}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'stats' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Statistics</span>
                </button>
                
                <button
                  onClick={handleViewProfile}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'profile' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
              </div>
              
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </nav>
      )}
      
      <div className={showNavigation ? '' : ''}>
        {renderCurrentView()}
      </div>
    </div>
  )
}