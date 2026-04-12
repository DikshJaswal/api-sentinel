interface Props {
  title: string;
  value: string;
  accent?: "blue" | "green" | "red" | "purple" | "orange" | "pink" | "cyan";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, accent = "blue", trend }: Props) {
  const color = {
    blue: "from-blue-500/20 to-blue-700/20 border-blue-400/50 bg-black/40",
    green: "from-green-500/20 to-emerald-700/20 border-green-400/50 bg-black/40",
    red: "from-red-500/20 to-pink-700/20 border-red-400/50 bg-black/40",
    purple: "from-purple-500/20 to-violet-700/20 border-purple-400/50 bg-black/40",
    orange: "from-orange-500/20 to-amber-700/20 border-orange-400/50 bg-black/40",
    pink: "from-pink-500/20 to-rose-700/20 border-pink-400/50 bg-black/40",
    cyan: "from-cyan-500/20 to-teal-700/20 border-cyan-400/50 bg-black/40",
  }[accent];

  const glowColor = {
    blue: "shadow-blue-500/30 hover:shadow-blue-500/50",
    green: "shadow-green-500/30 hover:shadow-green-500/50",
    red: "shadow-red-500/30 hover:shadow-red-500/50",
    purple: "shadow-purple-500/30 hover:shadow-purple-500/50",
    orange: "shadow-orange-500/30 hover:shadow-orange-500/50",
    pink: "shadow-pink-500/30 hover:shadow-pink-500/50",
    cyan: "shadow-cyan-500/30 hover:shadow-cyan-500/50",
  }[accent];

  const iconColor = {
    blue: "text-blue-300",
    green: "text-green-300",
    red: "text-red-300",
    purple: "text-purple-300",
    orange: "text-orange-300",
    pink: "text-pink-300",
    cyan: "text-cyan-300",
  }[accent];

  return (
    <div className={`relative overflow-hidden rounded-2xl ${color} border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${glowColor} group bg-black/30`}>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated background effect */}
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-2xl" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">{title}</p>
            <p className="text-4xl font-black text-white tracking-tight leading-none">{value}</p>
          </div>
          
          {trend ? (
            <div className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold backdrop-blur-sm ${
              trend.isPositive 
                ? 'bg-green-500/40 text-green-200 border border-green-400/50' 
                : 'bg-red-500/40 text-red-200 border border-red-400/50'
            }`}>
              <span className={trend.isPositive ? iconColor : 'text-red-300'}>
                {trend.isPositive ? '↑' : '↓'}
              </span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          ) : (
            <div className={`h-10 w-10 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center ${iconColor}`}>
              <div className="h-5 w-5 rounded-full bg-current opacity-80" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
