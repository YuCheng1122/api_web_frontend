type MitreData = {
    id: string;
    status: string;
    ipAddress: string;
    version: string;
    groups: string;
    os: string;
    clusterNode: string;
    registrationDate: string;
    lastKeepAlive: string;
};
export default function AgentInfo(props: { data: MitreData }) {
    const { data } = props;
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

    return (
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
    );
}