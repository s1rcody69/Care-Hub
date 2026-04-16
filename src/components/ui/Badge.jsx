import { STATUS_STYLES } from '../../utils/constants.js'
import { capitalize } from '../../utils/helpers.js'

/**
 * Badge — displays a colored status pill.
 * Automatically picks the correct color based on the status value.
 *
 * @param {string} status - One of: scheduled, completed, cancelled, rescheduled
 * @param {string} className - Additional Tailwind classes
 */
const Badge = ({ status, className = '' }) => {
  // Look up the Tailwind classes for this status; fall back to a neutral style
  const styles = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border border-gray-200'

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-semibold
        tracking-wide
        ${styles}
        ${className}
      `}
    >
      {/* Small dot indicator */}
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {capitalize(status)}
    </span>
  )
}

export default Badge