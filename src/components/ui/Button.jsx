import LoadingSpinner from './LoadingSpinner.jsx'

/**
 * Button — reusable button component with multiple visual variants.
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading - Shows spinner and disables the button
 * @param {React.ReactNode} icon - Optional Lucide icon (rendered left of label)
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles shared across all variants
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  // Variant-specific styles
  const variants = {
    primary:
      'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus:ring-brand-300 shadow-sm',
    secondary:
      'bg-surface-muted text-ink border border-surface-border hover:bg-surface-border focus:ring-brand-200',
    danger:
      'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300 shadow-sm',
    ghost:
      'bg-transparent text-ink-secondary hover:bg-surface-muted focus:ring-brand-200',
    outline:
      'bg-white text-brand-500 border border-brand-300 hover:bg-brand-50 focus:ring-brand-200',
  }

  // Size-specific padding and font sizes
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Show spinner when loading, otherwise show optional icon */}
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      )}
      {children}
    </button>
  )
}

export default Button