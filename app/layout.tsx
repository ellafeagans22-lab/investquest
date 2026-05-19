import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'InvestQuest — Learn to Invest, One Lesson at a Time',
  description: 'Master investing with bite-sized lessons, real stock simulations, and a progress system that keeps you motivated. Free to start.',
  openGraph: {
    title: 'InvestQuest — Learn to Invest, One Lesson at a Time',
    description: 'Master investing with bite-sized lessons, real stock simulations, and a progress system that keeps you motivated.',
    url: 'https://investquest-ten.vercel.app',
    siteName: 'InvestQuest',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvestQuest — Learn to Invest, One Lesson at a Time',
    description: 'Master investing with bite-sized lessons and real stock simulations.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
