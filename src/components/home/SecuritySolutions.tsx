"use client";

import React, { useEffect, useRef, useState } from 'react';

const solutions = [
  {
    title: '一站式註冊、申請、安裝與開通',
    description: 'ThreatCado XDR & SenseX 提供完整的一站式服務，從申請到安裝，無縫整合，快速啟動。簡化流程，讓企業迅速啟用資安防護，縮短部署時間並降低IT負擔。',
    features: [
      '無須額外硬體成本',
      '威脅情報即時更新',
      '自動化防禦與合規支持',
    ],
  },
  {
    title: '串接EDR與NDR事件，強化場域防護',
    description: 'ThreatCado XDR 支援多層次的資安防護，將場域內EDR (Endpoint Detection and Response) 和NDR (Network Detection and Response) 事件即時串接，實現完整的端到端威脅監控與分析。以網路與終端數據互補，提供更精準的威脅檢測和回應。',
    features: [
      '跨平台支援',
      '人性化介面設計',
      '一鍵安裝簡化流程',
      'AI智能小幫手',
    ],
  },
  {
    title: '以 SenseX 為核心 AI 威脅獵捕與場域風險評估',
    description: 'SenseX 作為系統的智慧核心，運用AI語言模型進行威脅獵捕和場域風險評估。SenseX的AI能力能自動檢測潛在威脅，透過學習不斷改進檢測與分析能力，確保企業免受惡意攻擊。此外，風險評估功能能夠根據場域特性提供動態安全建議，有效降低風險，保障營運安全。',
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

          <div className="px-6 py-4 w-2/5  ">
            {/* h3 的彈出效果 */}
            <h3 className="font-semibold text-lg mb-2">主要特點：</h3>
            <ul className="list-disc list-inside">
              {solution.features.map((feature, fIndex) => (
                <li key={fIndex} className="text-gray-600">{feature}</li>
              ))}
            </ul>
            {/* 圖片區塊 */}
            {index === 2 && (
              <div className="md:w-1-5  p-5">
                <img src="/QRCode.png" alt="優惠方案圖示" className="h-20 w-20 object-contain" />
              </div>
            )}
          </div>



        </div>
      ))}
    </div>
  );
};

export default SecuritySolutions;