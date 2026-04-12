import "./main.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white overflow-x-hidden antialiased">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3Ccircle cx='20' cy='20' r='0.5'/%3E%3Ccircle cx='80' cy='80' r='0.5'/%3E%3Ccircle cx='20' cy='80' r='0.5'/%3E%3Ccircle cx='80' cy='20' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        {children}
      </body>
    </html>
  );
}
