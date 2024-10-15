'use client'
import PieGraph from "@/components/agentdashboard/PieGraph"
import AgentInfo from "@/components/agentdashboard/AgentInfo";
import MitreList from "@/components/agentdashboard/MitreList";
import { usePathname } from 'next/navigation';
import { fetchAgentDetails } from "@/utils/agentdashboard/fetchAgentInfoData";
import { useEffect, useState } from "react";
type fetchPieDataType = {
    name: string,
    value: number
}
export default function AgentDashboardPage() {
    const pathname = usePathname();
    const [datas, setDatas] = useState<any>(null);
    const [error, setError] = useState<any>(null);

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
    console.log('datas:', datas);


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


    const mitres = [
        { name: 'Defense Evasion', count: 7 },
        { name: 'Privilege Escalation', count: 5 },
        { name: 'Initial Access', count: 3 },
        { name: 'Persistence', count: 3 },
    ];

    return (
        <div className="flex flex-col items-center space-y-1">
            <div className=" w-full mx-auto p-2 ">
                <AgentInfo data={datas} />
            </div>
            <div className=" flex flex-wrap space-x-4 h-screen space-y-5 justify-center">
                <p></p>
                <MitreList mitres={mitres} />

                <PieGraph title="Ransomware" data={defaultData} />
                <div className="flex flex-col space-y-5 bg-white rounded-lg w-1/5 items-center justify-center">
                    Wanna cry is a ........
                </div>
                <PieGraph title="IoC" data={RandomIoc} />
                <PieGraph title="CVE" data={Randomthreat} />
            </div>
        </div>
    )
}