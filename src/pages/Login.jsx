import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Activity, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebase.js'
import toast from 'react-hot-toast'


const Login = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  // const authorization = auth()
  // const signIn = signInWithEmailAndPassword()


  // Mode toggle: false = sign in, true = create account
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form fields
  const [form, setForm] = useState({
    displayName: '',
    email:       '',
    password:    '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Client-side validation
  const validate = () => {
    const errs = {}
    if (isRegister && !form.displayName.trim()) errs.displayName = 'Name is required'
    if (!form.email.trim())    errs.email    = 'Email is required'
    if (!form.password)        errs.password = 'Password is required'
    if (form.password && form.password.length < 6)
      errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        // Create new account
        await register(form.email, form.password, form.displayName)
        toast.success('Account created successfully')
      } else {
        // Sign in to existing account
        await login(form.email, form.password)
        toast.success('Welcome back!')
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      // Map Firebase error codes to friendly messages
      const firebaseErrors = {
        'auth/user-not-found':     'No account found with this email',
        'auth/wrong-password':     'Incorrect password',
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/invalid-email':      'Please enter a valid email address',
        'auth/too-many-requests':  'Too many attempts. Please try again later',
        'auth/invalid-credential': 'Invalid email or password',
      }
      toast.error(firebaseErrors[err.code] || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Reusable input field component
  const InputField = ({ label, name, type, icon: Icon, placeholder, autoComplete }) => (
    <div>
      <label className="block text-xs font-semibold text-ink-secondary mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          type={name === 'password' ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full rounded-xl border text-sm text-ink placeholder-ink-muted
            pl-9 ${name === 'password' ? 'pr-10' : 'pr-3'} py-3 transition-all
            focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
            ${errors[name]
              ? 'border-red-300 bg-red-50'
              : 'border-surface-border bg-white hover:border-brand-200'
            }
          `}
        />
        {/* Toggle password visibility */}
        {name === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-surface flex">

      {/* Left panel — branding illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-500/10" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-brand-500/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-500/5" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-float">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl">CareHub</p>
            <p className="text-white/40 text-xs">Patient Management System</p>
          </div>
        </div>

        {/* Center feature highlights */}
        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Modern clinic<br />management,<br />
            <span className="text-brand-400">simplified.</span>
          </h2>
          <div className="space-y-3">
            {[
              'Full patient records and history',
              'Appointment scheduling and tracking',
              'AI-powered clinical assistant',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                <p className="text-white/60 text-sm">{feat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative text-white/30 text-xs">
          Built for clinicians, designed for speed.
        </p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <p className="text-ink font-bold text-lg">CareHub</p>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink">
              {isRegister ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-ink-muted text-sm mt-1">
              {isRegister
                ? 'Fill in your details to get started'
                : 'Sign in to access your dashboard'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Display name — only shown when registering */}
            {isRegister && (
              <InputField
                label="Full Name"
                name="displayName"
                type="text"
                icon={User}
                placeholder="Dr. Jane Smith"
                autoComplete="name"
              />
            )}

            <InputField
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="doctor@clinic.com"
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder={isRegister ? 'Minimum 6 characters' : 'Enter your password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle between sign in / register */}
          <p className="text-center text-sm text-ink-muted mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister((v) => !v)
                setErrors({})
                setForm({ displayName: '', email: '', password: '' })
              }}
              className="text-brand-500 font-semibold hover:text-brand-600 transition-colors"
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login