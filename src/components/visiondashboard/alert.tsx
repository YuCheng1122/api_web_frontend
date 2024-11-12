import React from "react";

type AlertProps = {
    critical: number;
    high: number;
    medium: number;
    low: number;
};

const AlertComponent: React.FC<AlertProps> = ({ critical, high, medium, low }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-right text-gray-500 text-xs font-semibold mb-4">LAST 24 HOURS ALERTS</h2>
            <div className="grid grid-cols-4 gap-6 text-center">
                <AlertCard label="Critical severity" value={critical} color="text-red-500" rule="Rule level 15 or higher" />
                <AlertCard label="High severity" value={high} color="text-yellow-500" rule="Rule level 12 to 14" />
                <AlertCard label="Medium severity" value={medium} color="text-blue-500" rule="Rule level 7 to 11" />
                <AlertCard label="Low severity" value={low} color="text-teal-500" rule="Rule level 0 to 6" />
            </div>
        </div>
    );
};

type AlertCardProps = {
    label: string;
    value: number;
    color: string;
    rule: string;
};

const AlertCard: React.FC<AlertCardProps> = ({ label, value, color, rule }) => {
    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">{label}</h3>
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-gray-600 mt-2">{rule}</p>
        </div>
    );
};

// Usage example
export default function App() {
    return <AlertComponent critical={0} high={0} medium={12} low={89} />;
}
