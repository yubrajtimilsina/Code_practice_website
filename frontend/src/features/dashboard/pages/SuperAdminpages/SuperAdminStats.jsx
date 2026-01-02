import { 
  Users, 
  Code2, 
  UserCheck, 
  Shield, 
  Zap, 
  TrendingUp 
} from "lucide-react";

export default function SuperAdminStats({ stats = {} }) {
  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers || 0,
      subtitle: "All registered users",
      color: "blue",
      bgClass: "bg-blue-600"
    },
    {
      icon: UserCheck,
      label: "Active Users",
      value: stats.activeUsers || 0,
      subtitle: "Currently active",
      color: "green",
      bgClass: "bg-green-500"
    },
    {
      icon: Code2,
      label: "Total Problems",
      value: stats.totalProblems || 0,
      subtitle: "Listed problems",
      color: "purple",
      bgClass: "bg-purple-500"
    },
    {
      icon: Shield,
      label: "Total Admins",
      value: stats.totalAdmins || 0,
      subtitle: "Admin accounts",
      color: "yellow",
      bgClass: "bg-yellow-500"
    },
    {
      icon: Zap,
      label: "System Health",
      value: stats.systemHealth?.status === "operational" ? "100%" : "—",
      subtitle: "All systems running",
      color: "green",
      bgClass: "bg-green-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="group bg-white border border-slate-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition-all duration-300 hover:border-blue-500"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${stat.bgClass} rounded-lg group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stat.value}</p>
          <p className="text-xs text-slate-500 mt-2">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
}