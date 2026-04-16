/**
 * LoadingSpinner — reusable spinner component.
 * Pass fullScreen={true} to center it in the viewport.
 */
const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  // Size map for the spinner ring
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  }

  const spinner = (
    <div
      className={`
        ${sizes[size]}
        rounded-full
        border-brand-100
        border-t-brand-500
        animate-spin
      `}
      role="status"
      aria-label="Loading"
    />
  )

  // Full-screen centered layout
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-ink-muted font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner