const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      {/* Modal box */}
      <div className={`
        bg-white rounded-xl w-full
        ${size === 'xl' ? 'max-w-4xl' : 'max-w-2xl'}
        max-h-[90vh] flex flex-col
      `}>

        {/* HEADER (fixed) */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY (scrollable) */}
        <div className="overflow-y-auto p-4">
          {children}
        </div>

      </div>
    </div>
  )
}

export default Modal;