import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Home,
    Shield,
    Monitor,
    Network,
    Database,
    Settings,
    MessageSquare,
    BarChart2,
    Activity,
    Cpu
} from 'lucide-react';

const SideNav = () => {
    return (
        <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto">
            {/* Logo Section */}
            <div className="p-4 border-b border-gray-800">
                <Link href="/hunting_lodge" className="block">
                    <div className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
                        <Image
                            src="/logo.webp"
                            alt="ThreatCado Logo"
                            width={150}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="p-4">
                <ul className="space-y-2">
                    <li>
                        <Link href="/hunting_lodge" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Home size={20} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/hunting_lodge/events" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Shield size={20} />
                            <span>Events</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/vision_board" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Monitor size={20} />
                            <span>Vision Board</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/ndr" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Network size={20} />
                            <span>NDR</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/agents" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Database size={20} />
                            <span>Agents</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/ics" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Cpu size={20} />
                            <span>ICS</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/chatbot" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <MessageSquare size={20} />
                            <span>Chatbot</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/graph" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <BarChart2 size={20} />
                            <span>Graph</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/managecenter" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                            <Settings size={20} />
                            <span>Manage Center</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default SideNav;
