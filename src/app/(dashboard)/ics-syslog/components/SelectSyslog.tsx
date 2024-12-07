import React, { useState } from 'react';

export default function SelectSyslog(props: any) {
    const { props: mock, filter } = props;

    const [selectedDevice, setSelectedDevice] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');

    // Extract unique devices and severities
    const uniqueDevice = mock.reduce((acc: Set<string>, curr: any) => {
        acc.add(curr.device);
        return acc;
    }, new Set<string>());

    const uniqueSeverity = mock.reduce((acc: Set<string>, curr: any) => {
        acc.add(curr.severity);
        return acc;
    }, new Set<string>());

    const handleReset = () => {
        setSelectedDevice('all');
        setSelectedSeverity('all');
        filter('', 'all');
    }

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm space-x-3 ">
            <label htmlFor="device">選擇設備:</label>
            <select
                className="bg-gray-300 rounded-sm shadow-sm"
                name="device"
                id="device"
                onChange={(e) => {
                    const value = e.target.value;
                    setSelectedDevice(value);
                    filter(value, 'device');
                }}
                value={selectedDevice}
            >
                {
                    Array.from(uniqueDevice).map((item, index) => (
                        <option key={index} value={item as string}>{item as string}</option>
                    ))
                }
                <option value="all" disabled>全部</option>
            </select>

            <label htmlFor="severity">選擇嚴重性:</label>
            <select
                className="bg-gray-300 rounded-sm shadow-sm"
                name="severity"
                id="severity"
                onChange={(e) => {
                    const value = e.target.value;
                    setSelectedSeverity(value);
                    filter(value, 'severity');
                }}
                value={selectedSeverity}
            >
                {
                    Array.from(uniqueSeverity).map((item, index) => (
                        <option key={index} value={item as string}>{item as string}</option>
                    ))
                }
                <option value="all" disabled>全部</option>
            </select>

            <button
                onClick={handleReset}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                重置
            </button>
        </div>
    );
}
