
import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata = {
  title: 'The Eras Tour Danceability Analysis',
  description: 'How Taylor Swift Uses Danceability to Maintain Concert Tension',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-cream text-obsidian`}>
        {children}
      </body>
    </html>
  )
}