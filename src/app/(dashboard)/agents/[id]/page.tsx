'use client'

import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import PieGraph from "../components/PieGraph";
import AgentInfo from "../components/AgentInfo";
import MitreList from "../components/MitreList";
import { fetchAgentInfo } from "@/features/agents/api/fetchAgentInfo";
import { fetchMitreData } from "@/features/agents/api/fetchMitreData";
import { fetchRansomwareData } from "@/features/agents/api/fetchRansomwareData";
import { AgentDashboardDetailType, MitreDisplayData, RansomwareData } from "@/features/agents/types/agent";

interface PieDataType {
    name: string;
    value: number;
}

export default function AgentDashboardPage() {
    const pathname = usePathname();
    const [agentData, setAgentData] = useState<AgentDashboardDetailType | null>(null);
    const [error, setError] = useState<any>(null);
    const [mitreData, setMitreData] = useState<MitreDisplayData[] | null>(null);
    const [mitreError, setMitreError] = useState<any>(null);
    const [ransomwareData, setRansomwareData] = useState<RansomwareData[] | null>(null);
    const [ransomwareError, setRansomwareError] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData(agentId: string) {
            try {
                const agentResponse = await fetchAgentInfo({ id: agentId });
                if (agentResponse.success) {
                    setAgentData(agentResponse.content);
                } else {
                    setError('Failed to fetch agent info');
                }
            } catch (err) {
                setError(err);
            }

            try {
                const mitreResponse = await fetchMitreData({ id: agentId });
                if (mitreResponse.success) {
                    setMitreData(mitreResponse.content);
                } else {
                    setMitreError('Failed to fetch MITRE data');
                }
            } catch (err) {
                setMitreError(err);
            }

            try {
                const ransomwareResponse = await fetchRansomwareData({ id: agentId });
                if (ransomwareResponse.success) {
                    setRansomwareData(ransomwareResponse.content);
                } else {
                    setRansomwareError('Failed to fetch ransomware data');
                }
            } catch (err) {
                setRansomwareError(err);
            }

            setLoading(false);
        }

        if (pathname) {
            const agentId = pathname.split('/')[2];
            console.log('id:', agentId);
            fetchData(agentId);
        }
    }, [pathname]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error loading agent info: {error.message}</div>;
    }

    if (!agentData) {
        return <div>No agent data available</div>;
    }

    const threat: PieDataType[] = [
        { name: 'CVE-2024-10001', value: 100 },
        { name: 'CVE-2024-10002', value: 200 },
        { name: 'CVE-2024-10003', value: 300 },
        { name: 'CVE-2024-10004', value: 400 },
        { name: 'CVE-2024-10005', value: 500 },
    ];
    const Randomthreat = threat.slice(0, Math.floor(Math.random() * threat.length));

    const Ioc: PieDataType[] = [
        { name: 'IOC-Hash-abcdef123456', value: 150 },
        { name: 'IOC-Domain-maliciousdomain.com', value: 250 },
        { name: 'IOC-IP-192.168.1.100', value: 350 },
        { name: 'IOC-URL-http://badurl.com/malware', value: 450 },
        { name: 'IOC-FilePath-/var/tmp/suspicious.exe', value: 550 }
    ];
    const RandomIoc = Ioc.slice(0, Math.floor(Math.random() * Ioc.length));

    // Process ransomware data for pie chart
    const pieRansomwareData = ransomwareData?.map((ransomware: any) => {
        const name = ransomware.name.substring(45);
        const trimmedName = name.substring(0, name.length - 12);
        return { name: trimmedName, value: ransomware.value };
    }) || [];

    return (
        <div className="flex flex-col items-center space-y-1">
            <div className="w-full mx-auto p-2">
                <AgentInfo data={agentData} />
            </div>
            <div className="flex flex-wrap space-x-4 h-screen space-y-5 justify-center">
                <p></p>
                {mitreData && <MitreList mitres={mitreData} />}
                {ransomwareData && (
                    <>
                        <PieGraph title="Ransomware" data={pieRansomwareData} />
                        <div className="flex flex-col space-y-5 bg-white rounded-lg w-1/5 justify-center p-5 overflow-auto min-w-48">
                            Wanna Cry --{">"}Ransomware file list:
                            {ransomwareData.map((ransomware: any, index: number) => (
                                <ul key={index} className="border-b-2">
                                    <li><span>{index + 1} : </span>{ransomware.name}</li>
                                </ul>
                            ))}
                        </div>
                    </>
                )}
                <PieGraph title="IoC" data={RandomIoc} />
                <PieGraph title="CVE" data={Randomthreat} />
            </div>
        </div>
    )
}
