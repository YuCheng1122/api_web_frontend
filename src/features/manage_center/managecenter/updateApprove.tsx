import { avocadoClient } from '@/features/api/AvocadoClient';

type fetchApproveResponse = {
    message: string;
};

export const updateApprove = async (user_id: number): Promise<fetchApproveResponse> => {
    try {
        const response = await avocadoClient.put(
            '/api/manage/toggle-user-status',
            {
                user_id: user_id,
            }
        );
        const apiData = response.message;  // response is already response.data from axios
        return {
            message: apiData,
        };
    } catch (error: any) {
        console.error("Error fetching approve data:", error);
        return {
            message: 'error'
        };
    }
}
