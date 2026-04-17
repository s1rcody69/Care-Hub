import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Users, LayoutGrid, List, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import usePatients from '../hooks/usePatients.js'
import PatientTable from '../components/patients/PatientTable.jsx'
import PatientCard from '../components/patients/PatientCard.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import Button from '../components/ui/Button.jsx'


const Patients = () => {
  // HOOKS: Pulling live data and navigation capabilities
  const { patients, loading, error, removePatient } = usePatients()
  const navigate = useNavigate()

  // STATE: Tracking UI mode (table vs grid) and deletion targets
  const [viewMode, setViewMode] = useState('table')
  const [deleteTarget, setDeleteTarget] = useState(null) // Stores {id, name} of patient to delete
  const [deleting, setDeleting]         = useState(false) // Loading state for the delete button

  // LOGIC: Prepares the confirmation modal by setting the target patient
  const handleDeleteRequest = (id, name) => {
    setDeleteTarget({ id, name })
  }

  // LOGIC: The actual Firebase execution for record removal
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removePatient(deleteTarget.id) // Calls the custom hook logic
      toast.success('Patient deleted')
      setDeleteTarget(null) // Close modal on success
    } catch {
      toast.error('Failed to delete patient')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5 animate-fade-in-up pb-10"> {/* Added pb-10 for mobile clearance */}

      {/* ERROR HANDLING: Only renders if the usePatients hook catches a Firebase error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* HEADER: Uses flex-col for mobile and sm:flex-row for desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Patient Records</h2>
          <p className="text-sm text-ink-muted mt-0.5">
            Manage and review all registered patients
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={UserPlus} 
          onClick={() => navigate('/patients/add')}
          className="w-full sm:w-auto justify-center" // Full width on mobile for accessibility
        >
          Add Patient
        </Button>
      </div>

      {/* TOOLBAR: Summary chips and view toggles */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 flex-shrink-0">
          <Users size={13} className="text-brand-500" />
          <span className="text-[10px] sm:text-xs font-semibold text-brand-600 whitespace-nowrap">
            {patients.length} total {patients.length !== 1 ? 'patients' : 'patient'}
          </span>
        </div>

        {/* VIEW TOGGLE LOGIC: Swaps between list and grid icons */}
        <div className="flex items-center bg-surface-muted border border-surface-border rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'table' ? 'bg-white text-brand-500 shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
            title="Table view"
          >
            <List size={15} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-white text-brand-500 shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDERING: Table View */}
      {viewMode === 'table' && (
        <div className="w-full">
          <PatientTable
            patients={patients}
            loading={loading}
            onEdit={(patient) => navigate(`/patients/${patient.id}/edit`)}
            onDelete={(id) => {
              const p = patients.find((x) => x.id === id)
              handleDeleteRequest(id, p?.name)
            }}
          />
        </div>
      )}

      {/* CONDITIONAL RENDERING: Grid View (with Loading Skeleton logic) */}
      {viewMode === 'grid' && (
        <>
          {loading ? (
            // LOADING STATE: Renders empty animated cards while data fetches
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl2 border border-surface-border h-48 animate-pulse" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            // EMPTY STATE: If database returns 0 records
            <div className="bg-white rounded-xl2 border border-surface-border py-16 text-center">
              <p className="text-sm text-ink-muted">No patients registered yet.</p>
            </div>
          ) : (
            // SUCCESS STATE: Maps patient array into Individual PatientCard components
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {patients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onEdit={(p) => navigate(`/patients/${p.id}/edit`)}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* OVERLAY: Global Confirmation Dialog for Deletions */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete patient?"
        description={
          deleteTarget?.name
            ? `Are you sure you want to delete ${deleteTarget.name}? All their records will be permanently removed.`
            : 'This action cannot be undone.'
        }
        confirmLabel="Delete Patient"
        loading={deleting}
      />
    </div>
  )
}

export default Patients