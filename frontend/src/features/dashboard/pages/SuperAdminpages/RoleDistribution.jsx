export default function RoleDistribution({ roleDistribution = {} }) {
  const roles = Object.entries(roleDistribution).map(([role, data]) => ({
    role,
    total: data.total || 0,
    active: data.active || 0
  }));

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Role Distribution</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map(({ role, total, active }) => (
          <div key={role} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-slate-600 text-sm capitalize mb-2">{role}</p>
            <p className="text-2xl font-bold text-slate-900">{total}</p>
            <p className="text-xs text-green-600 mt-1">{active} active</p>
          </div>
        ))}
      </div>
    </div>
  );
}