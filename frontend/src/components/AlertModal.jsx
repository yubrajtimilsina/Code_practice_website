import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function AlertModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "info", // success, error, warning, info
  confirmText = "OK",
  cancelText = null,
  onConfirm = null,
  onCancel = null
}) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      default:
        return <Info className="w-12 h-12 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          button: "bg-green-600 hover:bg-green-700"
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          button: "bg-red-600 hover:bg-red-700"
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          button: "bg-yellow-600 hover:bg-yellow-700"
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          button: "bg-blue-600 hover:bg-blue-700"
        };
    }
  };

  const colors = getColors();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto animate-slideIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`${colors.bg} ${colors.border} border-b rounded-t-2xl p-6`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {title || (type === "success" ? "Success" : type === "error" ? "Error" : type === "warning" ? "Warning" : "Information")}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3 justify-end">
            {cancelText && (
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`px-6 py-2 text-white rounded-lg font-medium transition-colors ${colors.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}