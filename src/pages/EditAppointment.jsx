import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  User,
  CalendarDays,
  Clock,
  FileText,
  Stethoscope,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getAppointmentById, updateAppointment } from '../services/appointmentService.js'
import usePatients from '../hooks/usePatients.js'
import Button from '../components/ui/Button.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import Badge from '../components/ui/Badge.jsx'
import { APPOINTMENT_STATUSES } from '../utils/constants.js'
import { formatDate } from '../utils/helpers.js'

/**
 * EditAppointment — dedicated page at /appointments/:id/edit.
 *
 * Fetches the appointment by ID on mount, pre-fills all fields,
 * and saves changes via updateAppointment service.
 * Navigates back to /appointments on success.
 */
const EditAppointment = () => {
  const { id }   = useParams()
  const navigate = useNavigate()

  const { patients, loading: pLoading } = usePatients()

  const [form, setForm]       = useState(null)
  const [errors, setErrors]   = useState({})
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [original, setOriginal] = useState(null)

  // Fetch appointment on mount
  useEffect(() => {
    const load = async () => {
      try {
        const appt = await getAppointmentById(id)
        if (!appt) {
          toast.error('Appointment not found')
          navigate('/appointments')
          return
        }
        setOriginal(appt)

        // Convert Firestore Timestamp to YYYY-MM-DD string for the date input
        let dateStr = ''
        if (appt.date) {
          const d = appt.date?.toDate ? appt.date.toDate() : new Date(appt.date)
          dateStr = d.toISOString().split('T')[0]
        }

        setForm({
          patientId:   appt.patientId   || '',
          patientName: appt.patientName || '',
          date:        dateStr,
          time:        appt.time        || '',
          type:        appt.type        || '',
          status:      appt.status      || 'scheduled',
          notes:       appt.notes       || '',
        })
      } catch {
        toast.error('Failed to load appointment')
        navigate('/appointments')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Selecting a different patient updates both ID and display name
  const handlePatientSelect = (e) => {
    const selectedId = e.target.value
    const patient    = patients.find((p) => p.id === selectedId)
    setForm((prev) => ({
      ...prev,
      patientId:   selectedId,
      patientName: patient ? patient.name : '',
    }))
    if (errors.patientId) setErrors((prev) => ({ ...prev, patientId: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.patientId) errs.patientId = 'Please select a patient'
    if (!form.date)      errs.date      = 'Date is required'
    if (!form.time)      errs.time      = 'Time is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSaving(true)
    try {
      await updateAppointment(id, form)
      toast.success('Appointment updated successfully')
      navigate('/appointments')
    } catch {
      toast.error('Failed to update appointment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Loading / not-found state ─────────────────────────────────
  if (loading || pLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/appointments')}
            className="p-2 rounded-xl text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink">Edit Appointment</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              Updating appointment for{' '}
              <span className="font-semibold text-ink">{original?.patientName}</span>
            </p>
          </div>
        </div>

        {/* Current status chip */}
        {original && (
          <div className="hidden sm:flex items-center gap-2 bg-white border border-surface-border rounded-xl px-4 py-2.5 shadow-card">
            <span className="text-xs text-ink-muted">Current status:</span>
            <Badge status={original.status} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT: Main fields ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Core appointment details */}
            <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
                  <CalendarDays size={14} className="text-brand-500" />
                </div>
                <h2 className="text-sm font-bold text-ink">Appointment Details</h2>
              </div>

              <div className="space-y-4">

                {/* Patient selector */}
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <User size={13} />
                      Patient <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    name="patientId"
                    value={form.patientId}
                    onChange={handlePatientSelect}
                    className={`
                      w-full rounded-xl border text-sm text-ink px-3 py-2.5 bg-white
                      focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                      hover:border-brand-200 transition-all
                      ${errors.patientId ? 'border-red-300 bg-red-50' : 'border-surface-border'}
                    `}
                  >
                    <option value="">Select a patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.patientId && (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                      <AlertCircle size={11} />{errors.patientId}
                    </p>
                  )}
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} />Date <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="date" name="date" value={form.date} onChange={handleChange}
                      className={`
                        w-full rounded-xl border text-sm text-ink px-3 py-2.5 bg-white
                        focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                        hover:border-brand-200 transition-all
                        ${errors.date ? 'border-red-300 bg-red-50' : 'border-surface-border'}
                      `}
                    />
                    {errors.date && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={11} />{errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />Time <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="time" name="time" value={form.time} onChange={handleChange}
                      className={`
                        w-full rounded-xl border text-sm text-ink px-3 py-2.5 bg-white
                        focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                        hover:border-brand-200 transition-all
                        ${errors.time ? 'border-red-300 bg-red-50' : 'border-surface-border'}
                      `}
                    />
                    {errors.time && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={11} />{errors.time}
                      </p>
                    )}
                  </div>
                </div>

                {/* Type + Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Stethoscope size={13} />Appointment Type
                      </span>
                    </label>
                    <input
                      type="text" name="type" value={form.type} onChange={handleChange}
                      placeholder="e.g. Check-up, Follow-up"
                      className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                      Status
                    </label>
                    <select
                      name="status" value={form.status} onChange={handleChange}
                      className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
                    >
                      {APPOINTMENT_STATUSES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <h2 className="text-sm font-bold text-ink">Notes & Instructions</h2>
              </div>
              <textarea
                name="notes" value={form.notes} onChange={handleChange}
                placeholder="Any special instructions, preparation notes, or observations..."
                rows={5}
                className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all resize-none"
              />
            </div>
          </div>

          {/* ── RIGHT: Record info ────────────────────────── */}
          <div className="space-y-5">

            {/* Live preview */}
            <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-5">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-4">
                Current Values
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={14} className="text-ink-muted mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-ink-muted">Patient</p>
                    <p className="text-sm font-semibold text-ink">
                      {form.patientName || <span className="italic text-ink-muted font-normal">Not selected</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays size={14} className="text-ink-muted mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-ink-muted">Date & Time</p>
                    <p className="text-sm font-semibold text-ink">
                      {form.date && form.time
                        ? `${form.date} at ${form.time}`
                        : <span className="italic text-ink-muted font-normal">Not set</span>
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Badge status={form.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Record metadata */}
            {original && (
              <div className="bg-surface-muted rounded-xl2 border border-surface-border p-4 space-y-2">
                <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Record Info</p>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Created</span>
                  <span className="font-semibold text-ink">{formatDate(original.createdAt)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Last Updated</span>
                  <span className="font-semibold text-ink">{formatDate(original.updatedAt)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Appointment ID</span>
                  <span className="font-mono text-xs text-ink-muted truncate max-w-[120px]">{id}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky footer ─────────────────────────────── */}
        <div className="sticky bottom-0 mt-6 bg-white border-t border-surface-border rounded-b-xl2 px-6 py-4 flex items-center justify-between shadow-lg">
          <p className="text-xs text-ink-muted">
            Fields marked <span className="text-red-500 font-semibold">*</span> are required
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/appointments')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditAppointment