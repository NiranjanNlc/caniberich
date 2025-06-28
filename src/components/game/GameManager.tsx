import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { GameService } from '../../lib/gameService'
import { GameDashboard } from './GameDashboard'
import { GamePlay } from './GamePlay'
import { GameResults } from './GameResults'

type GameState = 'dashboard' | 'playing' | 'results'

export function GameManager() {
  const { user } = useAuth()
  const [gameState, setGameState] = useState<GameState>('dashboard')
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  useEffect(() => {
    checkForActiveSession()
  }, [user])

  const checkForActiveSession = async () => {
    if (!user) return

    const { data: session, error } = await GameService.getCurrentSession(user.id)
    
    if (!error && session) {
      setCurrentSessionId(session.id)
      
      // Determine game state based on session status
      if (session.status === 'completed') {
        setGameState('results')
      } else if (session.status === 'active') {
        setGameState('playing')
      } else {
        setGameState('dashboard')
      }
    } else {
      setGameState('dashboard')
    }
  }

  const handleStartNewGame = async () => {
    if (!user) return

    const { data: sessionId, error } = await GameService.startGameSession(user.id, 10)
    
    if (!error && sessionId) {
      setCurrentSessionId(sessionId)
      setGameState('playing')
    }
  }

  const handleGameComplete = () => {
    setGameState('results')
  }

  const handlePlayAgain = () => {
    handleStartNewGame()
  }

  const handleBackToDashboard = () => {
    setCurrentSessionId(null)
    setGameState('dashboard')
  }

  // Render based on current game state
  switch (gameState) {
    case 'playing':
      return currentSessionId ? (
        <GamePlay 
          sessionId={currentSessionId} 
          onGameComplete={handleGameComplete}
        />
      ) : (
        <GameDashboard />
      )
      
    case 'results':
      return currentSessionId ? (
        <GameResults 
          sessionId={currentSessionId}
          onPlayAgain={handlePlayAgain}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : (
        <GameDashboard />
      )
      
    case 'dashboard':
    default:
      return <GameDashboard />
  }
}