interface SeverityStats {
    Max: number;
    Avg: number;
    Total: number;
}

interface Summary {
    [severity: string]: SeverityStats;
}
export default function StatisticalTable(props: { summary: Summary }) {
    const { summary } = props;
    return (
        <table className="table-auto col-span-1">
            <thead>
                <tr>
                    <th className="px-4 py-2">Severity</th>
                    <th className="px-4 py-2">Max</th>
                    <th className="px-4 py-2">Avg</th>
                    <th className="px-4 py-2">Total</th>
                </tr>
            </thead>
            <tbody>
                {
                    Object.entries(summary).map(([severity, stats]) => (
                        <tr key={severity}>
                            <td className="border px-4 py-2">{severity}</td>
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