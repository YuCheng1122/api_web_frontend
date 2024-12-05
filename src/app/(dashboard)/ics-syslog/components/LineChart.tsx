import { log } from 'console';
import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
type LogEntry = {
    timestamp: string;
    severity: string;
};

type LogCount = {
    [severity: string]: number;
};

type Result = {
    date: Date;
    [severity: string]: number;
};
export default function LineChartsyslog(props: any) {
    console.log('props', props);


    // props is an array clean to be used in the LineChart by day count
    const propsa = props.props.reduce((acc: any, curr: any) => {
        const date = new Date(curr.timestamp);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const timestamp = `${year}-${month}-${day}`;
        const severity = curr.severity;
        acc.push({ timestamp, severity });
        return acc;
    }, []);
    console.log('propsa', propsa);
    // count the number of logs per day[{ date: '2023-12-03', INFO: 2, WARNING: 1 }, { date: '2023-12-04', INFO: 1 }]


    const logCounts: { [date: string]: LogCount } = {};

    // Count logs per date and severity
    propsa.forEach((log: any) => {
        const { timestamp, severity } = log;
        if (!logCounts[timestamp]) {
            logCounts[timestamp] = {};
        }
        if (!logCounts[timestamp][severity]) {
            logCounts[timestamp][severity] = 0;
        }
        logCounts[timestamp][severity]++;
    });

    // Format the result as an array of objects
    const result: Result[] = Object.keys(logCounts).map(date => {
        const count = logCounts[date]
        return { date, ...count };
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