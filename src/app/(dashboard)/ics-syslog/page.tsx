'use client'
import mock from './mock';
import LineChartsyslog from './components/LineChart';
import StatisticalTable from './components/StatisticalTable';
import SyslogTable from './components/SyslogTable';
import SelectSyslog from './components/SelectSyslog';
import { use, useState } from 'react';
import { Clock } from 'lucide-react';
import { fetchSyslogEvents } from '@/features/ics-syslog/services/syslogApi';
import { useEffect } from 'react';
import { SyslogRow } from '@/features/ics-syslog/types';
// 定義日誌項目的介面

export default function Page() {
    const [filterdata, setfilterdata] = useState<SyslogRow[]>([]);
    const [originaldata, setoriginaldata] = useState<SyslogRow[]>([]);
    const [device, setdevice] = useState<string>('all');
    const [severity, setseverity] = useState<string>('all');
    const [time, settime] = useState<string>('all');
    const [loading, setloading] = useState<boolean>(true);
    const [error, seterror] = useState<string | null>(null);
    useEffect(() => {
        if (severity === 'all' && device === 'all') {
            setfilterdata(originaldata);
        } else {
            const filtered = originaldata.filter(item => {
                const severityMatch = severity === 'all' || item.severity === severity;
                const deviceMatch = device === 'all' || item.device === device;
                return severityMatch && deviceMatch;
            });
            setfilterdata(filtered);
        }
    }, [severity, device, originaldata]);


    useEffect(() => {
        setloading(true);
        fetchSyslogEvents({ start_time: '2021-09-01T00:00:00Z', end_time: '2024-12-31T23:59:59Z' }).then((res) => {
            if (res.success) {
                setfilterdata(res.content);
                setoriginaldata(res.content);
                setloading(false);
            }
            else {
                setloading(false);
                seterror('Error fetching syslog events');
            }
        }
        )
    }, [])
    useEffect(() => {
        if (time === '') {
            return;
        }
        setloading(true);
        const fetchData = async (start_time: string, end_time: string) => {
            try {
                const res = await fetchSyslogEvents({ start_time, end_time });
                if (res.success) {
                    setfilterdata(res.content);
                    setoriginaldata(res.content);
                    setloading(false);
                }
            } catch (error) {
                setloading(false);
                seterror('Error fetching syslog events');
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
    const renderContent = () => {
        if (error) {
            return <div className="text-red-500 text-center">{error}</div>;
        }

        if (loading) {
            return (
                <div className="flex justify-center items-center h-96">
                    <div className="text-gray-400 text-2xl">載入中...</div>
                </div>
            );
        }

        if (filterdata.length === 0) {
            return (
                <div className="flex justify-center items-center h-96">
                    <div className="text-gray-400 text-2xl">沒有數據</div>
                </div>
            );
        }
        return (
            <div>
                <SelectSyslog originaldata={originaldata} setdevice={setdevice} setseverity={setseverity} device={device} severity={severity} />
                <div className="grid grid-cols-1 gap-2 mt-2 bg-white p-8 rounded-lg shadow-sm border mb-5 border-t-0 sm:grid-cols-4 md:grid-col-4 xl:grid-col-4">
                    <div className="col-span-3">
                        <LineChartsyslog props={filterdata} />
                    </div>
                    <div className="col-span-1 w-full flex justify-center items-center">
                        <StatisticalTable props={filterdata} />
                    </div>
                </div>
                <SyslogTable Syslog={filterdata} />
            </div>
        );
    };



    return (
        <div className="container mx-auto p-5">
            <div className="flex flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Syslog 分析圖</h1>
                    <p className="text-gray-600 mb-5">這是一個 Syslog 日誌的分析圖表</p>
                </div>
                <div className="flex items-center gap-4">
                    <label htmlFor="device">選擇時間:</label>
                    <div className=' relative'>
                        <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select className="w-40 pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" name="time" id="" onChange={(e) => settime(e.target.value)} defaultValue={time}>
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

        </div>
    );
}