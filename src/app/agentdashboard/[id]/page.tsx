'use client'
import PieGraph from "@/components/agentdashboard/PieGraph"
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
    const determineOS = (osName: string): string => {
        osName = osName.toLowerCase();
        if (osName.includes('windows') || osName.includes('microsoft')) {
            return 'windows';
        } else if (osName.includes('linux') || osName.includes('ubuntu') || osName.includes('centos') || osName.includes('redhat') || osName.includes('debian')) {
            return 'linux';
        } else if (osName.includes('mac') || osName.includes('darwin')) {
            return 'macos';
        } else {
            return 'other';
        }
    };
    const tactics = [
        { name: 'Defense Evasion', count: 7 },
        { name: 'Privilege Escalation', count: 5 },
        { name: 'Initial Access', count: 3 },
        { name: 'Persistence', count: 3 },
    ];

    return (
        <div className="flex flex-col items-center space-y-1">
            <div className=" w-full mx-auto p-2 ">
                <div className="bg-white shadow rounded-lg p-6 space-x-5 flex flex-row justify-around flex-grow">
                    <div className="flex justify-between items-center flex-col">
                        <span className=" text-gray-400">ID</span>
                        <span className="font-bold">{data.id}</span>
                    </div>
                    <div className="flex justify-between items-center flex-col">
                        <span className="text-gray-400">Status</span>
                        <span className="text-green-500">{data.status}</span>
                    </div>
                    <div className="flex justify-between flex-no items-center  flex-col">
                        <span className="text-gray-400 whitespace-nowrap">IP Address</span>
                        <span className="font-bold ">{data.ipAddress}</span>
                    </div>
                    <div className="flex justify-between items-center flex-col">
                        <span className="text-gray-400">Version</span>
                        <span className="font-bold">{data.version}</span>
                    </div>
                    <div className="flex justify-between items-center flex-col">
                        <span className="text-gray-400">Groups</span>
                        <span className="font-bold">{data.groups}</span>
                    </div>
                    <div className="flex justify-between items-center flex-col">
                        <span className="text-gray-400">OS</span>
                        <div className="flex items-center">
                            {determineOS(data.os) === 'linux' && (
                                <img src="/linux-logo.png" alt="Linux" width={20} height={20} className="mr-2" />
                            )}
                            {determineOS(data.os) === 'windows' && (
                                <img src="/windows-logo.png" alt="Windows" width={20} height={20} className="mr-2" />
                            )}
                            {determineOS(data.os) === 'macos' && (
                                <img src="/mac-logo.png" alt="macOS" width={20} height={20} className="mr-2" />
                            )}
                            <span className="font-bold">{data.os}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center flex-col">
                        <span className="text-gray-400">Cluster Node</span>
                        <span className="font-bold">{data.clusterNode}</span>
                    </div>
                    <div className="flex justify-between items-center flex-col">
                        <span className="text-gray-400">Registration Date</span>
                        <span className="font-bold">{data.registrationDate}</span>
                    </div>
                    <div className="flex justify-between items-center flex-col">
                        <span className="text-gray-400">Last Keep Alive</span>
                        <span className="font-bold">{data.lastKeepAlive}</span>
                    </div>
                </div>
            </div>
            <div className=" flex flex-wrap space-x-4 h-screen space-y-5 justify-center">
                <p></p>
                <div className="max-w-sm w-full mx-auto bg-white shadow-lg rounded-lg p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">MITRE ATT&CK</h2>
                        <a href="#" className="text-blue-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </a>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-md font-bold">Top Tactics</h3>
                        <ul className="mt-2 space-y-2">
                            {tactics.map((tactic, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span>{tactic.name}</span>
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
                                        {tactic.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <PieGraph title="Top_agents" data={defaultData} />
                <div className="flex flex-col space-y-5 bg-white rounded-lg w-1/5 items-center justify-center">
                    Wanna cry is a ........
                </div>
                <PieGraph title="Top_agents" data={defaultData} />
                <PieGraph title="Top_agents" data={defaultData} />
            </div>
        </div>
    )
}