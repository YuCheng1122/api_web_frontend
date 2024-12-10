import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json({
        success: false,
        content: [],
      });
    }

    // get from parame start_time and end_time
    const start_time = request.nextUrl.searchParams.get("start_time");
    const end_time = request.nextUrl.searchParams.get("end_time");

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/modbus_events/get-syslog?start_time=${start_time}&end_time=${end_time}`;

    const response = await fetch(url, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API response not ok:", {
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json({
        success: false,
        content: [],
      });
    }

    const apiData = await response.json();

    // Remove additional_info from each item
    apiData.forEach((data: any) => {
      delete data.additional_info;
    });

    return NextResponse.json({
      success: true,
      content: apiData,
    });
  } catch (error) {
    console.error("Error in modbus events API route:", error);
    return NextResponse.json({
      success: false,
      content: [],
    });
  }
}
