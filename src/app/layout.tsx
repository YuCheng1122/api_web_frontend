import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import { AuthProvider } from "@/components/AuthContext";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ArrowUpToLine } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AVOCADO Dashboard",
  description: "Advanced Threat Hunting System",
  icons: {
    icon: '/logo.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-200`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* Header 區域 */}
            <div className="w-full bg-white sticky top-0 z-50">
              <div className="max-w-[2000px] mx-auto px-4">
                <Header />
              </div>
            </div>
            <hr className="border-gray-900" />

            {/* 主要內容區域 */}
            <div className="flex-grow w-full">
              <div className="max-w-[2000px] mx-auto px-4">
                {children}
              </div>
            </div>

            {/* 回到頂部按鈕 */}
            <div className="fixed right-4 bottom-4 z-50">
              <ScrollToTop minHeight={20} scrollTo={10}>
                <ArrowUpToLine />
              </ScrollToTop>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
