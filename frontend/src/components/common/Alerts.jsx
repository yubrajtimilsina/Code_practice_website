import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ErrorAlert({ message, onDismiss, className = "" }) {
  if (!message) return null;
  
  return (
    <div className={`bg-red-100 border border-red-300 rounded-lg p-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <p className="text-red-700">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-700 hover:text-red-900 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function SuccessAlert({ message, onDismiss, className = "" }) {
  if (!message) return null;
  
  return (
    <div className={`bg-green-100 border border-green-300 rounded-lg p-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <p className="text-green-700">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-green-700 hover:text-green-900 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function InfoAlert({ message, onDismiss, className = "" }) {
  if (!message) return null;
  
  return (
    <div className={`bg-blue-100 border border-blue-300 rounded-lg p-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <p className="text-blue-700">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-blue-700 hover:text-blue-900 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function WarningAlert({ message, onDismiss, className = "" }) {
  if (!message) return null;
  
  return (
    <div className={`bg-yellow-100 border border-yellow-300 rounded-lg p-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <p className="text-yellow-700">{message}</p>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-yellow-700 hover:text-yellow-900 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}