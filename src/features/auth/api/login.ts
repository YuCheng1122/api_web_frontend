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
 * Development Mode:
 * Set NEXT_PUBLIC_BYPASS_AUTH=true in .env.development to bypass authentication
 * and return mock response for UI/UX development
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const login_api = `${baseURL}/api/auth/login`;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await axios.post(login_api, formData);
  return response.data as LoginResponse;
};
