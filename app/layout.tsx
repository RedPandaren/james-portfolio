import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/app/components/ThemeProvider";
import ChatbotWidget from "@/app/components/ChatbotWidget";
import TourProvider from "@/app/components/TourProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "James Conales | Software Engineer",
  description:
    "Fintech-specialized Backend Engineer building high-stakes payment infrastructure, secure cloud architecture, and greenfield REST platforms at PETNET, Inc.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "James Conales | Software Engineer",
    description:
      "Fintech-specialized Backend Engineer building high-stakes payment infrastructure and secure cloud architecture.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=t?t==="dark":m;var e=document.documentElement;e.classList.toggle("dark",d);e.classList.toggle("light",!d);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <TourProvider>
            {children}
            <ChatbotWidget />
          </TourProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
