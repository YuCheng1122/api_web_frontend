import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { AlertTriangle } from "lucide-react";


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
    const [isMobile, setIsMobile] = useState(false);
    const filteredSyslog = Syslog.filter((item) => {
        if (searchTerm === '') {
            return item;
        } else if (item.event_id.toLowerCase().includes(searchTerm.toLowerCase()) || item.device.toLowerCase().includes(searchTerm.toLowerCase()) || item.details.src_ip.toLowerCase().includes(searchTerm.toLowerCase()) || item.details.dst_ip.toLowerCase().includes(searchTerm.toLowerCase()) || item.severity.toLowerCase().includes(searchTerm.toLowerCase()) || item.message.toLowerCase().includes(searchTerm.toLowerCase())) {
            return item;
        }
    });
    const toChinese = (severity: string) => {
        switch (severity) {
            case 'INFO':
                return "一般";
            case 'WARNING':
                return "警告";
            case 'ERROR':
                return "錯誤";
            default:
                return 'N/A';
        }
    }
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);
    const totalPages = Math.ceil(filteredSyslog.length / itemsPerPage);
    if (isMobile) {
        return (
            <>
                <div className="sticky top-0 bg-white border-b p-4 space-y-3 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="搜尋事件..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">所有事件</option>
                            <option value="alerts">僅警告</option>
                            <option value="normal">一般事件</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                        共 {filteredSyslog.length} 筆日誌
                    </div>
                </div>
                <div className="space-y-4 p-4">
                    {filteredSyslog.map((event) => (
                        <div
                            key={event.event_id}
                            className="bg-white rounded-lg border shadow-sm p-4 space-y-3 active:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                    {event.event_id}
                                </span>
                                {event.severity === 'INFO' ? (
                                    <AlertTriangle className="text-green-500" size={20} />
                                ) : event.severity === 'WARNING' ? (
                                    <AlertTriangle className="text-yellow-500" size={20} />
                                ) : (
                                    <AlertTriangle className="text-red-500" size={20} />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">裝置</p>
                                    <p className="font-medium">{event.device.length > 15 ? `${event.device.slice(0, 15)}...` : event.device}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">類型</p>
                                    <p className="font-medium">{event.severity}</p>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500">
                                <p>來源: {event.details.src_ip}:{event.details.src_port}</p>
                                <p>目標: {event.details.dst_ip}:{event.details.dst_port}</p>
                            </div>

                            <div className="text-xs text-gray-400">
                                {new Date(event.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col gap-3">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="w-full border rounded-md px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>每頁 5 筆</option>
                        <option value={10}>每頁 10 筆</option>
                        <option value={25}>每頁 25 筆</option>
                    </select>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                            第 {currentPage} 頁，共 {totalPages} 頁
                        </span>
                        const totalPages = filteredSyslog.length / itemsPerPage;
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="bg-white p-5 rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex flex-row px-20  mb-2 gap-3">
                <div className=" relative flex-1  ">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="搜尋 嚴重性、裝置或 IP..."
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
                        {
                            Array.from(new Set(Syslog.map((item) => item.severity))).map((item, index) => (
                                <option key={index} value={item as string}>{toChinese(item as string)}</option>
                            ))
                        }
                    </select>
                </div>

            </div>
            <div className="flex justify-between items-center px-24">
                <span className="text-gray-400 text-sm">共 {filteredSyslog.length} 筆日誌</span>
                <p></p>
            </div>


            <table className="table-auto justify-center w-full overflow-x-auto">
                <thead>
                    <tr className="bg-gray-100 rounded-sm text-gray-500 font">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">裝置</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">來源IP</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目的IP</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">嚴重性</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訊息</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {
                        filteredSyslog.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 cursor-pointer transition-colors ">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.device}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.details && item.details.src_ip ? item.details.src_ip : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.details && item.details.dst_ip ? item.details.dst_ip : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 "> <span className={`bg-gray-200 p-1 rounded-md text-${item.severity === 'INFO' ? 'green' : item.severity === 'WARNING' ? 'yellow' : 'red'}-500`}>
                                    {toChinese(item.severity)}

                                </span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.message}</td>
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
                <div className="flex items-center gap-3">
                    <button className="   py-2 px-4 rounded mt-2" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>上一頁</button>
                    <div className="flex items-center gap-2 mt-2">
                        <p>
                            {currentPage} / {Math.ceil(filteredSyslog.length / itemsPerPage)}
                        </p>
                    </div>
                    <button className="   py-2 px-4 rounded mt-2 ml-2" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredSyslog.length / itemsPerPage)}>下一頁</button>
                </div>

            </div>

        </div>
    )
}