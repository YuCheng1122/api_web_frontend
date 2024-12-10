import axios from "axios";
import Cookies from "js-cookie";
import { SyslogRow } from "../types";

interface SyslogResponse {
  success: boolean;
  content: SyslogRow[];
}
type Timeinterval = {
  start_time: string;
  end_time: string;
};

export const fetchSyslogEvents = async (
  timeinterval: Timeinterval
): Promise<SyslogResponse> => {
  const token = Cookies.get("token");

  if (!token) {
    return {
      success: false,
      content: [],
    };
  }

  try {
    const response = await axios.get<SyslogResponse>("/api/modbus/syslogs", {
      headers: {
        Authorization: token,
      },
      params: {
        start_time: timeinterval.start_time,
        end_time: timeinterval.end_time,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching syslog events:", error);
    return {
      success: false,
      content: [],
    };
  }
};
