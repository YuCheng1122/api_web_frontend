type props = {
    Syslog: any[];
}

export default function SyslogTable(props: props) {
    const { Syslog } = props;
    return (
        <table className="table-auto">
            <thead>
                <tr>
                    <th className="px-4 py-2">Device</th>
                    <th className="px-4 py-2">Timestamp</th>
                    <th className="px-4 py-2">Severity</th>
                    <th className="px-4 py-2">Message</th>
                    <th className="px-4 py-2">Details</th>
                </tr>
            </thead>
            <tbody>
                {Syslog.map((item, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{item.device}</td>
                        <td className="border px-4 py-2">{item.timestamp}</td>
                        <td className="border px-4 py-2">{item.severity}</td>
                        <td className="border px-4 py-2">{item.message}</td>
                        <td className="border px-4 py-2">{JSON.stringify(item.details)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}