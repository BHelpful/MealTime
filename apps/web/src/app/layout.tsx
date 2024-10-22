import { CSPostHogProvider } from '@/components/posthog-provider';
import Providers from '@/components/providers';
import { SentryFeedbackWidget } from '@/components/sentry-feedback';
import { TailwindIndicator } from '@/components/ui/tailwind-indicator';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/site';
import { env } from '@/env.mjs';
import { fontMono, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { type Metadata, type Viewport } from 'next';
import dynamic from 'next/dynamic';
import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';

const PostHogPageView = dynamic(
  () => import('../components/posthog-page-view'),
  {
    ssr: true,
  }
);

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Server Actions',
    'MomentMeal',
  ],
  authors: [
    {
      name: 'bhelpful',
      url: 'https://github.com/bhelpful',
    },
  ],
  creator: 'bhelpful',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: '@bhelpful',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <CSPostHogProvider>
          <body
            className={cn(
              'min-h-screen bg-background font-sans antialiased',
              fontSans.variable,
              fontMono.variable
            )}
          >
            <PostHogPageView />
            <Providers attribute="class" defaultTheme="system" enableSystem>
              {children}
              <TailwindIndicator />
              <VercelAnalytics />
              <SpeedInsights />
              <SentryFeedbackWidget />
            </Providers>
            <Toaster />
          </body>
        </CSPostHogProvider>
      </html>
    </ClerkProvider>
  );
}
