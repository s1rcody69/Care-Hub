import { useState, useEffect } from 'react'
import { User, Phone, Mail, Droplets, Calendar, FileText, MapPin } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { BLOOD_GROUPS, GENDERS } from '../../utils/constants.js'

// Default empty form state
const EMPTY_FORM = {
  name:          '',
  age:           '',
  gender:        '',
  phone:         '',
  email:         '',
  bloodGroup:    '',
  address:       '',
  medicalHistory: '',
  allergies:     '',
  emergencyContact: '',
}

/**
 * 
 *
 * @param {Object} initialData - Pre-filled patient data for edit mode
 * @param {Function} onSubmit - Called with form data on submission
 * @param {Function} onCancel - Called when user cancels
 * @param {boolean} loading - Disables submit while saving
 */
const PatientForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Pre-fill form when editing an existing patient
  useEffect(() => {
    if (initialData) {
      setForm({
        name:             initialData.name             || '',
        age:              initialData.age              || '',
        gender:           initialData.gender           || '',
        phone:            initialData.phone            || '',
        email:            initialData.email            || '',
        bloodGroup:       initialData.bloodGroup       || '',
        address:          initialData.address          || '',
        medicalHistory:   initialData.medicalHistory   || '',
        allergies:        initialData.allergies        || '',
        emergencyContact: initialData.emergencyContact || '',
      })
    }
  }, [initialData])

  // Generic change handler for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field-level error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Validate required fields before submission
  const validate = () => {
    const newErrors = {}
    if (!form.name.trim())  newErrors.name  = 'Full name is required'
    if (!form.age)          newErrors.age   = 'Age is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (form.age && (isNaN(form.age) || form.age < 0 || form.age > 150)) {
      newErrors.age = 'Enter a valid age (0–150)'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    // Cast age to number before saving
    onSubmit({ ...form, age: Number(form.age) })
  }

  // Reusable input wrapper with label and error
  const Field = ({ label, name, icon: Icon, type = 'text', placeholder, required, children }) => (
    <div>
      <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
            <Icon size={15} />
          </div>
        )}
        {/* Render children (select/textarea) or default input */}
        {children ? (
          <div className={Icon ? 'pl-9' : ''}>{children}</div>
        ) : (
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`
              w-full rounded-xl border text-sm text-ink placeholder-ink-muted
              px-3 py-2.5 transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
              ${Icon ? 'pl-9' : ''}
              ${errors[name]
                ? 'border-red-300 bg-red-50'
                : 'border-surface-border bg-white hover:border-brand-200'
              }
            `}
          />
        )}
      </div>
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">

        {/* Row 1: Name + Age */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name" name="name" icon={User} placeholder="e.g. Jane Doe" required>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className={`
                w-full rounded-xl border text-sm text-ink placeholder-ink-muted
                pl-9 pr-3 py-2.5 transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                ${errors.name
                  ? 'border-red-300 bg-red-50'
                  : 'border-surface-border bg-white hover:border-brand-200'
                }
              `}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </Field>

          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Age <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 34"
                min="0"
                max="150"
                className={`
                  w-full rounded-xl border text-sm text-ink placeholder-ink-muted
                  pl-9 pr-3 py-2.5 transition-all duration-150
                  focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                  ${errors.age
                    ? 'border-red-300 bg-red-50'
                    : 'border-surface-border bg-white hover:border-brand-200'
                  }
                `}
              />
            </div>
            {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
          </div>
        </div>

        {/* Row 2: Gender + Blood Group */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all duration-150"
            >
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><Droplets size={13} />Blood Group</span>
            </label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all duration-150"
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3: Phone + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+254 700 000 000"
                className={`
                  w-full rounded-xl border text-sm text-ink placeholder-ink-muted
                  pl-9 pr-3 py-2.5 transition-all
                  focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                  ${errors.phone ? 'border-red-300 bg-red-50' : 'border-surface-border bg-white hover:border-brand-200'}
                `}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><Mail size={13} />Email</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="patient@email.com"
                className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
            <span className="flex items-center gap-1.5"><MapPin size={13} />Address</span>
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, City, Country"
            className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
          />
        </div>

        {/* Medical History */}
        <div>
          <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
            <span className="flex items-center gap-1.5"><FileText size={13} />Medical History</span>
          </label>
          <textarea
            name="medicalHistory"
            value={form.medicalHistory}
            onChange={handleChange}
            placeholder="Previous diagnoses, surgeries, chronic conditions..."
            rows={3}
            className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all resize-none"
          />
        </div>

        {/* Allergies + Emergency Contact */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Allergies</label>
            <input
              type="text"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="e.g. Penicillin, Peanuts"
              className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Emergency Contact</label>
            <input
              type="text"
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              placeholder="Name — Phone"
              className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Form action buttons */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Save Changes' : 'Add Patient'}
        </Button>
      </div>
    </form>
  )
}

export default PatientForm
