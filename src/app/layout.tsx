import type { Metadata } from "next";
import { Bigshot_One, Manrope } from "next/font/google";
import "./globals.css";
import AuthContext from "@/components/layout/AuthContext";
import Header from "@/components/layout/Header";
import GatekeeperModal from "@/components/auth/GatekeeperModal";
import Script from "next/script";

const bigshotOne = Bigshot_One({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Coopertunity",
  description: "Where Africans find purpose, and each other.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bigshotOne.variable} ${manrope.variable} font-body bg-cloud-dancer text-deep-brown antialiased`}>
        <AuthContext>
          <Header />
          <GatekeeperModal />
          {children}
        </AuthContext>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
