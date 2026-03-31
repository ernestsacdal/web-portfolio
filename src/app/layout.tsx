import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import { Dock } from '@/components/dock/Dock'

export const metadata: Metadata = {
  title: 'Ernest Surname — Full-Stack Developer & AI Engineer',
  description:
    'Full-Stack Developer & AI Engineer based in Sydney, Australia. Building intelligent systems, automation pipelines, and products people actually use.',
  openGraph: {
    title: 'Ernest Surname — Full-Stack Developer & AI Engineer',
    description: 'Full-Stack Developer & AI Engineer based in Sydney, Australia.',
    url: 'https://yourdomainhere.com',
    siteName: 'Ernest Surname',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ernest Surname — Full-Stack Developer & AI Engineer',
    description: 'Full-Stack Developer & AI Engineer based in Sydney, Australia.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Dock />
        </ThemeProvider>
      </body>
    </html>
  )
}
