'use client';

import { FC, useEffect } from 'react';
import { useNDR } from '../../../../features/ndr/hooks/useNDR';
import { useNDRData } from '../contexts/NDRContext';
import { ndrService } from '../../../../features/ndr/services/ndrService';
import TopBlockingList from './TopBlockingList';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import type { NDRTopBlocking } from '../../../../features/ndr/types/ndr';

const NDROverview: FC = () => {
    const {
        topBlocking,
        loading,
        error,
        devices,
        setDevices,
        setTopBlocking,
        setLoading,
        setError,
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

                // 獲取時間範圍
                const fromTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
                const toTimestamp = new Date().getTime();

                // 獲取所有設備的阻擋排行
                const allBlockingData = await Promise.all(
                    deviceListResponse.data.map(device =>
                        ndrService.getTopBlocking(
                            token,
                            device.name,
                            fromTimestamp,
                            toTimestamp,
                            1
                        ).catch(err => {
                            console.error(`Failed to fetch blocking data for device ${device.name}:`, err);
                            return [];
                        })
                    )
                );

                // 合併所有設備的阻擋數據
                const blockingMap = new Map<string, NDRTopBlocking>();
                allBlockingData.forEach(deviceBlocking => {
                    deviceBlocking.forEach((item: NDRTopBlocking) => {
                        const key = `${item.signature_id}-${item.signature}`;
                        const existing = blockingMap.get(key);
                        if (existing) {
                            existing.doc_count += item.doc_count;
                        } else {
                            blockingMap.set(key, { ...item });
                        }
                    });
                });

                // 轉換為陣列並排序
                const combinedBlocking = Array.from(blockingMap.values())
                    .sort((a, b) => b.doc_count - a.doc_count);

                setTopBlocking(combinedBlocking);
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
                        監控設備數量：{devices.length}
                    </span>
                </h2>

                {/* Top Blocking */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">阻擋排行 (所有設備)</h3>
                    {topBlocking.length > 0 ? (
                        <TopBlockingList data={topBlocking.slice(0, 10)} /> // 顯示前10筆
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
