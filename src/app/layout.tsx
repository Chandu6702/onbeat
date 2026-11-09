import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SideNav from "@/components/SideNav";
import Onboarding from "@/components/Onboarding";
import ThemeApplier from "@/components/ThemeApplier";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Cadence — Practice studio",
  description: "Learn, practice, and create music. A beginner-to-advanced practice partner.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ThemeApplier />
        <div className="flex min-h-dvh">
          <SideNav />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="mx-auto w-full max-w-[600px] flex-1 px-[18px] pb-[108px] pt-5 md:max-w-[720px] md:px-8 md:pb-12 md:pt-10">
              {children}
            </main>
            <BottomNav />
          </div>
        </div>
        <Onboarding />
      </body>
    </html>
  );
}
