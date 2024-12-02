import { NextRequest, NextResponse } from 'next/server';

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
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Failed to generate report: ${response.statusText}`);
        }

        // Get the PDF content
        const pdfBuffer = await response.arrayBuffer();

        // Return the PDF with appropriate headers
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${username}_${reportType}.pdf`,
            },
        });
    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json(
            { error: 'Failed to generate report' },
            { status: 500 }
        );
    }
}
