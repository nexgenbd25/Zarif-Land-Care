import type { Metadata } from 'next';
import { Inter, Hind_Siliguri } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Zarif Landcare Center',
    template: '%s | Zarif Landcare Center',
  },
  description: 'নির্ভরযোগ্য দলিল সেবা - আপনার জমি ও সম্পত্তির নির্ভরযোগ্য অংশীদার',
  keywords: [
    'Zarif Landcare',
    'দলিল',
    'খতিয়ান',
    'জমি',
    'সম্পত্তি',
    'Land Deed',
    'Khatian',
    'Registration',
  ],
  authors: [{ name: 'Zarif Landcare Center' }],
  creator: 'Zarif Landcare Center',
  publisher: 'Zarif Landcare Center',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: 'en_US',
    siteName: 'Zarif Landcare Center',
    title: 'Zarif Landcare Center',
    description: 'নির্ভরযোগ্য দলিল সেবা - আপনার জমি ও সম্পত্তির নির্ভরযোগ্য অংশীদার',
    images: ['/favicon.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Zarif Landcare Center',
    description: 'নির্ভরযোগ্য দলিল সেবা - আপনার জমি ও সম্পত্তির নির্ভরযোগ্য অংশীদার',
    images: ['/favicon.png'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.variable} ${hindSiliguri.variable} font-sans bg-white text-[#1F2937] antialiased`}
      >
        {children}

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1F2937',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#1F7A3F',
                secondary: '#FFFFFF',
              },
              style: {
                border: '1px solid #1F7A3F',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
              style: {
                border: '1px solid #EF4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
