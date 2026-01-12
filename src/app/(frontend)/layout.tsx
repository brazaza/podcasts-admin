import type { Metadata, Viewport } from 'next'
import { LayoutWrapper } from '@/components/layout-wrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'SYSTEM108 PODCAST',
  description: 'Official podcast platform for System 108. Deep house, techno, and beyond.',
  openGraph: {
    title: 'SYSTEM108 PODCAST',
    description: 'Official podcast platform for System 108.',
    images: ['https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&h=630&fit=crop'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <LayoutWrapper>{children}</LayoutWrapper>
}
