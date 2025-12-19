import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Fredoka, Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-be-vietnam',
})

const fredoka = Fredoka({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-fredoka',
})

const nunito = Nunito({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'Stitch My Habits - Suivi d\'Habitudes et Objectifs',
  description: 'Application de suivi d\'habitudes et objectifs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${beVietnamPro.variable} ${fredoka.variable} ${nunito.variable} font-body antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

