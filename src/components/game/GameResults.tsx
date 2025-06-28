import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { GameService, GameSession, SessionRound } from '../../lib/gameService'
import { Trophy, Target, Clock, Award, RotateCcw, Home } from 'lucide-react'

interface GameResultsProps {
  sessionId: string
  onPlayAgain: () => void
  onBackToDashboard: () => void
}

export function GameResults({ sessionId, onPlayAgain, onBackToDashboard }: GameResultsProps) {
  const { user } = useAuth()
  const [session, setSession] = useState<GameSession | null>(null)
  const [rounds, setRounds] = useState<SessionRound[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGameResults()
  }, [sessionId])

  const loadGameResults = async () => {
    setLoading(true)

    // Load session and rounds data
    const [sessionResult, roundsResult] = await Promise.all([
      GameService.getCurrentSession(user?.id || ''),
      GameService.getSessionRounds(sessionId)
    ])

    if (!sessionResult.error && sessionResult.data) {
      setSession(sessionResult.data)
    }

    if (!roundsResult.error && roundsResult.data) {
      setRounds(roundsResult.data)
    }

    setLoading(false)
  }

  const calculateStats = () => {
    if (!rounds.length) return { accuracy: 0, avgTime: 0, perfectRounds: 0 }

    const completedRounds = rounds.filter(r => r.completed_at)
    const correctAnswers = completedRounds.filter(r => r.is_correct).length
    const accuracy = (correctAnswers / completedRounds.length) * 100
    
    const totalTime = completedRounds.reduce((sum, r) => sum + (r.time_taken || 0), 0)
    const avgTime = totalTime / completedRounds.length

    const perfectRounds = completedRounds.filter(r => r.is_correct && (r.time_taken || 0) <= 30).length

    return { accuracy, avgTime, perfectRounds }
  }

  const getPerformanceLevel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' }
    if (percentage >= 75) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (percentage >= 60) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getCategoryBreakdown = () => {
    const categories: { [key: string]: { correct: number, total: number } } = {}
    
    rounds.forEach(round => {
      if (!categories[round.round_type]) {
        categories[round.round_type] = { correct: 0, total: 0 }
      }
      categories[round.round_type].total++
      if (round.is_correct) {
        categories[round.round_type].correct++
      }
    })

    return categories
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load game results.</p>
        </div>
      </div>
    )
  }

  const stats = calculateStats()
  const maxPossibleScore = session.max_rounds * 10 // Assuming 10 points per question
  const performance = getPerformanceLevel(session.total_score, maxPossibleScore)
  const categoryBreakdown = getCategoryBreakdown()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h1>
          <p className="text-gray-600">Here's how you performed</p>
        </div>

        {/* Main Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-primary-500 mb-2">{session.total_score}</div>
            <div className="text-xl text-gray-600">Total Score</div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mt-2 ${performance.bg} ${performance.color}`}>
              {performance.level}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">{Math.round(stats.accuracy)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            
            <div className="text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-500">{Math.round(stats.avgTime)}s</div>
              <div className="text-sm text-gray-600">Avg Time</div>
            </div>
            
            <div className="text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-500">{stats.perfectRounds}</div>
              <div className="text-sm text-gray-600">Perfect Rounds</div>
            </div>
            
            <div className="text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-500">{session.rounds_completed}</div>
              <div className="text-sm text-gray-600">Rounds Completed</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance by Category</h2>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([category, data]) => {
              const percentage = (data.correct / data.total) * 100
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900 capitalize">
                        {category.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-600">
                        {data.correct}/{data.total} correct
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-lg font-bold text-primary-500">{Math.round(percentage)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Round by Round Results */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Round by Round</h2>
          <div className="space-y-3">
            {rounds.map((round) => (
              <div key={round.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-medium text-gray-900">
                    Round {round.round_number}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {round.round_type.replace('_', ' ')}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {round.time_taken}s
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    round.is_correct ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {round.is_correct ? '✓' : '✗'}
                  </div>
                  <div className="text-lg font-bold text-primary-500">
                    +{round.points_earned}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>
          
          <button
            onClick={onBackToDashboard}
            className="bg-gray-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  )
}