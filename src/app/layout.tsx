import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SYSTEM108",
  description: "System 108 Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
