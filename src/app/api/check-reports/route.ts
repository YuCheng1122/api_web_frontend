import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type ReportType = 'daily' | 'weekly' | 'monthly';

interface ReportInfo {
  exists: boolean;
  size?: number;
}

interface ReportResponse {
  [key: string]: ReportInfo | undefined;
  daily?: ReportInfo;
  weekly?: ReportInfo;
  monthly?: ReportInfo;
}

interface FormattedReportInfo {
  exists: boolean;
  size?: string;
}

interface FormattedResponse {
  [key: string]: FormattedReportInfo;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const reportPath = path.join(process.cwd(), 'public', 'report', username);

    // Check if the user's report directory exists
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json({}, { status: 200 });
    }

    // Check each report type and get file size if exists
    const reports: ReportResponse = {};
    const reportTypes: ReportType[] = ['daily', 'weekly', 'monthly'];

    reportTypes.forEach(type => {
      const filePath = path.join(reportPath, `${username}_${type}.pdf`);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        reports[type] = {
          exists: true,
          size: stats.size
        };
      }
    });

    // Format the response with human-readable file sizes
    const formattedResponse = Object.entries(reports).reduce<FormattedResponse>((acc, [type, info]) => {
      if (info) {
        acc[type] = {
          exists: info.exists,
          size: info.size ? formatFileSize(info.size) : undefined
        };
      }
      return acc;
    }, {} as FormattedResponse);

    return NextResponse.json(formattedResponse, { status: 200 });
  } catch (error) {
    console.error('Error checking reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
