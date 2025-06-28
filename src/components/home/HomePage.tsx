import { useAuth } from '../../contexts/AuthContext'
import { Play, Trophy, Target, TrendingUp, User, BarChart3 } from 'lucide-react'

interface HomePageProps {
  onStartGame: () => void
  onViewProfile: () => void
  onViewStats: () => void
}

export function HomePage({ onStartGame, onViewProfile, onViewStats }: HomePageProps) {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-500 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Game Show</h1>
                <p className="text-gray-600">Master Your Money Through Play</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{profile?.username || 'Player'}</p>
              </div>
              <button
                onClick={onViewProfile}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
              >
                <User className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Level Up Your Financial Knowledge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test your financial literacy through engaging game rounds covering budgeting, 
            investing, savings, debt management, and insurance. Learn while you play!
          </p>
        </div>

        {/* Quick Stats */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">{profile.current_points}</h3>
              <p className="text-gray-600">Total Points</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Target className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {profile.financial_goal || 'Set Your Goal'}
              </h3>
              <p className="text-gray-600">Financial Goal</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {profile.risk_tolerance || 'Not Set'}
              </h3>
              <p className="text-gray-600">Risk Tolerance</p>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Start Game Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Playing</h3>
            <p className="text-gray-600 mb-6">
              Jump into a new game session with 10 challenging rounds across different financial topics.
            </p>
            <button
              onClick={onStartGame}
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors w-full"
            >
              Start New Game
            </button>
          </div>

          {/* View Stats Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">View Progress</h3>
            <p className="text-gray-600 mb-6">
              Check your game statistics, accuracy rates, and see how you're improving over time.
            </p>
            <button
              onClick={onViewStats}
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors w-full"
            >
              View Statistics
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Profile</h3>
            <p className="text-gray-600 mb-6">
              Update your financial goals, risk tolerance, and personal preferences.
            </p>
            <button
              onClick={onViewProfile}
              className="bg-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors w-full"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Game Categories Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Game Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { name: 'Budgeting', icon: '💰', color: 'bg-blue-100 text-blue-800', desc: 'Personal finance fundamentals' },
              { name: 'Investing', icon: '📈', color: 'bg-green-100 text-green-800', desc: 'Market basics and strategies' },
              { name: 'Savings', icon: '🏦', color: 'bg-purple-100 text-purple-800', desc: 'Emergency funds and goals' },
              { name: 'Debt Management', icon: '💳', color: 'bg-red-100 text-red-800', desc: 'Payoff strategies' },
              { name: 'Insurance', icon: '🛡️', color: 'bg-yellow-100 text-yellow-800', desc: 'Risk protection' }
            ].map((category) => (
              <div key={category.name} className={`${category.color} rounded-xl p-6 text-center`}>
                <div className="text-3xl mb-3">{category.icon}</div>
                <h4 className="font-semibold mb-2">{category.name}</h4>
                <p className="text-sm opacity-80">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Answer Questions</h4>
              <p className="text-gray-600">Test your knowledge across 10 rounds of financial literacy questions</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Earn Points</h4>
              <p className="text-gray-600">Gain points for correct answers and learn from detailed explanations</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
              <p className="text-gray-600">Monitor your improvement and build financial confidence</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}