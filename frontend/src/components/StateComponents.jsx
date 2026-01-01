
export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-red-100 border border-red-300 rounded-lg p-6 text-center">
      <p className="text-red-700 font-semibold mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyDataState({ title, description, action }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-600 mb-4">{description}</p>}
      {action && action}
    </div>
  );
}
