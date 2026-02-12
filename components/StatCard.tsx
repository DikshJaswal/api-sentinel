interface Props {
  title: string;
  value: string;
  accent?: "blue" | "green" | "red";
}

export default function StatCard({ title, value, accent = "blue" }: Props) {
  const color = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
  }[accent];

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 p-6 border border-white/10 shadow-lg">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${color}`} />
      <p className="text-sm text-gray-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
