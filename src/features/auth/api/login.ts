import axios from "axios";
import { LoginResponse } from "../types";

/**
 * Login API
 * 
 * Note: We use axios directly here instead of AvocadoClient because:
 * 1. Login endpoint doesn't require authentication token
 * 2. This endpoint is responsible for setting up the auth state
 * 3. Using AvocadoClient here would create a circular dependency since
 *    AvocadoClient needs the auth token that this endpoint provides
 * 
 * Note: The backend requires double slashes in the URL for auth endpoints
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  // Intentionally keeping double slash as required by backend
  const login_api = `${baseURL}/api/auth/login`;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await axios.post(login_api, formData);
  return response.data as LoginResponse;
};
