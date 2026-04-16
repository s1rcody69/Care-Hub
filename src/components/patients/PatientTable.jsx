import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { getInitials, formatDate, truncate } from '../../utils/helpers.js'
import Button from '../ui/Button.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import { Users } from 'lucide-react'

// Number of rows shown per page
const PAGE_SIZE = 8

/**
 * 
 *
 * @param {Array}    patients   - Array of patient objects from Firestore
 * @param {Function} onEdit     - Called with patient object to open edit modal
 * @param {Function} onDelete   - Called with patient ID to trigger delete
 * @param {boolean}  loading    - Shows skeleton rows while loading
 */
const PatientTable = ({ patients = [], onEdit, onDelete, loading }) => {
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const navigate               = useNavigate()

  // Filter patients by name, email, or phone
  const filtered = patients.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    )
  })

  // Pagination calculations
  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset to first page when search changes
  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  // Skeleton rows displayed while data is loading
  const SkeletonRow = () => (
    <tr className="border-b border-surface-border">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-surface-muted rounded-lg animate-pulse" />
        </td>
      ))}
    </tr>
  )

  return (
    <div className="bg-white rounded-xl2 border border-surface-border shadow-card overflow-hidden">

      {/* Table toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
        <p className="text-sm font-semibold text-ink">
          {loading ? 'Loading...' : `${filtered.length} patient${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Search input */}
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search patients..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-surface-border bg-surface-muted text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-muted border-b border-surface-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Age / Gender</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Blood Group</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Registered</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading skeletons */}
            {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={Users}
                    title={search ? 'No results found' : 'No patients yet'}
                    description={
                      search
                        ? `No patients match "${search}"`
                        : 'Add your first patient to get started.'
                    }
                  />
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && paginated.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-surface-border hover:bg-surface-muted/50 transition-colors group"
              >
                {/* Patient name + avatar */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Initials avatar */}
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-brand-600">
                        {getInitials(patient.name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{patient.name}</p>
                      <p className="text-xs text-ink-muted">{patient.email || '—'}</p>
                    </div>
                  </div>
                </td>

                {/* Age / Gender */}
                <td className="px-4 py-3 text-ink-secondary">
                  {patient.age ? `${patient.age} yrs` : '—'}
                  {patient.gender && (
                    <span className="text-ink-muted"> · {patient.gender}</span>
                  )}
                </td>

                {/* Phone */}
                <td className="px-4 py-3 text-ink-secondary">{patient.phone || '—'}</td>

                {/* Blood group badge */}
                <td className="px-4 py-3">
                  {patient.bloodGroup ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
                      {patient.bloodGroup}
                    </span>
                  ) : '—'}
                </td>

                {/* Registration date */}
                <td className="px-4 py-3 text-ink-muted text-xs">
                  {formatDate(patient.createdAt)}
                </td>

                {/* Action buttons */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* View details */}
                    <button
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="p-1.5 rounded-lg text-ink-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      title="View patient"
                    >
                      <Eye size={15} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(patient)}
                      className="p-1.5 rounded-lg text-ink-muted hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      title="Edit patient"
                    >
                      <Pencil size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(patient.id)}
                      className="p-1.5 rounded-lg text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete patient"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border">
          <p className="text-xs text-ink-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientTable