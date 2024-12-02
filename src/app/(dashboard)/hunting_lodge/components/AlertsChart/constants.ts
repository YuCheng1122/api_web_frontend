import { AlertTriangle, AlertCircle, AlertOctagon, CheckCircle } from 'lucide-react';
import type { Alerts } from '../../../../../features/dashboard_v2/types';

export const SEVERITY_CONFIG = [
    {
        name: 'Critical',
        color: '#DC2626', // red-600
        bgColor: '#FEE2E2', // red-100
        icon: AlertOctagon,
        getValue: (data: Alerts) => data.content.alerts.critical_severity
    },
    {
        name: 'High',
        color: '#F97316', // orange-500
        bgColor: '#FFEDD5', // orange-100
        icon: AlertTriangle,
        getValue: (data: Alerts) => data.content.alerts.high_severity
    },
    {
        name: 'Medium',
        color: '#FBBF24', // amber-400
        bgColor: '#FEF3C7', // amber-100
        icon: AlertCircle,
        getValue: (data: Alerts) => data.content.alerts.medium_severity
    },
    {
        name: 'Low',
        color: '#22C55E', // green-500
        bgColor: '#DCFCE7', // green-100
        icon: CheckCircle,
        getValue: (data: Alerts) => data.content.alerts.low_severity
    }
];
