import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-black via-slate-950 to-black text-gray-100 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
