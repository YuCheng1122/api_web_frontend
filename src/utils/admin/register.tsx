import axios from "axios"


interface RegisterResponse {
  success: boolean
  message: string
}

export const register = async (username: string, password: string) => {

  const register_api = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`
  const body = {
    username,
    password
  }
  
  const response = await axios.post(register_api, body)
  return response.data as RegisterResponse
}
