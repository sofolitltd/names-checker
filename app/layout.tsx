import type { Metadata } from "next";
// Import Open Sans from next/font/google
import { Open_Sans } from "next/font/google";
import "./globals.css";

// Configure Open Sans font
const openSans = Open_Sans({
  subsets: ["latin"],
    weight: ["400", "700"], // ✅ Add weights you intend to use
  display: "swap", // Optimize font loading with 'swap'
  variable: "--font-open-sans", // Define CSS variable for Open Sans
});

export const metadata: Metadata = {
  // Primary SEO: Title and Description
  title: {
    default: "Name Checker - Universal Username & Domain Link Builder",
    template: "%s | Name Checker",
  },
  description: "Generate and manage potential social media, domain, and email links for any username. Check availability and save your preferred online identities.",
  // Keywords for search engines
  keywords: [
    "username checker",
    "domain checker",
    "email checker",
    "social media links",
    "online identity",
    "name availability",
    "link generator",
    "profile links",
    "digital identity"
  ],
  // Canonical URL (important for preventing duplicate content issues)
  alternates: {
    canonical: 'https://nameschecker.vercel.app', // Replace with your actual domain
  },
  // Open Graph metadata for social media sharing (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "Name Checker - Universal Username & Domain Link Builder",
    description: "Generate and manage potential social media, domain, and email links for any username. Check availability and save your preferred online identities.",
    url: "https://nameschecker.vercel.app", // Replace with your actual domain
    siteName: "Name Checker",
    images: [
      {
        url: "https://nameschecker.vercel.app/og-image.png", // Replace with your actual OG image URL (e.g., a screenshot of your app)
        width: 1200,
        height: 630,
        alt: "Name Checker App Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Robots directive (optional, but good for explicit control)
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Other optional metadata like authors, publishers, etc.
  authors: [{ name: "Sofol IT", url: "https://sofolit.vercel.app" }], 
  creator: "Sofol IT | Md Asifuzzaman Reyad",
  publisher: "Sofol IT | Md Asifuzzaman Reyad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="google-site-verification" content="Evx4-_A8qr7gV3b3Kv7-JRn4xjAXaoNXNC2aG2sOjxs" />
      </head>
      <body>{children}</body>
    </html>
  );
}
