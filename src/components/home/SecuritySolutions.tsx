"use client";

import React, { useEffect, useRef, useState } from 'react';

const solutions = [
  {
    title: 'ThreatAvocado XDR',
    description: 'ThreatAvocado XDR 是一款由 AI 驅動的高效訂閱式安全服務，免除企業硬體採購和建置需求。其虛擬資安官 SenseX 強化了威脅偵測、即時回應和全面管理，提供自動化的防禦和合規支持，保障企業數位安全。',
    features: [
      '無須額外硬體成本',
      '威脅情報即時更新',
      '自動化防禦與合規支持',
    ],
  },
  {
    title: '技術與操作特點',
    description: 'ThreatAvocado XDR 支援 Linux、macOS 和 Windows 平台，並提供即時威脅情報更新，幫助企業減少額外的硬體成本負擔。人性化操作設計讓系統簡單易用，並配有 AI 智能小幫手解答資安問題，增強管理效率。',
    features: [
      '跨平台支援',
      '人性化介面設計',
      '一鍵安裝簡化流程',
      'AI智能小幫手',
    ],
  },
  {
    title: '優惠方案',
    description: '提供 20 家企業一個月的免費 PoC 試用期，隨後享有一年的 XDR 服務特惠價 20,000 元。透過掃描 QR Code，可即刻享受相關優惠，確保智能防禦隨時在線，威脅無所遁形。',
    features: [
      '免費 PoC 試用',
      '優惠價 XDR 服務',
      'QR Code 優惠取得', ,
    ],
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
            // 元素進入可視範圍時，將索引加入 visibleSections
            setVisibleSections((prev) => [...prev, index]);
          } else {
            // 元素離開可視範圍時，將索引從 visibleSections 移除
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
          className={`
              bg-white shadow-lg rounded-lg overflow-hidden flex md:w-4/5 w-full 
              ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'} 
              transform transition-transform duration-1000 ease-in-out 
              transition-opacity 
              ${visibleSections.includes(index) ? 'opacity-100 translate-x-0' : '-translate-x-full opacity-0'}
            `}
        >
          <div className="px-6 py-4 flex-1">
            {/* title 的彈出效果 */}
            <h2 className="font-bold text-xl mb-2">{solution.title}</h2>
            {/* description 的彈出效果 */}
            <p className="text-gray-700 text-base mb-4">{solution.description}</p>
          </div>

          <div className="px-6 py-4 w-3/5  ">
            {/* h3 的彈出效果 */}
            <h3 className="font-semibold text-lg mb-2">主要特點：</h3>
            <ul className="list-disc list-inside">
              {solution.features.map((feature, fIndex) => (
                <li key={fIndex} className="text-gray-600">{feature}</li>
              ))}
            </ul>
          </div>
          {/* 圖片區塊 */}
          {index === 2 && (
            <div className="md:w-1-5  p-5">
              <img src="/QRCode.png" alt="優惠方案圖示" className="h-20 w-20 object-contain" />
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default SecuritySolutions;