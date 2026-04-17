import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import usePatients from '../hooks/usePatients'
import useAppointments from '../hooks/useAppointments'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { formatDate, getInitials, formatRelativeDate } from '../utils/helpers'

const STATUS_COLORS = {
  scheduled:   '#16a34a',
  completed:   '#2563eb',
  cancelled:   '#dc2626',
  rescheduled: '#d97706',
}

const Dashboard = () => {
  const { patients,     loading: pLoading }  = usePatients()
  const { appointments, loading: aLoading }  = useAppointments()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const scheduled   = appointments.filter((a) => a.status === 'scheduled')
    const completed   = appointments.filter((a) => a.status === 'completed')
    const cancelled   = appointments.filter((a) => a.status === 'cancelled')
    const rescheduled = appointments.filter((a) => a.status === 'rescheduled')

    const upcoming = scheduled.filter((a) => {
      if (!a.date) return false
      const d = a.date?.toDate ? a.date.toDate() : new Date(a.date)
      return d >= today
    })

    return {
      totalPatients:     patients.length,
      totalAppointments: appointments.length,
      scheduled:         scheduled.length,
      completed:         completed.length,
      cancelled:         cancelled.length,
      rescheduled:       rescheduled.length,
      upcoming:          upcoming.length,
    }
  }, [patients, appointments])

  const chartData = useMemo(() => {
    return [
      { name: 'Scheduled',   value: stats.scheduled,   color: STATUS_COLORS.scheduled },
      { name: 'Completed',   value: stats.completed,   color: STATUS_COLORS.completed },
      { name: 'Cancelled',   value: stats.cancelled,   color: STATUS_COLORS.cancelled },
      { name: 'Rescheduled', value: stats.rescheduled, color: STATUS_COLORS.rescheduled },
    ].filter((d) => d.value > 0)
  }, [stats])

  const recentPatients     = patients.slice(0, 5)
  const recentAppointments = appointments.slice(0, 6)
  const isLoading          = pLoading || aLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-10"> {/* Added padding bottom for mobile clearance */}

      {/* Stat Cards — Fixed from grid-cols-2 to stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          iconColor="text-brand-500"
          iconBg="bg-brand-50"
          subtitle="All registered patients"
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={CalendarDays}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          subtitle="Active appointments"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CalendarCheck}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          subtitle="Finished appointments"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={CalendarX}
          iconColor="text-red-500"
          iconBg="bg-red-50"
          subtitle="Cancelled appointments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
          <h3 className="text-sm font-bold text-ink mb-4">Appointment Status</h3>

          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-ink-muted">No appointment data yet</p>
            </div>
          ) : (
            <div className="w-full overflow-hidden"> {/* Container to prevent chart overflow */}
                <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    >
                    {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip
                    contentStyle={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '12px',
                        borderRadius: '10px',
                        border: '1px solid #e8ecf4',
                    }}
                    />
                    <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'Sora, sans-serif' }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </div>
          )}

          <div className="text-center mt-1">
            <p className="text-2xl font-bold text-ink">{stats.totalAppointments}</p>
            <p className="text-xs text-ink-muted">total appointments</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-brand-500" />
              <h3 className="text-sm font-bold text-ink">Recent Patients</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
              View all <ArrowRight size={13} />
            </Button>
          </div>

          <div className="divide-y divide-surface-border overflow-x-auto"> {/* Added overflow scroll for small screens */}
            {recentPatients.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-ink-muted">No patients registered yet</p>
              </div>
            ) : (
              recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-surface-muted/50 transition-colors cursor-pointer min-w-[300px]"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-brand-600">
                      {getInitials(patient.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{patient.name}</p>
                    <p className="text-xs text-ink-muted">
                      {patient.age ? `${patient.age} yrs` : ''}
                      {patient.gender ? ` · ${patient.gender}` : ''}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {patient.bloodGroup && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-red-50 text-red-600 border border-red-100">
                        {patient.bloodGroup}
                      </span>
                    )}
                    <p className="text-xs text-ink-muted mt-0.5">
                      {formatDate(patient.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-brand-500" />
            <h3 className="text-sm font-bold text-ink">Recent Appointments</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>
            View all <ArrowRight size={13} />
          </Button>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-ink-muted">No appointments scheduled yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-surface-border">
            {recentAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-surface-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate('/appointments')}
              >
                <div className="w-8 h-8 rounded-xl bg-surface-muted flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-ink-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">
                    {appt.patientName || 'Patient'}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {formatRelativeDate(appt.date)}
                    {appt.time ? ` · ${appt.time}` : ''}
                  </p>
                </div>
                <Badge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System status banner — Fixed for mobile layout stack */}
      <div className="bg-ink rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} className="text-brand-300" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm">System is running smoothly</p>
            <p className="text-white/40 text-xs truncate">
              {stats.upcoming} upcoming · {stats.totalPatients} registered
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => navigate('/patients')}>
            Patients
          </Button>
          <Button variant="primary" size="sm" className="flex-1 sm:flex-none" onClick={() => navigate('/appointments')}>
            Appointments
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard