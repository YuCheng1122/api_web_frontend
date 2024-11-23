import axios from 'axios';
import Cookies from 'js-cookie';

export interface SignupResponse {
  success: boolean;
  message?: string;
}

export const signup = async (formData: {
  username: string;
  password: string;
  email: string;
  company_name: string;
  license_amount: string;
}): Promise<SignupResponse> => {
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`

  try {
    const response = await axios.post(api_url, formData, {
      headers: {
        'Authorization': Cookies.get('token'),
        'Content-Type': 'application/json'
      }
    });

    return {
      success: response.data.success,
      message: response.data.message
    };

  } catch (error: any) {
    console.error('Error during signup:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Signup failed'
    };
  }
};
