import { Clock, CalendarDays, FileText, Pencil, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import { formatDate } from '../../utils/helpers.js'


/*
 @param {Object}   appointment - Appointment data object from Firestore
  @param {Function} onEdit      - Opens edit modal for this appointment
  @param {Function} onDelete    - Triggers delete */
 
const AppointmentCard = ({ appointment, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-4 hover:border-brand-200 transition-all duration-200">

      {/* Header — patient name + status badge */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-ink leading-tight">
            {appointment.patientName || 'Unknown Patient'}
          </p>
          {appointment.type && (
            <p className="text-xs text-ink-muted mt-0.5">{appointment.type}</p>
          )}
        </div>
        <Badge status={appointment.status} />
      </div>

      {/* Date and time row */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
          <CalendarDays size={12} className="text-ink-muted" />
          {formatDate(appointment.date)}
        </div>
        {appointment.time && (
          <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <Clock size={12} className="text-ink-muted" />
            {appointment.time}
          </div>
        )}
      </div>

      {/* Optional notes */}
      {appointment.notes && (
        <div className="flex items-start gap-1.5 mb-3">
          <FileText size={12} className="text-ink-muted flex-shrink-0 mt-0.5" />
          <p className="text-xs text-ink-muted line-clamp-2">{appointment.notes}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-surface-border">
        <button
          onClick={() => onEdit(appointment)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-ink-secondary hover:bg-amber-50 hover:text-amber-600 transition-colors"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(appointment.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-ink-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default AppointmentCard