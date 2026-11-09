import { Inter } from "next/font/google";
import "./main.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "API Sentinel — Synthetic API Health Monitoring & Incident Telemetry",
  description: "Enterprise-grade synthetic uptime monitoring and multi-channel incident alerting with Twilio and SendGrid.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.className}`}>
      <body className="bg-black text-white overflow-x-hidden antialiased">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
        <div className="fixed inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3Ccircle cx='20' cy='20' r='0.5'/%3E%3Ccircle cx='80' cy='80' r='0.5'/%3E%3Ccircle cx='20' cy='80' r='0.5'/%3E%3Ccircle cx='80' cy='20' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
