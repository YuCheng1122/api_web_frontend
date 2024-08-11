export interface NetworkConnectionType {
  count: string
}

export interface fetchNetworkConnectionRequest {
  start: Date
  end: Date
}

export interface fetchNetworkConnectionResponse {
  success: boolean
  content: NetworkConnectionType
}

export const initData : string = '0'


export const fetchNetworkConnection = async (param: fetchNetworkConnectionRequest): Promise<fetchNetworkConnectionResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {

      const result = {
        count: '20,135'
      }

      const response = {
        success: true,
        content: result
      }

      resolve(response)

    }, 2500)
  })

}
