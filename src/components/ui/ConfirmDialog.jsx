import { AlertTriangle } from 'lucide-react'
import Button from './Button'

/**
 * ConfirmDialog — a focused modal for confirming destructive actions.
 * Replaces the native window.confirm() with a polished UI.
 *
 * @param {boolean}  isOpen      - Controls visibility
 * @param {Function} onClose     - Called when user cancels
 * @param {Function} onConfirm   - Called when user confirms
 * @param {string}   title       - Dialog heading
 * @param {string}   description - Supporting description text
 * @param {string}   confirmLabel - Label for the confirm button (default: "Delete")
 * @param {boolean}  loading     - Shows spinner on confirm button while processing
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title       = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 22, 35, 0.5)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl3 shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + text */}
        <div className="px-6 pt-6 pb-4 text-center">
          {/* Warning icon */}
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} className="text-red-500" />
          </div>

          <h2 className="text-base font-bold text-ink mb-1.5">{title}</h2>
          <p className="text-sm text-ink-muted">{description}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog