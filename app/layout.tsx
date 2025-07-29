import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Stralyze - Strategic Marketing Solutions",
    template: "%s | Stralyze"
  },
  description: "Elevate your brand with data-driven strategies and innovative campaigns. Stralyze provides comprehensive B2B marketing solutions including CRM, email marketing, and analytics.",
  keywords: [
    "marketing estratégico",
    "B2B marketing",
    "email marketing",
    "CRM",
    "analytics",
    "campañas digitales",
    "estrategia de marca",
    "marketing automation"
  ],
  authors: [{ name: "Stralyze Team" }],
  creator: "Stralyze",
  publisher: "Stralyze",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stralyze.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stralyze.com',
    title: 'Stralyze - Strategic Marketing Solutions',
    description: 'Elevate your brand with data-driven strategies and innovative campaigns.',
    siteName: 'Stralyze',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Stralyze - Strategic Marketing Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stralyze - Strategic Marketing Solutions',
    description: 'Elevate your brand with data-driven strategies and innovative campaigns.',
    images: ['/images/twitter-image.jpg'],
    creator: '@stralyze',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'marketing',
  classification: 'Business',
  other: {
    'theme-color': '#000000',
    'msapplication-TileColor': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://supabase.co" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//supabase.co" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
