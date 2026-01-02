import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-slate-600 mt-4">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry, className = "" }) {
  return (
    <div className={`bg-red-100 border border-red-300 rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-700 font-semibold">{message || "An error occurred"}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-12 text-center ${className}`}>
      {Icon && <Icon className="w-16 h-16 text-slate-300 mx-auto mb-4" />}
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-600 mb-6">{description}</p>}
      {action}
    </div>
  );
}
