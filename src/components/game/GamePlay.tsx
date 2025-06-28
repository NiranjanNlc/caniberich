import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { GameService, GameSession } from '../../lib/gameService'
import { Clock, CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react'

interface GamePlayProps {
  sessionId: string
  onGameComplete: () => void
}

export function GamePlay({ sessionId, onGameComplete }: GamePlayProps) {
  const { user } = useAuth()
  const [session, setSession] = useState<GameSession | null>(null)
  const [currentRound, setCurrentRound] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [roundResult, setRoundResult] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds per question
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadSession()
  }, [sessionId])

  useEffect(() => {
    if (currentRound && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      // Auto-submit when time runs out
      handleSubmitAnswer()
    }
  }, [timeLeft, currentRound, showResult])

  const loadSession = async () => {
    setLoading(true)
    
    // Get session details
    const { data: sessionData, error: sessionError } = await GameService.getCurrentSession(user?.id || '')
    
    if (sessionError || !sessionData) {
      console.error('Error loading session:', sessionError)
      return
    }

    setSession(sessionData)

    // Start next round
    await startNextRound()
    setLoading(false)
  }

  const startNextRound = async () => {
    const { data: roundData, error } = await GameService.startRound(sessionId)
    
    if (error) {
      console.error('Error starting round:', error)
      return
    }

    setCurrentRound(roundData)
    setSelectedAnswer('')
    setShowResult(false)
    setRoundResult(null)
    setTimeLeft(60)
  }

  const handleSubmitAnswer = async () => {
    if (!currentRound || submitting) return

    setSubmitting(true)
    const timeTaken = 60 - timeLeft

    const { data: result, error } = await GameService.submitAnswer(
      sessionId,
      currentRound.round_number,
      selectedAnswer || '', // Empty string if no answer selected
      timeTaken
    )

    if (error) {
      console.error('Error submitting answer:', error)
      setSubmitting(false)
      return
    }

    setRoundResult(result)
    setShowResult(true)
    setSubmitting(false)

    // Update session data
    if (session) {
      setSession({
        ...session,
        total_score: result.total_score,
        rounds_completed: result.rounds_completed
      })
    }
  }

  const handleNextRound = async () => {
    if (!session) return

    if (roundResult?.session_complete) {
      onGameComplete()
      return
    }

    await startNextRound()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!currentRound || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load game. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Game Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Round {currentRound.round_number} of {session.max_rounds}
              </h1>
              <p className="text-gray-600 capitalize">{currentRound.category} • {currentRound.difficulty}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-500">{session.total_score}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(session.rounds_completed / session.max_rounds) * 100}%` }}
            ></div>
          </div>

          {/* Timer */}
          {!showResult && (
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className={`font-medium ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                {timeLeft}s remaining
              </span>
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {!showResult ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentRound.question.question_text}
              </h2>

              {/* Scenario Data (if applicable) */}
              {currentRound.question.scenario_data && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">Scenario:</h3>
                  <p className="text-blue-800">{currentRound.question.scenario_data.description}</p>
                </div>
              )}

              {/* Answer Options */}
              {currentRound.question.options && (
                <div className="space-y-3 mb-8">
                  {currentRound.question.options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedAnswer === option
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{option}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || submitting}
                  className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Result Display */}
              <div className="text-center mb-6">
                {roundResult?.is_correct ? (
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                
                <h2 className={`text-2xl font-bold mb-2 ${
                  roundResult?.is_correct ? 'text-green-600' : 'text-red-600'
                }`}>
                  {roundResult?.is_correct ? 'Correct!' : 'Incorrect'}
                </h2>
                
                <p className="text-lg text-gray-600 mb-4">
                  You earned {roundResult?.points_earned} points
                </p>
              </div>

              {/* Correct Answer */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Correct Answer:</h3>
                <p className="text-gray-700 mb-4">{roundResult?.correct_answer}</p>
                
                <h3 className="font-semibold text-gray-900 mb-2">Explanation:</h3>
                <p className="text-gray-700">{roundResult?.explanation}</p>
              </div>

              {/* Score Update */}
              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary-900">Total Score:</span>
                  <span className="text-2xl font-bold text-primary-600">{roundResult?.total_score}</span>
                </div>
              </div>

              {/* Next Button */}
              <div className="text-center">
                {roundResult?.session_complete ? (
                  <button
                    onClick={handleNextRound}
                    className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>View Results</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextRound}
                    className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <span>Next Round</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}