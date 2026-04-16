import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import Chatbot from '../chatbot/Chatbot.jsx'

/**
 * Layout — main shell for all authenticated pages.
 */
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface flex overflow-x-hidden"> {/* Prevent horizontal scroll on the whole body */}

      {/* Sidebar — handles its own desktop/mobile rendering */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — fixed the squeezing issue by adding w-full and overflow-hidden */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full lg:ml-64 overflow-hidden">

        {/* Top navbar — receives the menu toggle handler */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 w-full max-w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    <Chatbot />

     
    </div>
  )
}

export default Layout