import axios from 'axios'
import Cookies from 'js-cookie'


export type EntireDataType = {
    cve_name: string;
    count: number;

}

export interface fetchBarDataRequest {
    start: Date
    end: Date
}

export interface fetchBarResponse {
    success: boolean
    content: EntireDataType[]
}

export const initData: EntireDataType[] = [

];



export const fetchCVEBarData = async (param: fetchBarDataRequest): Promise<fetchBarResponse> => {
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/dashboard/cve_barchart`;

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

        const apiData = response.data.content.cve_barchart;
        console.log('apiData:', apiData);


        return {
            success: true,
            content: apiData
        }

    } catch (error: any) {
        console.error('Error fetching pie graph data:', error);
        return {
            success: false,
            content: initData
        };
    }
}
