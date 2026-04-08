import type { Metadata } from 'next'
import { Syne, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { siteConfig } from '@/config/site'
import './globals.css'

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  /** 400 cuerpo, 600 semibold, 700 bold, 800 extrabold — sin 500 para menos bytes */
  weight: ["400", "600", "700", "800"],
})

const spaceMono = Space_Mono({ 
  subsets: ["latin"],
  variable: '--font-space-mono',
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={siteConfig.lang} className={`${syne.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased bg-black text-white">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
