import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className="h-full bg-white overflow-x-clip">
      <head>
        <title>Svoy Lounge</title>
        <meta name="description" content="Svoy Lounge - ресторан и караоке в Астана. Лучшее место для отдыха с друзьями и семьей. Наслаждайтесь изысканной кухней и живой музыкой в уютной атмосфере." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-dvh bg-white text-[#151515] overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
