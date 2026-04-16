import { useState } from 'react'
import { CalendarPlus, CalendarDays } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppointments from '../hooks/useAppointments.js'
import usePatients from '../hooks/usePatients.js'
import AppointmentTable from '../components/appointments/AppointmentTable.jsx'
import AppointmentForm from '../components/appointments/AppointmentForm.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'


const Appointments = () => {
  const { appointments, loading: aLoading, addAppointment, editAppointment, removeAppointment } =
    useAppointments()
  const { patients, loading: pLoading } = usePatients()

  const [modalMode, setModalMode]           = useState(null) // 'add' | 'edit' | null
  const [selectedAppointment, setSelected]  = useState(null)
  const [saving, setSaving]                 = useState(false)

  // ── Add ──────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setSelected(null)
    setModalMode('add')
  }

  const handleAdd = async (formData) => {
    setSaving(true)
    try {
      await addAppointment(formData)
      toast.success('Appointment scheduled')
      setModalMode(null)
    } catch {
      toast.error('Failed to schedule appointment')
    } finally {
      setSaving(false)
    }
  }

  // ── Edit ─────────────────────────────────────────────────
  const handleOpenEdit = (appointment) => {
    setSelected(appointment)
    setModalMode('edit')
  }

  const handleEdit = async (formData) => {
    setSaving(true)
    try {
      await editAppointment(selectedAppointment.id, formData)
      toast.success('Appointment updated')
      setModalMode(null)
      setSelected(null)
    } catch {
      toast.error('Failed to update appointment')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment? This cannot be undone.')) return
    try {
      await removeAppointment(id)
      toast.success('Appointment deleted')
    } catch {
      toast.error('Failed to delete appointment')
    }
  }

  // Count upcoming appointments for the summary chip
  const upcomingCount = appointments.filter((a) => {
    if (a.status !== 'scheduled' || !a.date) return false
    const d = a.date?.toDate ? a.date.toDate() : new Date(a.date)
    return d >= new Date()
  }).length

  return (
    <div className="space-y-5 animate-fade-in-up">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Appointments</h2>
          <p className="text-sm text-ink-muted mt-0.5">
            Schedule, track, and manage all clinic appointments
          </p>
        </div>
        <Button variant="primary" icon={CalendarPlus} onClick={handleOpenAdd}>
          Schedule Appointment
        </Button>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100">
          <CalendarDays size={13} className="text-brand-500" />
          <span className="text-xs font-semibold text-brand-600">
            {appointments.length} total
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">
            {upcomingCount} upcoming
          </span>
        </div>
      </div>

      {/* Appointments table */}
      <AppointmentTable
        appointments={appointments}
        loading={aLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* ── Schedule Appointment Modal ───────────────────── */}
      <Modal
        isOpen={modalMode === 'add'}
        onClose={() => setModalMode(null)}
        title="Schedule New Appointment"
        size="lg"
      >
        <AppointmentForm
          patients={patients}
          onSubmit={handleAdd}
          onCancel={() => setModalMode(null)}
          loading={saving || pLoading}
        />
      </Modal>

      {/* ── Edit Appointment Modal ───────────────────────── */}
      <Modal
        isOpen={modalMode === 'edit'}
        onClose={() => { setModalMode(null); setSelected(null) }}
        title="Edit Appointment"
        size="lg"
      >
        <AppointmentForm
          initialData={selectedAppointment}
          patients={patients}
          onSubmit={handleEdit}
          onCancel={() => { setModalMode(null); setSelected(null) }}
          loading={saving || pLoading}
        />
      </Modal>
    </div>
  )
}

export default Appointments