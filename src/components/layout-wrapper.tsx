'use client'

import React from 'react'
import { AudioProvider } from '@/hooks/use-audio'
import { GlobalPlayer } from '@/components/audio-player'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { BackToTop } from '@/components/back-to-top'
import ErrorReporter from './ErrorReporter'
import NextTopLoader from 'nextjs-toploader'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
          <body className="antialiased bg-background text-foreground min-h-screen">
             <ErrorReporter />
             <NextTopLoader
              color="#FACC15"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #FACC15,0 0 5px #FACC15"
            />
    <AudioProvider podcasts={[]}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <GlobalPlayer />
      </div>
      <BackToTop />
      <Toaster position="top-center" />
    </AudioProvider>
    </body>
    </html>
    
  )
}
