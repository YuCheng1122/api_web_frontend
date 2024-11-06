import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
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
          <div className="flex flex-col min-h-screen ">
            <Header />
            <hr className="border-gray-900" />
            <main className="flex-grow relative">
              {children}
              <div className="relative">
                {/* Some content */}
                <ScrollToTop minHeight={20} scrollTo={10} className="absolute right-4 bottom-4">
                  <ArrowUpToLine />
                </ScrollToTop>
              </div>
            </main>

          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
