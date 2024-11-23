import axios from 'axios'
import Cookies from 'js-cookie'


export type EntireDataType = {
    critical_severity: number;
    high_severity: number;
    medium_severity: number;
    low_severity: number;

}

export interface fetchAlertDataRequest {
    start: Date
    end: Date
}

export interface fetchAlertResponse {
    success: boolean
    content: EntireDataType
}

export const initData: EntireDataType = {
    critical_severity: 0,
    high_severity: 0,
    medium_severity: 0,
    low_severity: 0

}



export const fetchAlertData = async (param: fetchAlertDataRequest): Promise<fetchAlertResponse> => {
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/dashboard/alerts`;

    try {
        const header = {
            'Authorization': Cookies.get('token')
        }

        const response = await axios.get(api_url, {
            params: {
                start_time: param.start.toISOString(),
                end_time: param.end.toISOString(),
            },
            headers: header
        });

        const apiData = response.data.content.alerts;

        return {
            success: true,
            content: apiData
        }

    } catch (error: any) {
        console.error('Error fetching pie graph data:', error);
        return {
            success: false,
            content: {
                critical_severity: 0,
                high_severity: 0,
                medium_severity: 0,
                low_severity: 0

            }
        };
    }
}
