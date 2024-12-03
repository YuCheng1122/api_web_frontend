import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import dns from 'dns';

// 強制使用IPv4
dns.setDefaultResultOrder('ipv4first');

export async function POST(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const reportType = searchParams.get('report_type') || 'daily';
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        // Call the WQL API to generate the report
        const response = await fetch(`http://localhost:29000/wql/${username}?format=pdf&report_type=${reportType}`, {
            // 使用axios發送請求
            const response = await axios({
                method: 'POST',
                url: `http://sensex_nexus:29000/wql/${username}?format=pdf&report_type=${reportType}`,
                responseType: 'arraybuffer',
                timeout: 30000,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                    family: 4  // 強制使用IPv4
                }),
                headers: {
                    'Accept': 'application/pdf',
                    'Host': 'sensex_nexus'  // 明確指定Host頭
                },
                // 禁用代理
                proxy: false
            });

            if (!response.ok) {
            throw new Error(`Failed to generate report: ${response.statusText}`);
        }

        // Get the PDF content
        const pdfBuffer = await response.arrayBuffer();

        // Return the PDF with appropriate headers
        return new NextResponse(pdfBuffer, {
            return new NextResponse(response.data, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename=${username}_${reportType}.pdf`,
                },
            });
        } catch (error) {
            console.error('Error generating report:', error);

            let errorMessage = 'Unknown error occurred';
            if (axios.isAxiosError(error)) {
                errorMessage = error.message;
                // 添加更詳細的錯誤信息
                if (error.code === 'ECONNREFUSED') {
                    errorMessage = `Connection refused to sensex_nexus:29000. Please check if the service is running and network is properly configured.`;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            return NextResponse.json(
                { error: 'Failed to generate report' },
                { error: `Failed to generate report: ${errorMessage}` },
                { status: 500 }
            );
        }
    }

