import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/navbar'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trivia Mania',
  description: 'Portfolio Project by Marlon for ALX',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-full bg-slate-200 flex flex-col`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
