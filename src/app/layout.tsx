import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className="h-full bg-white overflow-x-clip">
      <body className="min-h-dvh bg-white text-[#151515] overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
