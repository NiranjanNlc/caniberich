import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User, Target, TrendingUp, DollarSign, CheckCircle } from 'lucide-react'

interface FormData {
  username: string
  primaryGoal: string
  secondaryGoals: string[]
  goalTimeline: string
  targetAmount: string
  riskTolerance: string
  investmentExperience: string
  comfortWithVolatility: number
  ageRange: string
  employmentStatus: string
  financialStressLevel: number
  preferredLearningStyle: string
}

interface FormErrors {
  [key: string]: string | undefined
}

interface OnboardingFormProps {
  onComplete?: () => void
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const { updateProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    // Basic info
    username: '',
    
    // Financial Goals
    primaryGoal: '',
    secondaryGoals: [],
    goalTimeline: '',
    targetAmount: '',
    
    // Risk Tolerance
    riskTolerance: '',
    investmentExperience: '',
    comfortWithVolatility: 5,
    
    // Additional Info
    ageRange: '',
    employmentStatus: '',
    financialStressLevel: 5,
    preferredLearningStyle: 'gamified'
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSecondaryGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      secondaryGoals: prev.secondaryGoals.includes(goal)
        ? prev.secondaryGoals.filter(g => g !== goal)
        : [...prev.secondaryGoals, goal]
    }))
  }

  const validateStep = (step: number) => {
    const newErrors: FormErrors = {}
    
    switch (step) {
      case 1: // Basic info and Financial Goals
        if (!formData.username.trim()) newErrors.username = 'Please enter a username'
        if (!formData.primaryGoal) newErrors.primaryGoal = 'Please select a primary financial goal'
        if (!formData.goalTimeline) newErrors.goalTimeline = 'Please select a timeline for your goals'
        break
      case 2: // Risk Tolerance
        if (!formData.riskTolerance) newErrors.riskTolerance = 'Please select your risk tolerance'
        if (!formData.investmentExperience) newErrors.investmentExperience = 'Please select your investment experience'
        break
      case 3: // Additional Information
        if (!formData.ageRange) newErrors.ageRange = 'Please select your age range'
        if (!formData.employmentStatus) newErrors.employmentStatus = 'Please select your employment status'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (validateStep(3)) {
      setLoading(true)
      
      // Prepare profile data for database
      const profileData = {
        username: formData.username,
        financial_goal: formData.primaryGoal,
        risk_tolerance: formData.riskTolerance as 'conservative' | 'moderate' | 'aggressive',
        initial_budget: parseFloat(formData.targetAmount) || 0,
        // Store additional onboarding data as JSON in a new field if needed
        onboarding_data: {
          secondaryGoals: formData.secondaryGoals,
          goalTimeline: formData.goalTimeline,
          investmentExperience: formData.investmentExperience,
          comfortWithVolatility: formData.comfortWithVolatility,
          ageRange: formData.ageRange,
          employmentStatus: formData.employmentStatus,
          financialStressLevel: formData.financialStressLevel,
          preferredLearningStyle: formData.preferredLearningStyle
        }
      }

      const { error } = await updateProfile(profileData)
      
      if (error) {
        setErrors({ submit: error.message })
        setLoading(false)
      } else {
        setCurrentStep(4) // Show completion step
        setLoading(false)
        
        // Auto-redirect after showing completion
        if (onComplete) {
          setTimeout(() => onComplete(), 3000)
        }
      }
    }
  }

  const goalOptions = [
    { value: 'emergency_fund', label: 'Build Emergency Fund', icon: '🛡️' },
    { value: 'debt_payoff', label: 'Pay Off Debt', icon: '💳' },
    { value: 'retirement', label: 'Save for Retirement', icon: '🏖️' },
    { value: 'home_purchase', label: 'Buy a Home', icon: '🏠' },
    { value: 'investment_growth', label: 'Grow Investments', icon: '📈' },
    { value: 'education_fund', label: 'Education Fund', icon: '🎓' }
  ]

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative', desc: 'Prefer stable, low-risk investments' },
    { value: 'moderate', label: 'Moderate', desc: 'Comfortable with some risk for better returns' },
    { value: 'aggressive', label: 'Aggressive', desc: 'Willing to take high risks for high returns' }
  ]

  const experienceOptions = [
    { value: 'none', label: 'No Experience', desc: 'Never invested before' },
    { value: 'beginner', label: 'Beginner', desc: 'Some basic knowledge' },
    { value: 'intermediate', label: 'Intermediate', desc: 'Comfortable with most concepts' },
    { value: 'experienced', label: 'Experienced', desc: 'Advanced investor' }
  ]

  const renderProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(currentStep / 3) * 100}%` }}
      ></div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Target className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get started!</h2>
        <p className="text-gray-600">Tell us about yourself and your financial goals</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Username *
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          placeholder="Choose a username"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Primary Financial Goal *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goalOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('primaryGoal', option.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                formData.primaryGoal === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
        {errors.primaryGoal && <p className="mt-2 text-sm text-red-600">{errors.primaryGoal}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Additional Goals (Optional)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {goalOptions.filter(opt => opt.value !== formData.primaryGoal).map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSecondaryGoalToggle(option.value)}
              className={`p-3 border rounded-lg text-sm transition-all duration-200 ${
                formData.secondaryGoals.includes(option.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Timeline for Primary Goal *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'short_term', label: 'Short Term', desc: 'Less than 2 years' },
            { value: 'medium_term', label: 'Medium Term', desc: '2-10 years' },
            { value: 'long_term', label: 'Long Term', desc: 'More than 10 years' }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('goalTimeline', option.value)}
              className={`p-4 border-2 rounded-lg text-center transition-all duration-200 hover:shadow-md ${
                formData.goalTimeline === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
            </button>
          ))}
        </div>
        {errors.goalTimeline && <p className="mt-2 text-sm text-red-600">{errors.goalTimeline}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Amount (Optional)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="number"
            value={formData.targetAmount}
            onChange={(e) => handleInputChange('targetAmount', e.target.value)}
            placeholder="50000"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <TrendingUp className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your risk tolerance?</h2>
        <p className="text-gray-600">Understanding your comfort with investment risk</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Risk Tolerance *
        </label>
        <div className="space-y-3">
          {riskToleranceOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('riskTolerance', option.value)}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                formData.riskTolerance === option.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
            </button>
          ))}
        </div>
        {errors.riskTolerance && <p className="mt-2 text-sm text-red-600">{errors.riskTolerance}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Investment Experience *
        </label>
        <div className="space-y-3">
          {experienceOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('investmentExperience', option.value)}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                formData.investmentExperience === option.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
            </button>
          ))}
        </div>
        {errors.investmentExperience && <p className="mt-2 text-sm text-red-600">{errors.investmentExperience}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Comfort with Market Volatility: {formData.comfortWithVolatility}/10
        </label>
        <div className="px-3">
          <input
            type="range"
            min="1"
            max="10"
            value={formData.comfortWithVolatility}
            onChange={(e) => handleInputChange('comfortWithVolatility', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Very Uncomfortable</span>
            <span>Very Comfortable</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">A little more about you</h2>
        <p className="text-gray-600">Final details to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Age Range *
          </label>
          <select
            value={formData.ageRange}
            onChange={(e) => handleInputChange('ageRange', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select age range</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46-55">46-55</option>
            <option value="56-65">56-65</option>
            <option value="65+">65+</option>
          </select>
          {errors.ageRange && <p className="mt-1 text-sm text-red-600">{errors.ageRange}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Employment Status *
          </label>
          <select
            value={formData.employmentStatus}
            onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select employment status</option>
            <option value="employed">Full-time Employed</option>
            <option value="self_employed">Self-employed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
            <option value="unemployed">Unemployed</option>
          </select>
          {errors.employmentStatus && <p className="mt-1 text-sm text-red-600">{errors.employmentStatus}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Financial Stress Level: {formData.financialStressLevel}/10
        </label>
        <div className="px-3">
          <input
            type="range"
            min="1"
            max="10"
            value={formData.financialStressLevel}
            onChange={(e) => handleInputChange('financialStressLevel', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>No Stress</span>
            <span>Very Stressed</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Learning Style
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'visual', label: 'Visual', desc: 'Charts & graphs' },
            { value: 'hands_on', label: 'Hands-on', desc: 'Interactive practice' },
            { value: 'theoretical', label: 'Theoretical', desc: 'Detailed explanations' },
            { value: 'gamified', label: 'Gamified', desc: 'Game-like experience' }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('preferredLearningStyle', option.value)}
              className={`p-3 border-2 rounded-lg text-center transition-all duration-200 hover:shadow-md ${
                formData.preferredLearningStyle === option.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Financial Journey!</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Thank you for completing your profile. We've personalized your learning experience based on your goals, 
        risk tolerance, and preferences.
      </p>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Personalized Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <span className="font-medium text-gray-700">Username:</span>
            <p className="text-gray-600">{formData.username}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Primary Goal:</span>
            <p className="text-gray-600">{goalOptions.find(g => g.value === formData.primaryGoal)?.label}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Risk Tolerance:</span>
            <p className="text-gray-600 capitalize">{formData.riskTolerance}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Experience Level:</span>
            <p className="text-gray-600 capitalize">{formData.investmentExperience}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Learning Style:</span>
            <p className="text-gray-600 capitalize">{formData.preferredLearningStyle.replace('_', ' ')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Timeline:</span>
            <p className="text-gray-600 capitalize">{formData.goalTimeline.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600">
        Your profile has been saved and you'll be redirected to the game dashboard shortly.
      </p>
      
      {onComplete && (
        <button
          onClick={onComplete}
          className="bg-primary-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Continue to Home
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep < 4 && renderProgressBar()}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              <button
                type="button"
                onClick={currentStep === 3 ? handleSubmit : nextStep}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : currentStep === 3 ? 'Complete Profile' : 'Next Step'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}