import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button.jsx'

/**
 * NotFound — 404 page shown for any unrecognised route.
 */
const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center max-w-sm animate-fade-in-up">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={28} className="text-brand-400" />
        </div>

        {/* 404 number */}
        <p className="text-7xl font-bold text-brand-100 leading-none mb-3">404</p>

        <h1 className="text-xl font-bold text-ink mb-2">Page not found</h1>
        <p className="text-sm text-ink-muted mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <Button
          variant="primary"
          icon={LayoutDashboard}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default NotFound