'use client'
import mock from './mock';
import LineChartsyslog from './components/LineChart';
import StatisticalTable from './components/StatisticalTable';
import SyslogTable from './components/SyslogTable';
// 定義日誌項目的介面
interface LogEntry {
    device: string;
    timestamp: string; // ISO 格式的日期時間字符串
    severity: string;
    message: string;
    details: {
        in_interface: string;
        out_interface: string;
        src_ip: string;
        dst_ip: string;
        protocol: string;
        src_port: number;
        dst_port: number;
    };
}

// 定義統計結果的介面
interface SeverityStats {
    Max: number;
    Avg: number;
    Total: number;
}

interface Summary {
    [severity: string]: SeverityStats;
}
export default function Page() {
    // 1. 提取所有唯一的日期
    const getUniqueDates = (logs: LogEntry[]): string[] => {
        const dateSet = new Set<string>();
        logs.forEach((log) => {
            const date = log.timestamp.split("T")[0]; // 提取日期部分
            dateSet.add(date);
        });
        return Array.from(dateSet);
    };

    // 2. 分組日誌按日期和嚴重性
    const groupLogs = (logs: LogEntry[]) => {
        const grouped: { [severity: string]: { [date: string]: number } } = {};

        logs.forEach((log) => {
            const date = log.timestamp.split("T")[0];
            const severity = log.severity;

            if (!grouped[severity]) {
                grouped[severity] = {};
            }

            if (!grouped[severity][date]) {
                grouped[severity][date] = 0;
            }

            grouped[severity][date] += 1;
        });

        return grouped;
    };

    // 3. 計算統計
    const calculateStats = (groupedLogs: { [severity: string]: { [date: string]: number } }, uniqueDates: string[]): Summary => {
        const summary: Summary = {};

        for (const severity in groupedLogs) {
            const countsPerDay = Object.values(groupedLogs[severity]);
            const total = countsPerDay.reduce((acc, count) => acc + count, 0);
            const max = Math.max(...countsPerDay);
            const avg = parseFloat((total / uniqueDates.length).toFixed(2)); // 保留兩位小數

            summary[severity] = {
                Max: max,
                Avg: avg,
                Total: total,
            };
        }

        return summary;
    };

    // 執行步驟
    const uniqueDates = getUniqueDates(mock);
    const groupedLogs = groupLogs(mock);
    const summary = calculateStats(groupedLogs, uniqueDates);
    return (
        <div>
            <h1 className="text-2xl font-semibold">Syslog</h1>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">

                    <LineChartsyslog props={mock} />
                </div>
                <div className="col-span-1">
                    <StatisticalTable summary={summary} />
                </div>

            </div>
            <SyslogTable Syslog={mock} />

        </div>
    );
}