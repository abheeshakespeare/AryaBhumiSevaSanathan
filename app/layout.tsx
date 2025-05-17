import type { Metadata } from 'next'
import './globals.css'
import { validateEnv } from './config/env'

// Validate environment variables
validateEnv();

export const metadata: Metadata = {
  title: 'Arya Bhumi Seva Sansthan',
  description: 'Arya Bhumi Seva Sansthan is a non-profit organization committed to serving communities through various initiatives in healthcare, education, and social welfare.',
  generator: 'Abhishek Mishra',
  keywords: ['NGO', 'blood donation', 'social welfare', 'healthcare', 'education', 'community service', 'Jharkhand', 'India'],
  authors: [{ name: 'Abhishek Mishra' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aryabhumisevasansthan.org',
    title: 'Arya Bhumi Seva Sansthan',
    description: 'Join us in our mission to serve communities through healthcare, education, and social welfare initiatives.',
    siteName: 'Arya Bhumi Seva Sansthan',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
        <link 
          rel="icon" 
          href="/logo.jpg" 
          type="image/jpeg" 
        />
        <meta name="theme-color" content="#08776e" />
      </head>
      <body>{children}</body>
    </html>
  )
}
