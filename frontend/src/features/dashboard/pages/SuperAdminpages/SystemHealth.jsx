import { CheckCircle, Activity } from "lucide-react";

export default function SystemHealth({ systemHealth = {}, stats = {} }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Activity (7 days)</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">New Users</span>
            <span className="text-2xl font-bold text-green-600">+{stats.recentUsers || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600">New Submissions</span>
            <span className="text-2xl font-bold text-blue-600">+{stats.recentSubmissions || 0}</span>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-600" />
          System Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Status</span>
            <span className="font-semibold text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {systemHealth.status === "operational" ? "Operational" : "Checking..."}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Uptime</span>
            <span className="font-semibold text-slate-900">
              {systemHealth.uptime 
                ? `${Math.floor(systemHealth.uptime / 3600)}h ${Math.floor((systemHealth.uptime % 3600) / 60)}m` 
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Last Updated</span>
            <span className="font-semibold text-slate-900">
              {systemHealth.timestamp 
                ? new Date(systemHealth.timestamp).toLocaleTimeString() 
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}