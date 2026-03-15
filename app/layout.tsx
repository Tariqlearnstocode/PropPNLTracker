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
import 'styles/main.css';

const title = 'Prop Firm PNL Tracker';
const description = 'Track your prop trading profit & loss automatically. Connect your bank and get instant PNL insights.';

const siteUrl = getURL();
const ogImage = `${siteUrl}/opengraph-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    url: siteUrl,
    siteName: 'Prop Firm PNL Tracker',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Prop Firm PNL Tracker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [ogImage],
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
      </body>
    </html>
  );
}
