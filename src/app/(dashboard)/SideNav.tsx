'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthContext } from '@/features/auth/contexts/AuthContext';
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
    Cpu,
    Menu,
    X,
    Download
} from 'lucide-react';

// 定義導航項目類型
interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
}

const SideNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isadmin } = useAuthContext();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // 定義導航項目
    const navItems: NavItem[] = [
        {
            href: '/hunting_lodge',
            label: 'Dashboard',
            icon: <Home size={20} />
        },
        {
            href: '/ndr',
            label: 'NDR',
            icon: <Network size={20} />
        },
        {
            href: '/agents',
            label: 'Agents',
            icon: <Database size={20} />
        },
        {
            href: '/ics',
            label: 'ICS',
            icon: <Cpu size={20} />
        },
        {
            href: '/chatbot',
            label: 'Chatbot',
            icon: <MessageSquare size={20} />
        },
        {
            href: '/agent-deployment',
            label: 'Agent Deployment',
            icon: <Download size={20} />
        },
        {
            href: '/managecenter',
            label: 'Manage Center',
            icon: <Settings size={20} />,
            adminOnly: true
        }
    ];

    // 過濾導航項目
    const filteredNavItems = navItems.filter(item => !item.adminOnly || isadmin);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMenu}
                className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="sm:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={toggleMenu}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-40
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                sm:translate-x-0
            `}>
                {/* Logo Section */}
                <div className="p-4 border-b border-gray-800">
                    <Link href="/hunting_lodge" className="block" onClick={() => setIsOpen(false)}>
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
                        {filteredNavItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default SideNav;