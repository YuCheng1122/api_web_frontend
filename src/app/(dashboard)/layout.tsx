import React from "react";
import { ArrowUpToLine } from "lucide-react";
import SideNav from "../components/SideNav";
import { ScrollToTop } from "../ui/scroll-to-top";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Side Navigation */}
            <SideNav />

            {/* Main Content Area */}
            <main className="flex-1 ml-64">
                <div className="max-w-[2000px] mx-auto p-6">
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
