import React from 'react';
type Props = {
    originaldata: any;
    setdevice: (device: string) => void;
    setseverity: (severity: string) => void;
    severity: string;
    device: string;
};
export default function SelectSyslog(props: Props) {
    const { originaldata, setdevice, setseverity, severity, device } = props;

    // Extract unique devices and severities
    const uniqueDevice = originaldata.reduce((acc: Set<string>, curr: any) => {
        acc.add(curr.device);
        return acc;
    }, new Set<string>());

    const uniqueSeverity = originaldata.reduce((acc: Set<string>, curr: any) => {
        acc.add(curr.severity);
        return acc;
    }, new Set<string>());

    const handleReset = () => {
        setdevice('all');
        setseverity('all');

    }

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm space-x-3 dark:bg-gray-800 ">
            <label htmlFor="device">選擇設備:</label>
            <select
                className="bg-gray-300 rounded-sm shadow-sm dark:bg-gray-700"
                name="device"
                id="device"
                onChange={(e) => {
                    const value = e.target.value;
                    setdevice(value);

                }}
                value={device}
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
                className="bg-gray-300 rounded-sm shadow-xl dark:bg-gray-700"
                name="severity"
                id="severity"
                onChange={(e) => {
                    const value = e.target.value;
                    setseverity(value);

                }}
                value={severity}
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
