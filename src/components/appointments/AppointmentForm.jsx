import { useState, useEffect } from 'react'
import { CalendarDays, Clock, FileText, User } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { APPOINTMENT_STATUSES } from '../../utils/constants.js'

// Default empty form
const EMPTY_FORM = {
  patientName: '',
  patientId:   '',
  date:        '',
  time:        '',
  status:      'scheduled',
  type:        '',
  notes:       '',
}

/**
 * 
 *
 * @param {Object}   initialData - Pre-filled data for edit mode
 * @param {Array}    patients    - List of patient objects for the dropdown
 * @param {Function} onSubmit    - Called with form data on submission
 * @param {Function} onCancel    - Called when user cancels
 * @param {boolean}  loading     - Disables the submit button while saving
 */
const AppointmentForm = ({ initialData, patients = [], onSubmit, onCancel, loading = false }) => {
  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (initialData) {
      // Convert Firestore Timestamp date to HTML date input format (YYYY-MM-DD)
      let dateStr = ''
      if (initialData.date) {
        const d = initialData.date?.toDate ? initialData.date.toDate() : new Date(initialData.date)
        dateStr = d.toISOString().split('T')[0]
      }
      setForm({
        patientName: initialData.patientName || '',
        patientId:   initialData.patientId   || '',
        date:        dateStr,
        time:        initialData.time        || '',
        status:      initialData.status      || 'scheduled',
        type:        initialData.type        || '',
        notes:       initialData.notes       || '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // When a patient is selected from the dropdown, populate both ID and name
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
          {errors.patientId && <p className="text-xs text-red-500 mt-1">{errors.patientId}</p>}
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} />
                Date <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`
                w-full rounded-xl border text-sm text-ink px-3 py-2.5 bg-white
                focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                hover:border-brand-200 transition-all
                ${errors.date ? 'border-red-300 bg-red-50' : 'border-surface-border'}
              `}
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                Time <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={`
                w-full rounded-xl border text-sm text-ink px-3 py-2.5 bg-white
                focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                hover:border-brand-200 transition-all
                ${errors.time ? 'border-red-300 bg-red-50' : 'border-surface-border'}
              `}
            />
            {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
          </div>
        </div>

        {/* Appointment type + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Appointment Type
            </label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="e.g. Check-up, Follow-up"
              className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
            >
              {APPOINTMENT_STATUSES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
            <span className="flex items-center gap-1.5">
              <FileText size={13} />
              Notes
            </span>
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any special instructions or observations..."
            rows={3}
            className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="secondary" loading={loading}>
          {initialData ? 'Save Changes' : 'Schedule Appointment'}
        </Button>
      </div>
    </form>
  )
}

export default AppointmentForm