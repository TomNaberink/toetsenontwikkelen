import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Toets Ontwikkelaar - AI voor Docenten',
  description: 'AI-gestuurde tool voor het ontwikkelen van professionele kennistoetsen voor het onderwijs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}