import axios from "axios"


interface LoginResponse {
  success: boolean
  content: {
    access_token: string
    token_type: string
  }
  message: string
}


export const login = async (username: string, password: string) => {

  const login_api = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`

  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)
  
  console.log(login_api);
  const response = await axios.post(login_api, formData)
  return response.data as LoginResponse

}
