import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { getInitials, formatDate, truncate } from '../../utils/helpers.js'
import Button from '../ui/Button.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import { Users } from 'lucide-react'

const PAGE_SIZE = 8

const PatientTable = ({ patients = [], onEdit, onDelete, loading }) => {
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)
  const navigate               = useNavigate()

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    )
  })

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

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

      {/* Table toolbar — Changed to flex-col on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-surface-border gap-4">
        <p className="text-sm font-semibold text-ink">
          {loading ? 'Loading...' : `${filtered.length} patient${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Search input — Full width on mobile */}
        <div className="relative w-full sm:w-64">
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

      {/* Table — Added overflow container and min-width */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-surface-muted border-b border-surface-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Patient</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Age / Gender</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Blood Group</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Registered</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider sticky right-0 bg-surface-muted shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.1)]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

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

            {!loading && paginated.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-surface-border hover:bg-surface-muted/50 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-brand-600">
                        {getInitials(patient.name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink truncate max-w-[120px] sm:max-w-none">{patient.name}</p>
                      <p className="text-xs text-ink-muted truncate">{patient.email || '—'}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">
                  {patient.age ? `${patient.age} yrs` : '—'}
                  {patient.gender && (
                    <span className="text-ink-muted"> · {patient.gender}</span>
                  )}
                </td>

                <td className="px-4 py-3 text-ink-secondary whitespace-nowrap">{patient.phone || '—'}</td>

                <td className="px-4 py-3">
                  {patient.bloodGroup ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
                      {patient.bloodGroup}
                    </span>
                  ) : '—'}
                </td>

                <td className="px-4 py-3 text-ink-muted text-xs whitespace-nowrap">
                  {formatDate(patient.createdAt)}
                </td>

                {/* Actions column — Removed opacity-0 on mobile so buttons are visible */}
                <td className="px-4 py-3 sticky right-0 bg-white group-hover:bg-surface-muted transition-colors shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="p-1.5 rounded-lg text-ink-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      title="View patient"
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => onEdit(patient)}
                      className="p-1.5 rounded-lg text-ink-muted hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      title="Edit patient"
                    >
                      <Pencil size={15} />
                    </button>

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

      {/* Pagination footer — Flex-col on mobile */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-surface-border gap-4">
          <p className="text-xs text-ink-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex-1 sm:flex-none justify-center"
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex-1 sm:flex-none justify-center"
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