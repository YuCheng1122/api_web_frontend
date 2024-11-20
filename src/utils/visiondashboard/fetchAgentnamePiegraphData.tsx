import axios from 'axios'
import Cookies from 'js-cookie'

export interface fetchPieDataType {
    value: number;
    name: string;
}

export type EntirePieDataType = {
    agent_name: fetchPieDataType[]

}

export interface fetchPieGraphDataRequest {
    start: Date
    end: Date
}

export interface fetchPieGraphDataResponse {
    success: boolean
    content: EntirePieDataType
}

export const initData: EntirePieDataType = {
    agent_name: [],

}



export const fetchPieGraphData = async (param: fetchPieGraphDataRequest): Promise<fetchPieGraphDataResponse> => {
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/agent_name`;

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

        const apiData = response.data.content;


        //    change column name name and value
        apiData.agent_name = apiData.agent_name.map((item: any) => {
            return {
                value: item.event_count,
                name: item.agent_name,
            }
        })


        // Assuming the API returns data in a format similar to the mock data
        // You may need to adjust this based on the actual API response structure

        return {
            success: true,
            content: apiData
        }

    } catch (error: any) {
        console.error('Error fetching pie graph data:', error);
        return {
            success: false,
            content: {
                agent_name: [],

            }
        };
    }
}
