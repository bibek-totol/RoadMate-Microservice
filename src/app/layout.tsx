import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Provider from "@/lib/Provider";
import ReduxProvider from "@/redux/ReduxProvider";
import InitUser from "@/InitUser";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "RoadMate - Smart Vehicle Booking Platform",
  description: "RoadMate ek modern multi-vendor vehicle booking platform hai jahan users aasaani se cars, bikes aur commercial vehicles book kar sakte hain. Secure login, verified owners aur transparent pricing ke saath RoadMate mobility ko simple aur reliable banata hai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload first 8 hero frames with high priority — browser fetches these
            before any JS/CSS parses, guaranteeing instant first-frame display.
            All 177 frames are served with Cache-Control: immutable (1 year),
            so after the first visit the browser never re-downloads any frame. */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <link
            key={n}
            rel="preload"
            as="image"
            href={`/hero-frames/ezgif-frame-${String(n).padStart(3, '0')}.webp`}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fetchPriority={"high" as any}
          />
        ))}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <ReduxProvider>
            <InitUser/>
  {children}
          </ReduxProvider>
        </Provider>
        
      </body>
    </html>
  );
}

