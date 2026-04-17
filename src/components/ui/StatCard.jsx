/**
 * StatCard — displays a single metric on the dashboard.
 *
 * @param {string} title - Card label (e.g. "Total Patients")
 * @param {string|number} value - The metric value
 * @param {React.ElementType} icon - Lucide icon component
 * @param {string} iconColor - Tailwind text color class for the icon
 * @param {string} iconBg - Tailwind bg color class for the icon wrapper
 * @param {string} subtitle - Optional small text below the value
 */
const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, subtitle }) => {
  return (
    <div className="bg-white rounded-xl border border-surface-border shadow-card p-5 flex items-start gap-4 animate-fade-in-up">
      {/* Icon container */}
      <div className={`rounded-xl p-3 ${iconBg} flex-shrink-0`}>
        <Icon size={22} className={iconColor} />
      </div>

      {/* Text content */}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-0.5">
          {title}
        </p>
        <p className="text-2xl font-bold text-ink leading-none">{value ?? '—'}</p>
        {subtitle && (
          <p className="text-xs text-ink-muted mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export default StatCard