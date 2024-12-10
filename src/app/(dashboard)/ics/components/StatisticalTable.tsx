interface SeverityStats {
    Max: number;
    Avg: number;
    Total: number;
}
type props = {
    props: any[];

}
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

export default function StatisticalTable(props: props) {
    const { props: mock } = props;
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
    const switchs = (severity: string) => {
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

    return (
        <table className="table-auto col-span-1 dark:bg-gray-800">
            <thead>
                <tr className="bg-gray-200 rounded-sm text-gray-800">
                    <th className="px-2 py-2">嚴重性</th>
                    <th className="px-2 py-2">最大值</th>
                    <th className="px-2 py-2">平均值(天)</th>
                    <th className="px-2 py-2">總計</th>
                </tr>
            </thead>
            <tbody>
                {
                    Object.entries(summary).map(([severity, stats]) => (
                        <tr key={severity}>
                            <td className="border px-4 py-2">
                                <span className={`p-1 rounded-md text-${severity === 'INFO' ? 'green' : severity === 'WARNING' ? 'yellow' : 'red'}-500`}>
                                    {switchs(severity)}
                                </span>
                            </td>
                            <td className="border px-4 py-2">{stats.Max}</td>
                            <td className="border px-4 py-2">{stats.Avg}</td>
                            <td className="border px-4 py-2">{stats.Total}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>

    )
}