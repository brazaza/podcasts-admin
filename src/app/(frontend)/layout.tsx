import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { AudioProvider } from "@/hooks/use-audio";
import { getPublishedPodcasts } from "@/lib/payload";
import { GlobalPlayer } from "@/components/audio-player";
import Link from "next/link";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const podcasts = await getPublishedPodcasts();
  
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased bg-black text-white selection:bg-white selection:text-black">
        <AudioProvider podcasts={podcasts}>
          <div className="flex flex-col min-h-screen pb-32">
            <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
              <nav className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-4 h-4 bg-black rounded-full" />
                    </div>
                    <span className="text-xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                      SYSTEM108
                    </span>
                  </Link>
                </div>
                <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
                  <Link href="/" className="hover:text-zinc-400 transition-colors">Podcasts</Link>
                  <Link href="/about" className="hover:text-zinc-400 transition-colors">About</Link>
                </div>
              </nav>
            </header>
            
            <main className="flex-grow pt-16">
              {children}
            </main>

            <GlobalPlayer />
          </div>
          
          <BackToTop />
          <Toaster position="top-center" />
          <Script
            id="orchids-browser-logs"
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
            strategy="afterInteractive"
            data-orchids-project-id="35eb1f71-b851-456c-a795-21433f989958"
          />
          <ErrorReporter />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
          />
          <VisualEditsMessenger />
        </AudioProvider>
      </body>
    </html>
  );
}
