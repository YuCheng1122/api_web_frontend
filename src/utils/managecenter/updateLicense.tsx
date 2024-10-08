import axios from "axios";
import Cookies from "js-cookie";
type LicenseDataType = {
  user_id: number;
  license_amount: number;
};
type fetchLicenseResponse = {
  message: string;
};
const initData: LicenseDataType = {
  license_amount: 0,
user_id: 0,
};
export const updateLicense = async (user_id: number,license_amount: string): Promise<fetchLicenseResponse> => {
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manage/toggle-user-status`;
  try {
    const header = {
      Authorization: Cookies.get("token"),
    };
    const response = await axios.put(
        api_url,
        {
            user_id: user_id,
            license_amount: license_amount,
        },
        {
            headers: header,
        }
        );

    const apiData = response.data.licenses;
    return {
      message: apiData,
    };
  } catch (error: any) {
    console.error("Error fetching license data:", error);
    return {
        message : 'error'
    };
  }
};