'use client'
import mock from './mock';
import LineChartsyslog from './components/LineChart';
import StatisticalTable from './components/StatisticalTable';
import SyslogTable from './components/SyslogTable';
import SelectSyslog from './components/SelectSyslog';
import { useState } from 'react';
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
        <div>
            <h1 className="text-2xl font-semibold">Syslog 分析圖</h1>
            <p className="text-gray-600 mb-5">這是一個 Syslog 日誌的分析圖表</p>
            <SelectSyslog props={mock} filter={filter} />

            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <LineChartsyslog props={filterdata} />
                </div>
                <div className="col-span-1">
                    <StatisticalTable props={filterdata} />
                </div>

            </div>
            <SyslogTable Syslog={filterdata} />

        </div>
    );
}