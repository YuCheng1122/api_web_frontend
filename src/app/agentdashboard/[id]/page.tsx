'use client'
import PieGraph from "@/components/agentdashboard/PieGraph"
import AgentInfo from "@/components/agentdashboard/AgentInfo";
import MitreList from "@/components/agentdashboard/MitreList";
type fetchPieDataType = {
    name: string,
    value: number
}
export default function AgentDashboardPage() {
    const defaultData: fetchPieDataType[] = [
        { name: 'Agent 1', value: 100 },
        { name: 'Agent 2', value: 200 },
        { name: 'Agent 3', value: 300 },
    ];
    const data = {
        id: '033',
        status: 'active',
        ipAddress: '172.20.10.3',
        version: 'Wazuh v4.9.0',
        groups: 'Threat_Hunting',
        os: 'macOS 14.6',
        clusterNode: 'node01',
        registrationDate: 'Oct 9, 2024 @ 11:52:15.000',
        lastKeepAlive: 'Oct 9, 2024 @ 15:54:43.000',
    };

    const mitres = [
        { name: 'Defense Evasion', count: 7 },
        { name: 'Privilege Escalation', count: 5 },
        { name: 'Initial Access', count: 3 },
        { name: 'Persistence', count: 3 },
    ];

    return (
        <div className="flex flex-col items-center space-y-1">
            <div className=" w-full mx-auto p-2 ">
                <AgentInfo data={data} />
            </div>
            <div className=" flex flex-wrap space-x-4 h-screen space-y-5 justify-center">
                <p></p>
                <MitreList mitres={mitres} />

                <PieGraph title="Ransomware" data={defaultData} />
                <div className="flex flex-col space-y-5 bg-white rounded-lg w-1/5 items-center justify-center">
                    Wanna cry is a ........
                </div>
                <PieGraph title="IoC" data={defaultData} />
                <PieGraph title="CVE" data={defaultData} />
            </div>
        </div>
    )
}