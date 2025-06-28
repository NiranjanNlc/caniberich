import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { OnboardingForm } from '../onboarding/OnboardingForm'
import { User, Target, TrendingUp, DollarSign, Save, LogOut } from 'lucide-react'

interface ProfileManagerProps {
  onComplete?: () => void
}

export function ProfileManager({ onComplete }: ProfileManagerProps) {
  const { profile, updateProfile, signOut } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    financial_goal: profile?.financial_goal || '',
    risk_tolerance: profile?.risk_tolerance || 'moderate',
    initial_budget: profile?.initial_budget?.toString() || ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Show onboarding if profile exists but username is not set (first-time user)
  if (profile && !profile.username) {
    return <OnboardingForm onComplete={onComplete} />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await updateProfile({
      username: formData.username,
      financial_goal: formData.financial_goal,
      risk_tolerance: formData.risk_tolerance as 'conservative' | 'moderate' | 'aggressive',
      initial_budget: parseFloat(formData.initial_budget) || 0
    })

    if (error) {
      setMessage('Error updating profile: ' + error.message)
    } else {
      setMessage('Profile updated successfully!')
      setEditing(false)
      if (onComplete) {
        setTimeout(() => onComplete(), 1500) // Give time to see success message
      }
    }

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleCancel = () => {
    setFormData({
      username: profile?.username || '',
      financial_goal: profile?.financial_goal || '',
      risk_tolerance: profile?.risk_tolerance || 'moderate',
      initial_budget: profile?.initial_budget?.toString() || ''
    })
    setEditing(false)
    setMessage('')
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                  <p className="text-primary-100">Current Points: {profile.current_points}</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {message && (
              <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${
                message.includes('Error') 
                  ? 'bg-error-50 border border-error-200 text-error-600'
                  : 'bg-success-50 border border-success-200 text-success-600'
              }`}>
                {message}
              </div>
            )}

            {!editing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Target className="w-5 h-5 text-primary-500" />
                      <h3 className="font-semibold text-gray-900">Financial Goal</h3>
                    </div>
                    <p className="text-gray-700">{profile.financial_goal || 'Not set'}</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-primary-500" />
                      <h3 className="font-semibold text-gray-900">Risk Tolerance</h3>
                    </div>
                    <p className="text-gray-700 capitalize">{profile.risk_tolerance || 'Not set'}</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <DollarSign className="w-5 h-5 text-primary-500" />
                      <h3 className="font-semibold text-gray-900">Initial Budget</h3>
                    </div>
                    <p className="text-gray-700">
                      ${profile.initial_budget?.toLocaleString() || '0'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="w-5 h-5 text-primary-500" />
                      <h3 className="font-semibold text-gray-900">Member Since</h3>
                    </div>
                    <p className="text-gray-700">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
                
                {onComplete && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={onComplete}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4 inline mr-2" />
                    Financial Goal
                  </label>
                  <textarea
                    name="financial_goal"
                    value={formData.financial_goal}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                    placeholder="e.g., Save $10,000 for a house down payment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Risk Tolerance
                  </label>
                  <select
                    name="risk_tolerance"
                    value={formData.risk_tolerance}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="conservative">Conservative - Play it safe</option>
                    <option value="moderate">Moderate - Balanced approach</option>
                    <option value="aggressive">Aggressive - High risk, high reward</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Initial Budget
                  </label>
                  <input
                    type="number"
                    name="initial_budget"
                    value={formData.initial_budget}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="1000.00"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}