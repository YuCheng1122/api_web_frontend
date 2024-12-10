import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type LogCount = {
    [severity: string]: number;
};
type Props = {
    props: {
        timestamp: string;
        severity: string;
    }[];
};

export default function LineChartsyslog(props: Props) {
    const toChinese = (severity: string) => {
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
    // props is an array clean to be used in the LineChart by day count
    const exchangeData = props.props.reduce((acc: { timestamp: string, severity: string }[], curr: { timestamp: string, severity: string }) => {
        const date = new Date(curr.timestamp);
        const timestamp = date.toLocaleDateString();
        const severity = toChinese(curr.severity);
        acc.push({ timestamp, severity });
        return acc;
    }, []);
    const logCounts: { [date: string]: LogCount } = {};
    // Count logs per date and severity
    exchangeData.forEach((log: { timestamp: string, severity: string }) => {
        const { timestamp, severity } = log;
        if (!logCounts[timestamp]) {
            logCounts[timestamp] = {};
        }
        if (!logCounts[timestamp][severity]) {
            logCounts[timestamp][severity] = 0;
        }
        logCounts[timestamp][severity] += 1;
    });
    // Format the result as an array of objects
    const result = Object.keys(logCounts).map(date => {
        const count = logCounts[date];
        return { date, ...count }
    });

    // result is an array of objects with date and severity count

    // find the unique severity
    const uniqueSeverities = exchangeData.reduce((acc: Set<string>, curr: { timestamp: string, severity: string }) => {
        acc.add(curr.severity);
        return acc;
    }, new Set<string>());
    const color = {
        "一般": "#82ca9d",
        "警告": "#ffc658",
        "錯誤": "#ff7300"
    }
    return (
        <div>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    width={500}
                    height={300}
                    data={result}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Array.from(uniqueSeverities).map((severity, index) => (
                        <Bar key={index} dataKey={severity as string} stackId="a" fill={color[severity as keyof typeof color]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}