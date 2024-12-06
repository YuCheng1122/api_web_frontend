import { NextResponse } from 'next/server';
import { DashboardService } from '@/features/dashboard_v2/api/dashboardService';
import { memoryCache } from '@/core/cache/memoryCache';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startTime = searchParams.get('start_time') || '';
    const endTime = searchParams.get('end_time') || '';
    
    const cacheKey = `dashboard:aggregate:${startTime}:${endTime}`;
    const cachedData = memoryCache.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const timeRange = { start_time: startTime, end_time: endTime };
    
    // 並行獲取所有數據
    const [
      criticalData,
      osData,
      chartData,
      eventTableData
    ] = await Promise.all([
      DashboardService.fetchCriticalData(timeRange),
      DashboardService.fetchOSData(timeRange),
      DashboardService.fetchChartData(timeRange),
      DashboardService.fetchEventTableData(timeRange)
    ]);

    const aggregatedData = {
      ...criticalData,
      osData,
      ...chartData,
      eventTableData,
    };

    // 緩存5分鐘
    memoryCache.set(cacheKey, aggregatedData, 300);

    return NextResponse.json(aggregatedData);
  } catch (error) {
    console.error('Error in aggregate dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
