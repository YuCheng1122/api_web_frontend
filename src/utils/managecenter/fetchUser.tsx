import axios from 'axios';
import Cookies from 'js-cookie';
type UserDataType  = {
    username: string
    email: string
    company: string
    license_amount: number
    role: string
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
  role: ''
};

export const fetchUser = async (): Promise<fetchUserResponse> => {
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manage/users`;
  try {
    const header = {
      'Authorization': Cookies.get('token')
    }

    const response = await axios.get(api_url, {
      headers: header
    });

    const apiData = response.data.users
    
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