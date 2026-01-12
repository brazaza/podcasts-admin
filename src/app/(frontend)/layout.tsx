import type { Metadata, Viewport } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import { AudioProvider } from "@/hooks/use-audio";
import { GlobalPlayer } from "@/components/audio-player";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { BackToTop } from "@/components/back-to-top";

export const metadata: Metadata = {
  title: "SYSTEM108 PODCAST",
  description: "Official podcast platform for System 108. Deep house, techno, and beyond.",
  openGraph: {
    title: "SYSTEM108 PODCAST",
    description: "Official podcast platform for System 108.",
    images: ["https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&h=630&fit=crop"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased bg-background text-foreground min-h-screen">
      <ErrorReporter />
      <AudioProvider podcasts={[]}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <GlobalPlayer />
        </div>
        <BackToTop />
        <Toaster position="top-center" />
      </AudioProvider>
    </div>
  );
}
