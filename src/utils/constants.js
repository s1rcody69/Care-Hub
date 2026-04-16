// ── Appointment status options ──────────────────────────────
export const APPOINTMENT_STATUSES = [
  { value: 'scheduled',   label: 'Scheduled' },
  { value: 'completed',   label: 'Completed' },
  { value: 'cancelled',   label: 'Cancelled' },
  { value: 'rescheduled', label: 'Rescheduled' },
]

// ── Tailwind classes for each appointment status badge ──────
export const STATUS_STYLES = {
  scheduled:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  completed:   'bg-blue-50   text-blue-700   border border-blue-200',
  cancelled:   'bg-red-50    text-red-700    border border-red-200',
  rescheduled: 'bg-amber-50  text-amber-700  border border-amber-200',
}

// ── Blood group options for patient form ───────────────────
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// ── Gender options ─────────────────────────────────────────
export const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']

// ── Navigation routes used by Sidebar ─────────────────────
export const NAV_ROUTES = [
  { path: '/dashboard',    label: 'Dashboard' },
  { path: '/patients',     label: 'Patients' },
  { path: '/appointments', label: 'Appointments' },
]