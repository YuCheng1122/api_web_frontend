'use client';

import { FC, useEffect } from 'react';
import { useNDR } from '../../../../features/ndr/hooks/useNDR';
import { useNDRData } from '../contexts/NDRContext';
import { ndrService } from '../../../../features/ndr/services/ndrService';
import DeviceInfoCard from './DeviceInfoCard';
import TopBlockingList from './TopBlockingList';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const NDROverview: FC = () => {
    const {
        deviceInfo,
        topBlocking,
        loading,
        error,
        selectedDevice,
        devices,
        setDevices,
        setDeviceInfo,
        setTopBlocking,
        setLoading,
        setError,
        setSelectedDevice,
    } = useNDRData();

    const {
        getToken,
        getCredentials,
        login,
        isAuthenticated,
        isLoading: authLoading,
        decodedToken
    } = useNDR();

    useEffect(() => {
        const initializeNDR = async () => {
            try {
                const credentials = await getCredentials();
                if (credentials && !isAuthenticated) {
                    await login(credentials, false);
                }
            } catch (err) {
                console.error('Failed to initialize NDR:', err);
                setError('NDR 初始化失敗');
            }
        };

        initializeNDR();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            if (!token || !isAuthenticated || !decodedToken?.customerId) return;

            try {
                setLoading(true);
                setError(null);

                // 獲取設備列表
                const deviceListResponse = await ndrService.listDeviceInfos(token, decodedToken.customerId);
                setDevices(deviceListResponse.data);

                if (deviceListResponse.data.length > 0) {
                    const deviceToUse = selectedDevice || deviceListResponse.data[0].name;
                    setSelectedDevice(deviceToUse);

                    // 獲取設備信息
                    const deviceInfoResponse = await ndrService.getDeviceInfo(token, deviceToUse);
                    if (deviceInfoResponse.length > 0) {
                        setDeviceInfo(deviceInfoResponse[0]);
                    }

                    // 獲取阻擋排行
                    const fromTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
                    const toTimestamp = new Date().getTime();

                    const topBlockingResponse = await ndrService.getTopBlocking(
                        token,
                        deviceToUse,
                        fromTimestamp,
                        toTimestamp,
                        1
                    );

                    setTopBlocking(topBlockingResponse);
                }
            } catch (err) {
                console.error('Error fetching NDR data:', err);
                setError(err instanceof Error ? err.message : '無法獲取 NDR 資料');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, decodedToken]);

    if (!isAuthenticated) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">網路偵測與回應 (NDR)</h2>
                <div className="text-muted-foreground">
                    請先在 NDR 頁面登入以查看相關資訊
                </div>
            </div>
        );
    }

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    網路偵測與回應 (NDR)
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                        {selectedDevice ? `監控設備：${devices.find(d => d.name === selectedDevice)?.label || selectedDevice}` : '未選擇設備'}
                    </span>
                </h2>

                {/* 設備資訊 */}
                {deviceInfo && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">系統狀態</h3>
                        <DeviceInfoCard info={deviceInfo} />
                    </div>
                )}

                {/* Top Blocking */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">阻擋排行</h3>
                    {topBlocking.length > 0 ? (
                        <TopBlockingList data={topBlocking.slice(0, 5)} /> // 只顯示前5筆
                    ) : (
                        <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-4 text-center text-muted-foreground">
                            無阻擋資料
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NDROverview;
