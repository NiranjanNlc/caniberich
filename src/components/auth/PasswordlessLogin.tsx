import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock, TrendingUp } from 'lucide-react'

export function PasswordlessLogin() {
  const { requestPasswordlessLogin, verifyOtp } = useAuth()
  const [step, setStep] = useState<'email' | 'verify'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    const { error } = await requestPasswordlessLogin(email)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the verification code!')
      setStep('verify')
    }

    setLoading(false)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate OTP format
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit verification code')
      return
    }
    
    setLoading(true)

    // Trim whitespace and ensure it's a string
    const cleanOtp = otp.trim()
    console.log('Submitting OTP:', cleanOtp, 'for email:', email)
    
    const { error } = await verifyOtp(email, cleanOtp)

    if (error) {
      console.error('OTP verification error:', error)
      setError(error.message)
    }

    setLoading(false)
  }

  const handleResendCode = async () => {
    setError('')
    setMessage('')
    setLoading(true)

    const { error } = await requestPasswordlessLogin(email)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Verification code sent!')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'email' ? 'Welcome to Financial Game Show' : 'Verify Your Email'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'email' 
              ? 'Enter your email to get started' 
              : `Enter the code sent to ${email}`
            }
          </p>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-success-50 border border-success-200 text-success-600 px-4 py-3 rounded-lg text-sm mb-6">
            {message}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  // Only allow numbers and limit to 6 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setOtp(value)
                }}
                required
                maxLength={6}
                pattern="[0-9]{6}"
                inputMode="numeric"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-center text-lg tracking-widest"
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-primary-500 hover:text-primary-600 font-medium text-sm"
              >
                Didn't receive the code? Resend
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setError('')
                  setMessage('')
                }}
                className="text-gray-500 hover:text-gray-600 text-sm"
              >
                ← Back to email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}