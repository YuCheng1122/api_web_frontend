'use client';

import { FC } from 'react';

interface MobileViewProps {
    totalEvents: number;
    criticalEvents: number;
    highEvents: number;
    mediumEvents: number;
    handleEventsClick: () => void;
    handleNetworkClick: () => void;
    handleThreatHuntingClick: () => void;
    isadmin: boolean;
}

export const MobileView: FC<MobileViewProps> = ({
    totalEvents,
    criticalEvents,
    highEvents,
    mediumEvents,
    handleEventsClick,
    handleNetworkClick,
    handleThreatHuntingClick,
    isadmin,
}) => {
    return (
        <>
            <div className="mb-3">
                <div className="text-xs text-gray-600">Total Events</div>
                <div className="text-2xl font-bold text-gray-900">{totalEvents}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2 bg-red-50 rounded-lg">
                    <div className="text-xs text-gray-600">Critical</div>
                    <div className="text-lg font-bold text-red-600">
                        {criticalEvents}
                    </div>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                    <div className="text-xs text-gray-600">High</div>
                    <div className="text-lg font-bold text-orange-600">
                        {highEvents}
                    </div>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                    <div className="text-xs text-gray-600">Medium</div>
                    <div className="text-lg font-bold text-yellow-600">
                        {mediumEvents}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
                <button
                    onClick={handleEventsClick}
                    className="text-center text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                    <span>View Events</span>
                    <span className="ml-1">→</span>
                </button>
                {isadmin && (
                    <>
                        <button
                            onClick={handleNetworkClick}
                            className="text-center text-xs text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <span>View Network</span>
                            <span className="ml-1">→</span>
                        </button>
                        <button
                            onClick={handleThreatHuntingClick}
                            className="text-center text-xs text-violet-600 hover:text-violet-800 hover:bg-violet-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <span>Threat Hunting</span>
                            <span className="ml-1">→</span>
                        </button>
                    </>
                )}
            </div>
        </>
    );
};
