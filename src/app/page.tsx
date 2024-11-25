import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Activity, Lock, Cpu, MessageSquare, BarChart2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Mobile Hero Section */}
      <section className="sm:hidden relative bg-gray-900">
        <div className="h-screen flex flex-col">
          {/* Navigation */}
          <nav className="w-full">
            <div className="px-4 py-4 flex justify-end">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Image Container */}
            <div className="relative flex-1">
              <Image
                src="/HomePageVisualAvocado.webp"
                alt="ThreatCado Security"
                fill
                priority
                className="object-contain"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900" />
            </div>

            {/* Text Content */}
            <div className="relative px-4 py-8 text-center bg-gray-900">
              <h1 className="text-3xl font-bold text-white mb-4">
                Next-Gen Security Intelligence Platform
              </h1>
              <p className="text-base text-gray-200 mb-6">
                Empower your security operations with AI-driven threat detection,
                real-time monitoring, and intelligent response capabilities.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-all duration-200 ease-in-out"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Hero Section */}
      <section className="hidden sm:block relative w-full bg-gray-900">
        <div className="relative w-full" style={{ aspectRatio: '1792/1024' }}>
          <Image
            src="/HomePageVisualAvocado.webp"
            alt="ThreatCado Security"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col">
          {/* Navigation */}
          <nav className="w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex justify-end items-center h-20">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="flex-grow flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Next-Gen Security Intelligence Platform
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                Empower your security operations with AI-driven threat detection,
                real-time monitoring, and intelligent response capabilities.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-all duration-200 ease-in-out"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Comprehensive Security Solutions
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Protect your organization with our advanced security features
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Threat Detection</h3>
              <p className="text-gray-600">Advanced threat detection with real-time monitoring and analysis</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Network Monitoring</h3>
              <p className="text-gray-600">Comprehensive network visibility and traffic analysis</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Endpoint Protection</h3>
              <p className="text-gray-600">Secure endpoint management and protection</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Cpu className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">ICS Security</h3>
              <p className="text-gray-600">Industrial Control System security monitoring</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Assistant</h3>
              <p className="text-gray-600">Intelligent chatbot for security insights and assistance</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart2 className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Analytics</h3>
              <p className="text-gray-600">Advanced security analytics and reporting</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to enhance your security?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              Get started with ThreatCado XDR today
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-base sm:text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ThreatCado XDR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
