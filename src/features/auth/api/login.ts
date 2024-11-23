import axios from "axios";
import { LoginResponse } from "../types";

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const login_api = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await axios.post(login_api, formData);
  return response.data as LoginResponse;
};
