export const SEVERITY_COLORS = {
    critical: {
        bg: 'bg-red-100',
        border: 'border-red-500',
        text: 'text-red-800',
        fill: '#EF4444'
    },
    high: {
        bg: 'bg-orange-100',
        border: 'border-orange-500',
        text: 'text-orange-800',
        fill: '#F97316'
    },
    medium: {
        bg: 'bg-yellow-100',
        border: 'border-yellow-500',
        text: 'text-yellow-800',
        fill: '#F59E0B'
    },
    low: {
        bg: 'bg-green-100',
        border: 'border-green-500',
        text: 'text-green-800',
        fill: '#10B981'
    }
} as const;
