import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Mail,
  Droplets,
  Calendar,
  FileText,
  MapPin,
  AlertCircle,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getPatientById, updatePatient } from '../services/patientService.js'
import Button from '../components/ui/Button.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import { BLOOD_GROUPS, GENDERS } from '../utils/constants.js'
import { formatDate } from '../utils/helpers.js'

/**
 * EditPatient — dedicated page at /patients/:id/edit.
 *
 * Fetches the patient by ID on mount, pre-fills all fields,
 * and saves changes via updatePatient service.
 * Navigates back to /patients/:id (detail view) on success.
 */
const EditPatient = () => {
  const { id }    = useParams()
  const navigate  = useNavigate()

  const [form, setForm]       = useState(null)    // null = not loaded yet
  const [errors, setErrors]   = useState({})
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [original, setOriginal] = useState(null)  // keep original for comparison

  // Fetch patient on mount
  useEffect(() => {
    const load = async () => {
      try {
        const patient = await getPatientById(id)
        if (!patient) {
          toast.error('Patient not found')
          navigate('/patients')
          return
        }
        setOriginal(patient)
        setForm({
          name:             patient.name             || '',
          age:              patient.age              || '',
          gender:           patient.gender           || '',
          phone:            patient.phone            || '',
          email:            patient.email            || '',
          bloodGroup:       patient.bloodGroup       || '',
          address:          patient.address          || '',
          medicalHistory:   patient.medicalHistory   || '',
          allergies:        patient.allergies        || '',
          emergencyContact: patient.emergencyContact || '',
        })
      } catch {
        toast.error('Failed to load patient')
        navigate('/patients')
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

  const validate = () => {
    const errs = {}
    if (!form.name.trim())  errs.name  = 'Full name is required'
    if (!form.age)          errs.age   = 'Age is required'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    if (form.age && (isNaN(form.age) || Number(form.age) < 0 || Number(form.age) > 150)) {
      errs.age = 'Enter a valid age between 0 and 150'
    }
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
      await updatePatient(id, { ...form, age: Number(form.age) })
      toast.success('Patient updated successfully')
      navigate(`/patients/${id}`)
    } catch {
      toast.error('Failed to update patient. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Reusable field components ─────────────────────────────────

  const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, required, autoComplete }) => (
    <div>
      <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        )}
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full rounded-xl border text-sm text-ink placeholder-ink-muted
            ${Icon ? 'pl-9' : 'px-3'} pr-3 py-2.5 transition-all
            focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
            ${errors[name]
              ? 'border-red-300 bg-red-50'
              : 'border-surface-border bg-white hover:border-brand-200'
            }
          `}
        />
      </div>
      {errors[name] && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertCircle size={11} />{errors[name]}
        </p>
      )}
    </div>
  )

  const SelectField = ({ label, name, options, placeholder }) => (
    <div>
      <label className="block text-xs font-semibold text-ink-secondary mb-1.5">{label}</label>
      <select
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">

      {/* ── Page header ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/patients/${id}`)}
            className="p-2 rounded-xl text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink">Edit Patient</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              Updating record for <span className="font-semibold text-ink">{original?.name}</span>
            </p>
          </div>
        </div>

        {/* Last updated chip */}
        {original?.updatedAt && (
          <div className="hidden sm:flex items-center gap-2 bg-white border border-surface-border rounded-xl px-4 py-2.5 shadow-card">
            <Clock size={13} className="text-ink-muted" />
            <span className="text-xs text-ink-muted">
              Last updated <span className="font-semibold text-ink">{formatDate(original.updatedAt)}</span>
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT: Personal & Contact ───────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Personal details */}
            <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
                  <User size={14} className="text-brand-500" />
                </div>
                <h2 className="text-sm font-bold text-ink">Personal Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Full Name" name="name" icon={User}
                    placeholder="e.g. Jane Doe" required autoComplete="name"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
                      <input
                        type="number" name="age" value={form.age}
                        onChange={handleChange} placeholder="e.g. 34" min="0" max="150"
                        className={`
                          w-full rounded-xl border text-sm text-ink placeholder-ink-muted
                          pl-9 pr-3 py-2.5 transition-all
                          focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                          ${errors.age ? 'border-red-300 bg-red-50' : 'border-surface-border bg-white hover:border-brand-200'}
                        `}
                      />
                    </div>
                    {errors.age && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={11} />{errors.age}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Gender" name="gender" options={GENDERS} placeholder="Select gender" />
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                      <span className="flex items-center gap-1.5"><Droplets size={13} />Blood Group</span>
                    </label>
                    <select
                      name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                      className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all"
                    >
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Phone size={14} className="text-emerald-600" />
                </div>
                <h2 className="text-sm font-bold text-ink">Contact Details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Phone Number" name="phone" type="tel" icon={Phone}
                    placeholder="+254 700 000 000" required autoComplete="tel"
                  />
                  <InputField
                    label="Email Address" name="email" type="email" icon={Mail}
                    placeholder="patient@email.com" autoComplete="email"
                  />
                </div>
                <InputField label="Physical Address" name="address" icon={MapPin} placeholder="Street, City, Country" />
                <InputField label="Emergency Contact" name="emergencyContact" placeholder="e.g. John Doe — +254 700 111 222" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Medical info + meta ─────────────────── */}
          <div className="space-y-5">

            <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <h2 className="text-sm font-bold text-ink">Medical Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                    <span className="flex items-center gap-1.5"><FileText size={13} />Medical History</span>
                  </label>
                  <textarea
                    name="medicalHistory" value={form.medicalHistory} onChange={handleChange}
                    placeholder="Previous diagnoses, surgeries, chronic conditions..." rows={5}
                    className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle size={13} className="text-amber-500" />
                      Known Allergies
                    </span>
                  </label>
                  <textarea
                    name="allergies" value={form.allergies} onChange={handleChange}
                    placeholder="e.g. Penicillin, Peanuts, Latex..." rows={3}
                    className="w-full rounded-xl border border-surface-border bg-white text-sm text-ink placeholder-ink-muted px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 hover:border-brand-200 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Record meta info */}
            {original && (
              <div className="bg-surface-muted rounded-xl2 border border-surface-border p-4 space-y-2">
                <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">Record Info</p>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Registered</span>
                  <span className="font-semibold text-ink">{formatDate(original.createdAt)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Last Updated</span>
                  <span className="font-semibold text-ink">{formatDate(original.updatedAt)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Patient ID</span>
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
              onClick={() => navigate(`/patients/${id}`)}
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

export default EditPatient