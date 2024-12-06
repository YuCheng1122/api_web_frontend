import React from "react";
import { ArrowUpToLine } from "lucide-react";
import SideNav from "./SideNav";
import { ScrollToTop } from "@/app/shared/scroll-to-top";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Side Navigation */}
            <SideNav />

            {/* Main Content Area */}
            <main className="flex-1 ml-0 sm:ml-64 min-h-screen">
                <div className="max-w-[2000px] mx-auto p-4 sm:p-6">
                    {children}
                </div>
            </main>

            {/* Back to Top Button */}
            <div className="fixed right-4 bottom-4 z-50">
                <ScrollToTop minHeight={20} scrollTo={10}>
                    <ArrowUpToLine />
                </ScrollToTop>
            </div>
        </div>
    );
}
