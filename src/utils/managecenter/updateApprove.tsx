import axios from "axios";
import Cookies from "js-cookie";
type fetchApproveResponse = {
    message: string;
    };
export const updateApprove = async (user_id: number): Promise<fetchApproveResponse> => {
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manage/toggle-user-status`;
    try {
        const header = {
            Authorization: Cookies.get("token"),
        };
        const response = await axios.put(
            api_url,
            {
                user_id: user_id,
            },
            {
                headers: header,
            }
            );
        const apiData = response.data.message;
        return {
            message: apiData,
        };
    } catch (error: any) {
        console.error("Error fetching approve data:", error);
        return {
            message : 'error'
        };
    }
}