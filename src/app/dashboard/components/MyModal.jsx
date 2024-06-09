// app/dashboard/components/MyModal.jsx

export default function MyModal({ id, title, children, isOpen, onClose }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
        <div className="relative bg-white rounded-lg p-8 shadow-lg w-1/2">
          <button 
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 p-5"
            onClick={onClose}
          >
            X
          </button>
          <h2 className="text-2xl mb-4">{title}</h2>
          {children}
        </div>
      </div>
    );
  }
  