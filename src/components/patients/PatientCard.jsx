import { Phone, Mail, Droplets, Pencil, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getInitials } from '../../utils/helpers.js'

/**
 * 
 *
 * @param {Object}   patient  - Patient data object from Firestore
 * @param {Function} onEdit   - Opens edit modal for this patient
 * @param {Function} onDelete - Triggers delete confirmation for this patient
 */
const PatientCard = ({ patient, onEdit, onDelete }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl2 border border-surface-border shadow-card p-4 hover:border-brand-200 hover:shadow-float transition-all duration-200 group">

      {/* Card header — avatar + name + actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Initials avatar */}
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-brand-600">
              {getInitials(patient.name)}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink leading-tight">{patient.name}</p>
            <p className="text-xs text-ink-muted">
              {patient.age ? `${patient.age} yrs` : '—'}
              {patient.gender ? ` · ${patient.gender}` : ''}
            </p>
          </div>
        </div>

        {/* Blood group badge */}
        {patient.bloodGroup && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-red-50 text-red-600 border border-red-100 flex-shrink-0">
            <Droplets size={10} className="inline mr-0.5" />
            {patient.bloodGroup}
          </span>
        )}
      </div>

      {/* Contact details */}
      <div className="space-y-1.5 mb-4">
        {patient.phone && (
          <div className="flex items-center gap-2 text-xs text-ink-secondary">
            <Phone size={12} className="text-ink-muted flex-shrink-0" />
            <span className="truncate">{patient.phone}</span>
          </div>
        )}
        {patient.email && (
          <div className="flex items-center gap-2 text-xs text-ink-secondary">
            <Mail size={12} className="text-ink-muted flex-shrink-0" />
            <span className="truncate">{patient.email}</span>
          </div>
        )}
      </div>

      {/* Medical history snippet */}
      {patient.medicalHistory && (
        <p className="text-xs text-ink-muted bg-surface-muted rounded-lg px-2.5 py-2 mb-4 line-clamp-2">
          {patient.medicalHistory}
        </p>
      )}

      {/* Action buttons — visible on hover */}
      <div className="flex items-center gap-1.5 pt-3 border-t border-surface-border">
        <button
          onClick={() => navigate(`/patients/${patient.id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-ink-secondary hover:bg-brand-50 hover:text-brand-600 transition-colors"
        >
          <Eye size={13} />
          View
        </button>
        <button
          onClick={() => onEdit(patient)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-ink-secondary hover:bg-amber-50 hover:text-amber-600 transition-colors"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(patient.id, patient.name)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-ink-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default PatientCard