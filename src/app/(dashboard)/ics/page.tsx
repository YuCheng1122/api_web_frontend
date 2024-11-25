'use client';

import { EventTable } from "./components/ModbusEventDetails";
import { Clock, AlertTriangle, Activity } from 'lucide-react';

export default function ICSPage() {
    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ICS Events Monitor</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor and analyze Industrial Control System events
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Event Rate</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                <span id="eventRate">-</span>
                                <span className="text-sm text-gray-500 ml-1">events/min</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                <span id="activeAlerts">-</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Last Update</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                <span id="lastUpdate">-</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-lg shadow-sm border">
                <EventTable />
            </div>
        </div>
    );
}
