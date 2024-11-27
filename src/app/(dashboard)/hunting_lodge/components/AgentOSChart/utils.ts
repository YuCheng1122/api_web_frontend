export const COLORS = {
    'Microsoft Windows 10': '#3B82F6',  // blue-500
    'Microsoft Windows 11': '#10B981',  // emerald-500
    'macOS': '#F59E0B',                // amber-500
    'Ubuntu': '#6366F1',               // indigo-500
    'default': '#EC4899',              // pink-500
} as const;

export const getOSIcon = (os: string): string => {
    if (os.toLowerCase().includes('windows')) {
        return 'fa-brands fa-windows';
    }
    if (os.toLowerCase().includes('macos')) {
        return 'fa-brands fa-apple';
    }
    if (os.toLowerCase().includes('ubuntu') || os.toLowerCase().includes('linux')) {
        return 'fa-brands fa-linux';
    }
    return 'fa-brands fa-windows';
};
