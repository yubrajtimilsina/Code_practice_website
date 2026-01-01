import { CheckCircle, XCircle, Clock, AlertTriangle, AlertCircle } from "lucide-react";

export function DifficultyBadge({ difficulty }) {
  const colors = {
    Easy: "bg-green-100 text-green-700 border-green-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Hard: "bg-red-100 text-red-700 border-red-300"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[difficulty] || colors.Easy}`}>
      {difficulty}
    </span>
  );
}

export function VerdictBadge({ verdict }) {
  const getColor = (v) => {
    if (v === "Accepted") return "bg-green-100 text-green-700";
    if (v === "Pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColor(verdict)}`}>
      {verdict}
    </span>
  );
}

export function VerdictIcon({ verdict, size = "w-5 h-5" }) {
  if (verdict === "Accepted") return <CheckCircle className={`${size} text-green-600`} />;
  if (verdict === "Pending") return <Clock className={`${size} text-yellow-600`} />;
  if (verdict === "Compilation Error" || verdict === "Runtime Error")
    return <AlertTriangle className={`${size} text-red-600`} />;
  return <XCircle className={`${size} text-red-600`} />;
}

export function RoleBadge({ role }) {
  const colors = {
    "super-admin": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "admin": "bg-red-100 text-red-700 border-red-300",
    "learner": "bg-blue-100 text-blue-700 border-blue-300"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[role] || colors.learner}`}>
      {role}
    </span>
  );
}


export function ErrorAlert({ message, onRetry, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <p className="text-red-700">{message}</p>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded text-sm font-medium transition-colors"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded text-sm font-medium transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

export function SuccessAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-green-100 border border-green-300 rounded-lg p-4 flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <p className="text-green-700">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="px-4 py-2 bg-green-200 hover:bg-green-300 text-green-700 rounded text-sm font-medium"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}


export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
      {Icon && <Icon className="w-16 h-16 text-slate-300 mx-auto mb-4" />}
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-600 mb-6">{description}</p>}
      {action && action}
    </div>
  );
}


export function StatCard({ 
  // eslint-disable-next-line no-unused-vars
  icon: Icon, 
  label, 
  value, 
  subtitle, 
  color = "blue",
  onClick 
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div 
      className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-slate-600 text-sm mb-1">{label}</p>
      <p className="text-4xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );
}


export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
  icon: Icon
}) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-200 text-slate-700 hover:bg-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    outline: "border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
}


export function Tag({ children, color = "slate", onRemove }) {
  const colors = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${colors[color]}`}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70">
          ×
        </button>
      )}
    </span>
  );
}