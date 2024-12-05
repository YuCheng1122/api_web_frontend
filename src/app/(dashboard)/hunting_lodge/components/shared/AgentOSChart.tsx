'use client';

import { FC } from 'react';
import type { AgentOS } from '../../../../../features/dashboard_v2/types';

// Enhanced color configuration
const COLORS = {
    'Microsoft Windows 10': 'var(--chart-1)',
    'Microsoft Windows 11': 'var(--chart-2)',
    'macOS': 'var(--chart-3)',
    'Ubuntu': 'var(--chart-4)',
    'default': 'var(--chart-5)'
} as const;

const getOSIconInfo = (os: string) => {
    const iconClass = os.toLowerCase().includes('windows')
        ? 'fa-brands fa-windows'
        : os.toLowerCase().includes('macos')
            ? 'fa-brands fa-apple'
            : 'fa-brands fa-linux';

    // Extract Windows version and edition
    let versionNumber = '';
    if (os.toLowerCase().includes('windows')) {
        const version = os.includes('10') ? '10'
            : os.includes('11') ? '11'
                : os.includes('2022') ? '22'
                    : '';

        const edition = os.toLowerCase().includes('pro') ? 'P'
            : os.toLowerCase().includes('home') ? 'H'
                : os.toLowerCase().includes('education') ? 'E'
                    : os.toLowerCase().includes('server') ? 'S'
                        : '';

        versionNumber = version + edition;
    }

    return { iconClass, versionNumber };
};

interface Props {
    data: AgentOS;
}

const AgentOSChart: FC<Props> = ({ data }) => {
    const osData = data.content.agent_os;
    const total = osData.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">作業系統分佈</h2>

            <div className="bg-muted rounded-lg p-3">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-sm font-medium text-muted-foreground pb-2">作業系統</th>
                            <th className="text-right text-sm font-medium text-muted-foreground pb-2">數量</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {osData.map((item) => {
                            const color = COLORS[item.os as keyof typeof COLORS] || COLORS.default;
                            const { iconClass, versionNumber } = getOSIconInfo(item.os);

                            return (
                                <tr key={item.os} className="group">
                                    <td className="py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <i
                                                    className={`${iconClass} text-xl`}
                                                    style={{ color: `hsl(${color})` }}
                                                ></i>
                                                {versionNumber && (
                                                    <span
                                                        className="absolute -bottom-1 -right-1 text-[10px] font-medium bg-background rounded-sm px-0.5"
                                                        style={{ color: `hsl(${color})` }}
                                                    >
                                                        {versionNumber}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-card-foreground">{item.os}</span>
                                        </div>
                                    </td>
                                    <td className="text-right text-sm font-medium" style={{ color: `hsl(${color})` }}>
                                        {item.count}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="border-t border-border">
                        <tr>
                            <td className="py-2 text-sm font-medium text-card-foreground">總計</td>
                            <td className="text-right text-sm font-medium text-card-foreground">{total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default AgentOSChart;
