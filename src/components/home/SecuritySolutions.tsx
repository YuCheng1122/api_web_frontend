"use client";

import React, { useEffect, useRef, useState } from 'react';

const solutions = [
  {
    title: 'ThreatAvocado XDR',
    description: '以 AI 驅動的高效訂閱式安全服務，完全免除軟硬體採購和建置的負擔。虛擬資安官 SenseX 強化威脅偵測、即時回應與全面管理，為企業提供強大的自動防禦與合規支持，確保數位安全無虞。',
    features: [
      '跨平台支持',
      '威脅情報即時更新',
      '直覺式操作介面',
      '無須額外硬體成本',
      '支援 Linux、macOS 和 Windows',
      'AI 智能小幫手',
      '快速安裝功能',
    ],
  },
  {
    title: '特色一：跨平台支持',
    description: '支援 Linux、macOS 和 Windows',
  },
  {
    title: '特色二：威脅情報即時更新',
    description: '提供最新情資，無須額外採購，為企業減少成本負擔',
  },
  {
    title: '特色三：直覺式操作介面',
    description: '人性化操作介面，讓您一目瞭然',
  },
  {
    title: '特色四：無須額外硬體成本',
    description: '免去採購時間成本，有效人力運用',
  },
  {
    title: '特色五：快速安裝功能',
    description: '免除安裝困擾，讓您一鍵安裝',
  },
  {
    title: '特色六：AI 智能小幫手',
    description: '為您解答任何問題，是企業最佳資安小幫手',
  },
];

const SecuritySolutions: React.FC = () => {
    const [visibleSections, setVisibleSections] = useState<number[]>([]);
    const sectionRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute('data-index'));
            if (entry.isIntersecting) {
              setVisibleSections((prev) => [...prev, index]);
            } else {
              setVisibleSections((prev) => prev.filter((i) => i !== index));
            }
          });
        },
        { threshold: 0.01, rootMargin: "0px" }
      );

      sectionRefs.current.forEach((section) => {
        if (section) observer.observe(section);
      });

      return () => {
        sectionRefs.current.forEach((section) => {
          if (section) observer.unobserve(section);
        });
      };
    }, []);

    return (
      <div className="flex flex-wrap gap-8">
        {solutions.map((solution, index) => (
          <div
            key={index}
            ref={(el) => { sectionRefs.current[index] = el!; }}
            data-index={index}
            className={`bg-white shadow-lg rounded-lg overflow-hidden flex w-4/5 
              ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'} 
              transform transition-transform duration-1000 ease-in-out 
              transition-opacity 
              ${visibleSections.includes(index) ? 'opacity-100 translate-x-0' : '-translate-x-full opacity-0'}
            `}
          >
            <div className="px-6 py-4 flex-1">
              <h2 className="font-bold text-xl mb-2">{solution.title}</h2>
              <p className="text-gray-700 text-base mb-4">{solution.description}</p>
            </div>
          </div>
        ))}
        {/* 新增的優惠方案區塊 */}
        <div className="w-full rounded-lg bg-black text-white py-6 px-8 text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">資安防護優惠方案</h2>
          <ul className="list-none">
            <li className="mb-2">提供20家一個月免費 PoC</li>
            <li className="mb-2">立即下單~即享一年 XDR 服務 20,000 元</li>
            <li className="mb-2">快掃 QR code，即享以上優惠!</li>
          </ul>
          <div className="mt-6">
            <img src="/QRCode.png" alt="QR Code" className="mx-auto" />
          </div>
        </div>
      </div>
    );
};

export default SecuritySolutions;
