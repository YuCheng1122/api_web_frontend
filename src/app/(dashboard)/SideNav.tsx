'use client'

import React, { useState } from 'react';
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
    Cpu,
    Menu,
    X
} from 'lucide-react';

const SideNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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
                        <li>
                            <Link
                                href="/hunting_lodge"
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Home size={20} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/ndr"
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Network size={20} />
                                <span>NDR</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/agents"
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Database size={20} />
                                <span>Agents</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/ics"
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Cpu size={20} />
                                <span>ICS</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/chatbot"
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <MessageSquare size={20} />
                                <span>Chatbot</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/managecenter"
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings size={20} />
                                <span>Manage Center</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default SideNav;
