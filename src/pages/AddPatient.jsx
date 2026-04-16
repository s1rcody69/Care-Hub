import { useState, useEffect } from 'react'
import { User, Phone, Mail, Droplets, Calendar, FileText, MapPin, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import Button from '../components/ui/Button.jsx'
import { createPatient } from '../services/patientService.js'
import { BLOOD_GROUPS, GENDERS } from '../utils/constants.js'

const EMPTY_FORM = {
  name:             '',
  age:              '',
  gender:           '',
  phone:            '',
  email:            '',
  bloodGroup:       '',
  address:          '',
  medicalHistory:   '',
  allergies:        '',
  emergencyContact: '',
}

/**
 * PatientForm — shared add/edit form used in modals (PatientDetail)
 * and as the base for the dedicated Add/Edit pages.
 *
 * All fields are rendered inline without the broken children-pattern
 * to avoid double-rendering issues.
 *
 * @param {Object}   initialData - Pre-fills all fields in edit mode
 * @param {Function} onSubmit    - Called with validated form data
 * @param {Function} onCancel   - Called on Cancel click
 * @param {boolean}  loading    - Disables submit while saving
 */
const PatientForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const navigate = useNavigate()
  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name:             initialData.name             || '',
        age:              String(initialData.age       || ''),
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())  errs.name  = 'Full name is required'
    if (!form.age)          errs.age   = 'Age is required'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    if (form.age && (isNaN(form.age) || Number(form.age) < 0 || Number(form.age) > 150)) {
      errs.age = 'Enter a valid age (0–150)'
    }
    return errs
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  const errs = validate()
  if (Object.keys(errs).length > 0) {
    setErrors(errs)
    return
  }

  try {
    await createPatient({ ...form, age: Number(form.age) })
    toast.success("Patient created successfully")
    navigate('/Patients');
  } catch (err) {
    toast.error("Error creating patient:", err)
  }
}


    // e.preventDefault()
    // const errs = validate()
    // if (Object.keys(errs).length > 0) { setErrors(errs); return }
    // onSubmit({ ...form, age: Number(form.age) })
  

  // Shared input class builder
  const inputClass = (field) => `
    w-full rounded-xl border text-sm text-ink placeholder-ink-muted
    px-3 py-2.5 transition-all
    focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
    ${errors[field]
      ? 'border-red-300 bg-red-50'
      : 'border-surface-border bg-white hover:border-brand-200'
    }
  `

  const iconInputClass = (field) => `
    w-full rounded-xl border text-sm text-ink placeholder-ink-muted
    pl-9 pr-3 py-2.5 transition-all
    focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
    ${errors[field]
      ? 'border-red-300 bg-red-50'
      : 'border-surface-border bg-white hover:border-brand-200'
    }
  `

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
        <AlertCircle size={11} />{errors[field]}
      </p>
    ) : null

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">

        {/* Name + Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Jane Doe" autoComplete="name"
                className={iconInputClass('name')}
              />
            </div>
            <ErrorMsg field="name" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Age <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type="number" name="age" value={form.age} onChange={handleChange}
                placeholder="e.g. 34" min="0" max="150"
                className={iconInputClass('age')}
              />
            </div>
            <ErrorMsg field="age" />
          </div>
        </div>

        {/* Gender + Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all">
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><Droplets size={13} />Blood Group</span>
            </label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
              className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all">
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+254 700 000 000" autoComplete="tel"
                className={iconInputClass('phone')}
              />
            </div>
            <ErrorMsg field="phone" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
              <span className="flex items-center gap-1.5"><Mail size={13} />Email</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="patient@email.com" autoComplete="email"
                className={iconInputClass('email')}
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
            type="text" name="address" value={form.address} onChange={handleChange}
            placeholder="Street, City, Country"
            className={inputClass('address')}
          />
        </div>

        {/* Medical History */}
        <div>
          <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
            <span className="flex items-center gap-1.5"><FileText size={13} />Medical History</span>
          </label>
          <textarea
            name="medicalHistory" value={form.medicalHistory} onChange={handleChange}
            placeholder="Previous diagnoses, surgeries, chronic conditions..."
            rows={3}
            className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all resize-none"
          />
        </div>

        {/* Allergies + Emergency Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Allergies</label>
            <input
              type="text" name="allergies" value={form.allergies} onChange={handleChange}
              placeholder="e.g. Penicillin, Peanuts"
              className={inputClass('allergies')}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Emergency Contact</label>
            <input
              type="text" name="emergencyContact" value={form.emergencyContact} onChange={handleChange}
              placeholder="Name — Phone"
              className={inputClass('emergencyContact')}
            />
          </div>
        </div>
      </div>

      {/* Footer actions */}
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