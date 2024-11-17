import axios from 'axios'
import Cookies from 'js-cookie'

export interface EventTableDataType {
  timestamp: string
  agent_name: string
  rule_description: string
  rule_mitre_tactic: string
  rule_mitre_id: string
  rule_level: number
}

export interface fetchEventTableDataRequest {
  id: number
  start: Date
  end: Date

}

export interface fetchEventTableDataResponse {
  success: boolean
  content: {

    datas: EventTableDataType[]
  }
}

export const initData: { datas: EventTableDataType[] } = {

  datas: []
}

export const fetchEventTableData = async (param: fetchEventTableDataRequest): Promise<fetchEventTableDataResponse> => {
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/event_table`;

  try {
    const header = {
      'Authorization': Cookies.get('token')
    }

    const response = await axios.get(api_url, {
      params: {
        start_time: param.start.toISOString(),
        end_time: param.end.toISOString(),
        // limit: 40  // 將 limit 設置為 5 的行已被移除
      },
      headers: header
    });

    const apiData = response.data.content
    console.log('apiData:', apiData);

    const adjustedData = apiData.event_table.map((item: EventTableDataType) => {
      const adjustedDate = new Date(item.timestamp);
      adjustedDate.setHours(adjustedDate.getHours() + 8);
      return {
        ...item,
        time: adjustedDate.toISOString()
      };
    });

    return {
      success: true,
      content: {

        datas: adjustedData // 移除 slice(0, 5) 的限制
      }
    };

  } catch (error: any) {
    console.error('Error fetching event table data:', error);
    return {
      success: false,
      content: initData
    };
  }
}
