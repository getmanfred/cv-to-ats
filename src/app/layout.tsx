import type { Metadata } from 'next'
import { Source_Serif_4, Big_Shoulders_Display, Montserrat } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'

const FeedbackWidget = dynamic(() => import('@/components/FeedbackWidget'), { ssr: false })

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-heading',
  display: 'swap',
})

const bigShoulders = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ATS Killer — Manfred',
  description: 'Analiza tu CV y descubre si está optimizado para los sistemas ATS de selección de personal.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${sourceSerif.variable} ${bigShoulders.variable} ${montserrat.variable}`}>
      <body className="antialiased bg-white text-purple-dark">
        <FeedbackWidget />
        {children}
      </body>
    </html>
  )
}
