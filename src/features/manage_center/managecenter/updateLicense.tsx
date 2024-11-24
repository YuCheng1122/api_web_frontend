import { avocadoClient } from '@/features/api/AvocadoClient';

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

export const updateLicense = async (user_id: number, license_amount: string): Promise<fetchLicenseResponse> => {
  try {
    const response = await avocadoClient.put(
      '/api/manage/license',
      {
        user_id: user_id,
        license_amount: license_amount,
      }
    );

    const apiData = response.licenses;  // response is already response.data from axios
    return {
      message: apiData,
    };
  } catch (error: any) {
    console.error("Error fetching license data:", error);
    return {
      message: 'error'
    };
  }
};
