import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  LogOut,
  Activity,
  ChevronRight,
  X, // Added for mobile close button
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/patients',     label: 'Patients',     icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
]

// Added mobileOpen and onClose to props
const Sidebar = ({ mobileOpen, onClose }) => {
  const { logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <>
      {/* Mobile Backdrop — Darkens screen when sidebar is open on mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-ink flex flex-col z-50 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Brand / Logo area */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-float">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none">CareHub</p>
              <p className="text-white/40 text-xs mt-0.5">Patient Management</p>
            </div>
          </div>
          
          {/* Close button — Only visible on mobile */}
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>

          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose} // Close sidebar when a link is clicked on mobile
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-float'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} className="opacity-70" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user section */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/30 border border-brand-400/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand-300">
                {currentUser?.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : currentUser?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                {currentUser?.displayName || 'User'}
              </p>
              <p className="text-white/40 text-xs truncate">{currentUser?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar