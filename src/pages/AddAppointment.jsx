import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarPlus,
  User,
  CalendarDays,
  Clock,
  FileText,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createAppointment } from '../services/appointmentService'
import usePatients from '../hooks/usePatients'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { APPOINTMENT_STATUSES } from '../utils/constants'

/**
 * AddAppointment — dedicated page at /appointments/add.
 *
 * Two-column layout:
 * - Left: main scheduling fields (patient, date, time, type, status)
 * - Right: notes and required-fields checklist
 *
 * Saves via createAppointment service and navigates to /appointments on success.
 */
const AddAppointment = () => {
  const navigate              = useNavigate()
  const { patients, loading: pLoading } = usePatients()

  const [form, setForm]     = useState({
    patientId:   '',
    patientName: '',
    date:        '',
    time:        '',
    type:        '',
    status:      'scheduled',
    notes:       '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Selecting a patient fills both ID and name
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
      await createAppointment(form)
      toast.success('Appointment scheduled successfully')
      navigate('/appointments')
    } catch {
      toast.error('Failed to schedule appointment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Required fields progress
  const requiredFilled = [form.patientId, form.date, form.time].filter(Boolean).length
  const progressPct    = Math.round((requiredFilled / 3) * 100)

  if (pLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

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
            <h1 className="text-xl font-bold text-ink">Schedule Appointment</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              Book a new clinic appointment
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="hidden sm:flex items-center gap-3 bg-white border border-surface-border rounded-xl px-4 py-2.5 shadow-card">
          <div className="w-24 h-1.5 rounded-full bg-surface-border overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-ink-secondary">
            {requiredFilled}/3 required fields
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT: Scheduling details ──────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Patient + Date/Time card */}
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
                  {patients.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={11} />
                      No patients registered yet.{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/patients/add')}
                        className="underline font-semibold"
                      >
                        Add a patient first
                      </button>
                    </p>
                  )}
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        Date <span className="text-red-500">*</span>
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
                        <Clock size={13} />
                        Time <span className="text-red-500">*</span>
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
                        <Stethoscope size={13} />
                        Appointment Type
                      </span>
                    </label>
                    <input
                      type="text" name="type" value={form.type} onChange={handleChange}
                      placeholder="e.g. Check-up, Follow-up, Lab test"
                      className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                      Initial Status
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

            {/* Notes card */}
            <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <h2 className="text-sm font-bold text-ink">Notes & Instructions</h2>
              </div>
              <textarea
                name="notes" value={form.notes} onChange={handleChange}
                placeholder="Any special instructions, preparation notes, or observations for this appointment..."
                rows={5}
                className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all resize-none"
              />
            </div>
          </div>

          {/* ── RIGHT: Summary + checklist ────────────────── */}
          <div className="space-y-5">

            {/* Live appointment summary */}
            <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-5">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-4">
                Appointment Summary
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={14} className="text-ink-muted mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-ink-muted">Patient</p>
                    <p className="text-sm font-semibold text-ink">
                      {form.patientName || <span className="text-ink-muted font-normal italic">Not selected</span>}
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
                        : <span className="text-ink-muted font-normal italic">Not set</span>
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Stethoscope size={14} className="text-ink-muted mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-ink-muted">Type</p>
                    <p className="text-sm font-semibold text-ink">
                      {form.type || <span className="text-ink-muted font-normal italic">General</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Required fields checklist */}
            <div className="bg-surface-muted rounded-xl2 border border-surface-border p-4">
              <p className="text-xs font-semibold text-ink-secondary mb-2">Required fields</p>
              {[
                { label: 'Patient selected', filled: !!form.patientId },
                { label: 'Date set',         filled: !!form.date },
                { label: 'Time set',         filled: !!form.time },
              ].map(({ label, filled }) => (
                <div key={label} className="flex items-center gap-2 py-1">
                  <CheckCircle2
                    size={14}
                    className={filled ? 'text-emerald-500' : 'text-surface-border'}
                  />
                  <span className={`text-xs ${filled ? 'text-emerald-700 font-medium' : 'text-ink-muted'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
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
              icon={CalendarPlus}
              loading={saving}
              disabled={patients.length === 0}
            >
              Schedule Appointment
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddAppointment