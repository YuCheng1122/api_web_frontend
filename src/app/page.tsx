import React from 'react';
import Image from 'next/image';
import SecuritySolutions from '@/components/home/SecuritySolutions';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[90vh]">
        <Image
          src="/HomePageVisualAvocado.webp"
          alt="Avocado Homepage Visual"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">Threatcado XDR</h1>
        <SecuritySolutions />
      </div>
    </div>
  );
}

