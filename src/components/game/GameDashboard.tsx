import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { GameService, GameSession, GameStats } from '../../lib/gameService'
import { Play, Trophy, Target, Clock, TrendingUp, Award } from 'lucide-react'

export function GameDashboard() {
  const { user } = useAuth()
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [stats, setStats] = useState<GameStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [startingGame, setStartingGame] = useState(false)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    setLoading(true)
    
    // Load current session and stats in parallel
    const [sessionResult, statsResult] = await Promise.all([
      GameService.getCurrentSession(user.id),
      GameService.getUserStats(user.id)
    ])

    if (!sessionResult.error) {
      setCurrentSession(sessionResult.data)
    }

    if (!statsResult.error) {
      setStats(statsResult.data)
    }

    setLoading(false)
  }

  const startNewGame = async () => {
    if (!user) return

    setStartingGame(true)
    const { error } = await GameService.startGameSession(user.id, 10)

    if (error) {
      console.error('Error starting game:', error)
    } else {
      // Reload dashboard to show new session
      await loadDashboardData()
    }

    setStartingGame(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Game Show</h1>
          <p className="text-gray-600">Test your financial knowledge and build wealth wisdom</p>
        </div>

        {/* Current Session Card */}
        {currentSession && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Game</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentSession.status === 'active' ? 'bg-green-100 text-green-800' :
                currentSession.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {currentSession.status.charAt(0).toUpperCase() + currentSession.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">{currentSession.rounds_completed}</div>
                <div className="text-sm text-gray-600">Rounds Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">{currentSession.max_rounds}</div>
                <div className="text-sm text-gray-600">Total Rounds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{currentSession.total_score}</div>
                <div className="text-sm text-gray-600">Current Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {Math.round((currentSession.rounds_completed / currentSession.max_rounds) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentSession.rounds_completed / currentSession.max_rounds) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {/* Navigate to game */}}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Continue Game</span>
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Best Score</h3>
                  <p className="text-2xl font-bold text-yellow-500">{stats.best_score}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Target className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Accuracy</h3>
                  <p className="text-2xl font-bold text-green-500">{Math.round(stats.accuracy_rate)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Games Played</h3>
                  <p className="text-2xl font-bold text-blue-500">{stats.completed_sessions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Avg Score</h3>
                  <p className="text-2xl font-bold text-purple-500">{Math.round(stats.average_score)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Game Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Budgeting', icon: '💰', color: 'bg-blue-100 text-blue-800' },
              { name: 'Investing', icon: '📈', color: 'bg-green-100 text-green-800' },
              { name: 'Savings', icon: '🏦', color: 'bg-purple-100 text-purple-800' },
              { name: 'Debt Management', icon: '💳', color: 'bg-red-100 text-red-800' },
              { name: 'Insurance', icon: '🛡️', color: 'bg-yellow-100 text-yellow-800' }
            ].map((category) => (
              <div key={category.name} className={`${category.color} rounded-lg p-4 text-center`}>
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium">{category.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Start New Game */}
        {!currentSession && (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <Award className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Play?</h2>
              <p className="text-gray-600 mb-6">
                Test your financial knowledge across 10 challenging rounds covering budgeting, 
                investing, savings, debt management, and insurance.
              </p>
              <button
                onClick={startNewGame}
                disabled={startingGame}
                className="bg-primary-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                <span>{startingGame ? 'Starting Game...' : 'Start New Game'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}