import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type LogCount = {
    [severity: string]: number;
};
type Props = {
    props: any[];
};

export default function LineChartsyslog(props: Props) {
    // props is an array clean to be used in the LineChart by day count
    const propsa = props.props.reduce((acc: any, curr: any) => {
        const date = new Date(curr.timestamp);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const timestamp = `${year}-${month}-${day}`;
        const severity = curr.severity;
        // console.log('timestamp', timestamp); TODO
        acc.push({ timestamp, severity });
        return acc;
    }, []);
    const logCounts: { [date: string]: LogCount } = {};

    // Count logs per date and severity
    propsa.forEach((log: { timestamp: string, severity: string }) => {
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
    // find the unique severity
    const uniqueSeverities = propsa.reduce((acc: Set<string>, curr: any) => {
        acc.add(curr.severity);
        return acc;
    }, new Set<string>());
    const color = {
        INFO: '#8884d8',
        WARNING: '#82ca9d',
        ERROR: '#ff7300',
        CRITICAL: '#ff0000',
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