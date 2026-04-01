import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import { Dock } from '@/components/dock/Dock'

export const metadata: Metadata = {
  title: 'Mikhail',
  description:
    'Software Engineer based in Sydney, Australia. Building intelligent systems, automation pipelines, and products people actually use.',
  openGraph: {
    title: 'Ernest Mikhail Sacdal — Software Engineer',
    description: 'Software Engineer based in Sydney, Australia.',
    url: 'https://yourdomainhere.com',
    siteName: 'Ernest Mikhail Sacdal',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ernest Mikhail Sacdal — Software Engineer',
    description: 'Software Engineer based in Sydney, Australia.',
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
