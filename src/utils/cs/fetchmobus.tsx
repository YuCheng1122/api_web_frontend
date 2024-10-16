import axios from "axios";
import Cookies from "js-cookie";

export const Fetchmobus = async () => {
  const nowtime = new Date();
  const endtime = new Date(nowtime);
  endtime.setDate(nowtime.getDate() - 1);
  // 時間格式為 "2024-10-05T00:00:00Z"
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL
    }/api/modbus_events/get-events?start_time=${'2024-10-10T00:00:00Z'}&end_time=${nowtime.toISOString()}`;
  console.log(api_url);


  try {
    const header = {
      'Authorization': Cookies.get('token'),
    };
    const response = await axios.get(api_url, {
      headers: header
    });
    console.log(response.data);


    const apiData = response.data;
    // drop additional_info
    apiData.forEach((data: any) => {
      delete data.additional_info;
    });

    return {
      success: true,
      content: apiData
    };

  } catch (error: any) {
    console.error('Error fetching ransomware data:', error);
    return {
      success: false,
      content: []
    };
  }
};
