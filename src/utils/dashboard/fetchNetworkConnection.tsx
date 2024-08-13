import axios from 'axios'
import Cookies from 'js-cookie'

export interface NetworkConnectionType {
  count: string
}

export interface fetchNetworkConnectionRequest {
  start: Date
  end: Date
}

export interface APIResponseBase {
  success: boolean
}

export interface APIResponseSuccess extends APIResponseBase {
  success: true
  content: NetworkConnectionType
}

export interface APIResponseError extends APIResponseBase {
  success: false
  detail: string
}


export const initData : string = '0'


export const fetchNetworkConnection = async (param: fetchNetworkConnectionRequest): Promise<APIResponseSuccess|APIResponseError> => {
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wazuh/total-event`;
    try {

      const header = {
        'Authorization': Cookies.get('token')
      }
      
      const response = await axios.get(api_url,{
        params: {
          start_time: param.start.toISOString(),
          end_time: param.end.toISOString()
        },
        headers: header        
      });
    
      return {
        success: true,
        content: {
          count: response.data.content.count
        }
      };
    } catch (error: any) {
      console.error('Error fetching agent data:', error);
      return {
        success: false,
        detail: error.data.detail
      };
    }
}
