import React from 'react';
import { Activity, AlertTriangle, Shield, Users, Server, Clock } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900">Welcome to ThreatCado XDR</h1>
                <p className="text-gray-600 mt-2">Monitor and manage your security operations from a single dashboard</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Threats</p>
                            <p className="text-2xl font-semibold text-gray-900">3</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                            <p className="text-2xl font-semibold text-gray-900">2</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">System Status</p>
                            <p className="text-2xl font-semibold text-gray-900">Healthy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <p className="ml-3 text-sm text-gray-600">New threat detected in network segment A</p>
                            <span className="ml-auto text-xs text-gray-400">2m ago</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-400" />
                            <p className="ml-3 text-sm text-gray-600">User authentication attempt failed</p>
                            <span className="ml-auto text-xs text-gray-400">15m ago</span>
                        </div>
                        <div className="flex items-center">
                            <Server className="h-5 w-5 text-gray-400" />
                            <p className="ml-3 text-sm text-gray-600">System update completed successfully</p>
                            <span className="ml-auto text-xs text-gray-400">1h ago</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">Run Scan</span>
                    </button>
                    <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">View Reports</span>
                    </button>
                    <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">Alerts</span>
                    </button>
                    <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">Manage Users</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
