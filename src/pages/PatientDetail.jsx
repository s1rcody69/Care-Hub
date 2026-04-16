import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Droplets,
  Calendar,
  FileText,
  AlertCircle,
  Pencil,
  CalendarPlus,
  Users,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { getPatientById } from '../services/patientService.js'
import { getAppointmentsByPatient } from '../services/appointmentService.js'
import usePatients from '../hooks/usePatients.js'
import useAppointments from '../hooks/useAppointments.js'
import PatientForm from '../components/patients/PatientForm.jsx'
import AppointmentForm from '../components/appointments/AppointmentForm.jsx'
import Modal from '../components/ui/Modal.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import { formatDate, getInitials, timeAgo } from '../utils/helpers.js'


const PatientDetail = () => {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const { editPatient }       = usePatients()
  const {  addAppointment } = useAppointments()

  const [patient, setPatient]                 = useState(null)
  const [appointments, setAppointments]       = useState([])
  const [loading, setLoading]                 = useState(true)
  const [modalMode, setModalMode]             = useState(null) // 'edit' | 'addAppt' | null
  const [saving, setSaving]                   = useState(false)

  // Fetch patient and their appointments in parallel
   useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [patientData, apptData] = await Promise.all([
          getPatientById(id),
          getAppointmentsByPatient(id),
        ])
        if (!patientData) {
          toast.error('Patient not found')
          navigate('/patients')
          return
        }
        setPatient(patientData)
        setAppointments(apptData)
      } catch {
        toast.error('Failed to load patient')
        navigate('/patients')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])
  
 

  // Handle saving edits from the PatientForm modal
  const handleEdit = async (formData) => {
    setSaving(true)
    try {
      await editPatient(id, formData)
      // Refresh local patient state
      const updated = await getPatientById(id)
      setPatient(updated)
      toast.success('Patient updated')
      setModalMode(null)
    } catch {
      toast.error('Failed to update patient')
    } finally {
      setSaving(false)
    }
  }

  // Handle scheduling a new appointment for this patient
  const handleAddAppointment = async (formData) => {
    setSaving(true)
    try {
      await addAppointment({ ...formData, patientId: id, patientName: patient.name })
      // Refresh appointments list
      const updated = await getAppointmentsByPatient(id)
      setAppointments(updated)
      toast.success('Appointment scheduled')
      setModalMode(null)
    } catch {
      toast.error('Failed to schedule appointment')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!patient) return null

  // Small reusable info row
  const InfoRow = ({ icon: Icon, label, value }) =>
    value ? (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={14} className="text-ink-muted" />
        </div>
        <div>
          <p className="text-xs text-ink-muted mb-0.5">{label}</p>
          <p className="text-sm font-medium text-ink">{value}</p>
        </div>
      </div>
    ) : null

  return (
    <div className="space-y-5 animate-fade-in-up">

      {/* Back button + page header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Patients
        </button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={CalendarPlus} size="sm" onClick={() => setModalMode('addAppt')}>
            Schedule Appointment
          </Button>
          <Button variant="primary" icon={Pencil} size="sm" onClick={() => setModalMode('edit')}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column — patient profile card */}
        <div className="lg:col-span-1 space-y-4">

          {/* Profile header */}
          <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-6 text-center">
            {/* Large initials avatar */}
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-brand-600">
                {getInitials(patient.name)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-ink">{patient.name}</h2>
            <p className="text-sm text-ink-muted mt-0.5">
              {patient.age ? `${patient.age} years old` : ''}
              {patient.gender ? ` · ${patient.gender}` : ''}
            </p>
            {patient.bloodGroup && (
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                <Droplets size={11} />
                {patient.bloodGroup}
              </span>
            )}
            <p className="text-xs text-ink-muted mt-3">
              Registered {timeAgo(patient.createdAt)}
            </p>
          </div>

          {/* Contact & details */}
          <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-ink-muted uppercase tracking-widest">
              Contact Information
            </h3>
            <InfoRow icon={Phone}   label="Phone"            value={patient.phone} />
            <InfoRow icon={Mail}    label="Email"            value={patient.email} />
            <InfoRow icon={MapPin}  label="Address"          value={patient.address} />
            <InfoRow icon={Users}   label="Emergency Contact" value={patient.emergencyContact} />
          </div>
        </div>

        {/* Right column — medical info + appointments */}
        <div className="lg:col-span-2 space-y-4">

          {/* Medical history */}
          <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-5">
            <h3 className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-4">
              Medical Information
            </h3>
            <div className="space-y-4">
              {patient.medicalHistory ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} className="text-brand-500" />
                    <p className="text-xs font-semibold text-ink-secondary">Medical History</p>
                  </div>
                  <p className="text-sm text-ink bg-surface-muted rounded-xl p-3 leading-relaxed">
                    {patient.medicalHistory}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-ink-muted">No medical history on record.</p>
              )}

              {patient.allergies && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={14} className="text-amber-500" />
                    <p className="text-xs font-semibold text-ink-secondary">Known Allergies</p>
                  </div>
                  <p className="text-sm text-ink bg-amber-50 border border-amber-100 rounded-xl p-3">
                    {patient.allergies}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Appointment history */}
          <div className="bg-white rounded-xl2 border border-surface-border shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-brand-500" />
                <h3 className="text-sm font-bold text-ink">Appointment History</h3>
              </div>
              <span className="text-xs text-ink-muted">
                {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
              </span>
            </div>

            {appointments.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-ink-muted">No appointments scheduled yet.</p>
                <button
                  onClick={() => setModalMode('addAppt')}
                  className="text-xs text-brand-500 font-semibold mt-2 hover:underline"
                >
                  Schedule the first one
                </button>
              </div>
            ) : (
              <div className="divide-y divide-surface-border">
                {appointments.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-surface-muted flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} className="text-ink-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">
                        {appt.type || 'General Appointment'}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {formatDate(appt.date)}
                        {appt.time ? ` at ${appt.time}` : ''}
                      </p>
                    </div>
                    <Badge status={appt.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={modalMode === 'edit'}
        onClose={() => setModalMode(null)}
        title="Edit Patient"
        size="xl"
      >
        <PatientForm
          initialData={patient}
          onSubmit={handleEdit}
          onCancel={() => setModalMode(null)}
          loading={saving}
        />
      </Modal>

      {/* Schedule Appointment Modal */}
      <Modal
        isOpen={modalMode === 'addAppt'}
        onClose={() => setModalMode(null)}
        title={`Schedule Appointment — ${patient.name}`}
        size="lg"
      >
        <AppointmentForm
          patients={[patient]}
          initialData={{ patientId: patient.id, patientName: patient.name }}
          onSubmit={handleAddAppointment}
          onCancel={() => setModalMode(null)}
          loading={saving}
        />
      </Modal>
    </div>
  )
}

export default PatientDetail