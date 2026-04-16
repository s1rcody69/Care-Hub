import { useLocation } from 'react-router-dom'
import { Bell, Search, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/patients':     'Patients',
  '/appointments': 'Appointments',
}

const EXACT_TITLES = {
  '/patients/add':     'Add New Patient',
  '/appointments/add': 'Schedule Appointment',
}

const Navbar = ({ onMenuClick }) => {
  const { currentUser } = useAuth()
  const location        = useLocation()

  const getTitle = () => {
    const path     = location.pathname
    const segments = path.split('/').filter(Boolean)

    if (EXACT_TITLES[path]) return EXACT_TITLES[path]

    if (segments.length === 3 && segments[2] === 'edit') {
      return segments[0] === 'patients' ? 'Edit Patient' : 'Edit Appointment'
    }

    if (segments.length === 2 && segments[0] === 'patients') {
      return 'Patient Detail'
    }

    const base = '/' + (segments[0] || '')
    return PAGE_TITLES[base] || 'CareHub'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    /* Added sticky top-0 and z-index to keep it above main content while scrolling */
    <header className="h-16 bg-white border-b border-surface-border flex items-center px-3 sm:px-6 gap-2 sm:gap-3 sticky top-0 z-30 w-full">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 sm:p-2 rounded-xl text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Page title + greeting */}
      <div className="flex-1 min-w-0">
        {/* Adjusted text size for smaller screens to prevent overlap */}
        <h1 className="text-sm sm:text-lg font-bold text-ink leading-tight truncate">
          {getTitle()}
        </h1>
        <p className="text-[10px] sm:text-xs text-ink-muted mt-0.5 hidden sm:block truncate">
          {getGreeting()}, {currentUser?.displayName || 'Doctor'}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

        {/* Search icon only on mobile/tablet, full button on desktop */}
        <button className="md:hidden p-2 rounded-xl text-ink-muted hover:bg-surface-muted transition-colors">
          <Search size={18} />
        </button>

        <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-muted border border-surface-border text-ink-muted text-sm hover:border-brand-300 transition-colors">
          <Search size={14} />
          <span className="text-xs">Search...</span>
        </button>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border-2 border-white" />
        </button>

        {/* Avatar — slightly smaller on mobile to save space */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm cursor-pointer flex-shrink-0">
          <span className="text-xs sm:text-sm font-bold text-white">
            {currentUser?.displayName
              ? currentUser.displayName.charAt(0).toUpperCase()
              : currentUser?.email?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Navbar