export interface Alerts {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    alerts: AlertsClass;
}

export interface AlertsClass {
    critical_severity: number;
    high_severity:     number;
    medium_severity:   number;
    low_severity:      number;
}
