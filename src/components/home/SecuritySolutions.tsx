"use client";

import React, { useEffect, useRef, useState } from 'react';

const solutions = [
  {
    title: 'NDR',
    description: 'ATHS NDR 就像是網路中的警察，24 小時不停巡邏，查看網路上有沒有異常的活動。它能即時發現和阻止不尋常的網路行為，保護企業免受各種網路攻擊。',
    features: [
      '無須額外硬體成本',
      '威脅情報即時更新',
      '自動化防禦與合規支持',
    ],
  },
  {
    title: 'EDR',
    description: 'EDR（終端檢測與回應）是一種先進的資安解決方案，專注於監控和保護企業的終端設備。它能夠檢測、分析和回應終端上的安全威脅。',
    features: [
      '跨平台支援',
      '人性化介面設計',
      '一鍵安裝簡化流程',
      'AI智能小幫手',
    ],
  },
  {
    title: 'XDR',
    description: 'XDR（擴展檢測與回應）是一種整合性的安全解決方案，結合了EDR、NDR等多種技術，提供更全面的威脅檢測和回應能力。',
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

          <div className="px-6 py-4 w-1/3">
            {/* h3 的彈出效果 */}
            <h3 className="font-semibold text-lg mb-2">主要特點：</h3>
            <ul className="list-disc list-inside">
              {solution.features.map((feature, fIndex) => (
                <li key={fIndex} className="text-gray-600">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecuritySolutions;