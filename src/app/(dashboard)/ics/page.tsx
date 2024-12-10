'use client';

import { EventTable } from "./components/ModbusEventDetails";
import { Clock, AlertTriangle, Activity } from 'lucide-react';
import LineChartsyslog from './components/LineChart';
import StatisticalTable from './components/StatisticalTable';
import SyslogTable from './components/SyslogTable';
import FilterSyslog from './components/FilterSyslog';
import { useState } from 'react';
import { fetchSyslogEvents } from '@/features/ics-syslog/services/syslogApi';
import { useEffect } from 'react';
import { SyslogRow } from '@/features/ics-syslog/types';
import Loading from './components/Loading';


export default function ICSPage() {
    const [filterdata, setFilterdata] = useState<SyslogRow[]>([]);
    const [originaldata, setOriginaldata] = useState<SyslogRow[]>([]);
    const [device, setDevice] = useState<string>('all');
    const [severity, setSeverity] = useState<string>('all');
    const [time, setTime] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        if (severity === 'all' && device === 'all') {
            setFilterdata(originaldata);
        } else {
            const filtered = originaldata.filter(item => {
                const severityMatch = severity === 'all' || item.severity === severity;
                const deviceMatch = device === 'all' || item.device === device;
                return severityMatch && deviceMatch;
            });
            setFilterdata(filtered);
        }
    }, [severity, device, originaldata]);
    useEffect(() => {

        setLoading(true);
        fetchSyslogEvents({
            start_time: new Date('2021-09-01T00:00:00Z').toISOString()
            , end_time: new Date().toISOString()
        }).then(res => {
            if (res.success) {
                setFilterdata(res.content);
                setOriginaldata(res.content);
                setLoading(false);
            }
            else {
                setLoading(false);
                setError('Error fetching syslog events');
            }
        }
        )
    }, []);
    useEffect(() => {
        if (time === '') {
            return;
        }
        setLoading(true);
        const fetchData = async (start_time: string, end_time: string) => {
            try {
                const res = await fetchSyslogEvents({ start_time, end_time });
                if (res.success) {
                    setFilterdata(res.content);
                    setOriginaldata(res.content);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                setError('Error fetching syslog events');
                console.error('Error fetching syslog events:', error);
            }
        };
        const now = new Date();
        let start_time = new Date();
        if (time === 'all') {
            start_time = new Date('2021-09-01T00:00:00Z'); // Hard-coded for 'all'
            fetchData(start_time.toISOString(), now.toISOString());
        } else {
            switch (time) {
                case 'day':
                    start_time.setDate(now.getDate() - 1);
                    break;
                case 'week':
                    start_time.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    start_time.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    start_time.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    return;
            }
            fetchData(start_time.toISOString(), now.toISOString());
        }
    }, [time]);
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);
    const renderContent = () => {
        if (error) {
            return <div className="text-red-500 text-center">{error}</div>;
        }

        if (loading) {
            return (
                <div className="flex items-start justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-2">
                        <Loading />
                        <p className="text-sm text-gray-500">載入中...</p>
                    </div>
                </div>
            );
        }

        if (filterdata.length === 0) {
            return (
                <div className="flex justify-center items-center h-96 flex-col">
                    <div className=" text-2xl  font-semibold">沒有資料</div>
                    <div>
                        <p className="text-gray-400">請嘗試更改過濾條件</p>
                    </div>
                </div>
            );
        }
        if (isMobile) {
            return (
                <div>
                    <FilterSyslog originaldata={originaldata} setdevice={setDevice} setseverity={setSeverity} device={device} severity={severity} />
                    <div className="grid grid-cols-1 gap-2 mt-2 bg-white p-8 rounded-lg shadow-sm border mb-5 border-t-0 sm:grid-cols-4 md:grid-col-4 xl:grid-col-4 dark:bg-gray-800 dark:border-gray-700">
                        <div className="col-span-3">
                            <LineChartsyslog props={filterdata} />
                        </div>
                        <div className="col-span-1 w-full flex justify-center items-center">
                            <StatisticalTable props={filterdata} />
                        </div>
                    </div>
                    <SyslogTable Syslog={originaldata} />
                </div>
            );
        }
        return (
            <div>
                <FilterSyslog originaldata={originaldata} setdevice={setDevice} setseverity={setSeverity} device={device} severity={severity} />
                <div className="grid grid-cols-1 gap-2 mt-2 bg-white p-8 rounded-lg shadow-sm border mb-5 border-t-0 sm:grid-cols-4 md:grid-col-4 xl:grid-col-4 dark:bg-gray-800 dark:border-gray-700">
                    <div className="col-span-3">
                        <LineChartsyslog props={filterdata} />
                    </div>
                    <div className="col-span-1 w-full flex justify-center items-center">
                        <StatisticalTable props={filterdata} />
                    </div>
                </div>
                <SyslogTable Syslog={originaldata} />
            </div>
        );
    };


    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Syslog 分析</h1>
                    <p className="text-gray-600 mb-5">這是一個 Syslog 日誌&分析圖表</p>
                </div>
                <div className="flex items-center gap-4">
                    {
                        isMobile ? null : (
                            <label htmlFor="device">選擇時間:</label>
                        )
                    }
                    <div className=' relative'>
                        <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
                        <select className="w-40 pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-800 dark:focus:ring-blue-500" value={time} onChange={(e) => setTime(e.target.value)}>
                            <option value="all">全部</option>
                            <option value="day">過去一天</option>
                            <option value="week">過去一週</option>
                            <option value="month">過去一個月</option>
                            <option value="year">過去一年</option>
                        </select>
                    </div>
                </div>
            </div>
            {renderContent()}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ICS Events Monitor</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor and analyze Industrial Control System events
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Event Rate</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                <span id="eventRate">-</span>
                                <span className="text-sm text-gray-500 ml-1">events/min</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                <span id="activeAlerts">-</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Last Update</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                <span id="lastUpdate">-</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-lg shadow-sm border">
                <EventTable />
            </div>
        </div>
    );
}
