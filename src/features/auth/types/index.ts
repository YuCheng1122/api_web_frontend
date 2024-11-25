export interface LoginResponse {
  success: boolean;
  content: {
    access_token: string;
    token_type: string;
  };
  message: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
}

export interface SignupFormData {
  username: string;
  password: string;
  email: string;
  company_name: string;
  license_amount: string;
}
