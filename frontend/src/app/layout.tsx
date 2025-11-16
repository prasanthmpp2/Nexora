import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nexora - Next-generation shopping, now.',
  description: 'Modern AI-powered eCommerce platform for the future',
  keywords: ['ecommerce', 'shopping', 'AI', 'next-generation'],
  authors: [{ name: 'Nexora Team' }],
  openGraph: {
    title: 'Nexora - Next-generation shopping, now.',
    description: 'Modern AI-powered eCommerce platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
