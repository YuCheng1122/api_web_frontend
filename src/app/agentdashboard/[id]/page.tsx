'use client'
import PieGraph from "@/components/agentdashboard/PieGraph"
import AgentInfo from "@/components/agentdashboard/AgentInfo";
import MitreList from "@/components/agentdashboard/MitreList";
import { usePathname } from 'next/navigation';
import { fetchAgentDetails } from "@/utils/agentdashboard/fetchAgentInfoData";
import { fetchMitreData } from "@/utils/agentdashboard/fetchMitreData";
import { fetchRansomwareData } from "@/utils/agentdashboard/fetchRansomwareData";
import { use, useEffect, useState } from "react";

type fetchPieDataType = {
    name: string,
    value: number
}

export default function AgentDashboardPage() {
    const pathname = usePathname();
    const [datas, setDatas] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [mitreData, setMitreData] = useState<any>(null);
    const [mitreError, setMitreError] = useState<any>(null);
    // ransomwareData 是一個陣列
    const [ransomwareData, setRansomwareData] = useState<any>(null);
    const [ransomwareError, setRansomwareError] = useState<any>(null);

    useEffect(() => {
        if (pathname) {
            const agentId = pathname.split('/')[2];  // Assuming agentId is in the 3rd position
            console.log('id:', agentId);

            // Fetch agent details if agentId is available
            if (agentId) {
                fetchAgentDetails({ id: agentId })
                    .then(response => setDatas(response.content))
                    .catch(err => setError(err));

            }
        }
    }, [pathname]);
    useEffect(() => {
        if (pathname) {
            const agentId = pathname.split('/')[2];  // Assuming agentId is in the 3rd position
            console.log('id:', agentId);

            // Fetch agent details if agentId is available
            if (agentId) {
                fetchMitreData({ id: agentId })
                    .then(response => setMitreData(response.content))
                    .catch(err => setMitreError(err));
            }
        }
    }, [pathname]);
    useEffect(() => {
        if (pathname) {
            const agentId = pathname.split('/')[2];  // Assuming agentId is in the 3rd position
            console.log('id:', agentId);

            // Fetch agent details if agentId is available
            if (agentId) {
                fetchRansomwareData({ id: agentId })
                    .then(response => setRansomwareData(response.content))
                    .catch(err => setRansomwareError(err));
            }
        }
    }, [pathname]);
    if (ransomwareError) return <div>Error: {ransomwareError.message}</div>;
    if (!ransomwareData) return <div>Loading...</div>;

    if (mitreError) return <div>Error: {mitreError.message}</div>;
    if (!mitreData) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!datas) return <div>Loading...</div>;

    const defaultData: fetchPieDataType[] = [
        { name: 'Agent 1', value: 100 },
        { name: 'Agent 2', value: 200 },
        { name: 'Agent 3', value: 300 },
    ];
    const threat: fetchPieDataType[] = [
        // CVEs
        { name: 'CVE-2024-10001', value: 100 },
        { name: 'CVE-2024-10002', value: 200 },
        { name: 'CVE-2024-10003', value: 300 },
        { name: 'CVE-2024-10004', value: 400 },
        { name: 'CVE-2024-10005', value: 500 },
    ];
    // threat data random 可能1個 或是五個
    const Randomthreat = threat.slice(0, Math.floor(Math.random() * threat.length));

    const Ioc: fetchPieDataType[] = [
        { name: 'IOC-Hash-abcdef123456', value: 150 },
        { name: 'IOC-Domain-maliciousdomain.com', value: 250 },
        { name: 'IOC-IP-192.168.1.100', value: 350 },
        { name: 'IOC-URL-http://badurl.com/malware', value: 450 },
        { name: 'IOC-FilePath-/var/tmp/suspicious.exe', value: 550 }
    ];
    // Ioc data random 可能1個 或是五個
    const RandomIoc = Ioc.slice(0, Math.floor(Math.random() * Ioc.length));
    console.log('ransomwareData:', ransomwareData.ransomware_name);


    return (
        <div className="flex flex-col items-center space-y-1">
            <div className=" w-full mx-auto p-2 ">
                <AgentInfo data={datas} />
            </div>
            <div className=" flex flex-wrap space-x-4 h-screen space-y-5 justify-center">
                <p></p>
                <MitreList mitres={mitreData} />

                <PieGraph title="Ransomware" data={defaultData} />
                <div className="flex flex-col space-y-5 bg-white rounded-lg w-1/5 justify-center p-5 overflow-auto">
                    Wanna Cry --{">"}Ransomware file list:
                    <div className="flex flex-col space-y-2">
                        {ransomwareData.ransomware_name.map((ransomware_name: string, index: number) => (
                            <div key={index} className="flex items-center ">
                                <span className=" text-pretty overflow-hidden">
                                    {ransomware_name}</span>
                                <hr className=" border-gray-300 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
                <PieGraph title="IoC" data={RandomIoc} />
                <PieGraph title="CVE" data={Randomthreat} />
            </div>
        </div>
    )
}