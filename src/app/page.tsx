import React from 'react';
import Image from 'next/image';
import SecuritySolutions from '@/components/home/SecuritySolutions';

export default function Home() {
  return (
    <div className="flex flex-wrap-reverse min-h-[90vh] w-full ">
      <div className="container mx-auto px-4 py-8 flex-grow w-2/3">
        <h1 className="text-3xl font-bold mb-6 text-center">ThreatCado XDR & SenseX</h1>
        <SecuritySolutions />
      </div>
      <div className=" relative w-full sm:w-1/3 h-[90vh]">
        <Image
          src="/HomePageVisualAvocado.webp"
          alt="Avocado Homepage Visual"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">AIXSOAR Solution</h1>
        <SecuritySolutions />
      </div>
    </div>
  );
}

