import { useState } from 'react'
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import { CalendarDays } from 'lucide-react'
import { formatDate, truncate } from '../../utils/helpers.js'
import { APPOINTMENT_STATUSES } from '../../utils/constants.js'

const PAGE_SIZE = 8

/**
 * 
 *
 * @param {Array}    appointments - Appointment data array
 * @param {Function} onEdit       - Opens edit modal with the appointment
 * @param {Function} onDelete     - Deletes an appointment by ID
 * @param {boolean}  loading      - Shows skeleton rows while loading
 */
const AppointmentTable = ({ appointments = [], onEdit, onDelete, loading }) => {
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage]             = useState(1)

  // Filter by search term and status dropdown
  const filtered = appointments.filter((a) => {
    const q        = search.toLowerCase()
    const matchQ   = a.patientName?.toLowerCase().includes(q) || a.type?.toLowerCase().includes(q)
    const matchS   = statusFilter === 'all' || a.status === statusFilter
    return matchQ && matchS
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1) }
  const handleFilter = (e) => { setStatusFilter(e.target.value); setPage(1) }

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

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-surface-border">
        <p className="text-sm font-semibold text-ink flex-1">
          {loading ? 'Loading...' : `${filtered.length} appointment${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-ink-muted" />
          <select
            value={statusFilter}
            onChange={handleFilter}
            className="text-sm border border-surface-border rounded-xl px-3 py-2 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-brand-200 hover:border-brand-200 transition-all"
          >
            <option value="all">All Statuses</option>
            {APPOINTMENT_STATUSES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search appointments..."
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Time</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={CalendarDays}
                    title={search || statusFilter !== 'all' ? 'No results found' : 'No appointments yet'}
                    description={
                      search || statusFilter !== 'all'
                        ? 'Try adjusting your search or filter'
                        : 'Schedule the first appointment to get started.'
                    }
                  />
                </td>
              </tr>
            )}

            {!loading && paginated.map((appt) => (
              <tr
                key={appt.id}
                className="border-b border-surface-border hover:bg-surface-muted/50 transition-colors group"
              >
                {/* Patient name */}
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{appt.patientName || '—'}</p>
                  {appt.notes && (
                    <p className="text-xs text-ink-muted mt-0.5">{truncate(appt.notes, 40)}</p>
                  )}
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-ink-secondary">
                  {formatDate(appt.date)}
                </td>

                {/* Time */}
                <td className="px-4 py-3 text-ink-secondary">
                  {appt.time || '—'}
                </td>

                {/* Appointment type */}
                <td className="px-4 py-3 text-ink-secondary">
                  {appt.type || '—'}
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <Badge status={appt.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(appt)}
                      className="p-1.5 rounded-lg text-ink-muted hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      title="Edit appointment"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(appt.id)}
                      className="p-1.5 rounded-lg text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete appointment"
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border">
          <p className="text-xs text-ink-muted">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={ChevronLeft}
              onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="secondary" size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentTable