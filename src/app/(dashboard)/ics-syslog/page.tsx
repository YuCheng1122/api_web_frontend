'use client'
import mock from './mock';
import LineChartsyslog from './components/LineChart';
import StatisticalTable from './components/StatisticalTable';
import SyslogTable from './components/SyslogTable';
import SelectSyslog from './components/SelectSyslog';
import { useState } from 'react';
import { Clock } from 'lucide-react';
// 定義日誌項目的介面

export default function Page() {
    const [filterdata, setfilterdata] = useState(mock);

    const filter = (option: string, type: string) => {
        if (type === 'device') {
            setfilterdata(mock.filter((item) => item.device === option));
        } else if (type === 'severity') {
            setfilterdata(mock.filter((item) => item.severity === option));
        }
        else {
            setfilterdata(mock);
        }
    }


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

                        <select className="w-40 pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" name="time" id="" onChange={(e) => filter(e.target.value, 'time')} defaultValue={'all'}>
                            <option value="all">全部</option>
                            <option value="day">過去一天</option>
                            <option value="week">過去一週</option>
                            <option value="month">過去一個月</option>
                            <option value="year">過去一年</option>

                        </select>
                    </div>
                </div>
            </div>

            <SelectSyslog props={mock} filter={filter} />
            <div className="grid grid-cols-1 gap-2 mt-2 bg-white p-8 rounded-lg shadow-sm border mb-5 border-t-0 sm:grid-cols-4 md:grid-col-4 xl:grid-col-4">
                <div className="col-span-3">
                    <LineChartsyslog props={filterdata} />
                </div>
                <div className="col-span-1 w-full  flex justify-center items-center">
                    <StatisticalTable props={filterdata} />
                </div>

            </div>
            <SyslogTable Syslog={filterdata} />

        </div>
    );
}