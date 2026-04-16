import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Context providers
import { AuthProvider } from './context/AuthContext.jsx'


// Route guards and layout
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/layout/Layout.jsx'

// Pages
import Login            from './pages/Login.jsx'
import Dashboard        from './pages/Dashboard.jsx'
import Patients         from './pages/Patients.jsx'
import PatientDetail    from './pages/PatientDetail.jsx'
import AddPatient       from './pages/AddPatient.jsx'
import EditPatient      from './pages/EditPatient.jsx'
import Appointments     from './pages/Appointments.jsx'
import AddAppointment   from './pages/AddAppointment.jsx'
import EditAppointment  from './pages/EditAppointment.jsx'
import NotFound         from './pages/NotFound.jsx'

/**
 * App — root component with full route tree.
 *
 *  /login                        Public sign-in / register
 *  /dashboard                    Overview dashboard
 *  /patients                     Patient list
 *  /patients/add                 Add new patient (full page)
 *  /patients/:id                 Patient detail view
 *  /patients/:id/edit            Edit patient (full page)
 *  /appointments                 Appointments list
 *  /appointments/add             Schedule new appointment (full page)
 *  /appointments/:id/edit        Edit appointment (full page)
 */
function App() {
  return (
    <AuthProvider>
      
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/"      element={<Navigate to="/dashboard" replace />} />

            {/* Protected — inside Layout shell */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard"              element={<Dashboard />} />

                {/* Patient routes */}
                <Route path="/patients"               element={<Patients />} />
                <Route path="/patients/add"           element={<AddPatient />} />
                <Route path="/patients/:id"           element={<PatientDetail />} />
                <Route path="/patients/:id/edit"      element={<EditPatient />} />

                {/* Appointment routes */}
                <Route path="/appointments"           element={<Appointments />} />
                <Route path="/appointments/add"       element={<AddAppointment />} />
                <Route path="/appointments/:id/edit"  element={<EditAppointment />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Sora, sans-serif',
              fontSize:   '13px',
              fontWeight: '500',
              borderRadius: '12px',
              border: '1px solid #e8ecf4',
              boxShadow: '0 4px 24px rgba(15,22,35,0.10)',
            },
            success: { iconTheme: { primary: '#3366ff', secondary: '#fff' } },
          }}
        />
      
    </AuthProvider>
  )
}

export default App
