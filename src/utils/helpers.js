import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns'

/**
 * Format a Firestore Timestamp or JS Date to a readable date string.
 * @param {any} value - Firestore Timestamp, JS Date, or ISO string
 * @param {string} formatStr - date-fns format string
 * @returns {string}
 */
export const formatDate = (value, formatStr = 'MMM d, yyyy') => {
  if (!value) return '—'
  // Handle Firestore Timestamp objects
  const date = value?.toDate ? value.toDate() : new Date(value)
  return format(date, formatStr)
}

/**
 * Format a date with a relative label (Today, Tomorrow, or full date).
 * @param {any} value - Date value
 * @returns {string}
 */
export const formatRelativeDate = (value) => {
  if (!value) return '—'
  const date = value?.toDate ? value.toDate() : new Date(value)
  if (isToday(date))    return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMM d, yyyy')
}

/**
 * Return a human-readable "time ago" string (e.g., "3 days ago").
 * @param {any} value - Date value
 * @returns {string}
 */
export const timeAgo = (value) => {
  if (!value) return '—'
  const date = value?.toDate ? value.toDate() : new Date(value)
  return formatDistanceToNow(date, { addSuffix: true })
}

/**
 * Truncate a string to a max length, appending ellipsis if needed.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export const truncate = (str, max = 60) => {
  if (!str) return '—'
  return str.length > max ? str.slice(0, max) + '…' : str
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generate initials from a full name (up to 2 letters).
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}