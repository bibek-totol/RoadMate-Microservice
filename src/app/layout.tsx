import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Provider from "@/lib/Provider";
import ReduxProvider from "@/redux/ReduxProvider";
import InitUser from "@/InitUser";
import "./globals.css";
import "leaflet/dist/leaflet.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
