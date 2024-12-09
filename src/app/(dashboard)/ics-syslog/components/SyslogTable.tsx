import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { useState } from "react";

type props = {
    Syslog: {
        event_id: string;
        timestamp: string;
        device: string;
        details: {
            in_interface: string;
            out_interface: string;
            src_ip: string;
            dst_ip: string;
            protocol: string;
            src_port: number;
            dst_port: number;
        };
        severity: string;
        message: string;
    }[];
}

export default function SyslogTable(props: props) {
    const { Syslog } = props;
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredSyslog = Syslog.filter((item) => {
        if (searchTerm === '') {
            return item;
        } else if (item.event_id.toLowerCase().includes(searchTerm.toLowerCase()) || item.device.toLowerCase().includes(searchTerm.toLowerCase()) || item.details.src_ip.toLowerCase().includes(searchTerm.toLowerCase()) || item.details.dst_ip.toLowerCase().includes(searchTerm.toLowerCase()) || item.severity.toLowerCase().includes(searchTerm.toLowerCase()) || item.message.toLowerCase().includes(searchTerm.toLowerCase())) {
            return item;
        }
    });
    return (
        <div className="bg-white p-5 rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex flex-row px-20  mb-2 gap-3">
                <div className=" relative flex-1  ">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="搜尋 ID、裝置或 IP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-700 dark:focus:ring-blue-500"
                    />


                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " size={20} />
                    <select
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-700 dark:focus:ring-blue-500"
                    >
                        <option value="">全部</option>
                        <option value="INFO">INFO</option>
                        <option value="WARNING">WARNING</option>
                        <option value="ERROR">ERROR</option>

                    </select>
                </div>

            </div>
            <div className="flex justify-between items-center px-24">
                <span className="text-gray-400 text-sm">共 {filteredSyslog.length} 筆日誌</span>
                <p></p>
            </div>


            <table className="table-auto justify-center w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Timestamp</th>
                        <th className="px-4 py-2">Device</th>
                        <th className="px-4 py-2">Source_IP</th>
                        <th className="px-4 py-2">Destination_IP</th>
                        <th className="px-4 py-2">Severity</th>
                        <th className="px-4 py-2">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredSyslog.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{item.timestamp}</td>
                                <td className="border px-4 py-2">{item.device}</td>
                                <td className="border px-4 py-2">{item.details && item.details.src_ip ? item.details.src_ip : 'N/A'}</td>

                                <td className="border px-4 py-2">{item.details && item.details.dst_ip ? item.details.dst_ip : 'N/A'}</td>
                                <td className="border px-4 py-2">{item.severity}</td>
                                <td className="border px-4 py-2">{item.message}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                filteredSyslog.length === 0 && (
                    <div className="text-center text-gray-600">找不到符合條件的日誌</div>
                )
            }
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="w-[200px] border rounded-md px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>每頁 5 筆</option>
                        <option value={10}>每頁 10 筆</option>
                        <option value={25}>每頁 25 筆</option>
                    </select>
                </div>
                <span className="text-gray-600 text-sm ml-2">第 {currentPage} 頁/總共 {Math.ceil(filteredSyslog.length / itemsPerPage)} 頁</span>
                <div className="flex items-center gap-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>上一頁</button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredSyslog.length / itemsPerPage)}>下一頁</button>
                </div>

            </div>

        </div>
    )
}