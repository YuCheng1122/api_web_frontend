import { avocadoClient } from '@/core/https/AvocadoClient';

type UserDataType = {
  username: string
  email: string
  company: string
  license_amount: number
  disabled: boolean
  role: string
  user_id: number
}

type fetchUserResponse = {
  success: boolean
  content: UserDataType
}

const initData: UserDataType = {
  username: '',
  email: '',
  company: '',
  license_amount: 0,
  disabled: false,
  role: '',
  user_id: 0
};

export const fetchUser = async (): Promise<fetchUserResponse> => {
  try {
    const response = await avocadoClient.get('/api/manage/users');
    const apiData = response.users;  // response is already response.data from axios

    return {
      success: true,
      content: apiData
    };
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    return {
      success: false,
      content: initData
    };
  }
}
