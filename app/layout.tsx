import { Metadata } from 'next';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import Footer from '@/components/Footer';
import GlobalNavbar from '@/components/GlobalNavbar';
import { MainContentWrapper } from '@/components/MainContentWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import { createClient } from '@/utils/supabase/server';
import { AuthModalWrapper } from '@/components/AuthModalWrapper';
import { ReportNavProvider } from '@/contexts/ReportNavContext';
import { Analytics } from '@vercel/analytics/next';
import 'styles/main.css';

const title = 'Prop PNL | Prop Firm P&L Tracker';
const description =
  'Track your prop firm profit and loss with real bank data. No spreadsheets, no screenshots. Payouts and fees from Topstep, FTMO, Apex, Rise.';

const siteUrl = getURL();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | Prop PNL`,
  },
  description: description,
  keywords: [
    'prop firm',
    'pnl tracker',
    'prop trading',
    'profit and loss',
    'Topstep',
    'FTMO',
    'Apex',
    'Rise',
    'bank verified',
    'trading tracker',
  ],
  authors: [{ name: 'Prop PNL' }],
  creator: 'Prop PNL',
  publisher: 'Prop PNL',
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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: title,
    description: description,
    url: siteUrl,
    siteName: 'Prop PNL',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Prop PNL — Prop Firm P&L Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    site: '@proppnl',
    creator: '@proppnl',
    images: [`${siteUrl}twitter-image`],
  },
  other: {
    'msapplication-TileColor': '#0a0a0f',
  },
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    // "Auth session missing" is expected when user is logged out - not a real error
  }

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0a0a0f] min-h-screen flex flex-col">
        <AuthProvider initialUser={user}>
          <ReportNavProvider>
            <GlobalNavbar />
            <MainContentWrapper>
              <main id="skip" className="flex-1">
                {children}
              </main>
              <Footer />
            </MainContentWrapper>
          </ReportNavProvider>
          <AuthModalWrapper />
          <Suspense>
            <Toaster />
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
