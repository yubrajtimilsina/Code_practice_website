import React from 'react';

export default function LoadingSpinner({ size = "md", message, className = "" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`} />
      {message && <p className="text-slate-600 text-sm">{message}</p>}
    </div>
  );
}