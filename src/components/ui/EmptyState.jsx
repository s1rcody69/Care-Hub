import Button from './Button.jsx'

/**
 * EmptyState — displayed when a data list is empty.
 *
 * @param {React.ElementType} icon - Lucide icon to display
 * @param {string} title - Main heading
 * @param {string} description - Supporting text
 * @param {string} actionLabel - CTA button label (optional)
 * @param {Function} onAction - CTA button handler (optional)
 * @param {React.ElementType} actionIcon - Icon for the CTA button
 */
const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction, actionIcon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon container with subtle background */}
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
          <Icon size={28} className="text-brand-400" />
        </div>
      )}

      <h3 className="text-base font-bold text-ink mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-ink-muted max-w-xs mb-6">{description}</p>
      )}

      {/* Optional action button */}
      {actionLabel && onAction && (
        <Button variant="primary" icon={actionIcon} onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState