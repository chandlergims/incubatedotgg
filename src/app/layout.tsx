import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/SidebarContext";
import { WalletContextProvider } from "@/contexts/WalletContext";
import MainContent from "@/components/MainContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "incubate.gg",
  description: "AI Agent Launchpad - Create and tokenize AI agents with dynamic bonding curves",
  icons: {
    icon: "/Untitled design (60).png",
    apple: "/Untitled design (60).png",
  },
  openGraph: {
    title: "incubate.gg",
    description: "AI Agent Launchpad - Create and tokenize AI agents with dynamic bonding curves",
    images: ["/Untitled design (60).png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "incubate.gg",
    description: "AI Agent Launchpad - Create and tokenize AI agents with dynamic bonding curves",
    images: ["/Untitled design (60).png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <WalletContextProvider>
          <SidebarProvider>
            <div className="h-screen">
              <Sidebar />
              <MainContent>{children}</MainContent>
            </div>
          </SidebarProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
